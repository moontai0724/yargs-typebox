import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Options } from "yargs";

let component: typeof import("@/index");

beforeAll(async () => {
  component = await import("@/index");
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("array", () => {
  it("should pass schema to array transformer", () => {
    const schema = Type.Array(Type.String());
    const result = component.getOption(schema);
    expect(result).toEqual({ type: "array", requiresArg: true });
  });

  it("should pass override to array transformer", () => {
    const schema = Type.Array(Type.String());
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(result).toEqual({
      type: "array",
      requiresArg: true,
      alias: "aliased",
    });
  });
});

describe("boolean", () => {
  it("should pass schema to boolean transformer", () => {
    const schema = Type.Boolean();
    const result = component.getOption(schema);
    expect(result).toEqual({ type: "boolean", requiresArg: true });
  });

  it("should pass override to boolean transformer", () => {
    const schema = Type.Boolean();
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(result).toEqual({
      type: "boolean",
      requiresArg: true,
      alias: "aliased",
    });
  });
});

describe("number", () => {
  it("should pass schema to number transformer", () => {
    const schema = Type.Number();
    const result = component.getOption(schema);
    expect(result).toEqual({ type: "number", requiresArg: true });
  });

  it("should pass override to number transformer", () => {
    const schema = Type.Number();
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(result).toEqual({
      type: "number",
      requiresArg: true,
      alias: "aliased",
    });
  });
});

describe("string", () => {
  it("should pass schema to string transformer", () => {
    const schema = Type.String();
    const result = component.getOption(schema);
    expect(result).toEqual({ type: "string", requiresArg: true });
  });

  it("should pass override to string transformer", () => {
    const schema = Type.String();
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(result).toEqual({
      type: "string",
      requiresArg: true,
      alias: "aliased",
    });
  });
});

describe("union (choices)", () => {
  it("should pass schema to union transformer", () => {
    const schema = Type.Union([Type.Literal("foo"), Type.Literal("bar")]);
    const result = component.getOption(schema);
    expect(result).toEqual({
      type: "string",
      requiresArg: true,
      choices: ["foo", "bar"],
    });
  });

  it("should pass override to union transformer", () => {
    const schema = Type.Union([Type.Literal("foo"), Type.Literal("bar")]);
    const override: Options = { alias: "aliased" };
    const result = component.getOption(schema, override);
    expect(result).toEqual({
      type: "string",
      requiresArg: true,
      choices: ["foo", "bar"],
      alias: "aliased",
    });
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
