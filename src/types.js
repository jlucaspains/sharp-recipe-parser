/**
 * @typedef {{
 *  symbol: string;
 *  text: string;
 *  customFunction?: (tokens: string[], startIndex: number) => { uom: string; uomText: string; newIndex: number };
 *  conversionGroup?: string;
 * }} UnitDetail
 */

/**
 * @typedef {{
 *  quantity: number;
 *  unit: string;
 *  unitText: string;
 *  minQuantity: number;
 *  maxQuantity: number;
 * }} AlternativeQuantity
 */

/**
 * @typedef {{
 *  defaultConversions: Map<string, string[]>;
 *  converters: Map<string, (input: number) => number>;
 * }} UnitConversion
 */

/**
 * @typedef {{
 *  ingredientUnits: Map<string, UnitDetail>;
 *  timeUnits: Map<string, string>;
 *  timeUnitMultipliers: Map<string, number>;
 *  temperatureUnits: Map<string, UnitDetail>;
 *  ingredientPrepositions: string[];
 *  ingredientSizes: string[];
 *  temperatureMarkers: string[];
 *  ingredientQuantities: Map<string, number>;
 *  ingredientRangeMarker: string[];
 *  ingredientQuantityAddMarker: string[];
 *  unitConversions: UnitConversion;
 *  defaultTemperatureUnit: string | null;
 * }} Units
 */

/**
 * @typedef {"en" | "en-US" | "pt" | "pt-BR" | string} ValidLanguages
 */

/**
 * @typedef {{
 *  timeInSeconds: number;
 *  timeUnitText: string;
 *  timeText: string;
 * }} InstructionTime
 */

export const Types = {};
