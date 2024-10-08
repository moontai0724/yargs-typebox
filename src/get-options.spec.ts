import { Type } from "@sinclair/typebox";
import { beforeAll, beforeEach, expect, it, vi } from "vitest";

const getOption = vi.fn().mockReturnValue({ type: "mocked" });

let component: typeof import("./get-options");

beforeAll(async () => {
  vi.doMock("./get-option", () => ({ getOption }));
  component = await import("./get-options");
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("should pass schemas of props in a TObject to get-option", () => {
  const schema = Type.Object({
    foo: Type.String(),
  });
  const result = component.getOptions(schema);
  expect(getOption).toBeCalledWith(schema.properties.foo);
  expect(result).toEqual({ foo: { type: "mocked" } });
});
