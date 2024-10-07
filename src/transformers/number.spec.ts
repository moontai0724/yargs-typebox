import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";
import type { Options } from "yargs";

import { getNumberOption } from "./number";

it("should transform TNumber to yargs option", () => {
  const schema = Type.Number();

  const result = getNumberOption(schema);

  expect(result).toEqual({
    type: "number",
    requiresArg: true,
  });
});

it("should transform TNumber with truthy default value to yargs option", () => {
  const schema = Type.Number({ default: 10 });

  const result = getNumberOption(schema);

  expect(result).toEqual({
    type: "number",
    requiresArg: false,
    default: 10,
  });
});

it("should transform TNumber with falsy default value to yargs option", () => {
  const schema = Type.Number({ default: 0 });

  const result = getNumberOption(schema);

  expect(result).toEqual({
    type: "number",
    requiresArg: false,
    default: 0,
  });
});

it("should transform TNumber with description to yargs option", () => {
  const schema = Type.Number({ description: "foo" });

  const result = getNumberOption(schema);

  expect(result).toEqual({
    type: "number",
    requiresArg: true,
    description: "foo",
  });
});

it("should transform TNumber with override to yargs option", () => {
  const schema = Type.Number();
  const overwrite: Options = {
    requiresArg: false,
    alias: "aliased",
  };

  const result = getNumberOption(schema, overwrite);

  expect(result).toEqual({
    type: "number",
    requiresArg: false,
    alias: "aliased",
  });
});

it("should detect if it is optional", () => {
  const schema = Type.Optional(Type.Number());

  const result = getNumberOption(schema);

  expect(result).toEqual({
    type: "number",
    requiresArg: false,
  });
});
