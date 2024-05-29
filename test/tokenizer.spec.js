import { tokenize } from "../src/tokenizer.js";

describe("Tokenize", () => {
  it("should return an empty array when given an empty string", () => {
    const result = tokenize("");
    expect(result).toEqual([]);
  });

  it("should tokenize the given text", () => {
    const text = "Hello, world! How are you?";
    const result = tokenize(text);
    expect(result).toEqual(["Hello", ",", "world", "!", "How", "are", "you", "?"]);
  });

  it("should remove spaces from the tokens when removeSpaces is true", () => {
    const text = "Hello, world! How are you?";
    const result = tokenize(text, true);
    expect(result).toEqual(["Hello", ",", "world", "!", "How", "are", "you", "?"]);
  });

  it("should not remove spaces from the tokens when removeSpaces is false", () => {
    const text = "Hello, world! How are you?";
    const result = tokenize(text, false);
    expect(result).toEqual(["Hello", ",", " ", "world", "!", " ", "How", " ", "are", " ", "you", "?"]);
  });
});