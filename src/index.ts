import { WordPunctTokenizer } from "natural/lib/natural/tokenizers";
// import {
//   BrillPOSTagger,
//   BrillPOSTaggedWord,
//   Lexicon,
//   RuleSet,
// } from "natural/lib/natural/brill_pos_tagger";
import { NounInflector } from "natural/lib/natural/inflectors";
import Fraction from "fraction.js";
import { getUnits } from "./units";
import {
  IngredientParseResult,
  InstructionParseResult,
  ValidLanguages,
} from "./types";

interface POSTaggedWord {
  token: string;
  tag: string;
}

const tokenizer = new WordPunctTokenizer();
const nounInflector = new NounInflector();
// const taggers = new Map<string, BrillPOSTagger>();

/* eslint-disable @typescript-eslint/naming-convention */
const unicodeFractions: Record<string, string> = {
  "½": "1/2",
  "⅓": "1/3",
  "⅔": "2/3",
  "¼": "1/4",
  "¾": "3/4",
  "⅕": "1/5",
  "⅖": "2/5",
  "⅗": "3/5",
  "⅘": "4/5",
  "⅙": "1/6",
  "⅚": "5/6",
  "⅐": "1/7",
  "⅛": "1/8",
  "⅜": "3/8",
  "⅝": "5/8",
  "⅞": "7/8",
  "⅑": "1/9",
  "⅒": "1/10",
};
/* eslint-enable @typescript-eslint/naming-convention */

export function parseIngredient(
  text: string,
  language: ValidLanguages
): IngredientParseResult | null {
  const tokens = tokenizer.tokenize(text);

  if (tokens == null || tokens.length == 0) {
    return null;
  }

  const tags = tokens.map((item) => {
    return { token: item, tag: "N" };
  });

  const [quantity, quantityText, quantityEndIndex] = getQuantity(tags);
  const [unit, unitEndIndex] = getUnit(tags, quantityEndIndex, language);
  const [ingredient, ingredientEndIndex] = getIngredient(
    tags,
    unitEndIndex,
    language
  );
  const extra = getExtra(tags, ingredientEndIndex);

  return { quantity, quantityText, unit, ingredient, extra };
}

export function parseIngredientSimple(
  text: string,
  language: ValidLanguages
): IngredientParseResult | null {
  const tokens = tokenizer.tokenize(text);

  if (tokens == null || tokens.length == 0) {
    return null;
  }

  const tags = tokens.map((item) => {
    return { token: item, tag: "N" };
  });

  const [quantity, quantityText, quantityEndIndex] = getQuantity(tags);
  const [unit, unitEndIndex] = getUnit(tags, quantityEndIndex, language);
  const [ingredient, ingredientEndIndex] = getIngredient(
    tags,
    unitEndIndex,
    language
  );
  const extra = getExtra(tags, ingredientEndIndex);

  return { quantity, quantityText, unit, ingredient, extra };
}

export function parseInstruction(
  text: string,
  language: ValidLanguages
): InstructionParseResult | null {
  const tokens = tokenizer.tokenize(text);

  if (tokens == null || tokens.length == 0) {
    return null;
  }

  // const tagger = getTagger(language);
  // const tags = tagger.tagWithLexicon(tokens).taggedWords;
  const tags = tokens.map((item) => {
    return { token: item, tag: "N" };
  });
  const units = getUnits(language);

  let number = 0;
  let timeInSeconds = 0;
  let temperature = 0;
  let temperatureUnit = "";
  for (const tag of tags) {
    const maybeNumber = Number(tag.token);
    if (!isNaN(maybeNumber)) {
      number = maybeNumber;
    } else if (number > 0) {
      const maybeUnitSingular = nounInflector
        .singularize(tag.token)
        .toLowerCase();

      // uom is only relevant after number
      if (units.timeUnits.has(maybeUnitSingular)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const timeUnit = units.timeUnits.get(maybeUnitSingular)!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        timeInSeconds += number * units.timeUnitMultipliers.get(timeUnit)!;
      } else if (units.temperatureUnits.has(maybeUnitSingular)) {
        temperature = number;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        temperatureUnit = units.temperatureUnits.get(maybeUnitSingular)!;
      }

      number = 0; // reset if no match
    }
  }

  return { timeInSeconds, temperature, temperatureUnit };
}

