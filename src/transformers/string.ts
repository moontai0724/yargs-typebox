import { type TString } from "@sinclair/typebox";
import type { Options } from "yargs";

import { getAnyOption } from "./any";

export function getStringOption<S extends TString, O extends Options = object>(
  schema: S,
  overwrites: O = {} as never,
) {
  return getAnyOption("string", schema, overwrites);
}
