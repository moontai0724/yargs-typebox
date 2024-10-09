import { type TBoolean } from "@sinclair/typebox";
import type { Options } from "yargs";

import { getAnyOption } from "./any";

export function getBooleanOption<
  S extends TBoolean,
  O extends Options = object,
>(schema: S, overwrites: O = {} as never) {
  return getAnyOption("boolean", schema, overwrites);
}
