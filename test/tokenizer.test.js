import { tokenize } from "../src/tokenizer.js";

describe("Tokenize", () => {
  it("should return an empty array when given an empty string", () => {
    const result = tokenize("");
    expect(result).toEqual([]);
  });

  it("should tokenize the given text", () => {
    const text = "Hello, world! This is a test.";
    const result = tokenize(text);
    expect(result).toEqual(["Hello", ",", "world", "!", "This", "is", "a", "test", "."]);
  });

  it("should remove spaces from the tokens when removeSpaces is true", () => {
    const text = "Hello, world! This is a test.";
    const result = tokenize(text, true);
    expect(result).toEqual(["Hello", ",", "world", "!", "This", "is", "a", "test", "."]);
  });

  it("should not remove spaces from the tokens when removeSpaces is false", () => {
    const text = "Hello, world! This is a test.";
    const result = tokenize(text, false);
    expect(result).toEqual(["Hello", ",", " ", "world", "!", " ", "This", " ", "is", " ", "a", " ", "test", "."]);
  });
});