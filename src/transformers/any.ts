import { type Static, type TSchema, TypeGuard } from "@sinclair/typebox";
import type { Options } from "yargs";

/**
 * Transform TypeBox schema and options appended in schema to yargs options.
 * @param type type of the yargs option
 * @param schema TypeBox schema to transform
 * @param overwrites overwrites for yargs options result
 * @returns applicable yargs options in schema and overwrites
 * @see https://yargs.js.org/docs/#api-reference-optionskey-opt
 */
export function getAnyOption<
  T extends Options["type"] | undefined,
  S extends TSchema & Options,
  O extends Options = object,
>(type: T, schema: S, overwrites: O = {} as never) {
  // values that will be used for calculate or transform
  const defaultValue = schema.default as Static<S> | undefined;
  const hasDefaultValue = defaultValue !== undefined;
  const required = !TypeGuard.IsOptional(schema) && !hasDefaultValue;

  const base = { type } as { type: T };
  // take default value if present in schema without any modification
  const optionsFromSchema = {
    alias: schema.alias,
    coerce: schema.coerce,
    config: schema.config,
    configParser: schema.configParser,
    conflicts: schema.conflicts,
    count: schema.count,
    defaultDescription: schema.defaultDescription,
    global: schema.global,
    group: schema.group,
    hidden: schema.hidden,
    implies: schema.implies,
    nargs: schema.nargs,
    normalize: schema.normalize,
    requiresArg: schema.requiresArg,
    skipValidation: schema.skipValidation,
    default: defaultValue,
  } satisfies Options;
  // those values that might be able to come from multiple sources
  const overrides = {
    demandOption: schema.demandOption ?? required,
    deprecated: schema.deprecated ?? schema.deprecate,
    describe: schema.description ?? schema.describe ?? schema.desc,
  } satisfies Options;

  return {
    ...base,
    ...optionsFromSchema,
    ...overrides,
    ...overwrites,
  } satisfies Options;
}
