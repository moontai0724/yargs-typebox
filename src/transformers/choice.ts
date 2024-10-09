import { type Static, type TLiteral, type TUnion } from "@sinclair/typebox";
import type { Options } from "yargs";

import { isUnionLiteral } from "@/helpers/is-union-literal";
import { tUnionToTuple } from "@/helpers/t-union-to-tuple";

import { getAnyOption } from "./any";

export function getChoiceOption<
  S extends TLiteral | TUnion<TLiteral[]>,
  O extends Options = object,
>(schema: S, overwrites: O = {} as never) {
  const choices = isUnionLiteral(schema)
    ? tUnionToTuple(schema)
    : [schema.const as Static<S>];
  const mergedOverwrites = {
    choices,
    ...overwrites,
  };

  return getAnyOption("string", schema, mergedOverwrites);
}
