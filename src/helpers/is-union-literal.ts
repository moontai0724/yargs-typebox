import {
  type TLiteral,
  type TSchema,
  type TUnion,
  TypeGuard,
} from "@sinclair/typebox";

export function isUnionLiteral(schema: TSchema): schema is TUnion<TLiteral[]> {
  if (!TypeGuard.IsUnion(schema)) return false;

  return schema.anyOf.every(item => TypeGuard.IsLiteral(item));
}
