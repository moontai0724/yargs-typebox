import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import type { Options } from "yargs";

const getAnyOption = vi.fn();

let getBooleanOption: typeof import("./boolean").getBooleanOption;

beforeAll(async () => {
  vi.doMock("./any", () => ({ getAnyOption }));

  getBooleanOption = await import("./boolean").then(m => m.getBooleanOption);
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should call getAnyOption to transform", () => {
  const schema = Type.Boolean();
  const expectedResponse = { mocked: true };
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getBooleanOption(schema);

  expect(getAnyOption).toBeCalledWith("boolean", schema, {});
  expect(response).toEqual(expectedResponse);
});

it("should call getAnyOption to transform with overwrites", () => {
  const schema = Type.Boolean();
  const overwrites = {
    alias: "aliased",
  } satisfies Options;
  const expectedResponse = { mocked: true, alias: "aliased" };
  getAnyOption.mockReturnValue(expectedResponse);

  const response = getBooleanOption(schema, overwrites);

  const expectedOverwrites = overwrites satisfies Options;

  expect(getAnyOption).toBeCalledWith("boolean", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});
