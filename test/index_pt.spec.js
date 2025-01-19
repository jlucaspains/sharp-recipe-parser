import * as Types from "../src/types.js";
import { parseIngredient, parseInstruction } from "../src/index.js";

describe("Parse ingredient pt-BR", () => {
  const table = [
    ["", -1, -1, -1, -1, -1],
    ["142g farinha de pao", 142, "142", "grama", "farinha de pao", ""],
    ["142g farinha de pao", 142, "142", "grama", "farinha de pao", ""],
    ["142g farinha de pao", 142, "142", "grama", "farinha de pao", ""],
    [
      "1 copo de cenouras, cortadas pequenas",
      1,
      "1",
      "copo",
      "cenouras",
      "cortadas pequenas",
    ],
    ["1 copo de farinha de trigo", 1, "1", "copo", "farinha de trigo", ""],
    ["1c cenouras", 1, "1", "copo", "cenouras", ""],
    ["2 copos de cenoura", 2, "2", "copo", "cenoura", ""],
    [
      "1 1/2 colheres (sopa) de azeite de oliva",
      1.5,
      "1 1/2",
      "colhersopa",
      "azeite de oliva",
      "",
    ],
    [
      "1 1/2 colheres de chá de azeite de oliva",
      1.5,
      "1 1/2",
      "colhercha",
      "azeite de oliva",
      "",
    ],
    ["1/2 quilo de carne moida", 0.5, "1/2", "quilograma", "carne moida", ""],
    [
      "1/2 quilograma de carne moida",
      0.5,
      "1/2",
      "quilograma",
      "carne moida",
      "",
    ],
    ["1/2KG carne moida", 0.5, "1/2", "quilograma", "carne moida", ""],
    ["1½ KG carne moida", 1.5, "1½", "quilograma", "carne moida", ""],
    ["2 gramas sal", 2, "2", "grama", "sal", ""],
    ["1 grama sal", 1, "1", "grama", "sal", ""],
    ["5 latas de milho", 5, "5", "lata", "milho", ""],
    ["½ lata de milho seco", 0.5, "½", "lata", "milho seco", ""],
    ["10 ml leite", 10, "10", "mililitro", "leite", ""],
    ["10l leite", 10, "10", "litro", "leite", ""],
    ["Sal a gosto", 0, "", "", "Sal a gosto", ""],
    ["Ingrediente", 0, "", "", "Ingrediente", ""],
    ["1 gota de balnilha", 1, "1", "gota", "balnilha", ""],
    [
      "1 copo (120g) farinha, peneirada",
      1,
      "1",
      "copo",
      "farinha",
      "peneirada",
    ],
    [
      "1 copo farinha (integral), peneirada",
      1,
      "1",
      "copo",
      "farinha",
      "peneirada",
    ],
    ["1 xícara farinha", 1, "1", "xícara", "farinha", ""],
    ["1 xícara de chá farinha", 1, "1", "xicaracha", "farinha", ""],
    ["1 xícara (chá) farinha", 1, "1", "xicaracha", "farinha", ""],
    ["1 xícara de café farinha", 1, "1", "xicaracafe", "farinha", ""],
    ["1 xícara (café) farinha", 1, "1", "xicaracafe", "farinha", ""],
    ["1 colher farinha", 1, "1", "colher", "farinha", ""],
    ["1 colher de sopa farinha", 1, "1", "colhersopa", "farinha", ""],
    ["1 colher (sopa) farinha", 1, "1", "colhersopa", "farinha", ""],
    ["1 colher de chá farinha", 1, "1", "colhercha", "farinha", ""],
    ["1 colher (chá) farinha", 1, "1", "colhercha", "farinha", ""],
    ["um quilo de cenouras", 1, "um", "quilograma", "cenouras", ""],
    ["dois quilos de cenouras", 2, "dois", "quilograma", "cenouras", ""],
    ["três quilos de cenouras", 3, "três", "quilograma", "cenouras", ""],
    ["quatro quilos de cenouras", 4, "quatro", "quilograma", "cenouras", ""],
    ["cinco quilos de cenouras", 5, "cinco", "quilograma", "cenouras", ""],
    ["seis quilos de cenouras", 6, "seis", "quilograma", "cenouras", ""],
    ["sete quilos de cenouras", 7, "sete", "quilograma", "cenouras", ""],
    ["oito quilos de cenouras", 8, "oito", "quilograma", "cenouras", ""],
    ["nove quilos de cenouras", 9, "nove", "quilograma", "cenouras", ""],
    ["dez quilos de cenouras", 10, "dez", "quilograma", "cenouras", ""],
    ["10ml de agua", 10, "10", "mililitro", "agua", ""],
    ["1 e 1/2 copo de agua", 1.5, "1 e 1/2", "copo", "agua", ""],
    ["cenoura/laranja", 0, "", "", "cenoura/laranja", ""],
    ["cenoura/1", 1, "1", "", "", ""],
    ["1", 1, "1", "", "", ""],
    ["Pitada de sal e pimenta ($0.05)", 0, "", "pitada", "sal e pimenta", ""],
    ["Pitada de sal e pimenta", 0, "", "pitada", "sal e pimenta", ""],
  ];
  it.each(table)(
    "parse %s",
    (text, quantity, quantityText, unit, ingredient, extra) => {
      const result = parseIngredient(text, "pt-BR");
      expect(result?.quantity ?? -1).toBe(quantity);
      expect(result?.quantityText ?? -1).toBe(quantityText);
      expect(result?.unit ?? -1).toBe(unit);
      expect(result?.ingredient ?? -1).toBe(ingredient);
      expect(result?.extra ?? -1).toBe(extra);
    },
  );
});

