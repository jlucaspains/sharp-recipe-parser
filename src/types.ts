export type ValidLanguages = "en" | "pt";

export interface IngredientParseResult {
  quantity: number;
  quantityText: string;
  unit: string;
  ingredient: string;
  extra: string;
}

export interface InstructionParseResult {
  timeInSeconds: number;
  temperature: number;
  temperatureUnit: string;
}

export interface Units {
  ingredientUnits: Map<string, string>;
  timeUnits: Map<string, string>;
  timeUnitMultipliers: Map<string, number>;
  temperatureUnits: Map<string, string>;
  ingredientPrepositions: string[];
}
