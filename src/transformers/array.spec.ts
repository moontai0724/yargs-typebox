import { Type } from "@sinclair/typebox";
import { describe, expect, it } from "vitest";
import type { Options } from "yargs";

import { getArrayOption } from "./array";

it("should transform TArray to yargs option", () => {
  const schema = Type.Array(Type.String());

  const result = getArrayOption(schema);

  expect(result).toEqual({
    type: "array",
    requiresArg: true,
  });
});

describe("should transform TArray with choices to yargs option", () => {
  it("when item is literal", () => {
    const schema = Type.Array(Type.Literal("foo"));

    const result = getArrayOption(schema);

    expect(result).toEqual({
      type: "array",
      requiresArg: true,
      choices: ["foo"],
    });
  });

  it("when items are union of literal", () => {
    const schema = Type.Array(
      Type.Union([Type.Literal("foo"), Type.Literal("bar")]),
    );

    const result = getArrayOption(schema);

    expect(result).toEqual({
      type: "array",
      requiresArg: true,
      choices: ["foo", "bar"],
    });
  });

  it("should not transform when items are union of literal and non-literal", () => {
    const schema = Type.Array(
      Type.Union([Type.Literal("foo"), Type.Literal("bar"), Type.Boolean()]),
    );

    const result = getArrayOption(schema);

    expect(result).toEqual({
      type: "array",
      requiresArg: true,
    });
  });
});

it("should transform TArray with truthy default value to yargs option", () => {
  const schema = Type.Array(Type.String(), { default: ["foo"] });

  const result = getArrayOption(schema);

  expect(result).toEqual({
    type: "array",
    requiresArg: false,
    default: ["foo"],
  });
});

it("should transform TArray with falsy default value to yargs option", () => {
  const schema = Type.Array(Type.String(), { default: [] });

  const result = getArrayOption(schema);

  expect(result).toEqual({
    type: "array",
    requiresArg: false,
    default: [],
  });
});

it("should transform TArray with description to yargs option", () => {
  const schema = Type.Array(Type.String(), { description: "foo" });

  const result = getArrayOption(schema);

  expect(result).toEqual({
    type: "array",
    requiresArg: true,
    description: "foo",
  });
});

it("should transform TArray with override to yargs option", () => {
  const schema = Type.Array(Type.String());
  const overwrite: Options = {
    requiresArg: false,
    alias: "aliased",
  };

  const result = getArrayOption(schema, overwrite);

  expect(result).toEqual({
    type: "array",
    requiresArg: false,
    alias: "aliased",
  });
});

it("should detect if it is optional", () => {
  const schema = Type.Optional(Type.Array(Type.String()));

  const result = getArrayOption(schema);

  expect(result).toEqual({
    type: "array",
    requiresArg: false,
  });
});
