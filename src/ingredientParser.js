// eslint-disable-next-line no-unused-vars
import * as Types from "./types.js";
import Fraction from "fraction.js";
import { tokenize } from "./tokenizer.js";
import { convert, getUnits, round } from "./units.js";

/**
 * @typedef {{
 *  quantity: number;
 *  quantityText: string;
 *  minQuantity: number;
 *  maxQuantity: number;
 *  unit: string;
 *  unitText: string;
 *  ingredient: string;
 *  extra: string;
 *  alternativeQuantities: Types.AlternativeQuantity[];
 * }} IngredientParseResult
 */

/**
 * @typedef {{
 *  includeExtra: boolean;
 *  includeAlternativeUnits: boolean;
 * }} ParseIngredientOptions
 */

/**
 * @type {Record<string, string>}
 */
const unicodeFractions = {
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

/**
 * @type {ParseIngredientOptions}
 */
const defaultParseIngredientOptions = {
  includeAlternativeUnits: false,
  includeExtra: true,
};

/**
 * Parses an ingredient string into its component parts
 * @param {string} text - The ingredient string to be parsed.
 * @param {Types.ValidLanguages} language - The language of the ingredient string.
 * @param {ParseIngredientOptions} options - The options to use when parsing the ingredient string.
 * @returns {IngredientParseResult | null} The parsed ingredient object, or null if the ingredient string is empty.
 * @throws {Error} if language is not supported
 */
export function parseIngredient(
  text,
  language,
  options = defaultParseIngredientOptions,
) {
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

  /**
   * @type {Types.AlternativeQuantity[]}
   */
  let alternativeQuantities = [];
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

/**
 * Gets the quantity out of a list of tokens using a specific unit dictionary
 * @param {string[]} tokens - The list of tokens to get the quantity from.
 * @param {Types.Units} units - The unit dictionary to use when parsing the quantity.
 * @returns {[number, number, string, number]} The quantity value, the quantity text, and the index of the last token used to get the quantity.
 */
function getQuantity(tokens, units) {
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
        value = units.ingredientQuantities.get(item.toLowerCase()).toString();
      }

      quantityText += `${space}${item}`;
      quantityConvertible += `${specialSpace}${value}`;
    } else if (units.ingredientQuantityAddMarker.includes(item)) {
      quantityText += `${space}${item}`;
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

/**
 * This function converts a quantity string into a numerical value.
 * If the string includes a "/", it is treated as a fraction and converted accordingly.
 * If the string does not include a "/", it is converted directly to a float.
 * @param {string} quantityConvertible - The quantity string to be converted.
 * @returns {number} The converted numerical value of the quantity.
 */
function getQuantityValue(quantityConvertible) {
  let quantityValue = 0;
  if (quantityConvertible.includes("/")) {
    const frac = new Fraction(quantityConvertible.trim());
    quantityValue = frac.round(2).valueOf();
  } else if (quantityConvertible.length > 0) {
    quantityValue = parseFloat(quantityConvertible.trim());
  }

  return quantityValue;
}

/**
 * Gets the unit out of a list of tokens using a specific unit dictionary
 * @param {string[]} tokens - The list of tokens to get the unit from.
 * @param {number} startIndex - The index of the first token to use when getting the unit.
 * @param {Types.Units} units - The unit dictionary to use when parsing the unit.
 * @returns {[string, string, number]} The unit value, the unit text, and the index of the last token used to get the unit.
 */
function getUnit(tokens, startIndex, units) {
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

  const unit = units.ingredientUnits.get(possibleUOMLower);
  /**
   * @type {string}
   */
  let resultUnit;
  /**
   * @type {string}
   */
  let resultUnitText;

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

/**
 * Gets the ingredient out of a list of tokens using a specific unit dictionary
 * @param {string[]} tokens - The list of tokens to get the ingredient from.
 * @param {number} startIndex - The index of the first token to use when getting the ingredient.
 * @param {Types.Units} units - The unit dictionary to use when parsing the ingredient.
 * @returns {[string, number]} The ingredient value and the index of the last token used to get the ingredient.
 */
function getIngredient(tokens, startIndex, units) {
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

/**
 * Gets the extra text out of a list of tokens
 * @param {string[]} tokens - The list of tokens to get the extra text from.
 * @param {number} startIndex - The index of the first token to use when getting the extra text.
 * @returns {string} The extra text value.
 */
function getExtra(tokens, startIndex) {
  return tokens
    .slice(startIndex + 1)
    .join("")
    .trim();
}

/**
 * Gets the ingredient conversions for a given ingredient quantity
 * @param {Types.AlternativeQuantity} defaultQuantity - The ingredient quantity to get the conversions for.
 * @param {Types.Units} units - The unit dictionary to use when getting the conversions.
 * @returns {Types.AlternativeQuantity[]} The ingredient conversions.
 */
function getIngredientConversions(defaultQuantity, units) {
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
    .map((possibility) => {
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

/**
 * Checks if a string is a unicode fraction
 * @param {string} maybeFraction - The string to check.
 * @returns {boolean} True if the string is a unicode fraction, false otherwise.
 */
function isUnicodeFraction(maybeFraction) {
  // eslint-disable-next-line no-prototype-builtins
  return unicodeFractions.hasOwnProperty(maybeFraction);
}
