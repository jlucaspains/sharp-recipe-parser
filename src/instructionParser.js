import { tokenize } from "./tokenizer";
import { getUnits, convert, round } from "./units";
import * as Types from "./types";

/**
 * @typedef {{
 *  timeInSeconds: number;
 *  timeUnitText: string;
 *  timeText: string;
 * }} InstructionTime
 */

/**
 * @typedef {{
 *  totalTimeInSeconds: number;
 *  timeItems: InstructionTime[];
 *  temperature: number;
 *  temperatureUnit: string;
 *  temperatureText: string;
 *  temperatureUnitText: string;
 *  alternativeTemperatures: Types.AlternativeQuantity[];
 * }} InstructionParseResult
 */

/**
 * @typedef {{
 *  includeAlternativeTemperatureUnit: boolean;
 * }} ParseInstructionOptions
 */

/**
 * @type {ParseInstructionOptions}
 */
const defaultParseInstructionOptions = {
  includeAlternativeTemperatureUnit: false,
};

/**
 * This function parses a given instruction string.
 * It identifies and extracts the time, temperature, and units from the instruction.
 * It also provides alternative temperature conversions if the option is set.
 * @param {string} text - The instruction string to be parsed.
 * @param {Types.ValidLanguages} language - The language of the instruction.
 * @param {ParseInstructionOptions} options - The options for parsing the instruction.
 * @returns {InstructionParseResult | null} An object containing the parsed time, temperature, and units, or null if no tokens are found.
 * @throws {Error} Throws an error if the language is not supported.
 */
export function parseInstruction(
  text,
  language,
  options = defaultParseInstructionOptions,
) {
  const units = getUnits(language);

  if (!units) {
    throw new Error(`Language ${language} is not supported`);
  }

  const tokens = tokenize(text);

  if (tokens.length == 0) {
    return null;
  }

  let number = 0;
  let numberText = "";
  /**
   * @type {InstructionTime[]}
   */
  const timeItems = [];
  let totalTimeInSeconds = 0;
  let temperature = 0;
  let temperatureText = "";
  let temperatureUnit = "";
  let temperatureUnitText = "";
  /**
   * @type {Types.AlternativeQuantity[]}
   */
  let alternativeTemperatures = [];
  for (const token of tokens) {
    const maybeNumber = Number(token);

    if (!isNaN(maybeNumber)) {
      number = maybeNumber;
      numberText = token;
    } else if (number > 0) {
      const maybeUnit = token.toLowerCase();

      if (units.temperatureMarkers.includes(maybeUnit)) {
        // preemptively set temperature if marker is found
        // if later, a specific UOM is also found, it will override this.
        // if nothing is found and a default exists, it will use that.
        if (units.defaultTemperatureUnit) {
          temperature = number;
          temperatureText = numberText;
          temperatureUnit = units.temperatureUnits.get(
            units.defaultTemperatureUnit,
          ).text;
        }

        continue;
      }

      // uom is only relevant after number
      if (units.timeUnits.has(maybeUnit)) {
        const timeUnit = units.timeUnits.get(maybeUnit);
        const timeInSeconds = number * units.timeUnitMultipliers.get(timeUnit);
        totalTimeInSeconds += timeInSeconds;
        timeItems.push({
          timeInSeconds,
          timeUnitText: token,
          timeText: numberText,
        });
      } else if (units.temperatureUnits.has(maybeUnit)) {
        temperature = number;
        temperatureText = numberText;
        temperatureUnit = units.temperatureUnits.get(maybeUnit).text;
        temperatureUnitText = token;
      }

      number = 0; // reset if no match
    }
  }

  if (options.includeAlternativeTemperatureUnit && temperature > 0) {
    alternativeTemperatures = getTemperatureConversions(
      temperature,
      temperatureUnit,
      units,
    );
  }

  return {
    totalTimeInSeconds,
    timeItems,
    temperature,
    temperatureText,
    temperatureUnit,
    temperatureUnitText,
    alternativeTemperatures,
  };
}

/**
 * This function gets the temperature conversions for a given temperature and unit of measure.
 * It uses the provided units to find the conversion group for the unit of measure.
 * If a conversion group is found, it gets the default conversions for that group.
 * It then filters out the original unit of measure and maps the remaining units to their converted quantities.
 * @param {number} temperature - The temperature to be converted.
 * @param {string} uom - The unit of measure for the temperature.
 * @param {Types.Units} units - The units object containing temperature units and unit conversions.
 * @returns {Types.AlternativeQuantity[]} An array of alternative quantities, each containing the converted quantity, unit, unit text, and min and max quantities.
 */
function getTemperatureConversions(temperature, uom, units) {
  const unit = units.temperatureUnits.get(uom);
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
      const possibilityUOM = units.temperatureUnits.get(possibility);
      const quantity = convert(temperature, unit.symbol, possibility, units);

      const rounded = round(quantity, 0, 4);
      return {
        quantity: rounded,
        unit: possibility,
        unitText: possibilityUOM?.text ?? possibility,
        minQuantity: rounded,
        maxQuantity: rounded,
      };
    });
}