describe("Parse ingredient with compound UOM pt-BR", () => {
  const table = [
    [
      "1 xícara de chá farinha",
      1,
      "1",
      "xicaracha",
      "xícara de chá",
      "farinha",
      "",
    ],
    [
      "2 xícaras (chá) farinha",
      2,
      "2",
      "xicaracha",
      "xícaras (chá)",
      "farinha",
      "",
    ],
    [
      "2 xícaras de café farinha",
      2,
      "2",
      "xicaracafe",
      "xícaras de café",
      "farinha",
      "",
    ],
    [
      "1 xícara (café) farinha",
      1,
      "1",
      "xicaracafe",
      "xícara (café)",
      "farinha",
      "",
    ],
    ["1 colher farinha", 1, "1", "colher", "colher", "farinha", ""],
    [
      "1 colher de sopa farinha",
      1,
      "1",
      "colhersopa",
      "colher de sopa",
      "farinha",
      "",
    ],
    [
      "3 colheres (sopa) farinha",
      3,
      "3",
      "colhersopa",
      "colheres (sopa)",
      "farinha",
      "",
    ],
    [
      "2 colheres de chá farinha",
      2,
      "2",
      "colhercha",
      "colheres de chá",
      "farinha",
      "",
    ],
    [
      "1 colher (chá) farinha",
      1,
      "1",
      "colhercha",
      "colher (chá)",
      "farinha",
      "",
    ],
  ];
  it.each(table)(
    "parse %s",
    (text, quantity, quantityText, unit, unitText, ingredient, extra) => {
      const result = parseIngredient(text, "pt-BR");
      expect(result?.quantity ?? -1).toBe(quantity);
      expect(result?.quantityText ?? -1).toBe(quantityText);
      expect(result?.unit ?? -1).toBe(unit);
      expect(result?.unitText ?? -1).toBe(unitText);
      expect(result?.ingredient ?? -1).toBe(ingredient);
      expect(result?.extra ?? -1).toBe(extra);
    },
  );
});
describe("Parse ingredient ranges pt-BR", () => {
  const table = [
    [
      "um a dois quilos de cenouras",
      2,
      1,
      2,
      "um a dois",
      "quilograma",
      "cenouras",
      "",
    ],
    ["2-3 copos de cenouras", 3, 2, 3, "2-3", "copo", "cenouras", ""],
    ["3 - 4 copos de cenouras", 4, 3, 4, "3 - 4", "copo", "cenouras", ""],
    ["3- 4 copos de cenouras", 4, 3, 4, "3- 4", "copo", "cenouras", ""],
    ["3 -4 copos de cenouras", 4, 3, 4, "3 -4", "copo", "cenouras", ""],
    ["3 a 4 copos de cenouras", 4, 3, 4, "3 a 4", "copo", "cenouras", ""],
    [
      "1/4 a 1/2 copos de cenouras",
      0.5,
      0.25,
      0.5,
      "1/4 a 1/2",
      "copo",
      "cenouras",
      "",
    ],
    [
      "1/4 - 1/2 copos de cenouras",
      0.5,
      0.25,
      0.5,
      "1/4 - 1/2",
      "copo",
      "cenouras",
      "",
    ],
    [
      "1/4-1/2 copos de cenouras",
      0.5,
      0.25,
      0.5,
      "1/4-1/2",
      "copo",
      "cenouras",
      "",
    ],
    [
      "1 1/4 - 1 1/2 copos de cenouras",
      1.5,
      1.25,
      1.5,
      "1 1/4 - 1 1/2",
      "copo",
      "cenouras",
      "",
    ],
    ["2 copos de cenouras", 2, 2, 2, "2", "copo", "cenouras", ""],
  ];
  it.each(table)(
    "parse %s",
    (
      text,
      quantity,
      minQuantity,
      maxQuantity,
      quantityText,
      unit,
      ingredient,
      extra,
    ) => {
      const result = parseIngredient(text, "pt-BR");
      expect(result?.quantity ?? -1).toBe(quantity);
      expect(result?.minQuantity ?? -1).toBe(minQuantity);
      expect(result?.maxQuantity ?? -1).toBe(maxQuantity);
      expect(result?.quantityText ?? -1).toBe(quantityText);
      expect(result?.unit ?? -1).toBe(unit);
      expect(result?.ingredient ?? -1).toBe(ingredient);
      expect(result?.extra ?? -1).toBe(extra);
    },
  );
});

