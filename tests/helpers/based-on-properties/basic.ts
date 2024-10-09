import type { Options } from "yargs";

import { basedOnRequired } from "./required";

export function basedOnBasic<O extends Options>(properties: O) {
  return basedOnRequired(properties);
}
