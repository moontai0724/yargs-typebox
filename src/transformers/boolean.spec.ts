import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";
import type { Options } from "yargs";

import { getBooleanOption } from "./boolean";

it("should transform TBoolean to yargs option", () => {
  const schema = Type.Boolean();

  const result = getBooleanOption(schema);

  expect(result).toEqual({
    type: "boolean",
    requiresArg: true,
  });
});

it("should transform TBoolean with truthy default value to yargs option", () => {
  const schema = Type.Boolean({ default: true });

  const result = getBooleanOption(schema);

  expect(result).toEqual({
    type: "boolean",
    requiresArg: false,
    default: true,
  });
});

it("should transform TBoolean with falsy default value to yargs option", () => {
  const schema = Type.Boolean({ default: false });

  const result = getBooleanOption(schema);

  expect(result).toEqual({
    type: "boolean",
    requiresArg: false,
    default: false,
  });
});

it("should transform TBoolean with description to yargs option", () => {
  const schema = Type.Boolean({ description: "foo" });

  const result = getBooleanOption(schema);

  expect(result).toEqual({
    type: "boolean",
    requiresArg: true,
    description: "foo",
  });
});

it("should transform TBoolean with override to yargs option", () => {
  const schema = Type.Boolean();
  const overwrite: Options = {
    requiresArg: false,
    alias: "aliased",
  };

  const result = getBooleanOption(schema, overwrite);

  expect(result).toEqual({
    type: "boolean",
    requiresArg: false,
    alias: "aliased",
  });
});

it("should detect if it is optional", () => {
  const schema = Type.Optional(Type.Boolean());

  const result = getBooleanOption(schema);

  expect(result).toEqual({
    type: "boolean",
    requiresArg: false,
  });
});
