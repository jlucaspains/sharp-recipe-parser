import { Units, ValidLanguages } from "./types";
import EnglishUnits from "./units.en";
import AmericanEnglishUnits from "./units.enUS";
import PortugueseUnits from "./units.pt";
import BrazilianPortugueseUnits from "./units.ptBR";

const units = new Map<string, Units>();
units.set("en", EnglishUnits);
units.set("en-us", AmericanEnglishUnits);
units.set("pt", PortugueseUnits);
units.set("pt-br", BrazilianPortugueseUnits);

export function getUnits(language: ValidLanguages): Units {
  // only types mapped will be accepted so it is safe to disable this rule
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return units.get(language.toLowerCase())!;
}

export function convert(input: number, from: string, to: string, language: ValidLanguages): number {
  const converter = getUnits(language)?.unitConversions?.converters?.get(`${from}->${to}`);
  if (!converter) {
    throw new Error(`No conversion found from ${from} to ${to}`);
  }

    return converter(input);
}