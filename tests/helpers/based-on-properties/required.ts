import type { Options } from "yargs";

export function basedOnRequired<O extends Options>(properties: O) {
  return {
    demandOption: true,
    ...properties,
  };
}
