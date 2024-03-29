import * as Types from "./types.js";
import DefaultPortuguese from "./units.pt.js";

/**
 * @type {Map<string, (input: number) => number>}
 */
const converters = new Map(DefaultPortuguese.unitConversions.converters);

/**
 * @type {Map<string, string[]>}
 */
const defaultConversions = new Map(
  DefaultPortuguese.unitConversions.defaultConversions,
);
const unitConversions = { converters, defaultConversions };
/**
 * @type {Map<string, Types.UnitDetail>}
 */
const ingredientUnits = new Map(DefaultPortuguese.ingredientUnits);

// Add xicara that is specific to ptBR
/**
 * This function parses a given array of input strings and identifies the unit of measure (UOM).
 * It checks if the text starts with "de chá" or "(chá)" and returns "xicaracha" as the UOM.
 * If the text starts with "de café" or "(café)", it returns "xicaracafe" as the UOM.
 * If none of the above conditions are met, it returns "xícara" as the UOM.
 * @param {string[]} input - The array of input strings to be parsed.
 * @param {number} startIndex - The index in the input array to start parsing from.
 * @returns {Types.UnitCustomIdentifier} An object containing the identified UOM, the text representation of the UOM, and the new index in the input array.
 */
const xicaraFunc = (input, startIndex) => {
  const text = input.slice(startIndex + 1).join("");

  if (text.startsWith("de chá") || text.startsWith("(chá)")) {
    return {
      uom: "xicaracha",
      uomText: input.slice(startIndex - 1, startIndex + 4).join(""),
      newIndex: startIndex + 4,
    };
  }

  if (text.startsWith("de café") || text.startsWith("(café)")) {
    return {
      uom: "xicaracafe",
      uomText: input.slice(startIndex - 1, startIndex + 4).join(""),
      newIndex: startIndex + 4,
    };
  }

  return { uom: "xícara", uomText: "xícara", newIndex: startIndex };
};

ingredientUnits.set("xícara", {
  symbol: "xicara",
  text: "xícara",
  customFunction: xicaraFunc,
});
ingredientUnits.set("xícaras", {
  symbol: "xicara",
  text: "xícara",
  customFunction: xicaraFunc,
});

ingredientUnits.set("xicaracha", {
  symbol: "xicaracha",
  text: "xícara de chá",
  conversionGroup: "volume",
});
ingredientUnits.set("xicaracafe", {
  symbol: "xicaracafe",
  text: "xícara de café",
  conversionGroup: "volume",
});

// Add colher de cha e de cafe that are specific to ptBR
/**
 * This function parses a given array of input strings and identifies the unit of measure (UOM).
 * It checks if the text starts with "de chá" or "(chá)" and returns "colhercha" as the UOM.
 * If the text starts with "de sopa" or "(sopa)", it returns "colhersopa" as the UOM.
 * If none of the above conditions are met, it returns "colher" as the UOM.
 * @param {string[]} input - The array of input strings to be parsed.
 * @param {number} startIndex - The index in the input array to start parsing from.
 * @returns {{ uom: string; uomText: string; newIndex: number }} An object containing the identified UOM, the text representation of the UOM, and the new index in the input array.
 */
const colherFunc = (input, startIndex) => {
  const text = input.slice(startIndex + 1).join("");

  if (text.startsWith("de chá") || text.startsWith("(chá)")) {
    return {
      uom: "colhercha",
      uomText: input.slice(startIndex - 1, startIndex + 4).join(""),
      newIndex: startIndex + 4,
    };
  }

  if (text.startsWith("de sopa") || text.startsWith("(sopa)")) {
    return {
      uom: "colhersopa",
      uomText: input.slice(startIndex - 1, startIndex + 4).join(""),
      newIndex: startIndex + 4,
    };
  }

  return { uom: "colher", uomText: "colher", newIndex: startIndex };
};
ingredientUnits.set("colher", {
  symbol: "colher",
  text: "colher",
  customFunction: colherFunc,
});
ingredientUnits.set("colheres", {
  symbol: "colher",
  text: "colher",
  customFunction: colherFunc,
});

ingredientUnits.set("colhersopa", {
  symbol: "colhersopa",
  text: "colher de sopa",
  conversionGroup: "volume",
});
ingredientUnits.set("colhercha", {
  symbol: "colhercha",
  text: "colher de chá",
  conversionGroup: "volume",
});

// override conversions for volumetric UOMs like cup, tablespoon, teaspoon

const mlFactor = 1000;
const copoFactor = 4;
const colherSopaFactor = 66.6667;
const colherChaFactor = 200;
const xicaraCafeFactor = 4.17;
const xicaraChaFactor = 5;
converters.set("l->copo", (input) => input * copoFactor);
converters.set("l->colhersopa", (input) => input * colherSopaFactor);
converters.set("l->colhercha", (input) => input * colherChaFactor);
converters.set("l->xicaracafe", (input) => input * xicaraCafeFactor);
converters.set("l->xicaracha", (input) => input * xicaraChaFactor);
converters.set("l->ml", (input) => input * mlFactor);

