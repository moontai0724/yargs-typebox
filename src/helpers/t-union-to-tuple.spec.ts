import { Type } from "@sinclair/typebox";
import { expect, it } from "vitest";

import { tUnionToTuple } from "./t-union-to-tuple";

it("should transform TUnion to tuple", () => {
  const schema = Type.Union([
    Type.Literal("foo"),
    Type.Literal(10),
    Type.Literal(true),
  ]);

  const result = tUnionToTuple(schema);

  expect(result).toEqual(["foo", 10, true]);
});
