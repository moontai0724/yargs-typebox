import { type TSchema, Type } from "@sinclair/typebox";
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import type { Options } from "yargs";

const getArrayOption = vi.fn().mockReturnValue({ type: "mocked" });
const getBooleanOption = vi.fn().mockReturnValue({ type: "mocked" });
const getChoiceOption = vi.fn().mockReturnValue({ type: "mocked" });
const getNumberOption = vi.fn().mockReturnValue({ type: "mocked" });
const getStringOption = vi.fn().mockReturnValue({ type: "mocked" });

let component: typeof import("./get-option");

beforeAll(async () => {
  vi.doMock("./array", () => ({ getArrayOption }));
  vi.doMock("./boolean", () => ({ getBooleanOption }));
  vi.doMock("./choice", () => ({ getChoiceOption }));
  vi.doMock("./number", () => ({ getNumberOption }));
  vi.doMock("./string", () => ({ getStringOption }));
  component = await import("./get-option");
});

beforeEach(() => {
  vi.clearAllMocks();
});

const types = [
  "array",
  "boolean",
  "number",
  "string",
  "literal",
  "union",
] as const;

const schemas = {
  array: Type.Array(Type.Unknown()),
  boolean: Type.Boolean(),
  number: Type.Number(),
  string: Type.String(),
  literal: Type.Literal("foo"),
  union: Type.Union([Type.Literal("foo"), Type.Literal("bar")]),
} satisfies Record<(typeof types)[number], TSchema>;

const mocks = {
  array: getArrayOption,
  boolean: getBooleanOption,
  number: getNumberOption,
  string: getStringOption,
  literal: getChoiceOption,
  union: getChoiceOption,
} satisfies Record<(typeof types)[number], Mock>;

describe.each(types)("should properly handle %s", type => {
  const schema = schemas[type];
  const mock = mocks[type];

  it(`should pass schema to ${type} transformer`, () => {
    const result = component.getOption(schema);

    expect(mock).toBeCalledWith(schema, {});
    expect(result).toEqual({ type: "mocked" });
  });

  it(`should pass overwrites to ${type} transformer`, () => {
    const override = {
      alias: "aliased",
    } satisfies Options;
    component.getOption(schema, override);

    expect(mock).toBeCalledWith(schema, override);
  });
});

describe("unaccepted type", () => {
  it("should return empty object when type is not supported", () => {
    const schema = Type.BigInt();
    const result = component.getOption(schema);
    expect(result).toEqual({});
  });

  it("should still be able to override", () => {
    const schema = Type.BigInt();
    const override = { alias: "aliased" } satisfies Options;
    const result = component.getOption(schema, override);
    expect(result).toEqual({ alias: "aliased" });
  });
});