converters.set("copo->l", (input) => input / copoFactor);
converters.set(
  "copo->colhersopa",
  (input) => (input / copoFactor) * colherSopaFactor,
);
converters.set(
  "copo->colhercha",
  (input) => (input / copoFactor) * colherChaFactor,
);
converters.set(
  "copo->xicaracafe",
  (input) => (input / copoFactor) * xicaraCafeFactor,
);
converters.set(
  "copo->xicaracha",
  (input) => (input / copoFactor) * xicaraChaFactor,
);
converters.set("copo->ml", (input) => (input / copoFactor) * mlFactor);

converters.set("ml->l", (input) => input / mlFactor);
converters.set(
  "ml->colhersopa",
  (input) => (input / mlFactor) * colherSopaFactor,
);
converters.set(
  "ml->colhercha",
  (input) => (input / mlFactor) * colherChaFactor,
);
converters.set(
  "ml->xicaracafe",
  (input) => (input / mlFactor) * xicaraCafeFactor,
);
converters.set(
  "ml->xicaracha",
  (input) => (input / mlFactor) * xicaraChaFactor,
);
converters.set("ml->copo", (input) => (input / mlFactor) * copoFactor);

converters.set("colhersopa->l", (input) => input / colherSopaFactor);
converters.set(
  "colhersopa->copo",
  (input) => (input / colherSopaFactor) * copoFactor,
);
converters.set(
  "colhersopa->colhercha",
  (input) => (input / colherSopaFactor) * colherChaFactor,
);
converters.set(
  "colhersopa->xicaracafe",
  (input) => (input / colherSopaFactor) * xicaraCafeFactor,
);
converters.set(
  "colhersopa->xicaracha",
  (input) => (input / colherSopaFactor) * xicaraChaFactor,
);
converters.set(
  "colhersopa->ml",
  (input) => (input / colherSopaFactor) * mlFactor,
);

converters.set("colhercha->l", (input) => input / colherChaFactor);
converters.set(
  "colhercha->copo",
  (input) => (input / colherChaFactor) * copoFactor,
);
converters.set(
  "colhercha->colhersopa",
  (input) => (input / colherChaFactor) * colherSopaFactor,
);
converters.set(
  "colhercha->xicaracafe",
  (input) => (input / colherChaFactor) * xicaraCafeFactor,
);
converters.set(
  "colhercha->xicaracha",
  (input) => (input / colherChaFactor) * xicaraChaFactor,
);
converters.set(
  "colhercha->ml",
  (input) => (input / colherChaFactor) * mlFactor,
);

converters.set("xicaracafe->l", (input) => input / xicaraCafeFactor);
converters.set(
  "xicaracafe->copo",
  (input) => (input / xicaraCafeFactor) * copoFactor,
);
converters.set(
  "xicaracafe->colhercha",
  (input) => (input / xicaraCafeFactor) * colherChaFactor,
);
converters.set(
  "xicaracafe->colhersopa",
  (input) => (input / xicaraCafeFactor) * colherSopaFactor,
);
converters.set(
  "xicaracafe->xicaracha",
  (input) => (input / xicaraCafeFactor) * xicaraChaFactor,
);
converters.set(
  "xicaracafe->ml",
  (input) => (input / xicaraCafeFactor) * mlFactor,
);

converters.set("xicaracha->l", (input) => input / xicaraChaFactor);
converters.set(
  "xicaracha->copo",
  (input) => (input / xicaraChaFactor) * copoFactor,
);
converters.set(
  "xicaracha->colhercha",
  (input) => (input / xicaraChaFactor) * colherChaFactor,
);
converters.set(
  "xicaracha->colhersopa",
  (input) => (input / xicaraChaFactor) * colherSopaFactor,
);
converters.set(
  "xicaracha->xicaracafe",
  (input) => (input / xicaraChaFactor) * xicaraCafeFactor,
);
converters.set(
  "xicaracha->ml",
  (input) => (input / xicaraChaFactor) * mlFactor,
);

// override list of conversions for volume
defaultConversions.set("volume", [
  "copo",
  "l",
  "ml",
  "xicaracha",
  "xicaracafe",
  "colhercha",
  "colhersopa",
]);

export default {
  ingredientUnits,
  ingredientSizes: DefaultPortuguese.ingredientSizes,
  timeUnits: DefaultPortuguese.timeUnits,
  timeUnitMultipliers: DefaultPortuguese.timeUnitMultipliers,
  temperatureUnits: DefaultPortuguese.temperatureUnits,
  ingredientPrepositions: DefaultPortuguese.ingredientPrepositions,
  temperatureMarkers: DefaultPortuguese.temperatureMarkers,
  ingredientQuantities: DefaultPortuguese.ingredientQuantities,
  ingredientRangeMarker: DefaultPortuguese.ingredientRangeMarker,
  ingredientQuantityAddMarker: DefaultPortuguese.ingredientQuantityAddMarker,
  unitConversions,
  defaultTemperatureUnit: "celsius",
};
