import { type TBoolean } from "@sinclair/typebox";
import type { Options } from "yargs";

import { transform } from "./transform";

export function getBooleanOption<
  S extends TBoolean,
  O extends Options = object,
>(schema: S, overwrites: O = {} as never) {
  return transform("boolean", schema, overwrites);
}