describe("Parse ingredient with options pt-BR", () => {
  const table = [
    ["500g de farinha", 500, 500, 500, "grama", "farinha", 0.5, 0.5, 0.5, "kg"],
    ["1kg de farinha", 1, 1, 1, "quilograma", "farinha", 1000, 1000, 1000, "g"],
    [
      "1-2kg de farinha",
      2,
      1,
      2,
      "quilograma",
      "farinha",
      2000,
      1000,
      2000,
      "g",
    ],
    [
      "1 copo de leite",
      1,
      1,
      1,
      "copo",
      "leite",
      16.6667,
      16.6667,
      16.6667,
      "colhersopa",
    ],
    ["1 copo de leite", 1, 1, 1, "copo", "leite", 0.25, 0.25, 0.25, "l"],
    ["1 copo de leite", 1, 1, 1, "copo", "leite", 50, 50, 50, "colhercha"],
    [
      "10 colheres de sopa de leite",
      10,
      10,
      10,
      "colhersopa",
      "leite",
      0.6,
      0.6,
      0.6,
      "copo",
    ],
    ["1 pitada de sal", 1, 1, 1, "pitada", "sal", 0, 0, 0, ""],
    ["1 pacote macarrao", 1, 1, 1, "pacote", "macarrao", 0, 0, 0, ""],
    ["10ml de agua", 10, 10, 10, "mililitro", "agua", 0.04, 0.04, 0.04, "copo"],
    [
      "1 copo (120g) farinha",
      1,
      1,
      1,
      "copo",
      "farinha",
      120,
      120,
      120,
      "grama",
    ],
    [
      "1 copo (120gramas) farinha",
      1,
      1,
      1,
      "copo",
      "farinha",
      120,
      120,
      120,
      "grama",
    ],
    [
      "120g (1 copo) farinha",
      120,
      120,
      120,
      "grama",
      "farinha",
      1,
      1,
      1,
      "copo",
    ],
    [
      "120g(1 copo) farinha",
      120,
      120,
      120,
      "grama",
      "farinha",
      1,
      1,
      1,
      "copo",
    ],
    ["½-1 colher pimenta", 1, 0.5, 1, "colher", "pimenta", 0, 0, 0, ""],
    ["½–1 colher pimenta", 1, 0.5, 1, "colher", "pimenta", 0, 0, 0, ""],
    [
      "500g/½kg cebola",
      500,
      500,
      500,
      "grama",
      "cebola",
      0.5,
      0.5,
      0.5,
      "quilograma",
    ],
    [
      "500g / ½kg cebola",
      500,
      500,
      500,
      "grama",
      "cebola",
      0.5,
      0.5,
      0.5,
      "quilograma",
    ],
    [
      "100-200g (1-2 copo) farinha",
      200,
      100,
      200,
      "grama",
      "farinha",
      2,
      1,
      2,
      "copo",
    ],
  ];
  it.each(table)(
    "parse %s",
    (
      text,
      quantity,
      minQuantity,
      maxQuantity,
      unit,
      ingredient,
      alternateQuantity,
      alternateMin,
      alternateMax,
      alternateUOM,
    ) => {
      const result = parseIngredient(text, "pt-BR", {
        includeAlternativeUnits: true,
        includeExtra: true,
      });
      expect(result?.quantity ?? -1).toBe(quantity);
      expect(result?.minQuantity ?? -1).toBe(minQuantity);
      expect(result?.maxQuantity ?? -1).toBe(maxQuantity);
      expect(result?.unit ?? -1).toBe(unit);
      expect(result?.ingredient ?? -1).toBe(ingredient);

      if (alternateQuantity === 0) {
        expect(result?.alternativeQuantities).toEqual([]);
      } else {
        expect(result?.alternativeQuantities).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              quantity: alternateQuantity,
              unit: alternateUOM,
              minQuantity: alternateMin,
              maxQuantity: alternateMax,
            }),
          ]),
        );
      }
    },
  );
});

