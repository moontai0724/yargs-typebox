import { Type, type UnionToTuple } from "@sinclair/typebox";
import { expect, it } from "vitest";
import type { Options } from "yargs";

import { type SchemaType, transform } from "./transform";

const schemaTypes = [
  "string",
  "number",
  "boolean",
  "array",
] satisfies UnionToTuple<SchemaType>;

it.each(schemaTypes)(
  "should transform %s type schema to yargs option",
  type => {
    const schema = Type.Any();
    const result = transform(type, schema);
    const expected = {
      type,
      requiresArg: true,
      demandOption: true,
    } satisfies Options;

    expect(result).toEqual(expected);
  },
);

it("should check if it is marked as optional", () => {
  const schema = Type.Optional(Type.Any());
  const overwrites = {} satisfies Options;
  const expected = {
    type: "string",
    requiresArg: false,
    demandOption: false,
  } satisfies Options;

  const result = transform("string", schema, overwrites);

  expect(result).toEqual(expected);
});

it("should take default value if present and made it optional", () => {
  const schema = Type.Any({
    default: true,
  });
  const overwrites = {} satisfies Options;
  const expected = {
    type: "string",
    requiresArg: false,
    demandOption: false,
    default: true,
  } satisfies Options;

  const result = transform("string", schema, overwrites);

  expect(result).toEqual(expected);
});

it("should take description if present", () => {
  const schema = Type.Any({
    description: "Something",
  });
  const overwrites = {} satisfies Options;
  const expected = {
    type: "string",
    requiresArg: true,
    demandOption: true,
    description: "Something",
  };

  const result = transform("string", schema, overwrites);

  expect(result).toEqual(expected);
});

it("should be able to overwrite given options", () => {
  const schema = Type.Any();
  const overwrites = {
    requiresArg: false,
    description: "Something",
    choices: ["foo", "bar"],
  } satisfies Options;
  const expected = {
    type: "string",
    requiresArg: false,
    demandOption: true,
    description: "Something",
    choices: ["foo", "bar"],
  };

  const result = transform("string", schema, overwrites);

  expect(result).toEqual(expected);
});
