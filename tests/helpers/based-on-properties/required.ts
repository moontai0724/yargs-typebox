import type { Options } from "yargs";

export function basedOnRequired<O extends Options>(properties: O) {
  return {
    requiresArg: true,
    demandOption: true,
    ...properties,
  };
}
