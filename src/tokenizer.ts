export function tokenize(text: string, removeSpaces = true): string[] {
  const tokenizer = /([a-zÀ-ÿ-]+|[0-9._]+|.|!|\?|'|"|:|;|,|-)/i;
  const dirtyTokens = text.split(tokenizer);
  return dirtyTokens.filter(
    (token) => token != "" && (!removeSpaces || token != " ")
  );
}
