import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import type { Options } from "yargs";

const getAnyOption = vi.fn().mockReturnValue({});

let getNumberOption: typeof import("./number").getNumberOption;

beforeAll(async () => {
  vi.doMock("./any", () => ({ getAnyOption }));

  getNumberOption = await import("./number").then(m => m.getNumberOption);
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should call getAnyOption to transform", () => {
  const schema = Type.Number();
  const expectedResponse = { mocked: true };
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getNumberOption(schema);

  expect(getAnyOption).toBeCalledWith("number", schema, {});
  expect(response).toEqual(expectedResponse);
});

it("should call getAnyOption to transform with overwrites", () => {
  const schema = Type.Number();
  const overwrites = {
    alias: "aliased",
  } satisfies Options;
  const expectedResponse = { mocked: true, ...overwrites };
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getNumberOption(schema, overwrites);

  const expectedOverwrites = overwrites satisfies Options;

  expect(getAnyOption).toBeCalledWith("number", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});
