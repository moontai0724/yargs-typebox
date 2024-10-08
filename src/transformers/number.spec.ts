import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";
import type { Options } from "yargs";

const transform = vi.fn().mockReturnValue({});

let getNumberOption: typeof import("./number").getNumberOption;

beforeAll(async () => {
  vi.doMock("./transform", () => ({ transform }));

  getNumberOption = await import("./number").then(m => m.getNumberOption);
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should call transform to transform", () => {
  const schema = Type.Number();
  const expectedResponse = { mocked: true };
  transform.mockReturnValue(expectedResponse);

  const response = getNumberOption(schema);

  expect(transform).toBeCalledWith("number", schema, {});
  expect(response).toEqual(expectedResponse);
});

it("should call transform to transform with overwrites", () => {
  const schema = Type.Number();
  const overwrites = {
    alias: "aliased",
  } satisfies Options;
  const expectedResponse = { mocked: true, ...overwrites };
  transform.mockReturnValue(expectedResponse);

  const response = getNumberOption(schema, overwrites);

  const expectedOverwrites = overwrites satisfies Options;

  expect(transform).toBeCalledWith("number", schema, expectedOverwrites);
  expect(response).toEqual(expectedResponse);
});
