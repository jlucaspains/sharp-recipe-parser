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
  alternativeQuantities: AlternativeQuantity[];
}

export interface InstructionParseResult {
  totalTimeInSeconds: number;
  timeItems: InstructionTime[];
  temperature: number;
  temperatureUnit: string;
  temperatureText: string;
  temperatureUnitText: string;
  alternativeTemperatures: AlternativeQuantity[]
}

export interface InstructionTime {
  timeInSeconds: number;
  timeUnitText: string;
  timeText: string;
}

export interface UnitDetail {
  symbol: string;
  text: string;
  canConvert: boolean;
  customFunction?: UnitCustomIdentifier;
  conversions: string[];
}

export interface Units {
  ingredientUnits: Map<string, UnitDetail>;
  timeUnits: Map<string, string>;
  timeUnitMultipliers: Map<string, number>;
  temperatureUnits: Map<string, UnitDetail>;
  ingredientPrepositions: string[];
  ingredientSizes: string[];
  temperatureMarkers: string[];
  ingredientQuantities: Map<string, number>;
  ingredientRangeMarker: string[];
}

export type UnitCustomIdentifier = (
  tokens: string[],
  startIndex: number
) => { uom: string, uomText: string; newIndex: number };

export interface ParseIngredientOptions {
  includeExtra: boolean;
  includeAlternativeUnits: boolean;
}

export interface ParseInstructionOptions {
  includeAlternativeTemperatureUnit: boolean;
}

export interface AlternativeQuantity {
  quantity: number;
  unit: string;
  minQuantity: number;
  maxQuantity: number;
}