import {
  type Static,
  type TLiteral,
  type TUnion,
  type UnionToTuple,
} from "@sinclair/typebox";

export function tUnionToTuple<S extends TUnion<TLiteral[]>>(
  schema: S,
): UnionToTuple<Static<S>> {
  return schema.anyOf.map(item => item.const) as never;
}
