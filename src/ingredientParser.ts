import Fraction from "fraction.js";
import { tokenize } from "./tokenizer";
import {
  AlternativeQuantity,
  IngredientParseResult,
  ParseIngredientOptions,
  Units,
  ValidLanguages,
} from "./types";
import { convert, getUnits, round } from "./units";

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

const defaultParseIngredientOptions: ParseIngredientOptions = {
  includeAlternativeUnits: false,
  includeExtra: true,
};

export function parseIngredient(
  text: string,
  language: ValidLanguages,
  options: ParseIngredientOptions = defaultParseIngredientOptions,
): IngredientParseResult | null {
  const units = getUnits(language);

  if (!units) {
    throw new Error(`Language ${language} is not supported`);
  }

  const tokens = tokenize(text, false);

  if (tokens.length == 0 || tokens.every((item) => item === " ")) {
    return null;
  }

  const [firstQuantity, quantity, quantityText, quantityEndIndex] = getQuantity(
    tokens,
    units,
  );
  const [unit, unitText, unitEndIndex] = getUnit(
    tokens,
    quantityEndIndex,
    units,
  );
  const [ingredient, ingredientEndIndex] = getIngredient(
    tokens,
    unitEndIndex,
    units,
  );

  let extra = "";
  if (options.includeExtra) {
    extra = getExtra(tokens, ingredientEndIndex);
  }

  const minQuantity = firstQuantity || quantity;
  const maxQuantity = quantity;

  let alternativeQuantities: AlternativeQuantity[] = [];
  if (options.includeAlternativeUnits) {
    alternativeQuantities = getIngredientConversions(
      { quantity, minQuantity, maxQuantity, unit, unitText },
      units,
    );
  }

  return {
    quantity,
    quantityText,
    minQuantity,
    maxQuantity,
    unit,
    unitText,
    ingredient,
    extra,
    alternativeQuantities,
  };
}

function getQuantity(
  tokens: string[],
  units: Units,
): [number, number, string, number] {
  let quantityText = "";
  let quantityConvertible = "";
  let firstQuantityConvertible = "";
  let index = 0;
  let space = "";

  for (; index < tokens.length; index++) {
    const item = tokens[index];
    const isSpace = item === " ";
    const isNumber = !isSpace && !isNaN(Number(item));
    const isFraction = item === "/";
    const isSpecialFraction = isUnicodeFraction(item);
    const isTextNumber = units.ingredientQuantities.has(item.toLowerCase());

    if (isNumber || isFraction || isSpecialFraction || isTextNumber) {
      let value = item;

      let specialSpace = space;
      if (isSpecialFraction) {
        value = unicodeFractions[item];
        specialSpace = quantityConvertible.length > 0 ? " " : space; // force space for unicode fractions
      } else if (isTextNumber) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        value = units.ingredientQuantities.get(item.toLowerCase())!.toString();
      }

      quantityText += `${space}${item}`;
      quantityConvertible += `${specialSpace}${value}`;
    } else if (
      quantityText.length > 0 &&
      units.ingredientRangeMarker.includes(item)
    ) {
      firstQuantityConvertible = quantityConvertible;
      quantityText += `${space}${item}`;
      quantityConvertible = "";
    } else if (!isSpace && quantityText.length > 0) {
      break;
    }

    space = isSpace ? " " : "";
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
  units: Units,
): [string, string, number] {
  if (startIndex >= tokens.length) {
    return ["", "", startIndex];
  }

  let newStartIndex = startIndex;

  // remove ingredient size if present
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const item = tokens[newStartIndex];

    if (!units.ingredientSizes.includes(item) && item != " ") {
      break;
    }

    newStartIndex++;
  }

  const possibleUOM = tokens[newStartIndex];
  const possibleUOMLower = possibleUOM.toLowerCase();

  if (!units.ingredientUnits.has(possibleUOMLower)) {
    return ["", "", newStartIndex];
  }

  newStartIndex++;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const unit = units.ingredientUnits.get(possibleUOMLower)!;
  let resultUnit: string;
  let resultUnitText: string;

  if (unit.customFunction) {
    const customUnit = unit.customFunction(tokens, newStartIndex);
    resultUnit = customUnit.uom;
    resultUnitText = customUnit.uomText;
    newStartIndex = customUnit.newIndex;
  } else {
    resultUnit = unit.text;
    resultUnitText = possibleUOM;
  }

  return [resultUnit, resultUnitText, newStartIndex];
}

function getIngredient(
  tokens: string[],
  startIndex: number,
  units: Units,
): [string, number] {
  if (startIndex >= tokens.length) {
    return ["", startIndex];
  }

  const separatorIndex = tokens.findIndex((item) => item == ",");
  const endIndex = separatorIndex > 0 ? separatorIndex : tokens.length;
  const cleanTokens = [];
  let withinParenthesis = false;

  if (tokens[startIndex] == " ") {
    startIndex++;
  }

  const firstToken = tokens[startIndex];

  const skipFirstToken =
    units.ingredientPrepositions.includes(firstToken) ||
    units.ingredientSizes.includes(firstToken) ||
    firstToken == ".";
  const newStartIndex = skipFirstToken ? startIndex + 2 : startIndex;

  for (const item of tokens.slice(newStartIndex, endIndex)) {
    // remove anything within parenthesis
    withinParenthesis = withinParenthesis || item == "(";

    if (!withinParenthesis) {
      cleanTokens.push(item);
    }

    withinParenthesis = withinParenthesis && item != ")";
  }

  return [
    cleanTokens
      .map((item) => item)
      .join("")
      .trim(),
    endIndex,
  ];
}

function getExtra(tokens: string[], startIndex: number): string {
  return tokens
    .slice(startIndex + 1)
    .join("")
    .trim();
}

function getIngredientConversions(
  defaultQuantity: AlternativeQuantity,
  units: Units,
): AlternativeQuantity[] {
  const unit = units.ingredientUnits.get(defaultQuantity.unit);
  const conversionGroup = unit?.conversionGroup;

  if (!conversionGroup) {
    return [];
  }

  const defaultConversions =
    units.unitConversions.defaultConversions.get(conversionGroup);

  if (!defaultConversions) {
    return [];
  }

  return defaultConversions
    .filter((item) => item !== unit.symbol)
    .map((possibility: string) => {
      const quantity = convert(
        defaultQuantity.quantity,
        unit.symbol,
        possibility,
        units,
      );
      const minQuantity = convert(
        defaultQuantity.minQuantity,
        unit.symbol,
        possibility,
        units,
      );
      const maxQuantity = convert(
        defaultQuantity.maxQuantity,
        unit.symbol,
        possibility,
        units,
      );

      const possibilityUOM = units.ingredientUnits.get(possibility);

      return {
        quantity: round(quantity, 0, 4),
        unit: possibility,
        unitText: possibilityUOM?.text ?? possibility,
        minQuantity: round(minQuantity, 0, 4),
        maxQuantity: round(maxQuantity, 0, 4),
      };
    });
}

function isUnicodeFraction(maybeFraction: string): boolean {
  // eslint-disable-next-line no-prototype-builtins
  return unicodeFractions.hasOwnProperty(maybeFraction);
}
