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

import { getArrayOption } from "./array";
import { getBooleanOption } from "./boolean";
import { getChoiceOption } from "./choice";
import { getNumberOption } from "./number";
import { getStringOption } from "./string";

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

  return overwrites;
}
