export type ValidLanguages = "en" | "pt";

export interface IngredientParseResult {
  quantity: number;
  quantityText: string;
  unit: string;
  unitText: string;
  ingredient: string;
  extra: string;
}

export interface InstructionParseResult {
  timeInSeconds: number;
  timeText: string;
  timeUnitText: string;
  temperature: number;
  temperatureUnit: string;
  temperatureText: string;
  temperatureUnitText: string;
}

export interface Units {
  ingredientUnits: Map<string, string>;
  timeUnits: Map<string, string>;
  timeUnitMultipliers: Map<string, number>;
  temperatureUnits: Map<string, string>;
  ingredientPrepositions: string[];
  ingredientSizes: string[];
}
