export type ValidLanguages = "en" | "pt";

export interface IngredientParseResult {
  quantity: number;
  quantityText: string;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  unitText: string;
  ingredient: string;
  extra: string;
}

export interface InstructionParseResult {
  totalTimeInSeconds: number;
  timeItems: InstructionTime[];
  temperature: number;
  temperatureUnit: string;
  temperatureText: string;
  temperatureUnitText: string;
}

export interface InstructionTime {
  timeInSeconds: number;
  timeUnitText: string;
  timeText: string;
}

export interface Units {
  ingredientUnits: Map<string, string>;
  timeUnits: Map<string, string>;
  timeUnitMultipliers: Map<string, number>;
  temperatureUnits: Map<string, string>;
  ingredientPrepositions: string[];
  ingredientSizes: string[];
  temperatureMarkers: string[];
  ingredientQuantities: Map<string, number>;
  ingredientRangeMarker: string[];
}
