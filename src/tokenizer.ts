export function tokenize(text: string): string[] {
    const tokenizer = /([A-Za-zÀ-ÿ-]+|[0-9._]+|.|!|\?|'|"|:|;|,|-)/i;
    const dirtyTokens = text.split(tokenizer);
    return dirtyTokens.filter((token) => token != '' && token!= ' ');
}