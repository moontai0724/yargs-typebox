import { type TLiteral, type TUnion, Type } from "@sinclair/typebox";
import { expect, it } from "vitest";
import type { Options } from "yargs";

import { getChoiceOption } from "./choice";

it("should transform TUnion to yargs option", () => {
  const schema = Type.Union([Type.Literal("foo"), Type.Literal("bar")]);

  const result = getChoiceOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: true,
    choices: ["foo", "bar"],
  });
});

it("should transform TUnion with truthy default value to yargs option", () => {
  const schema = Type.Union([Type.Literal("foo"), Type.Literal("bar")], {
    default: "foo",
  });

  const result = getChoiceOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: false,
    choices: ["foo", "bar"],
    default: "foo",
  });
});

it("should transform TUnion with falsy default value to yargs option", () => {
  const schema = Type.Union([Type.Literal("foo"), Type.Literal("bar")], {
    default: "",
  });

  const result = getChoiceOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: false,
    choices: ["foo", "bar"],
    default: "",
  });
});

it("should transform TUnion with description to yargs option", () => {
  const schema = Type.Union([Type.Literal("foo"), Type.Literal("bar")], {
    description: "foo",
  });

  const result = getChoiceOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: true,
    choices: ["foo", "bar"],
    description: "foo",
  });
});

it("should transform TUnion with override to yargs option", () => {
  const schema = Type.Union([Type.Literal("foo"), Type.Literal("bar")]);
  const overwrite: Options = {
    requiresArg: false,
    alias: "aliased",
  };

  const result = getChoiceOption(schema, overwrite);

  expect(result).toEqual({
    type: "string",
    requiresArg: false,
    choices: ["foo", "bar"],
    alias: "aliased",
  });
});

it("should detect if it is optional", () => {
  const schema = Type.Optional(
    Type.Union([Type.Literal("foo"), Type.Literal("bar")]),
  );

  const result = getChoiceOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: false,
    choices: ["foo", "bar"],
  });
});

it("should throw error when union contains non-literal", () => {
  const schema = Type.Union([Type.String(), Type.Number()]);

  expect(() =>
    getChoiceOption(schema as unknown as TUnion<TLiteral[]>),
  ).toThrowError("Choices must contain only literal values");
});
