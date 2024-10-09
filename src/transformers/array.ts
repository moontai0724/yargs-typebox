import {
  type Static,
  type TArray,
  type TLiteral,
  type TSchema,
  type TUnion,
  TypeGuard,
  type UnionToTuple,
} from "@sinclair/typebox";
import type { Options } from "yargs";

import { isUnionLiteral } from "@/helpers/is-union-literal";
import { tUnionToTuple } from "@/helpers/t-union-to-tuple";

import { getAnyOption } from "./any";

type GetChoices<T extends TSchema> = T extends TLiteral
  ? [Static<T>]
  : T extends TUnion<TLiteral[]>
    ? UnionToTuple<Static<T>>
    : never;

function getChoices<T extends TSchema>(schema: T): GetChoices<T>;
function getChoices(schema: TSchema) {
  if (TypeGuard.IsLiteral(schema)) return [schema.const];
  if (isUnionLiteral(schema)) return tUnionToTuple(schema);

  return undefined;
}

export function getArrayOption<S extends TArray, O extends Options = object>(
  schema: S,
  overwrites: O = {} as never,
) {
  const choices = getChoices(schema.items) as GetChoices<S["items"]>;
  const mergedOverwrites = {
    // @ts-expect-error We expect this type to be calculated, but seems it's too
    // long for ts. If it been proved to be not nessesary, we can remove this
    // type inference.
    choices,
    ...overwrites,
  };

  return getAnyOption("array", schema, mergedOverwrites);
}
