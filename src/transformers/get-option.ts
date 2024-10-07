import {
  type TLiteral,
  type TSchema,
  type TUnion,
  TypeGuard,
} from "@sinclair/typebox";
import type { Options } from "yargs";

import { getArrayOption } from "./array";
import { getBooleanOption } from "./boolean";
import { getChoiceOption } from "./choice";
import { getNumberOption } from "./number";
import { getStringOption } from "./string";

export function getOption(schema: TSchema, override: Options = {}) {
  const option: Options = (() => {
    if (TypeGuard.IsNumber(schema)) return getNumberOption(schema, override);
    if (TypeGuard.IsString(schema)) return getStringOption(schema, override);
    if (TypeGuard.IsBoolean(schema)) return getBooleanOption(schema, override);
    if (TypeGuard.IsUnion(schema))
      return getChoiceOption(schema as TUnion<TLiteral[]>, override);
    if (TypeGuard.IsArray(schema)) return getArrayOption(schema, override);

    return {};
  })();

  Object.assign(option, override);

  return option;
}
