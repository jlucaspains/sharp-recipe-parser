import { UnitDetail } from "./types";

const saco: UnitDetail = { symbol: "saco", text: "saco", canConvert: false, conversions: [] };
const caixa: UnitDetail = { symbol: "caixa", text: "caixa", canConvert: false, conversions: [] };
const copo: UnitDetail = { symbol: "cup", text: "copo", canConvert: true, conversions: ["Tbs", "l", "ml", "qt", "tsp", "gal"] };
const lata: UnitDetail = { symbol: "lata", text: "lata", canConvert: false, conversions: [] };
const dente: UnitDetail = { symbol: "dente", text: "dente", canConvert: false, conversions: [] };
const gota: UnitDetail = { symbol: "gota", text: "gota", canConvert: false, conversions: [] };
const grama: UnitDetail = { symbol: "g", text: "grama", canConvert: true, conversions: ["lb", "kg", "oz", "mg"] };
const galao: UnitDetail = { symbol: "gal", text: "galão", canConvert: true, conversions: ["cup", "l", "ml", "qt", "tsp", "Tbs", "pnt"] };
const polegada: UnitDetail = { symbol: "in", text: "polegada", canConvert: true, conversions: ["cm"] };
const cm: UnitDetail = { symbol: "cm", text: "centimeter", canConvert: true, conversions: ["in"] };
const quilograma: UnitDetail = { symbol: "kg", text: "quilograma", canConvert: true, conversions: ["lb", "oz", "g", "mg"] };
const litro: UnitDetail = { symbol: "l", text: "litro", canConvert: true, conversions: ["cup", "pnt", "ml", "qt", "tsp", "Tbs", "gal"] };
const miligrama: UnitDetail = { symbol: "mg", text: "miligrama", canConvert: true, conversions: ["g"] };
const mililitro: UnitDetail = { symbol: "ml", text: "mililitro", canConvert: true, conversions: ["cup", "l", "pnt", "qt", "tsp", "Tbs", "gal"] };
const pacote: UnitDetail = { symbol: "pacote", text: "pacote", canConvert: false, conversions: [] };
const pedaco: UnitDetail = { symbol: "pedaço", text: "pedaço", canConvert: false, conversions: [] };
const pitada: UnitDetail = { symbol: "pitada", text: "pitada", canConvert: false, conversions: [] };
const fatia: UnitDetail = { symbol: "fatia", text: "fatia", canConvert: false, conversions: [] };
const bastao: UnitDetail = { symbol: "bastão", text: "bastão", canConvert: false, conversions: [] };

const ingredientUnits = new Map<string, UnitDetail>();
ingredientUnits.set("saco", saco);
ingredientUnits.set("sacos", saco);
ingredientUnits.set("caixa", caixa);
ingredientUnits.set("caixas", caixa);
ingredientUnits.set("c", copo);
ingredientUnits.set("centimetro", cm);
ingredientUnits.set("centimetros", cm);
ingredientUnits.set("cm", cm);
ingredientUnits.set("cms", cm);
ingredientUnits.set("lata", lata);
ingredientUnits.set("latas", lata);
ingredientUnits.set("dente", dente);
ingredientUnits.set("dentes", dente);
ingredientUnits.set("copo", copo);
ingredientUnits.set("copos", copo);
ingredientUnits.set("gota", gota);
ingredientUnits.set("gotas", gota);
ingredientUnits.set("g", grama);
ingredientUnits.set("grama", grama);
ingredientUnits.set("gramas", grama);
ingredientUnits.set("gal", galao);
ingredientUnits.set("galão", galao);
ingredientUnits.set("galões", galao);
ingredientUnits.set("kg", quilograma);
ingredientUnits.set("kgs", quilograma);
ingredientUnits.set("quilo", quilograma);
ingredientUnits.set("quilos", quilograma);
ingredientUnits.set("quilograma", quilograma);
ingredientUnits.set("quilogramas", quilograma);
ingredientUnits.set("litro", litro);
ingredientUnits.set("litros", litro);
ingredientUnits.set("lt", litro);
ingredientUnits.set("lts", litro);
ingredientUnits.set("mg", miligrama);
ingredientUnits.set("mgs", miligrama);
ingredientUnits.set("miligrama", miligrama);
ingredientUnits.set("miligramas", miligrama);
ingredientUnits.set("mililitro", mililitro);
ingredientUnits.set("mililitros", mililitro);
ingredientUnits.set("ml", mililitro);
ingredientUnits.set("mls", mililitro);
ingredientUnits.set("pacote", pacote);
ingredientUnits.set("pacotes", pacote);
ingredientUnits.set("pedaço", pedaco);
ingredientUnits.set("pedaços", pedaco);
ingredientUnits.set("pitada", pitada);
ingredientUnits.set("pitadas", pitada);
ingredientUnits.set("polegada", polegada);
ingredientUnits.set("polegadas", polegada);
ingredientUnits.set("fatia", fatia);
ingredientUnits.set("fatias", fatia);
ingredientUnits.set("bastão", bastao);
ingredientUnits.set("bastões", bastao);

