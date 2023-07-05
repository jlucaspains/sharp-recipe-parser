import { WordPunctTokenizer } from "natural/lib/natural/tokenizers";
import { NounInflector } from "natural/lib/natural/inflectors";
import Fraction from "fraction.js";
import { getUnits } from "./units";
import {
  IngredientParseResult,
  InstructionParseResult,
  InstructionTime,
  ValidLanguages,
} from "./types";

interface POSTaggedWord {
  token: string;
  tag: string;
}

const tokenizer = new WordPunctTokenizer();
const nounInflector = new NounInflector();

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

  const [firstQuantity, quantity, quantityText, quantityEndIndex] = getQuantity(tags, language);
  const [unit, unitText, unitEndIndex] = getUnit(tags, quantityEndIndex, language);
  const [ingredient, ingredientEndIndex] = getIngredient(
    tags,
    unitEndIndex,
    language
  );
  const extra = getExtra(tags, ingredientEndIndex);

  return { quantity, quantityText, minQuantity: firstQuantity || quantity, maxQuantity: quantity, unit, unitText, ingredient, extra };
}

export function parseInstruction(
  text: string,
  language: ValidLanguages
): InstructionParseResult | null {
  const tokens = tokenizer.tokenize(text);

  if (tokens == null || tokens.length == 0) {
    return null;
  }

  const tags = tokens.map((item) => {
    return { token: item, tag: "N" };
  });
  const units = getUnits(language);

  let number = 0;
  let numberText = "";
  let timeItems: InstructionTime[] = [];
  let totalTimeInSeconds = 0;
  let temperature = 0;
  let temperatureText = "";
  let temperatureUnit = "";
  let temperatureUnitText = "";
  for (const tag of tags) {
    const maybeNumber = Number(tag.token);
    if (!isNaN(maybeNumber)) {
      number = maybeNumber;
      numberText = tag.token;
    } else if (number > 0) {
      const maybeUnitSingular = nounInflector
        .singularize(tag.token)
        .toLowerCase();

      if (units.temperatureMarkers.includes(maybeUnitSingular)) {
        continue;
      }

      // uom is only relevant after number
      if (units.timeUnits.has(maybeUnitSingular)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const timeUnit = units.timeUnits.get(maybeUnitSingular)!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const timeInSeconds = number * units.timeUnitMultipliers.get(timeUnit)!;
        totalTimeInSeconds += timeInSeconds;
        timeItems.push({timeInSeconds, timeUnitText: tag.token, timeText: numberText});
      } else if (units.temperatureUnits.has(maybeUnitSingular)) {
        temperature = number;
        temperatureText = numberText;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        temperatureUnit = units.temperatureUnits.get(maybeUnitSingular)!;
        temperatureUnitText = tag.token;
      }

      number = 0; // reset if no match
    }
  }

  return { totalTimeInSeconds, timeItems, temperature, temperatureText, temperatureUnit, temperatureUnitText };
}

function getQuantity(tokens: POSTaggedWord[], language: ValidLanguages): [number, number, string, number] {
  let quantityText = "";
  let quantityConvertible = "";
  let ignoreNextSpace = false;
  let firstQuantityConvertible = "";
  let index = 0;
  const units = getUnits(language);

  for (; index < tokens.length; index++) {
    const item = tokens[index].token;
    const isNumber = !isNaN(Number(item));
    const isFraction = item === "/";
    const isSpecialFraction = isUnicodeFraction(item);
    const isTextNumber = units.ingredientQuantities.has(item.toLowerCase());

    if (isNumber || isFraction || isSpecialFraction || isTextNumber) {
      const addSpace = quantityText.length > 0 && !ignoreNextSpace && !isFraction;
      const space = addSpace ? " " : "";
      let value = item;

      if (isSpecialFraction) {
        value = unicodeFractions[item];
      } else if (isTextNumber) {
        value = units.ingredientQuantities.get(item.toLowerCase())!.toString();
      }

      quantityText += `${space}${item}`;
      quantityConvertible += `${space}${value}`;
      ignoreNextSpace = isFraction;
    } else if(quantityText.length > 0 && units.ingredientRangeMarker.includes(item)) {
      firstQuantityConvertible = quantityConvertible;
      quantityText += ` ${item}`;
      quantityConvertible = "";
    } else if (quantityText.length > 0) {
      break;
    }
  }

  if (quantityText.length === 0) {
    index = 0;
  }

  const firstQuantityValue = getQuantityValue(firstQuantityConvertible);
  const quantityValue = getQuantityValue(quantityConvertible);

  return [firstQuantityValue, quantityValue, quantityText, index];
}

function getQuantityValue(quantityConvertible: string): number {
  let quantityValue = 0;
  if (quantityConvertible.includes("/")) {
    const frac = new Fraction(quantityConvertible.trim());
    quantityValue = frac.round(2).valueOf();
  } else if (quantityConvertible.length > 0) {
    quantityValue = parseFloat(quantityConvertible.trim());
  }

  return quantityValue;
}

function getUnit(
  tokens: POSTaggedWord[],
  startIndex: number,
  language: ValidLanguages
): [string, string, number] {
  if (startIndex >= tokens.length) {
    return ["", "", startIndex];
  }

  const units = getUnits(language);
  let newStartIndex = startIndex;

  // remove ingredient size if present
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const item = tokens[newStartIndex];

    if (!units.ingredientSizes.includes(item.token)) {
      break;
    }

    newStartIndex++;
  }

  const possibleUOM = tokens[newStartIndex].token;
  const possibleUOMSingular = nounInflector
    .singularize(possibleUOM)
    .toLowerCase();

  if (!units.ingredientUnits.has(possibleUOMSingular)) {
    return ["", "", newStartIndex];
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return [units.ingredientUnits.get(possibleUOMSingular)!, possibleUOM, newStartIndex + 1];
}

function getIngredient(
  tokens: POSTaggedWord[],
  startIndex: number,
  language: ValidLanguages
): [string, number] {
  if (startIndex >= tokens.length) {
    return ["", startIndex];
  }

  const separatorIndex = tokens.findIndex((item) => item.token == ",");
  const endIndex = separatorIndex > 0 ? separatorIndex : tokens.length;
  const units = getUnits(language);
  const cleanTokens = [];
  let withinParenthesis = false;

  for (const item of tokens.slice(startIndex, endIndex)) {
    // remove anything within parenthesis
    withinParenthesis = withinParenthesis || item.token == "("
    // remove prepositions and ingredient sizes
    const isSpecial = units.ingredientPrepositions.includes(item.token)
      || units.ingredientSizes.includes(item.token);

    if (!isSpecial && !withinParenthesis) {
      cleanTokens.push(item);
    }

    withinParenthesis = withinParenthesis && item.token != ")";
  }


  return [cleanTokens.map((item) => item.token).join(" "), endIndex];
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