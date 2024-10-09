import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";

let component: typeof import("@/index");

beforeAll(async () => {
  component = await import("@/index");
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should transform schemas of props in a TObject to yargs options", () => {
  const schema = Type.Object({
    page: Type.Number({ description: "page number" }),
    size: Type.Number({ description: "page size", default: 10 }),
    query: Type.Optional(Type.String()),
    sort: Type.Optional(
      Type.Array(Type.Union([Type.Literal("id"), Type.Literal("createdAt")])),
    ),
    order: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
      default: "asc",
    }),
    pretty: Type.Boolean({ description: "pretty print" }),
  });
  const result = component.getOptions(schema);
  expect(result).toEqual({
    page: {
      type: "number",
      requiresArg: true,
      demandOption: true,
      describe: "page number",
    },
    size: {
      type: "number",
      requiresArg: false,
      demandOption: false,
      default: 10,
      describe: "page size",
    },
    query: {
      type: "string",
      requiresArg: false,
      demandOption: false,
    },
    sort: {
      type: "array",
      requiresArg: false,
      demandOption: false,
      choices: ["id", "createdAt"],
    },
    order: {
      type: "string",
      requiresArg: false,
      demandOption: false,
      choices: ["asc", "desc"],
      default: "asc",
    },
    pretty: {
      type: "boolean",
      requiresArg: true,
      demandOption: true,
      describe: "pretty print",
    },
  });
});

it("should transform unknown schemas to empty object", () => {
  const schema = Type.Object({
    foo: Type.Object({}),
  });
  const result = component.getOptions(schema);
  expect(result).toEqual({
    foo: {},
  });
});
