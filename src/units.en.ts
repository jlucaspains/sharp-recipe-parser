const ingredientUnits = new Map<string, string>();
ingredientUnits.set("bag", "bag");
ingredientUnits.set("box", "box");
ingredientUnits.set("c", "cup");
ingredientUnits.set("can", "can");
// the nounInflector incorrectly singularizes "cloves" to "clof"
ingredientUnits.set("clof", "clove"); 
ingredientUnits.set("clove", "clove");
ingredientUnits.set("cup", "cup");
ingredientUnits.set("dash", "dash");
ingredientUnits.set("g", "gram");
ingredientUnits.set("gal", "gallon");
ingredientUnits.set("gallon", "gallon");
ingredientUnits.set("gr", "grain");
ingredientUnits.set("grain", "grain");
ingredientUnits.set("gram", "gram");
ingredientUnits.set("inch", "inch");
ingredientUnits.set("kg", "kilogram");
ingredientUnits.set("kgs", "kilogram");
ingredientUnits.set("kilogram", "kilogram");
ingredientUnits.set("lb", "pound");
ingredientUnits.set("lbs", "pound");
ingredientUnits.set("liter", "liter");
ingredientUnits.set("lt", "liter");
ingredientUnits.set("lts", "liter");
ingredientUnits.set("mg", "milligram");
ingredientUnits.set("mgs", "milligram");
ingredientUnits.set("milligram", "milligram");
ingredientUnits.set("milliliter", "milliliter");
ingredientUnits.set("ml", "milliliter");
ingredientUnits.set("mls", "milliliter");
ingredientUnits.set("ounce", "ounce");
ingredientUnits.set("oz", "ounce");
ingredientUnits.set("package", "package");
ingredientUnits.set("pcs", "piece");
ingredientUnits.set("piece", "piece");
ingredientUnits.set("pinch", "pinch");
ingredientUnits.set("pint", "pint");
ingredientUnits.set("pkg", "package");
ingredientUnits.set("pkgs", "package");
ingredientUnits.set("pound", "pound");
ingredientUnits.set("pt", "pint");
ingredientUnits.set("pts", "pint");
ingredientUnits.set("qt", "quart");
ingredientUnits.set("qts", "quart");
ingredientUnits.set("quart", "quart");
ingredientUnits.set("slice", "slice");
ingredientUnits.set("stalk", "stalk");
ingredientUnits.set("stick", "stick");
ingredientUnits.set("t", "teaspoon");
ingredientUnits.set("tablespoon", "tablespoon");
ingredientUnits.set("tbs", "tablespoon");
ingredientUnits.set("tbsp", "tablespoon");
ingredientUnits.set("tbspn", "tablespoon");
ingredientUnits.set("teaspoon", "teaspoon");
ingredientUnits.set("tsp", "teaspoon");
ingredientUnits.set("tspn", "teaspoon");

const ingredientSizes = ["large", "medium", "small"];

const timeUnits = new Map<string, string>();
timeUnits.set("min", "minute");
timeUnits.set("mins", "minute");
timeUnits.set("minute", "minute");
timeUnits.set("sec", "second");
timeUnits.set("secs", "second");
timeUnits.set("second", "second");
timeUnits.set("h", "hour");
timeUnits.set("hour", "hour");
timeUnits.set("day", "day");
timeUnits.set("days", "day");

const timeUnitMultipliers = new Map<string, number>();
timeUnitMultipliers.set("minute", 60);
timeUnitMultipliers.set("second", 1);
timeUnitMultipliers.set("hour", 60 * 60);
timeUnitMultipliers.set("day", 60 * 60 * 24);

const temperatureUnits = new Map<string, string>();
temperatureUnits.set("fahrenheit", "fahrenheit");
temperatureUnits.set("f", "fahrenheit");
temperatureUnits.set("c", "celsius");
temperatureUnits.set("celsius", "celsius");

const ingredientPrepositions = ["of"];

export default {
  ingredientUnits,
  ingredientSizes,
  timeUnits,
  timeUnitMultipliers,
  temperatureUnits,
  ingredientPrepositions,
};
