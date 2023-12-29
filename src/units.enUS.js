import DefaultEnglish from "./units.en";
import * as Types from "./types";

/**
 * @type {Map<string, (input: number) => number>}
 */
const converters = new Map(DefaultEnglish.unitConversions.converters);
/**
 * @type {Map<string, string[]>}
 */
const defaultConversions = new Map(
  DefaultEnglish.unitConversions.defaultConversions,
);

defaultConversions.set("volume", [
  "cup",
  "tbsp",
  "l",
  "ml",
  "qt",
  "tsp",
  "gal",
  "pt",
]);

const unitConversions = { converters, defaultConversions };

// volume (cup is base): l, tbsp, qt, tsp, gal, pt
const lFactor = 0.236588;
const tbspFactor = 16;
const mlFactor = 236.588;
const qtFactor = 0.25;
const tspFactor = 48;
const galFactor = 0.0625;
const ptFactor = 0.416337;
converters.set("cup->l", (input) => input * lFactor);
converters.set("cup->ml", (input) => input * mlFactor);
converters.set("cup->tbsp", (input) => input * tbspFactor);
converters.set("cup->qt", (input) => input * qtFactor);
converters.set("cup->tsp", (input) => input * tspFactor);
converters.set("cup->gal", (input) => input * galFactor);
converters.set("cup->pt", (input) => input * ptFactor);

converters.set("l->cup", (input) => input / lFactor);
converters.set("l->ml", (input) => (input / lFactor) * mlFactor);
converters.set("l->tbsp", (input) => (input / lFactor) * tbspFactor);
converters.set("l->qt", (input) => (input / lFactor) * qtFactor);
converters.set("l->tsp", (input) => (input / lFactor) * tspFactor);
converters.set("l->gal", (input) => (input / lFactor) * galFactor);
converters.set("l->pt", (input) => (input / lFactor) * ptFactor);

converters.set("ml->cup", (input) => input / mlFactor);
converters.set("ml->l", (input) => (input / mlFactor) * lFactor);
converters.set("ml->tbsp", (input) => (input / mlFactor) * tbspFactor);
converters.set("ml->qt", (input) => (input / mlFactor) * qtFactor);
converters.set("ml->tsp", (input) => (input / mlFactor) * tspFactor);
converters.set("ml->gal", (input) => (input / mlFactor) * galFactor);
converters.set("ml->pt", (input) => (input / mlFactor) * ptFactor);

converters.set("tbsp->cup", (input) => input / tbspFactor);
converters.set("tbsp->l", (input) => (input / tbspFactor) * lFactor);
converters.set("tbsp->ml", (input) => (input / tbspFactor) * mlFactor);
converters.set("tbsp->qt", (input) => (input / tbspFactor) * qtFactor);
converters.set("tbsp->tsp", (input) => (input / tbspFactor) * tspFactor);
converters.set("tbsp->gal", (input) => (input / tbspFactor) * galFactor);
converters.set("tbsp->pt", (input) => (input / tbspFactor) * ptFactor);

converters.set("qt->cup", (input) => input / qtFactor);
converters.set("qt->l", (input) => (input / qtFactor) * lFactor);
converters.set("qt->ml", (input) => (input / qtFactor) * mlFactor);
converters.set("qt->tbsp", (input) => (input / qtFactor) * tbspFactor);
converters.set("qt->tsp", (input) => (input / qtFactor) * tspFactor);
converters.set("qt->gal", (input) => (input / qtFactor) * galFactor);
converters.set("qt->pt", (input) => (input / qtFactor) * ptFactor);

converters.set("tsp->cup", (input) => input / tspFactor);
converters.set("tsp->l", (input) => (input / tspFactor) * lFactor);
converters.set("tsp->ml", (input) => (input / tspFactor) * mlFactor);
converters.set("tsp->tbsp", (input) => (input / tspFactor) * tbspFactor);
converters.set("tsp->qt", (input) => (input / tspFactor) * qtFactor);
converters.set("tsp->gal", (input) => (input / tspFactor) * galFactor);
converters.set("tsp->pt", (input) => (input / tspFactor) * ptFactor);

converters.set("gal->cup", (input) => input / galFactor);
converters.set("gal->l", (input) => (input / galFactor) * lFactor);
converters.set("gal->ml", (input) => (input / galFactor) * mlFactor);
converters.set("gal->tbsp", (input) => (input / galFactor) * tbspFactor);
converters.set("gal->qt", (input) => (input / galFactor) * qtFactor);
converters.set("gal->tsp", (input) => (input / galFactor) * tspFactor);
converters.set("gal->pt", (input) => (input / galFactor) * ptFactor);

converters.set("pt->cup", (input) => input / ptFactor);
converters.set("pt->l", (input) => (input / ptFactor) * lFactor);
converters.set("pt->ml", (input) => (input / ptFactor) * mlFactor);
converters.set("pt->tbsp", (input) => (input / ptFactor) * tbspFactor);
converters.set("pt->qt", (input) => (input / ptFactor) * qtFactor);
converters.set("pt->tsp", (input) => (input / ptFactor) * tspFactor);
converters.set("pt->gal", (input) => (input / ptFactor) * galFactor);

/**
 * @type {Types.Units}
 */
export default {
  ingredientUnits: DefaultEnglish.ingredientUnits,
  ingredientSizes: DefaultEnglish.ingredientSizes,
  timeUnits: DefaultEnglish.timeUnits,
  timeUnitMultipliers: DefaultEnglish.timeUnitMultipliers,
  temperatureUnits: DefaultEnglish.temperatureUnits,
  ingredientPrepositions: DefaultEnglish.ingredientPrepositions,
  temperatureMarkers: DefaultEnglish.temperatureMarkers,
  ingredientQuantities: DefaultEnglish.ingredientQuantities,
  ingredientRangeMarker: DefaultEnglish.ingredientRangeMarker,
  unitConversions,
  defaultTemperatureUnit: "fahrenheit",
};
