import type { Static, TObject } from "@sinclair/typebox";
import type { Options } from "yargs";

import { getOption } from "./get-option";

/**
 * Transform a whole TypeBox TObject schema to multiple yargs options. Key of
 * the object will be the name of the parameter, and the value will be the yargs
 * option schema.
 *
 * The value will be transformed by `getOption` function.
 *
 * @param schema TypeBox TObject schema to transform as multiple yargs options,
 * as key be the name and the value be the schema
 * @returns transformed object of yargs options
 */
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
