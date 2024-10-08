import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import type { Options } from "yargs";

const transform = vi.fn().mockReturnValue({});

let getStringOption: typeof import("./string").getStringOption;

beforeAll(async () => {
  vi.doMock("./transform", () => ({ transform }));

  getStringOption = await import("./string").then(m => m.getStringOption);
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should call transform to transform", () => {
  const schema = Type.String();
  const expectedResponse = { mocked: true };
  transform.mockReturnValue(expectedResponse);

  const response = getStringOption(schema);

  expect(transform).toBeCalledWith("string", schema, {});
  expect(response).toEqual(expectedResponse);
});

it("should call transform to transform with overwrites", () => {
  const schema = Type.String();
  const overwrites = {
    alias: "aliased",
  } satisfies Options;
  const expectedResponse = { mocked: true, ...overwrites };
  transform.mockReturnValue(expectedResponse);

  const response = getStringOption(schema, overwrites);

  const expectedOverwrites = overwrites satisfies Options;

  expect(transform).toBeCalledWith("string", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});
