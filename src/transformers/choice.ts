import { type TLiteral, type TUnion, TypeGuard } from "@sinclair/typebox";
import type { Options } from "yargs";

export function getChoiceOption(
  schema: TUnion<TLiteral[]>,
  override: Options = {},
): Options {
  const hasDefaultValue = schema.default !== undefined;
  const options = {
    type: "string" as const,
    requiresArg: !TypeGuard.IsOptional(schema) && !hasDefaultValue,
    choices: schema.anyOf.map(item => {
      if (!TypeGuard.IsLiteral(item)) {
        throw new Error("Choices must contain only literal values");
      }

      return item.const.toString();
    }),
  };

  if (hasDefaultValue)
    Object.assign(options, { default: schema.default as string });
  if (schema.description)
    Object.assign(options, { description: schema.description });

  Object.assign(options, override);

  return options;
}
