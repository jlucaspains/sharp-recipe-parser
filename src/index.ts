import { tokenize } from './tokenizer';
import Fraction from "fraction.js";
import { getUnits } from "./units";
import {
  IngredientParseResult,
  InstructionParseResult,
  InstructionTime,
  ValidLanguages,
} from "./types";

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
  const tokens = tokenize(text);

  if (tokens == null || tokens.length == 0) {
    return null;
  }

  const [firstQuantity, quantity, quantityText, quantityEndIndex] = getQuantity(
    tokens,
    language
  );
  const [unit, unitText, unitEndIndex] = getUnit(
    tokens,
    quantityEndIndex,
    language
  );
  const [ingredient, ingredientEndIndex] = getIngredient(
    tokens,
    unitEndIndex,
    language
  );
  const extra = getExtra(tokens, ingredientEndIndex);

  return {
    quantity,
    quantityText,
    minQuantity: firstQuantity || quantity,
    maxQuantity: quantity,
    unit,
    unitText,
    ingredient,
    extra,
  };
}

export function parseInstruction(
  text: string,
  language: ValidLanguages
): InstructionParseResult | null {
  const tokens = tokenize(text);

  if (tokens == null || tokens.length == 0) {
    return null;
  }

  const tags = tokens.map((item) => {
    return { token: item, tag: "N" };
  });
  const units = getUnits(language);

  let number = 0;
  let numberText = "";
  const timeItems: InstructionTime[] = [];
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
      const maybeUnit = tag.token.toLowerCase();

      if (units.temperatureMarkers.includes(maybeUnit)) {
        continue;
      }

      // uom is only relevant after number
      if (units.timeUnits.has(maybeUnit)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const timeUnit = units.timeUnits.get(maybeUnit)!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const timeInSeconds = number * units.timeUnitMultipliers.get(timeUnit)!;
        totalTimeInSeconds += timeInSeconds;
        timeItems.push({
          timeInSeconds,
          timeUnitText: tag.token,
          timeText: numberText,
        });
      } else if (units.temperatureUnits.has(maybeUnit)) {
        temperature = number;
        temperatureText = numberText;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        temperatureUnit = units.temperatureUnits.get(maybeUnit)!;
        temperatureUnitText = tag.token;
      }

      number = 0; // reset if no match
    }
  }

  return {
    totalTimeInSeconds,
    timeItems,
    temperature,
    temperatureText,
    temperatureUnit,
    temperatureUnitText,
  };
}

function getQuantity(
  tokens: string[],
  language: ValidLanguages
): [number, number, string, number] {
  let quantityText = "";
  let quantityConvertible = "";
  let ignoreNextSpace = false;
  let firstQuantityConvertible = "";
  let index = 0;
  const units = getUnits(language);

  for (; index < tokens.length; index++) {
    const item = tokens[index];
    const isNumber = !isNaN(Number(item));
    const isFraction = item === "/";
    const isSpecialFraction = isUnicodeFraction(item);
    const isTextNumber = units.ingredientQuantities.has(item.toLowerCase());

    if (isNumber || isFraction || isSpecialFraction || isTextNumber) {
      const addSpace =
        quantityText.length > 0 && !ignoreNextSpace && !isFraction;
      const space = addSpace ? " " : "";
      let value = item;

      if (isSpecialFraction) {
        value = unicodeFractions[item];
      } else if (isTextNumber) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        value = units.ingredientQuantities.get(item.toLowerCase())!.toString();
      }

      quantityText += `${space}${item}`;
      quantityConvertible += `${space}${value}`;
      ignoreNextSpace = isFraction;
    } else if (
      quantityText.length > 0 &&
      units.ingredientRangeMarker.includes(item)
    ) {
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
  tokens: string[],
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

    if (!units.ingredientSizes.includes(item)) {
      break;
    }

    newStartIndex++;
  }

  const possibleUOM = tokens[newStartIndex].toLowerCase();

  if (!units.ingredientUnits.has(possibleUOM)) {
    return ["", "", newStartIndex];
  }

  newStartIndex++;

  const unit = units.ingredientUnits.get(possibleUOM)!;
  let resultUnit: string;

  if (typeof unit === "string") {
    resultUnit = unit;
  } else {
    const customUnit = unit(tokens, newStartIndex);
    resultUnit = customUnit.uom;
    newStartIndex = customUnit.newIndex;
  }

  return [
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resultUnit,
    possibleUOM,
    newStartIndex,
  ];
}

function getIngredient(
  tokens: string[],
  startIndex: number,
  language: ValidLanguages
): [string, number] {
  if (startIndex >= tokens.length) {
    return ["", startIndex];
  }

  const separatorIndex = tokens.findIndex((item) => item == ",");
  const endIndex = separatorIndex > 0 ? separatorIndex : tokens.length;
  const units = getUnits(language);
  const cleanTokens = [];
  let withinParenthesis = false;
  const firstToken = tokens[startIndex];
  const skipFirstToken = units.ingredientPrepositions.includes(firstToken) ||
    units.ingredientSizes.includes(firstToken);
  const newStartIndex = skipFirstToken ? startIndex + 1 : startIndex;

  for (const item of tokens.slice(newStartIndex, endIndex)) {
    // remove anything within parenthesis
    withinParenthesis = withinParenthesis || item == "(";

    if (!withinParenthesis) {
      cleanTokens.push(item);
    }

    withinParenthesis = withinParenthesis && item != ")";
  }

  return [cleanTokens.map((item) => item).join(" "), endIndex];
}

function getExtra(tokens: string[], startIndex: number): string {
  return tokens
    .slice(startIndex + 1)
    .join(" ");
}

function isUnicodeFraction(maybeFraction: string): boolean {
  // eslint-disable-next-line no-prototype-builtins
  return unicodeFractions.hasOwnProperty(maybeFraction);
}
