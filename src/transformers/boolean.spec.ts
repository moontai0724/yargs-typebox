import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import type { Options } from "yargs";

const transform = vi.fn();

let getBooleanOption: typeof import("./boolean").getBooleanOption;

beforeAll(async () => {
  vi.doMock("./transform", () => ({ transform }));

  getBooleanOption = await import("./boolean").then(m => m.getBooleanOption);
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should call transform to transform", () => {
  const schema = Type.Boolean();
  const expectedResponse = { mocked: true };
  transform.mockReturnValue(expectedResponse);

  const response = getBooleanOption(schema);

  expect(transform).toBeCalledWith("boolean", schema, {});
  expect(response).toEqual(expectedResponse);
});

it("should call transform to transform with overwrites", () => {
  const schema = Type.Boolean();
  const overwrites = {
    alias: "aliased",
  } satisfies Options;
  const expectedResponse = { mocked: true, alias: "aliased" };
  transform.mockReturnValue(expectedResponse);

  const response = getBooleanOption(schema, overwrites);

  const expectedOverwrites = overwrites satisfies Options;

  expect(transform).toBeCalledWith("boolean", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});
