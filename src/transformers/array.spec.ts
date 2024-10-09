import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import type { Options } from "yargs";

const isUnionLiteral = vi.fn();
const tUnionToTuple = vi.fn();
const getAnyOption = vi.fn();

let getArrayOption: typeof import("./array").getArrayOption;

beforeAll(async () => {
  vi.doMock("@/helpers/is-union-literal", () => ({ isUnionLiteral }));
  vi.doMock("@/helpers/t-union-to-tuple", () => ({ tUnionToTuple }));
  vi.doMock("./any", () => ({ getAnyOption }));

  getArrayOption = await import("./array").then(m => m.getArrayOption);
});

beforeEach(() => {
  vi.resetAllMocks();
});

it("should call getAnyOption to transform", () => {
  const schema = Type.Array(Type.Any());
  const expectedResponse = { mocked: true };
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getArrayOption(schema);

  expect(getAnyOption).toBeCalledWith("array", schema, {});
  expect(response).toEqual(expectedResponse);
});

it("should take its value as choices if it is literal", () => {
  const schema = Type.Array(Type.Union([Type.Literal("foo")]));
  const expectedResponse = { mocked: true };
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getArrayOption(schema);

  const expectedOverwrites = {
    choices: ["foo"],
  } satisfies Options;

  expect(isUnionLiteral).not.toBeCalled();
  expect(tUnionToTuple).not.toBeCalled();
  expect(getAnyOption).toBeCalledWith("array", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});

it("should take union of literals to tuple of literals as value of choices then call getAnyOption to transform", () => {
  const schema = Type.Array(
    Type.Union([Type.Literal("foo"), Type.Literal(10), Type.Literal(true)]),
  );
  const expectedResponse = { mocked: true };
  isUnionLiteral.mockReturnValueOnce(true);
  tUnionToTuple.mockReturnValueOnce(["foo", 10, true]);
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getArrayOption(schema);

  const expectedOverwrites = {
    choices: ["foo", 10, true],
  } satisfies Options;

  expect(isUnionLiteral).toBeCalledWith(schema.items);
  expect(tUnionToTuple).toBeCalledWith(schema.items);
  expect(getAnyOption).toBeCalledWith("array", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});

it("should call getAnyOption with overwrites", () => {
  const schema = Type.Array(
    Type.Union([Type.Literal("foo"), Type.Literal(10), Type.Literal(true)]),
  );
  const overwrites = {
    alias: "aliased",
    choices: ["foo", "bar"],
  } satisfies Options;
  const expectedResponse = { mocked: true, ...overwrites };
  isUnionLiteral.mockReturnValueOnce(true);
  tUnionToTuple.mockReturnValueOnce(["foo", 10, true]);
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getArrayOption(schema, overwrites);

  const expectedOverwrites = overwrites satisfies Options;

  expect(isUnionLiteral).toBeCalledWith(schema.items);
  expect(tUnionToTuple).toBeCalledWith(schema.items);
  expect(getAnyOption).toBeCalledWith("array", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});
