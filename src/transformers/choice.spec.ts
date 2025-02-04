import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import type { Options } from "yargs";

const isUnionLiteral = vi.fn();
const tUnionToTuple = vi.fn();
const getAnyOption = vi.fn();

let getChoiceOption: typeof import("./choice").getChoiceOption;

beforeAll(async () => {
  vi.doMock("@/helpers/is-union-literal", () => ({ isUnionLiteral }));
  vi.doMock("@/helpers/t-union-to-tuple", () => ({ tUnionToTuple }));
  vi.doMock("./any", () => ({ getAnyOption }));

  getChoiceOption = await import("./choice").then(m => m.getChoiceOption);
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should take its value if it is literal", () => {
  const schema = Type.Union([Type.Literal("foo")]);
  const expectedResponse = { mocked: true };
  getAnyOption.mockReturnValue(expectedResponse);
  isUnionLiteral.mockReturnValueOnce(false);

  const response = getChoiceOption(schema);

  const expectedOverwrites = {
    choices: ["foo"],
  } satisfies Options;

  expect(isUnionLiteral).toBeCalledWith(schema);
  expect(tUnionToTuple).not.toBeCalled();
  expect(getAnyOption).toBeCalledWith("string", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});

it("should call getAnyOption to transform union of literals to tuple of literals", () => {
  const schema = Type.Union([
    Type.Literal("foo"),
    Type.Literal(10),
    Type.Literal(true),
  ]);
  const expectedResponse = { mocked: true };
  getAnyOption.mockReturnValue(expectedResponse);
  isUnionLiteral.mockReturnValueOnce(true);
  tUnionToTuple.mockReturnValueOnce(["foo", 10, true]);

  const response = getChoiceOption(schema);

  const expectedOverwrites = {
    choices: ["foo", 10, true],
  } satisfies Options;

  expect(isUnionLiteral).toBeCalledWith(schema);
  expect(tUnionToTuple).toBeCalledWith(schema);
  expect(getAnyOption).toBeCalledWith("string", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});

it("should call getAnyOption with overwrites", () => {
  const schema = Type.Union([
    Type.Literal("foo"),
    Type.Literal(10),
    Type.Literal(true),
  ]);
  const overwrites = {
    alias: "aliased",
    choices: ["foo", "bar"],
  } satisfies Options;
  const expectedResponse = { mocked: true, ...overwrites };
  getAnyOption.mockReturnValue(expectedResponse);
  isUnionLiteral.mockReturnValueOnce(true);
  tUnionToTuple.mockReturnValueOnce(["foo", 10, true]);

  const response = getChoiceOption(schema, overwrites);

  const expectedOverwrites = overwrites satisfies Options;

  expect(isUnionLiteral).toBeCalledWith(schema);
  expect(tUnionToTuple).toBeCalledWith(schema);
  expect(getAnyOption).toBeCalledWith("string", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});
