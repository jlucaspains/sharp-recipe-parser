import { tokenize } from "./tokenizer";
import Fraction from "fraction.js";
import { getUnits } from "./units";
import convert from 'convert-units';
import {
  IngredientParseResult,
  InstructionParseResult,
  InstructionTime,
  ValidLanguages,
  ParseIngredientOptions,
  AlternativeQuantity,
  ParseInstructionOptions
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

const defaultParseIngredientOptions: ParseIngredientOptions = {
  includeAlternativeUnits: false,
  includeExtra: true,
}


const defaultParseInstructionOptions: ParseInstructionOptions = {
  includeAlternativeTemperatureUnit: false
}

export function parseIngredient(
  text: string,
  language: ValidLanguages,
  options: ParseIngredientOptions = defaultParseIngredientOptions
): IngredientParseResult | null {
  const tokens = tokenize(text, false);

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

  let extra = "";
  if (options.includeExtra ?? true) {
    extra = getExtra(tokens, ingredientEndIndex);
  }

  const minQuantity = firstQuantity || quantity;
  const maxQuantity = quantity;

  let alternativeQuantities: Array<AlternativeQuantity> = [];
  if (options.includeAlternativeUnits ?? false) {
    alternativeQuantities = getIngredientConversions({ quantity, minQuantity, maxQuantity, unit }, language);
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
    alternativeQuantities
  };
}

export function parseInstruction(
  text: string,
  language: ValidLanguages,
  options: ParseInstructionOptions = defaultParseInstructionOptions
  ): InstructionParseResult | null {
  const tokens = tokenize(text);

  if (tokens == null || tokens.length == 0) {
    return null;
  }

  const units = getUnits(language);

  let number = 0;
  let numberText = "";
  const timeItems: InstructionTime[] = [];
  let totalTimeInSeconds = 0;
  let temperature = 0;
  let temperatureText = "";
  let temperatureUnit = "";
  let temperatureUnitText = "";
  let alternativeTemperatures: Array<AlternativeQuantity> = [];
  for (const token of tokens) {
    const maybeNumber = Number(token);

    if (!isNaN(maybeNumber)) {
      number = maybeNumber;
      numberText = token;
    } else if (number > 0) {
      const maybeUnit = token.toLowerCase();

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
          timeUnitText: token,
          timeText: numberText,
        });
      } else if (units.temperatureUnits.has(maybeUnit)) {
        temperature = number;
        temperatureText = numberText;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        temperatureUnit = units.temperatureUnits.get(maybeUnit)!.text;
        temperatureUnitText = token;
      }

      number = 0; // reset if no match
    }
  }

  if (options.includeAlternativeTemperatureUnit && temperature > 0) {
    alternativeTemperatures = getTemperatureConversions(temperature, temperatureUnit, language);
  }

  return {
    totalTimeInSeconds,
    timeItems,
    temperature,
    temperatureText,
    temperatureUnit,
    temperatureUnitText,
    alternativeTemperatures
  };
}

function getQuantity(
  tokens: string[],
  language: ValidLanguages
): [number, number, string, number] {
  let quantityText = "";
  let quantityConvertible = "";
  let firstQuantityConvertible = "";
  let index = 0;
  const units = getUnits(language);
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

  const unit = units.ingredientUnits.get(possibleUOMLower)!;
  let resultUnit: string;
  let resultUnitText: string;

  if (unit.customFunction) {
    const customUnit = unit.customFunction(tokens, newStartIndex);
    resultUnit = customUnit.uom;
    resultUnitText = customUnit.uomText
    newStartIndex = customUnit.newIndex;
  } else {
    resultUnit = unit.text;
    resultUnitText = possibleUOM;
  }

  return [
    resultUnit,
    resultUnitText,
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

function getIngredientConversions(defaultQuantity: AlternativeQuantity, language: ValidLanguages): Array<AlternativeQuantity> {
  const unit = getUnits(language).ingredientUnits.get(defaultQuantity.unit);

  if (!unit?.canConvert) {
    return [];
  }

  return unit.conversions.map((possibility: string) => {
    const quantity = convert(defaultQuantity.quantity).from(unit.symbol).to(possibility);
    const minQuantity = convert(defaultQuantity.quantity).from(unit.symbol).to(possibility);
    const maxQuantity = convert(defaultQuantity.quantity).from(unit.symbol).to(possibility);

    return {
      quantity: round(quantity, 0, 4),
      unit: possibility,
      minQuantity: round(minQuantity, 0, 4),
      maxQuantity: round(maxQuantity, 0, 4),
    };
  });
}

function getTemperatureConversions(temperature: number, uom: string, language: ValidLanguages): AlternativeQuantity[] {
  const unit = getUnits(language).temperatureUnits.get(uom);

  if (!unit?.canConvert) {
    return [];
  }

  return unit.conversions.map((possibility: string) => {
    const quantity = convert(temperature).from(unit.symbol).to(possibility);

    const rounded = round(quantity, 0, 4);
    return {
      quantity: rounded,
      unit: possibility,
      minQuantity: rounded,
      maxQuantity: rounded,
    };
  });
}

function isUnicodeFraction(maybeFraction: string): boolean {
  // eslint-disable-next-line no-prototype-builtins
  return unicodeFractions.hasOwnProperty(maybeFraction);
}

function round(
  value: number,
  minimumFractionDigits: number,
  maximumFractionDigits: number
) {
  const formattedValue = value.toLocaleString('en', {
    useGrouping: false,
    minimumFractionDigits,
    maximumFractionDigits
  })
  return Number(formattedValue)
}