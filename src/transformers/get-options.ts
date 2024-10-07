import type { Static, TObject } from "@sinclair/typebox";
import type { Options } from "yargs";

import { getOption } from "./get-option";

export function getOptions<Schema extends TObject>(
  schema: Schema,
): Record<keyof Static<Schema>, Options> {
  const options = Object.entries(schema.properties).reduce(
    (acc, [key, value]) => {
      const option = getOption(value);
      const result = {
        [key]: option,
      };

      Object.assign(acc, result);

      return acc;
    },
    {} as Record<keyof Static<Schema>, Options>,
  );

  return options;
}
