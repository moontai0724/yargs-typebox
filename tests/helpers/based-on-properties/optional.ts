import type { Options } from "yargs";

export function basedOnOptional<O extends Options>(properties: O) {
  return {
    requiresArg: false,
    demandOption: false,
    ...properties,
  };
}
