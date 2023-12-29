import * as Types from "./types";
import EnglishUnits from "./units.en";
import AmericanEnglishUnits from "./units.enUS";
import PortugueseUnits from "./units.pt";
import BrazilianPortugueseUnits from "./units.ptBR";

/**
 * @type {Map<string, string>}
 */
const units = new Map();
units.set("en", EnglishUnits);
units.set("en-us", AmericanEnglishUnits);
units.set("pt", PortugueseUnits);
units.set("pt-br", BrazilianPortugueseUnits);

/**
 * This function retrieves the units for a given language.
 * It uses a Map of units, where the key is the language.
 * If no units are found for the given language, it returns null.
 * @param {Types.ValidLanguages} language - The language to get the units for.
 * @returns {Types.Units | null} The units for the given language, or null if no units are found.
 */
export function getUnits(language) {
  if (!language) {
    return null;
  }

  // only types mapped will be accepted so it is safe to disable this rule
  return units.get(language.toLowerCase()) ?? null;
}

/**
 * This function converts a value from one unit to another.
 * It uses a Map of converters, where the key is a string in the format 'from->to'.
 * If no converter is found for the given units, it throws an error.
 * @param {number} input - The value to be converted.
 * @param {string} from - The unit of the input value.
 * @param {string} to - The unit to convert the input value to.
 * @param {Types.Units} units - The units object containing unit conversions.
 * @returns {number} The converted value.
 * @throws {Error} Throws an error if no conversion is found for the given units.
 */
export function convert(input, from, to, units) {
  const converter = units.unitConversions.converters.get(`${from}->${to}`);
  if (!converter) {
    throw new Error(`No conversion found from ${from} to ${to}`);
  }

  return converter(input);
}

/**
 * This function rounds a number to a specified number of decimal places.
 * It uses the toLocaleString method to format the number with the specified minimum and maximum number of fraction digits.
 * The formatted number is then converted back to a Number and returned.
 * @param {number} value - The number to be rounded.
 * @param {number} minimumFractionDigits - The minimum number of fraction digits to use.
 * @param {number} maximumFractionDigits - The maximum number of fraction digits to use.
 * @returns {number} The rounded number.
 */
export function round(value, minimumFractionDigits, maximumFractionDigits) {
  const formattedValue = value.toLocaleString("en", {
    useGrouping: false,
    minimumFractionDigits,
    maximumFractionDigits,
  });
  return Number(formattedValue);
}
