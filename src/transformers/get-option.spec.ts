import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
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

describe("array", () => {
  it("should pass schema to array transformer", () => {
    const schema = Type.Array(Type.Unknown());
    const result = component.getOption(schema);
    expect(getArrayOption).toBeCalledWith(schema, {});
    expect(result).toEqual({ type: "mocked" });
  });

  it("should pass override to array transformer", () => {
    const schema = Type.Array(Type.Unknown());
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(getArrayOption).toBeCalledWith(schema, override);
    expect(result).toEqual({ type: "mocked", alias: "aliased" });
  });
});

describe("boolean", () => {
  it("should pass schema to boolean transformer", () => {
    const schema = Type.Boolean();
    const result = component.getOption(schema);
    expect(getBooleanOption).toBeCalledWith(schema, {});
    expect(result).toEqual({ type: "mocked" });
  });

  it("should pass override to boolean transformer", () => {
    const schema = Type.Boolean();
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(getBooleanOption).toBeCalledWith(schema, override);
    expect(result).toEqual({ type: "mocked", alias: "aliased" });
  });
});

describe("number", () => {
  it("should pass schema to number transformer", () => {
    const schema = Type.Number();
    const result = component.getOption(schema);
    expect(getNumberOption).toBeCalledWith(schema, {});
    expect(result).toEqual({ type: "mocked" });
  });

  it("should pass override to number transformer", () => {
    const schema = Type.Number();
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(getNumberOption).toBeCalledWith(schema, override);
    expect(result).toEqual({ type: "mocked", alias: "aliased" });
  });
});

describe("string", () => {
  it("should pass schema to string transformer", () => {
    const schema = Type.String();
    const result = component.getOption(schema);
    expect(getStringOption).toBeCalledWith(schema, {});
    expect(result).toEqual({ type: "mocked" });
  });

  it("should pass override to string transformer", () => {
    const schema = Type.String();
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(getStringOption).toBeCalledWith(schema, override);
    expect(result).toEqual({ type: "mocked", alias: "aliased" });
  });
});

describe("union", () => {
  it("should pass schema to union transformer", () => {
    const schema = Type.Union([Type.Literal("foo"), Type.Literal("bar")]);
    const result = component.getOption(schema);
    expect(getChoiceOption).toBeCalledWith(schema, {});
    expect(result).toEqual({ type: "mocked" });
  });

  it("should pass override to union transformer", () => {
    const schema = Type.Union([Type.Literal("foo"), Type.Literal("bar")]);
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(getChoiceOption).toBeCalledWith(schema, override);
    expect(result).toEqual({ type: "mocked", alias: "aliased" });
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
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(result).toEqual({ alias: "aliased" });
  });
});
