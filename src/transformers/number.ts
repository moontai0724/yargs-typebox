import { type TNumber, TypeGuard } from "@sinclair/typebox";
import type { Options } from "yargs";

export function getNumberOption(
  schema: TNumber,
  override: Options = {},
): Options {
  const hasDefaultValue = schema.default !== undefined;
  const options: Options = {
    type: "number" as const,
    requiresArg: !TypeGuard.IsOptional(schema) && !hasDefaultValue,
  };

  if (hasDefaultValue)
    Object.assign(options, { default: schema.default as number });
  if (schema.description)
    Object.assign(options, { description: schema.description });

  Object.assign(options, override);

  return options;
}
