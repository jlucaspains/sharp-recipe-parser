/**
 * Tokenizes the given text.
 * @param {string} text - The text to be tokenized.
 * @param {boolean} [removeSpaces=true] - Whether to remove spaces from the tokens.
 * @returns {string[]} An array of tokens.
 */
export function tokenize(text, removeSpaces = true) {
  if (!text) {
    return [];
  }

  const tokenizer = /([a-zÀ-ÿ-]+|[0-9._]+|.|!|\?|'|"|:|;|,|-)/i;
  const dirtyTokens = text.split(tokenizer);
  return dirtyTokens.filter(
    (token) => token != "" && (!removeSpaces || token != " "),
  );
}