describe("Parse ingredient with options pt", () => {
  const table = [
    ["500g de farinha", 500, 500, 500, "grama", "farinha", 0.5, 0.5, 0.5, "kg"],
    ["1 copo de farinha", 1, 1, 1, "copo", "farinha", 0, 0, 0, ""],
  ];
  it.each(table)(
    "parse %s",
    (
      text,
      quantity,
      minQuantity,
      maxQuantity,
      unit,
      ingredient,
      alternateQuantity,
      alternateMin,
      alternateMax,
      alternateUOM,
    ) => {
      const result = parseIngredient(text, "pt", {
        includeAlternativeUnits: true,
        includeExtra: true,
      });
      expect(result?.quantity ?? -1).toBe(quantity);
      expect(result?.minQuantity ?? -1).toBe(minQuantity);
      expect(result?.maxQuantity ?? -1).toBe(maxQuantity);
      expect(result?.unit ?? -1).toBe(unit);
      expect(result?.ingredient ?? -1).toBe(ingredient);

      if (alternateQuantity === 0) {
        expect(result?.alternativeQuantities).toEqual([]);
      } else {
        expect(result?.alternativeQuantities).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              quantity: alternateQuantity,
              unit: alternateUOM,
              minQuantity: alternateMin,
              maxQuantity: alternateMax,
            }),
          ]),
        );
      }
    },
  );
});

describe("Parse instruction pt-BR", () => {
  const table = [
    ["", -1, -1, -1],
    ["Asse por 10min", 600, 0, ""],
    ["Reserve por 1 hora, sove mais e espere mais 15 min", 4500, 0, ""],
    ["Aqueca o forno a 180 celsius", 0, 180, "celsius"],
    ["Aqueca o forno a 450° fahrenheit", 0, 450, "fahrenheit"],
    ["Aqueca o forno a 450°F", 0, 450, "fahrenheit"],
    [
      "Aqueca o forno a 180 celsius depois ajuste para 200C",
      0,
      200, // keep the last temperature
      "celsius",
    ],
    [
      "Aqueca o forno a 180 graus",
      0,
      180,
      "celsius", // assume pt-BR default temperature unit
    ],
    [
      "Aqueca o forno a 180 graus por um tempo",
      0,
      180,
      "celsius", // assume pt-BR default temperature unit
    ],
    ["Forme uma bola e deixe crescer por 2 horas", 7200, 0, ""],
    ["Misture todos os ingredientes", 0, 0, ""],
  ];
  it.each(table)(
    "parse %s",
    (text, timeInSeconds, temperature, temperatureUnit) => {
      const result = parseInstruction(text, "pt-BR");
      expect(result?.totalTimeInSeconds ?? -1).toBe(timeInSeconds);
      expect(result?.temperature ?? -1).toBe(temperature);
      expect(result?.temperatureUnit ?? -1).toBe(temperatureUnit);
    },
  );
});

