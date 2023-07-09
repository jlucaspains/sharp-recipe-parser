import { UnitCustomIdentifier } from "./types";

const ingredientUnits = new Map<string, string | UnitCustomIdentifier>();
ingredientUnits.set("saco", "saco");
ingredientUnits.set("sacos", "saco");
ingredientUnits.set("caixa", "caixa");
ingredientUnits.set("caixas", "caixa");
ingredientUnits.set("c", "copo");
ingredientUnits.set("lata", "lata");
ingredientUnits.set("latas", "lata");
ingredientUnits.set("dente", "dente");
ingredientUnits.set("dentes", "dente");
ingredientUnits.set("copo", "copo");
ingredientUnits.set("copos", "copo");
ingredientUnits.set("gota", "gota");
ingredientUnits.set("gotas", "gota");
ingredientUnits.set("g", "grama");
ingredientUnits.set("grama", "grama");
ingredientUnits.set("gramas", "grama");
ingredientUnits.set("gal", "galão");
ingredientUnits.set("galão", "galão");
ingredientUnits.set("galões", "galão");
ingredientUnits.set("kg", "quilograma");
ingredientUnits.set("kgs", "quilograma");
ingredientUnits.set("quilo", "quilograma");
ingredientUnits.set("quilos", "quilograma");
ingredientUnits.set("quilograma", "quilograma");
ingredientUnits.set("quilogramas", "quilograma");
ingredientUnits.set("litro", "litro");
ingredientUnits.set("litros", "litro");
ingredientUnits.set("lt", "litro");
ingredientUnits.set("lts", "litro");
ingredientUnits.set("mg", "miligrama");
ingredientUnits.set("mgs", "miligrama");
ingredientUnits.set("miligrama", "miligrama");
ingredientUnits.set("miligramas", "miligrama");
ingredientUnits.set("mililitro", "mililitro");
ingredientUnits.set("mililitros", "mililitro");
ingredientUnits.set("ml", "mililitro");
ingredientUnits.set("mls", "mililitro");
ingredientUnits.set("pacote", "pacote");
ingredientUnits.set("pacotes", "pacote");
ingredientUnits.set("pedaço", "pedaço");
ingredientUnits.set("pedaços", "pedaço");
ingredientUnits.set("pitada", "pitada");
ingredientUnits.set("pitadas", "pitada");
ingredientUnits.set("fatia", "fatia");
ingredientUnits.set("fatias", "fatia");
ingredientUnits.set("bastão", "bastão");
ingredientUnits.set("bastões", "bastão");

const xicaraFunc = (input: string[], startIndex: number) => {
  const token = input[startIndex];
  if (token === "(" || token == "de") {
    if (input[startIndex + 1] === "chá") {
      return {uom: "xícara de chá", newIndex: startIndex + 3};
    }
    if (input[startIndex + 1] === "café") {
      return {uom: "xícara de café", newIndex: startIndex + 3};
    }
  }

  return {uom: "xícara", newIndex: startIndex};
}

ingredientUnits.set("xícara", xicaraFunc);
ingredientUnits.set("xícaras", xicaraFunc);

const colherFunc = (input: string[], startIndex: number) => {
  const token = input[startIndex];
  const isParenthesis = token === "(";
  const isDe = token == "de";
  const newIndex = isParenthesis ? 3 : 2;
  if (isParenthesis || isDe) {
    if (input[startIndex + 1] === "chá") {
      return {uom: "colher de chá", newIndex: startIndex + newIndex};
    }
    if (input[startIndex + 1] === "sopa") {
      return {uom: "colher de sopa", newIndex: startIndex + newIndex};
    }
  }

  return {uom: "colher", newIndex: startIndex};
}
ingredientUnits.set("colher", colherFunc);
ingredientUnits.set("colheres", colherFunc);

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

const temperatureUnits = new Map<string, string>();
temperatureUnits.set("fahrenheit", "fahrenheit");
temperatureUnits.set("f", "fahrenheit");
temperatureUnits.set("c", "celsius");
temperatureUnits.set("celsius", "celsius");

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
