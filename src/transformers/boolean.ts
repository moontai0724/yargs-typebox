import { type TBoolean } from "@sinclair/typebox";
import type { Options } from "yargs";

import { getAnyOption } from "./any";

/**
 * Transform TypeBox TBoolean schema and options appended in schema to yargs
 * options.
 *
 * @param schema TypeBox TBoolean schema to transform
 * @param overwrites overwrites for yargs options result
 * @returns applicable yargs options in schema and overwrites
 */
export function getBooleanOption<
  S extends TBoolean,
  O extends Options = object,
>(schema: S, overwrites: O = {} as never) {
  return getAnyOption("boolean", schema, overwrites);
}