describe("Parse instruction default temperature unit pt", () => {
  const table = [
    ["Aqueca o forno a 180 graus", 0, 0, ""],
    ["Aqueca o forno a 180 graus por um tempo", 0, 0, ""],
  ];
  it.each(table)(
    "parse %s",
    (text, timeInSeconds, temperature, temperatureUnit) => {
      const result = parseInstruction(text, "pt");
      expect(result?.totalTimeInSeconds ?? -1).toBe(timeInSeconds);
      expect(result?.temperature ?? -1).toBe(temperature);
      expect(result?.temperatureUnit ?? -1).toBe(temperatureUnit);
    },
  );
});

describe("Parse instruction with options pt-BR", () => {
  const table = [
    ["Aqueca o forno a 450 fahrenheit", 450, "fahrenheit", 232.2222, "c"],
    ["Aqueca o frono a 450 celsius", 450, "celsius", 842, "f"],
    [
      "Aqueca o frono a 450 fahrenheit depois ajuste para 500F",
      500, // keep the last temperature
      "fahrenheit",
      260,
      "c",
    ],
    ["Asse", 0, "", 0, ""],
  ];
  it.each(table)(
    "parse %s",
    (text, temperature, temperatureUnit, altTemp, altTempUOM) => {
      const result = parseInstruction(text, "pt-BR", {
        includeAlternativeTemperatureUnit: true,
      });
      expect(result?.temperature ?? -1).toBe(temperature);
      expect(result?.temperatureUnit ?? -1).toBe(temperatureUnit);

      if (altTemp === 0) {
        expect(result?.alternativeTemperatures).toEqual([]);
      } else {
        expect(result?.alternativeTemperatures).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              quantity: altTemp,
              unit: altTempUOM,
              minQuantity: altTemp,
              maxQuantity: altTemp,
            }),
          ]),
        );
      }
    },
  );
});
describe("Parse instruction time range pt-BR", () => {
  const table = [
    [
      "Asse por 10min depois 20 min e depois 30 minutos",
      3600,
      [
        { timeInSeconds: 600, timeUnitText: "min", timeText: "10" },
        { timeInSeconds: 1200, timeUnitText: "min", timeText: "20" },
        { timeInSeconds: 1800, timeUnitText: "minutos", timeText: "30" },
      ],
    ],
    [
      "Asse por 10min depois espere esfriar por 15 minutos",
      1500,
      [
        { timeInSeconds: 600, timeUnitText: "min", timeText: "10" },
        { timeInSeconds: 900, timeUnitText: "minutos", timeText: "15" },
      ],
    ],
    [
      "Asse por 10min",
      600,
      [{ timeInSeconds: 600, timeUnitText: "min", timeText: "10" }],
    ],
    ["Fervente ate pronto", 0, []],
  ];
  it.each(table)("parse %s", (text, totalTimeInSeconds, time) => {
    /**
     * @type {Types.InstructionTime[]}
     */
    const timeItems = time;
    const result = parseInstruction(text, "pt-BR");
    expect(result?.totalTimeInSeconds ?? -1).toBe(totalTimeInSeconds);
    expect(result?.timeItems.length).toBe(timeItems.length);

    for (let index = 0; index < (result?.timeItems.length ?? 0); index++) {
      const element = result?.timeItems[index];

      expect(element?.timeInSeconds).toBe(timeItems[index].timeInSeconds);
      expect(element?.timeText).toBe(timeItems[index].timeText);
      expect(element?.timeUnitText).toBe(timeItems[index].timeUnitText);
    }
  });
});
