import { Type } from "@sinclair/typebox";
import { describe, expect, it } from "vitest";
import type { Options } from "yargs";

import { basedOnBasic, basedOnOptional } from "~/helpers/based-on-properties";

import { getAnyOption } from "./any";

const schemaTypes = ["string", "number", "boolean", "array"] as const;

it.each(schemaTypes)(
  "should transform %s type schema to yargs option",
  type => {
    const schema = Type.Any();
    const result = getAnyOption(type, schema);
    const expected = basedOnBasic({
      type,
    }) satisfies Options;

    expect(result).toEqual(expected);
  },
);

it("should check if it is marked as optional", () => {
  const schema = Type.Optional(Type.Any());
  const expected = basedOnOptional({
    type: "string",
  }) satisfies Options;

  const result = getAnyOption("string", schema);

  expect(result).toEqual(expected);
});

describe("default", () => {
  it("should take default value if present and made it optional", () => {
    const schema = Type.Any({
      default: true,
    });
    const expected = basedOnOptional({
      type: "string",
      default: true,
    }) satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toEqual(expected);
  });

  it("should properly handle default value even if it is falsy value", () => {
    const schema = Type.Any({
      default: null,
    });
    const expected = basedOnOptional({
      type: "string",
      default: null,
    }) satisfies Options;
    const result = getAnyOption("string", schema);
    expect(result).toEqual(expected);
  });
});

describe("demandOption", () => {
  it("should take demandOption if present", () => {
    const schema = Type.Any({
      demandOption: true,
    });
    const expected = basedOnBasic({
      type: "string",
      demandOption: true,
    }) satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toEqual(expected);
  });

  it("should set demandOption to true if it is not present but required", () => {
    const schema = Type.Any();
    const expected = {
      type: "string",
      demandOption: true,
    } satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toMatchObject(expected);
  });

  it("should set demandOption to false if it is not present and not required", () => {
    const schema = Type.Optional(Type.Any());
    const expected = {
      type: "string",
      demandOption: false,
    } satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toMatchObject(expected);
  });
});

describe("deprecated", () => {
  it("should take `deprecated` as deprecated if present", () => {
    const schema = Type.Any({
      deprecated: "Something",
    });
    const expected = basedOnBasic({
      type: "string",
      deprecated: "Something",
    }) satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toEqual(expected);
  });

  it("should take `deprecate` as deprecated if present", () => {
    const schema = Type.Any({
      deprecate: "Something",
    });
    const expected = basedOnBasic({
      type: "string",
      deprecated: "Something",
    }) satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toEqual(expected);
  });

  it("should take `deprecated` instead of `deprecate` if both present", () => {
    const schema = Type.Any({
      deprecate: "Something",
      deprecated: "Something else",
    });
    const expected = basedOnBasic({
      type: "string",
      deprecated: "Something else",
    }) satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toEqual(expected);
  });
});

describe("description", () => {
  it("should take description if present", () => {
    const schema = Type.Any({
      description: "Something",
    });
    const expected = basedOnBasic({
      type: "string",
      describe: "Something",
    }) satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toEqual(expected);
  });
  it("should take `describe` as description if present", () => {
    const schema = Type.Any({
      describe: "Something",
    });
    const expected = basedOnBasic({
      type: "string",
      describe: "Something",
    }) satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toEqual(expected);
  });
  it("should take `desc` as description if present", () => {
    const schema = Type.Any({
      desc: "Something",
    });
    const expected = basedOnBasic({
      type: "string",
      describe: "Something",
    }) satisfies Options;

    const result = getAnyOption("string", schema);

    expect(result).toEqual(expected);
  });
});

const passthroughOptions = [
  "alias",
  "coerce",
  "config",
  "configParser",
  "conflicts",
  "count",
  "defaultDescription",
  "global",
  "group",
  "hidden",
  "implies",
  "nargs",
  "normalize",
  "requiresArg",
  "skipValidation",
] as const;

describe("passthrough options", () => {
  it.each(passthroughOptions)("should passthrough %s option", option => {
    const schema = Type.Any();
    const expected = basedOnBasic({
      type: "string",
      [option]: true,
    }) satisfies Options;

    const result = getAnyOption("string", schema, { [option]: true });

    expect(result).toEqual(expected);
  });
});

it("should be able to overwrite given options", () => {
  const schema = Type.Any();
  const overwrites = {
    demandOption: false,
    describe: "Something",
    choices: ["foo", "bar"],
  } satisfies Options;
  const expected = basedOnBasic({
    type: "string",
    demandOption: false,
    describe: "Something",
    choices: ["foo", "bar"],
  }) satisfies Options;

  const result = getAnyOption("string", schema, overwrites);

  expect(result).toEqual(expected);
});
