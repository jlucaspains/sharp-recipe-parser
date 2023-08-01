import { UnitDetail } from "./types";
import CultureInvariantConversions from "./conversions";

const saco: UnitDetail = { symbol: "saco", text: "saco" };
const caixa: UnitDetail = { symbol: "caixa", text: "caixa" };
const copo: UnitDetail = {
  symbol: "cup",
  text: "copo",
  conversionGroup: "volume",
};
const lata: UnitDetail = { symbol: "lata", text: "lata" };
const dente: UnitDetail = { symbol: "dente", text: "dente" };
const gota: UnitDetail = { symbol: "gota", text: "gota" };
const grama: UnitDetail = {
  symbol: "g",
  text: "grama",
  conversionGroup: "mass",
};
const galao: UnitDetail = {
  symbol: "gal",
  text: "galão",
  conversionGroup: "volume",
};
const cm: UnitDetail = {
  symbol: "cm",
  text: "centimeter",
  conversionGroup: "length",
};
const quilograma: UnitDetail = {
  symbol: "kg",
  text: "quilograma",
  conversionGroup: "mass",
};
const litro: UnitDetail = {
  symbol: "l",
  text: "litro",
  conversionGroup: "volume",
};
const miligrama: UnitDetail = {
  symbol: "mg",
  text: "miligrama",
  conversionGroup: "mass",
};
const mililitro: UnitDetail = {
  symbol: "ml",
  text: "mililitro",
  conversionGroup: "volume",
};
const pacote: UnitDetail = { symbol: "pacote", text: "pacote" };
const pedaco: UnitDetail = { symbol: "pedaço", text: "pedaço" };
const pitada: UnitDetail = { symbol: "pitada", text: "pitada" };
const fatia: UnitDetail = { symbol: "fatia", text: "fatia" };
const bastao: UnitDetail = { symbol: "bastão", text: "bastão" };

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
ingredientUnits.set("fatia", fatia);
ingredientUnits.set("fatias", fatia);
ingredientUnits.set("bastão", bastao);
ingredientUnits.set("bastões", bastao);

ingredientUnits.set("colher", { symbol: "colher", text: "colher" });
ingredientUnits.set("colheres", { symbol: "colher", text: "colher" });

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

const fahrenheit: UnitDetail = {
  symbol: "f",
  text: "fahrenheit",
  conversionGroup: "temperature",
};
const celsius: UnitDetail = {
  symbol: "c",
  text: "celsius",
  conversionGroup: "temperature",
};
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

const defaultConversions = new Map<string, string[]>();
defaultConversions.set("volume", ["cup", "l", "ml"]);
defaultConversions.set("mass", ["kg", "mg", "g"]);
defaultConversions.set("length", ["cm"]);
defaultConversions.set("temperature", ["f", "c"]);

const converters = new Map<string, (input: number) => number>(
  CultureInvariantConversions,
);
const unitConversions = { defaultConversions, converters };

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
  unitConversions,
};
