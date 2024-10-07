import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";
import type { Options } from "yargs";

import { getStringOption } from "./string";

it("should transform TString to yargs option", () => {
  const schema = Type.String();

  const result = getStringOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: true,
  });
});

it("should transform TString with truthy default value to yargs option", () => {
  const schema = Type.String({ default: "foo" });

  const result = getStringOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: false,
    default: "foo",
  });
});

it("should transform TString with falsy default value to yargs option", () => {
  const schema = Type.String({ default: "" });

  const result = getStringOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: false,
    default: "",
  });
});

it("should transform TString with description to yargs option", () => {
  const schema = Type.String({ description: "foo" });

  const result = getStringOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: true,
    description: "foo",
  });
});

it("should transform TString with override to yargs option", () => {
  const schema = Type.String();
  const overwrite: Options = {
    requiresArg: false,
    alias: "aliased",
  };

  const result = getStringOption(schema, overwrite);

  expect(result).toEqual({
    type: "string",
    requiresArg: false,
    alias: "aliased",
  });
});

it("should detect if it is optional", () => {
  const schema = Type.Optional(Type.String());

  const result = getStringOption(schema);

  expect(result).toEqual({
    type: "string",
    requiresArg: false,
  });
});
