import { type TString } from "@sinclair/typebox";
import type { Options } from "yargs";

import { transform } from "./transform";

export function getStringOption<S extends TString, O extends Options = object>(
  schema: S,
  overwrites: O = {} as never,
) {
  return transform("string", schema, overwrites);
}
