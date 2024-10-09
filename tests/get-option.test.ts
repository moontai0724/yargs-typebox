import { type TSchema, Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Options } from "yargs";

import { basedOnBasic } from "./helpers/based-on-properties";

let component: typeof import("@/index");

beforeAll(async () => {
  component = await import("@/index");
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
  array: Type.Array(
    Type.Union([Type.Literal("id"), Type.Literal("createdAt")]),
  ),
  boolean: Type.Boolean({ description: "pretty print" }),
  number: Type.Number({ description: "page size", default: 10 }),
  string: Type.String(),
  literal: Type.Literal(true),
  union: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
    default: "asc",
  }),
} satisfies Record<(typeof types)[number], TSchema>;

const expectations = {
  array: {
    type: "array",
    demandOption: true,
    choices: ["id", "createdAt"],
  },
  boolean: {
    type: "boolean",
    demandOption: true,
    describe: "pretty print",
  },
  number: {
    type: "number",
    demandOption: false,
    default: 10,
    describe: "page size",
  },
  string: {
    type: "string",
    demandOption: true,
  },
  literal: {
    type: "string",
    demandOption: true,
    choices: [true],
  },
  union: {
    type: "string",
    demandOption: false,
    choices: ["asc", "desc"],
    default: "asc",
  },
} satisfies Record<(typeof types)[number], Options>;

describe.each(types)("should properly handle %s", type => {
  const schema = schemas[type];
  const expected = expectations[type];

  it("should transform", () => {
    const result = component.getOption(schema);

    expect(result).toEqual(expected);
  });

  it("should transform with overwrites", () => {
    const override = {
      alias: "aliased",
    } satisfies Options;
    const result = component.getOption(schema, override);

    expect(result).toEqual({ ...expected, alias: "aliased" });
  });
});

describe("unaccepted type", () => {
  it("should return empty object when type is not supported", () => {
    const schema = Type.BigInt();
    const result = component.getOption(schema);
    expect(result).toEqual(basedOnBasic({}));
  });

  it("should still be able to override", () => {
    const schema = Type.BigInt();
    const override = { alias: "aliased" } satisfies Options;
    const result = component.getOption(schema, override);
    expect(result).toEqual(basedOnBasic({ alias: "aliased" }));
  });
});
