import { type TNumber } from "@sinclair/typebox";
import type { Options } from "yargs";

import { getAnyOption } from "./any";

/**
 * Transform TypeBox TNumber schema and options appended in schema to yargs
 * options.
 *
 * @param schema TypeBox TNumber schema to transform
 * @param overwrites overwrites for yargs options result
 * @returns applicable yargs options in schema and overwrites
 */
export function getNumberOption<S extends TNumber, O extends Options = object>(
  schema: S,
  overwrites: O = {} as never,
) {
  return getAnyOption("number", schema, overwrites);
}
