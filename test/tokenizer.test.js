import { tokenize } from "../src/tokenizer.js";

describe("Tokenize", () => {
  it("should return an empty array if the input text is empty", () => {
    const text = "";
    const result = tokenize(text);
    expect(result).toEqual([]);
  });

  it("should tokenize the given text", () => {
    const text = "Hello, world!";
    const result = tokenize(text);
    expect(result).toEqual(["Hello", ",", "world", "!"]);
  });

  it("should remove spaces from the tokens if removeSpaces is true", () => {
    const text = "Hello, world!";
    const result = tokenize(text, true);
    expect(result).toEqual(["Hello", ",", "world", "!"]);
  });

  it("should not remove spaces from the tokens if removeSpaces is false", () => {
    const text = "Hello, world!";
    const result = tokenize(text, false);
    expect(result).toEqual(["Hello", ",", " ", "world", "!"]);
  });
});