const xicaraFunc = (input: string[], startIndex: number) => {
  const text = input.slice(startIndex + 1).join("");

  if (text.startsWith("de chá") || text.startsWith("(chá)")) {
    return {
      uom: "xícara de chá",
      uomText: input.slice(startIndex - 1, startIndex + 4).join(""),
      newIndex: startIndex + 4
    };
  }

  if (text.startsWith("de café") || text.startsWith("(café)")) {
    return {
      uom: "xícara de café",
      uomText: input.slice(startIndex - 1, startIndex + 4).join(""),
      newIndex: startIndex + 4
    };
  }

  return { uom: "xícara", uomText: "xícara", newIndex: startIndex };
};

ingredientUnits.set("xícara", { symbol: "saco", text: "saco", canConvert: false, customFunction: xicaraFunc, conversions: [] });
ingredientUnits.set("xícaras", { symbol: "saco", text: "saco", canConvert: false, customFunction: xicaraFunc, conversions: [] });

const colherFunc = (input: string[], startIndex: number) => {
  const text = input.slice(startIndex + 1).join("");

  if (text.startsWith("de chá") || text.startsWith("(chá)")) {
    return {
      uom: "colher de chá",
      uomText: input.slice(startIndex - 1, startIndex + 4).join(""),
      newIndex: startIndex + 4
    };
  }

  if (text.startsWith("de sopa") || text.startsWith("(sopa)")) {
    return {
      uom: "colher de sopa",
      uomText: input.slice(startIndex - 1, startIndex + 4).join(""),
      newIndex: startIndex + 4
    };
  }

  return { uom: "colher", uomText: "colher", newIndex: startIndex };
};
ingredientUnits.set("colher", { symbol: "saco", text: "saco", canConvert: false, customFunction: colherFunc, conversions: [] });
ingredientUnits.set("colheres", { symbol: "saco", text: "saco", canConvert: false, customFunction: colherFunc, conversions: [] });

const ingredientSizes = ["grande", "médio", "média", "pequeno", "pequena"];

const timeUnits = new Map<string, string>();
timeUnits.set("min", "minuto");
timeUnits.set("mins", "minuto");
timeUnits.set("minuto", "minuto");
timeUnits.set("minutos", "minuto");
timeUnits.set("seg", "segundo");
timeUnits.set("segs", "segundo");
timeUnits.set("segundo", "segundo");
timeUnits.set("segundos", "segundo");
timeUnits.set("h", "hora");
timeUnits.set("hora", "hora");
timeUnits.set("horas", "hora");
timeUnits.set("dia", "dia");
timeUnits.set("dias", "dia");

const timeUnitMultipliers = new Map<string, number>();
timeUnitMultipliers.set("minuto", 60);
timeUnitMultipliers.set("segundo", 1);
timeUnitMultipliers.set("hora", 60 * 60);
timeUnitMultipliers.set("dia", 60 * 60 * 24);

const fahrenheit: UnitDetail = { symbol: "F", text: "fahrenheit", canConvert: true, conversions: ["C"] };
const celsius: UnitDetail = { symbol: "C", text: "celsius", canConvert: true, conversions: ["F"] };
const temperatureUnits = new Map<string, UnitDetail>();
temperatureUnits.set("fahrenheit", fahrenheit);
temperatureUnits.set("f", fahrenheit);
temperatureUnits.set("c", celsius);
temperatureUnits.set("celsius", celsius);

const temperatureMarkers = ["°", "grau"];

const ingredientPrepositions = ["de"];

const ingredientQuantities = new Map<string, number>();
ingredientQuantities.set("um", 1);
ingredientQuantities.set("dois", 2);
ingredientQuantities.set("três", 3);
ingredientQuantities.set("quatro", 4);
ingredientQuantities.set("cinco", 5);
ingredientQuantities.set("seis", 6);
ingredientQuantities.set("sete", 7);
ingredientQuantities.set("oito", 8);
ingredientQuantities.set("nove", 9);
ingredientQuantities.set("dez", 10);

const ingredientRangeMarker = ["a", "-", "ou"];

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
};
