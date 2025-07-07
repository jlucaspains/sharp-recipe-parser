import { parseIngredient, parseInstruction } from "../src/index.js";

test("Parse ingredient with bad language", () => {
  expect(() => parseIngredient("some ingredient", "no")).toThrow(
    "Language no is not supported",
  );
});

test("Parse ingredient with null language", () => {
  expect(() => parseIngredient("some ingredient", null)).toThrow(
    "Language null is not supported",
  );
});

test("Parse ingredient with unknown language no fallback", () => {
  expect(() => parseIngredient("some ingredient", "en-CA")).toThrow(
    "Language en-CA is not supported and no fallback language is provided",
  );
});

test("Parse ingredient with unknown language with fallback en-US", () => {
  const result = parseIngredient("1 cup flour", "en-CA", {
    fallbackLanguage: "en-US",
  });
  expect(result).toEqual({
    alternativeQuantities: [],
    extra: "",
    ingredient: "flour",
    maxQuantity: 1,
    minQuantity: 1,
    quantity: 1,
    quantityText: "1",
    unit: "cup",
    unitText: "cup",
  });
});

test("Parse ingredient with unknown language with fallback en", () => {
  const result = parseIngredient("1 cup flour", "en-CA", {
    fallbackLanguage: "en",
  });
  expect(result).toEqual({
    alternativeQuantities: [],
    extra: "",
    ingredient: "flour",
    maxQuantity: 1,
    minQuantity: 1,
    quantity: 1,
    quantityText: "1",
    unit: "cup",
    unitText: "cup",
  });
});

test("Parse ingredient with unknown language with invalid fallback", () => {
  expect(() =>
    parseIngredient("some ingredient", "en-CA", {
      fallbackLanguage: "en-CA",
    }),
  ).toThrow(
    "Language en-CA is not supported and no fallback language is provided",
  );
});

test("Parse ingredient with null language", () => {
  expect(() => parseIngredient("some ingredient", undefined)).toThrow(
    "Language undefined is not supported",
  );
});

test("Parse ingredient empty", () => {
  expect(parseIngredient("", "en")).toBeNull();
});

test("Parse ingredient space", () => {
  expect(parseIngredient(" ", "en")).toBeNull();
});

test("Parse ingredient null", () => {
  expect(parseIngredient(null, "en")).toBeNull();
});

test("Parse ingredient undefined", () => {
  expect(parseIngredient(undefined, "en")).toBeNull();
});

test("Parse instruction with bad language", () => {
  expect(() => parseInstruction("some instruction", "no")).toThrow(
    "Language no is not supported",
  );
});

test("Parse instruction with null language", () => {
  expect(() => parseInstruction("some instruction", null)).toThrow(
    "Language null is not supported",
  );
});

test("Parse instruction with undefined language", () => {
  expect(() => parseInstruction("some instruction", undefined)).toThrow(
    "Language undefined is not supported",
  );
});

test("Parse instruction empty", () => {
  expect(parseInstruction("", "en")).toBeNull();
});

test("Parse instruction space", () => {
  expect(parseInstruction(" ", "en")).toBeNull();
});

test("Parse instruction null", () => {
  expect(parseInstruction(null, "en")).toBeNull();
});

test("Parse instruction undefined", () => {
  expect(parseInstruction(undefined, "en")).toBeNull();
});
