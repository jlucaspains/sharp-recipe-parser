import { UnitDetail } from "./types";
import CultureInvariantConversions from "./conversions";

const bag: UnitDetail = { symbol: "bag", text: "bag" };
const batch: UnitDetail = { symbol: "batch", text: "batch" };
const box: UnitDetail = { symbol: "box", text: "box" };
const bunch: UnitDetail = { symbol: "bunch", text: "bunch" };
const cup: UnitDetail = { symbol: "cup", text: "cup", conversionGroup: "volume" };
const can: UnitDetail = { symbol: "can", text: "can" };
const clove: UnitDetail = { symbol: "clove", text: "clove" };
const dash: UnitDetail = { symbol: "dash", text: "dash" };
const drop: UnitDetail = { symbol: "drop", text: "drop" };
const gram: UnitDetail = { symbol: "g", text: "gram", conversionGroup: "mass" };
const gallon: UnitDetail = { symbol: "gal", text: "gallon", conversionGroup: "volume" };
const grain: UnitDetail = { symbol: "grain", text: "grain" };
const inch: UnitDetail = { symbol: "in", text: "inch", conversionGroup: "length" };
const cm: UnitDetail = { symbol: "cm", text: "centimeter", conversionGroup: "length" };
const kilogram: UnitDetail = { symbol: "kg", text: "kilogram", conversionGroup: "mass" };
const pound: UnitDetail = { symbol: "lb", text: "pound", conversionGroup: "mass" };
const liter: UnitDetail = { symbol: "l", text: "liter", conversionGroup: "volume" };
const milligram: UnitDetail = { symbol: "mg", text: "milligram", conversionGroup: "mass" };
const milliliter: UnitDetail = { symbol: "ml", text: "milliliter", conversionGroup: "volume" };
const ounce: UnitDetail = { symbol: "oz", text: "ounce", conversionGroup: "mass" };
const pkg: UnitDetail = { symbol: "package", text: "package" };
const piece: UnitDetail = { symbol: "piece", text: "piece" };
const pinch: UnitDetail = { symbol: "pinch", text: "pinch" };
const pint: UnitDetail = { symbol: "pnt", text: "pint", conversionGroup: "volume" };
const quart: UnitDetail = { symbol: "qt", text: "quart", conversionGroup: "volume" };
const slice: UnitDetail = { symbol: "slice", text: "slice" };
const stalk: UnitDetail = { symbol: "stalk", text: "stalk" };
const stick: UnitDetail = { symbol: "stick", text: "stick" };
const teaspoon: UnitDetail = { symbol: "tsp", text: "teaspoon", conversionGroup: "volume" };
const tablespoon: UnitDetail = { symbol: "tbsp", text: "tablespoon", conversionGroup: "volume" };

const ingredientUnits = new Map<string, UnitDetail>();
ingredientUnits.set("bag", bag);
ingredientUnits.set("bags", bag);
ingredientUnits.set("batch", batch);
ingredientUnits.set("batches", batch);
ingredientUnits.set("box", box);
ingredientUnits.set("boxes", box);
ingredientUnits.set("bunch", bunch);
ingredientUnits.set("bunches", bunch);
ingredientUnits.set("c", cup);
ingredientUnits.set("can", can);
ingredientUnits.set("cans", can);
ingredientUnits.set("cm", cm);
ingredientUnits.set("centimeter", cm);
ingredientUnits.set("centimeters", cm);
ingredientUnits.set("clove", clove);
ingredientUnits.set("cloves", clove);
ingredientUnits.set("cup", cup);
ingredientUnits.set("cups", cup);
ingredientUnits.set("dash", dash);
ingredientUnits.set("dashes", dash);
ingredientUnits.set("drop", drop);
ingredientUnits.set("drops", drop);
ingredientUnits.set("g", gram);
ingredientUnits.set("gal", gallon);
ingredientUnits.set("gallon", gallon);
ingredientUnits.set("gallons", gallon);
ingredientUnits.set("gr", grain);
ingredientUnits.set("grain", grain);
ingredientUnits.set("grains", grain);
ingredientUnits.set("gram", gram);
ingredientUnits.set("grams", gram);
ingredientUnits.set("inch", inch);
ingredientUnits.set("inches", inch);
ingredientUnits.set("in", inch);
ingredientUnits.set("kg", kilogram);
ingredientUnits.set("kgs", kilogram);
ingredientUnits.set("kilogram", kilogram);
ingredientUnits.set("kilograms", kilogram);
ingredientUnits.set("lb", pound);
ingredientUnits.set("lbs", pound);
ingredientUnits.set("liter", liter);
ingredientUnits.set("liters", liter);
ingredientUnits.set("lt", liter);
ingredientUnits.set("l", liter);
ingredientUnits.set("lts", liter);
ingredientUnits.set("mg", milligram);
ingredientUnits.set("mgs", milligram);
ingredientUnits.set("milligram", milligram);
ingredientUnits.set("milligrams", milligram);
ingredientUnits.set("milliliter", milliliter);
ingredientUnits.set("milliliters", milliliter);
ingredientUnits.set("ml", milliliter);
ingredientUnits.set("mls", milliliter);
ingredientUnits.set("ounce", ounce);
ingredientUnits.set("ounces", ounce);
ingredientUnits.set("oz", ounce);
ingredientUnits.set("package", pkg);
ingredientUnits.set("packages", pkg);
ingredientUnits.set("pcs", piece);
ingredientUnits.set("piece", piece);
ingredientUnits.set("pieces", piece);
ingredientUnits.set("pinch", pinch);
ingredientUnits.set("pinches", pinch);
ingredientUnits.set("pint", pint);
ingredientUnits.set("pints", pint);
ingredientUnits.set("pnt", pint);
ingredientUnits.set("pkg", pkg);
ingredientUnits.set("pkgs", pkg);
ingredientUnits.set("pound", pound);
ingredientUnits.set("pounds", pound);
ingredientUnits.set("pt", pint);
ingredientUnits.set("pts", pint);
ingredientUnits.set("qt", quart);
ingredientUnits.set("qts", quart);
ingredientUnits.set("quart", quart);
ingredientUnits.set("quarts", quart);
ingredientUnits.set("slice", slice);
ingredientUnits.set("slices", slice);
ingredientUnits.set("stalk", stalk);
ingredientUnits.set("stalks", stalk);
ingredientUnits.set("stick", stick);
ingredientUnits.set("sticks", stick);
ingredientUnits.set("t", teaspoon);
ingredientUnits.set("tablespoon", tablespoon);
ingredientUnits.set("tablespoons", tablespoon);
ingredientUnits.set("tbs", tablespoon);
ingredientUnits.set("tbsp", tablespoon);
ingredientUnits.set("tbspn", tablespoon);
ingredientUnits.set("teaspoon", teaspoon);
ingredientUnits.set("teaspoons", teaspoon);
ingredientUnits.set("tsp", teaspoon);
ingredientUnits.set("tspn", teaspoon);

