import { type Static, type TSchema, TypeGuard } from "@sinclair/typebox";
import type { Options } from "yargs";

export type SchemaType = "string" | "number" | "boolean" | "array";

/**
 * Transform TypeBox schema to yargs options.
 * @param type type of the yargs option
 * @param schema TypeBox schema to transform
 * @returns applicable yargs options
 */
export function transform<
  T extends SchemaType,
  S extends TSchema,
  O extends Options = object,
>(type: T, schema: S, overwrites: O = {} as never) {
  const hasDefaultValue = schema.default !== undefined;
  const required = !TypeGuard.IsOptional(schema) && !hasDefaultValue;
  const defaultValue = hasDefaultValue
    ? (schema.default as Static<S>)
    : undefined;

  const base = { type } as { type: T };

  return {
    ...base,
    requiresArg: required,
    demandOption: required,
    default: defaultValue,
    description: schema.description,
    ...overwrites,
  } satisfies Options;
}