// function getTagger(language: ValidLanguages): BrillPOSTagger {
//   if (!taggers.has(language)) {
//     const defaultCategory = "N";
//     const defaultCategoryCapitalized = "NNP";
//     const lexicon = new Lexicon(
//       language.toUpperCase(),
//       defaultCategory,
//       defaultCategoryCapitalized
//     );
//     const ruleSet = new RuleSet(language.toUpperCase());
//     const tagger = new BrillPOSTagger(lexicon, ruleSet);
//     taggers.set(language, tagger);
//   }

//   // the passed language will always be available here, so it is safe to disable this rule
//   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   return taggers.get(language)!;
// }

function getQuantity(tokens: POSTaggedWord[]): [number, string, number] {
  let quantityText = "";
  let quantityConvertible = "";

  let addSpace = false;
  let index = 0;
  for (; index < tokens.length; index++) {
    const item = tokens[index].token;

    addSpace = addSpace && item != "/";

    let hasUnicodeFraction = false;
    if (
      !isNaN(Number(item)) ||
      item == "/" ||
      (hasUnicodeFraction = isUnicodeFraction(item))
    ) {
      quantityText += `${addSpace ? " " : ""}${item}`;
      quantityConvertible += `${addSpace ? " " : ""}${
        hasUnicodeFraction ? unicodeFractions[item] : item
      }`;
    } else {
      break;
    }

    addSpace = item != "/";
  }

  let quantityValue = 0;
  if (quantityConvertible.includes("/")) {
    const frac = new Fraction(quantityConvertible);
    quantityValue = frac.valueOf();
  } else if (quantityConvertible.length == 0) {
    quantityValue = 0;
  } else {
    quantityValue = parseFloat(quantityConvertible);
  }

  return [quantityValue, quantityText, index];
}

function getUnit(
  tokens: POSTaggedWord[],
  startIndex: number,
  language: ValidLanguages
): [string, number] {
  if (startIndex >= tokens.length) {
    return ["", startIndex];
  }

  const possibleUOM = tokens[startIndex].token;
  // const possibleUOMSingular = possibleUOM.toLowerCase();
  const possibleUOMSingular = nounInflector
    .singularize(possibleUOM)
    .toLowerCase();

  const units = getUnits(language);
  if (!units.ingredientUnits.has(possibleUOMSingular)) {
    return ["", startIndex];
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [units.ingredientUnits.get(possibleUOMSingular)!, startIndex + 1];
}

function getIngredient(
  tokens: POSTaggedWord[],
  startIndex: number,
  language: ValidLanguages
): [string, number] {
  if (startIndex >= tokens.length) {
    return ["", startIndex];
  }

  const commaIndex = tokens.findIndex((item) => item.token == ",");
  const endIndex = commaIndex > 0 ? commaIndex : tokens.length;

  let newStartIndex = startIndex;

  const units = getUnits(language);
  // remove prepositions up until the first non-preposition
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const item = tokens[newStartIndex];

    if (!units.ingredientPrepositions.includes(item.token)) {
      break;
    }

    newStartIndex++;
  }

  const ingredients = tokens.slice(newStartIndex, endIndex);

  return [ingredients.map((item) => item.token).join(" "), endIndex];
}

function getExtra(tokens: POSTaggedWord[], startIndex: number): string {
  return tokens
    .slice(startIndex + 1)
    .map((item) => item.token)
    .join(" ");
}

function isUnicodeFraction(maybeFraction: string): boolean {
  // eslint-disable-next-line no-prototype-builtins
  return unicodeFractions.hasOwnProperty(maybeFraction);
}

// console.log(parseIngredient("1 cup of sugar", "en"));
// console.log(parseInstruction("Bake at 400F for 20sec  ", "en"));
// console.log(parseInstruction("Bake at 400F for 10 min", "en"));
// console.log(parseInstruction("Bake at 400F for 2 hour", "en"));
// console.log(parseInstruction("Bake at 180C for 1 day", "en"));
