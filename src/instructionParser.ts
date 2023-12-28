import { tokenize } from "./tokenizer";
import { getUnits, convert, round } from "./units";
import {
  InstructionParseResult,
  InstructionTime,
  ValidLanguages,
  AlternativeQuantity,
  ParseInstructionOptions,
  Units,
} from "./types";

const defaultParseInstructionOptions: ParseInstructionOptions = {
  includeAlternativeTemperatureUnit: false,
};

export function parseInstruction(
  text: string,
  language: ValidLanguages,
  options: ParseInstructionOptions = defaultParseInstructionOptions,
): InstructionParseResult | null {
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
  const timeItems: InstructionTime[] = [];
  let totalTimeInSeconds = 0;
  let temperature = 0;
  let temperatureText = "";
  let temperatureUnit = "";
  let temperatureUnitText = "";
  let alternativeTemperatures: AlternativeQuantity[] = [];
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
          temperatureUnit = units.temperatureUnits.get(units.defaultTemperatureUnit)!.text;
          temperatureUnitText = units.defaultTemperatureUnit;
        }

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

function getTemperatureConversions(
  temperature: number,
  uom: string,
  units: Units,
): AlternativeQuantity[] {
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
    .map((possibility: string) => {
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
