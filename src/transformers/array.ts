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

/**
 * Transform TypeBox TArray schema and options appended in schema to yargs
 * options.
 *
 * If the array items is Literal or Union of Literal, the choices will be set to
 * the const value of the Literal or Union of Literal. Otherwise, the choices
 * will be undefined.
 *
 * @param schema TypeBox TArray schema to transform
 * @param overwrites overwrites for yargs options result
 * @returns applicable yargs options in schema and overwrites
 */
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
