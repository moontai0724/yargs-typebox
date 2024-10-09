import {
  type TArray,
  type TBoolean,
  type TLiteral,
  type TNumber,
  type TSchema,
  type TString,
  type TUnion,
  TypeGuard,
} from "@sinclair/typebox";
import type { Options } from "yargs";

import {
  getAnyOption,
  getArrayOption,
  getBooleanOption,
  getChoiceOption,
  getNumberOption,
  getStringOption,
} from "./transformers";

/**
 * Handy function to get yargs options from TypeBox schema without having to
 * manually call corresponding transformers.
 *
 * Handlable TypeBox schema types:
 * - `TNumber`
 * - `TString`
 * - `TBoolean`
 * - `TArray`
 * - `TLiteral`
 * - `TUnion<TLiteral[]>`
 *
 * Schemas that are not supported will still be able to transform, but only pick
 * supported yargs properties from schema.
 *
 * @param schema Any TypeBox schema that could be transformed to yargs options.
 * @param overwrites overwrites for yargs options result
 * @returns applicable yargs options in schema and overwrites
 */
export function getOption<T extends TSchema, O extends Options = object>(
  schema: T,
  overwrites?: O,
): T extends TNumber
  ? ReturnType<typeof getNumberOption<T>>
  : T extends TString
    ? ReturnType<typeof getStringOption<T>>
    : T extends TBoolean
      ? ReturnType<typeof getBooleanOption<T>>
      : T extends TUnion<TLiteral[]>
        ? ReturnType<typeof getChoiceOption<T>>
        : T extends TArray
          ? ReturnType<typeof getArrayOption<T>>
          : O;

export function getOption(schema: TSchema, overwrites: Options = {}) {
  if (TypeGuard.IsNumber(schema)) return getNumberOption(schema, overwrites);
  if (TypeGuard.IsString(schema)) return getStringOption(schema, overwrites);
  if (TypeGuard.IsBoolean(schema)) return getBooleanOption(schema, overwrites);
  if (TypeGuard.IsUnionLiteral(schema) || TypeGuard.IsLiteral(schema))
    return getChoiceOption(schema, overwrites);
  if (TypeGuard.IsArray(schema)) return getArrayOption(schema, overwrites);

  return getAnyOption(undefined, schema, overwrites);
}
