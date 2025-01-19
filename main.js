import { parseIngredient } from "./src/index.js";

const result = parseIngredient("300g/10½oz onions, thinly sliced", "en-US", {
  includeAlternativeUnits: true,
  includeExtra: true,
});
console.log(result);
