import { Units, ValidLanguages } from "./types";
import EnglishUnits from "./units.en";

const units = new Map<string, Units>();
units.set("en", EnglishUnits);

export function getUnits(language: ValidLanguages): Units {
  // only types mapped will be accepted so it is safe to disable this rule
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return units.get(language.toLowerCase())!;
}
