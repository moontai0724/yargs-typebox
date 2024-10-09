import { type TNumber } from "@sinclair/typebox";
import type { Options } from "yargs";

import { getAnyOption } from "./any";

export function getNumberOption<S extends TNumber, O extends Options = object>(
  schema: S,
  overwrites: O = {} as never,
) {
  return getAnyOption("number", schema, overwrites);
}
