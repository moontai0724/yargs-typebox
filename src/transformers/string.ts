import { type TString } from "@sinclair/typebox";
import type { Options } from "yargs";

import { getAnyOption } from "./any";

/**
 * Transform TypeBox TString schema and options appended in schema to yargs
 * options.
 *
 * @param schema TypeBox TString schema to transform
 * @param overwrites overwrites for yargs options result
 * @returns applicable yargs options in schema and overwrites
 */
export function getStringOption<S extends TString, O extends Options = object>(
  schema: S,
  overwrites: O = {} as never,
) {
  return getAnyOption("string", schema, overwrites);
}
