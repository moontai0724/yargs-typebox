import { type TNumber } from "@sinclair/typebox";
import type { Options } from "yargs";

import { transform } from "./transform";

export function getNumberOption<S extends TNumber, O extends Options = object>(
  schema: S,
  overwrites: O = {} as never,
) {
  return transform("number", schema, overwrites);
}
