import { type TString, TypeGuard } from "@sinclair/typebox";
import type { Options } from "yargs";

export function getStringOption(
  schema: TString,
  override: Options = {},
): Options {
  const hasDefaultValue = schema.default !== undefined;
  const options = {
    type: "string" as const,
    requiresArg: !TypeGuard.IsOptional(schema) && !hasDefaultValue,
  };

  if (hasDefaultValue)
    Object.assign(options, { default: schema.default as string });
  if (schema.description)
    Object.assign(options, { description: schema.description });

  Object.assign(options, override);

  return options;
}