const ingredientSizes = ["large", "medium", "small"];

const timeUnits = new Map<string, string>();
timeUnits.set("min", "minute");
timeUnits.set("mins", "minute");
timeUnits.set("minute", "minute");
timeUnits.set("minutes", "minute");
timeUnits.set("sec", "second");
timeUnits.set("secs", "second");
timeUnits.set("second", "second");
timeUnits.set("seconds", "second");
timeUnits.set("h", "hour");
timeUnits.set("hour", "hour");
timeUnits.set("hours", "hour");
timeUnits.set("day", "day");
timeUnits.set("days", "day");

const timeUnitMultipliers = new Map<string, number>();
timeUnitMultipliers.set("minute", 60);
timeUnitMultipliers.set("second", 1);
timeUnitMultipliers.set("hour", 60 * 60);
timeUnitMultipliers.set("day", 60 * 60 * 24);

const fahrenheit: UnitDetail = { symbol: "f", text: "fahrenheit", conversionGroup: "temperature" };
const celsius: UnitDetail = { symbol: "c", text: "celsius", conversionGroup: "temperature" };
const temperatureUnits = new Map<string, UnitDetail>();
temperatureUnits.set("fahrenheit", fahrenheit);
temperatureUnits.set("f", fahrenheit);
temperatureUnits.set("c", celsius);
temperatureUnits.set("celsius", celsius);

const temperatureMarkers = ["°", "degree", "degrees"];

const ingredientPrepositions = ["of"];

const ingredientQuantities = new Map<string, number>();
ingredientQuantities.set("one", 1);
ingredientQuantities.set("two", 2);
ingredientQuantities.set("three", 3);
ingredientQuantities.set("four", 4);
ingredientQuantities.set("five", 5);
ingredientQuantities.set("six", 6);
ingredientQuantities.set("seven", 7);
ingredientQuantities.set("eight", 8);
ingredientQuantities.set("nine", 9);
ingredientQuantities.set("ten", 10);

const ingredientRangeMarker = ["to", "-", "or"];

const defaultConversions = new Map<string, string[]>();
defaultConversions.set("volume", ["cup", "tbsp", "l", "ml", "qt", "tsp", "gal", "pt"]);
defaultConversions.set("mass", ["lb", "kg", "oz", "mg", "g"]);
defaultConversions.set("length", ["in", "cm"]);
defaultConversions.set("temperature", ["f", "c"]);

const converters = new Map<string, (input: number) => number>(CultureInvariantConversions);
const unitConversions = {defaultConversions, converters};

export default {
  ingredientUnits,
  ingredientSizes,
  timeUnits,
  timeUnitMultipliers,
  temperatureUnits,
  ingredientPrepositions,
  temperatureMarkers,
  ingredientQuantities,
  ingredientRangeMarker,
  unitConversions
};
