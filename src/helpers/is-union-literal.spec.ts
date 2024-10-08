import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { isUnionLiteral } from "./is-union-literal";

it("should return true if schema is TUnion of TLiteral", () => {
  const schema = Type.Union([
    Type.Literal("foo"),
    Type.Literal(10),
    Type.Literal(true),
  ]);

  const result = isUnionLiteral(schema);

  expect(result).toBe(true);
});

it("should return false if schema is not TUnion of TLiteral", () => {
  const schema = Type.Union([Type.Literal("foo")]);

  const result = isUnionLiteral(schema);

  expect(result).toBe(false);
});
