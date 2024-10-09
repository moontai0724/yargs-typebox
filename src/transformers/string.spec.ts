import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import type { Options } from "yargs";

const getAnyOption = vi.fn().mockReturnValue({});

let getStringOption: typeof import("./string").getStringOption;

beforeAll(async () => {
  vi.doMock("./any", () => ({ getAnyOption }));

  getStringOption = await import("./string").then(m => m.getStringOption);
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should call getAnyOption to transform", () => {
  const schema = Type.String();
  const expectedResponse = { mocked: true };
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getStringOption(schema);

  expect(getAnyOption).toBeCalledWith("string", schema, {});
  expect(response).toEqual(expectedResponse);
});

it("should call getAnyOption to transform with overwrites", () => {
  const schema = Type.String();
  const overwrites = {
    alias: "aliased",
  } satisfies Options;
  const expectedResponse = { mocked: true, ...overwrites };
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getStringOption(schema, overwrites);

  const expectedOverwrites = overwrites satisfies Options;

  expect(getAnyOption).toBeCalledWith("string", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});
