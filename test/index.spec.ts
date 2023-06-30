import { parseIngredient, parseInstruction } from "../src/index";

describe("Parse ingredient EN", () => {
  const table = [
    ["", -1, -1, -1, -1, -1],
    ["142g bread flour", 142, "142", "gram", "bread flour", ""],
    ["142g bread flour", 142, "142", "gram", "bread flour", ""],
    ["142g bread flour", 142, "142", "gram", "bread flour", ""],
    ["1 cup carrots, cut up small", 1, "1", "cup", "carrots", "cut up small"],
    ["1 cup flour", 1, "1", "cup", "flour", ""],
    ["1c carrots", 1, "1", "cup", "carrots", ""],
    ["2 cups carrots", 2, "2", "cup", "carrots", ""],
    [
      "1 1/2 tablespoons olive oil",
      1.5,
      "1 1/2",
      "tablespoon",
      "olive oil",
      "",
    ],
    ["1/2 pound ground beef", 0.5, "1/2", "pound", "ground beef", ""],
    ["1/2LB ground beef", 0.5, "1/2", "pound", "ground beef", ""],
    ["1½ LB ground beef", 1.5, "1 ½", "pound", "ground beef", ""],
    ["2 grams salt", 2, "2", "gram", "salt", ""],
    ["1 gram salt", 1, "1", "gram", "salt", ""],
    ["2oz of scallions", 2, "2", "ounce", "scallions", ""],
    ["2 ounces of scallions", 2, "2", "ounce", "scallions", ""],
    ["2 bunches of scallions", 2, "2", "", "bunches of scallions", ""],
    ["5 cans of dried corn", 5, "5", "can", "dried corn", ""],
    ["½ cans of dried corn", 0.5, "½", "can", "dried corn", ""],
    ["10 ml milk", 10, "10", "milliliter", "milk", ""],
    ["Salt to taste", 0, "", "", "Salt to taste", ""],
    ["Ingredient", 0, "", "", "Ingredient", ""],
    ["10 gr wheat flour", 10, "10", "grain", "wheat flour", ""],
    ["1 drop of water", 1, "1", "drop", "water", ""],
    ["1 batch of another recipe", 1, "1", "batch", "another recipe", ""],
    ["2 batches meringue", 2, "2", "batch", "meringue", ""],
    ["1", 1, "1", "", "", ""],
  ];
  it.each(table)(
    "parse %s",
    (text, quantity, quantityText, unit, ingredient, extra) => {
      const result = parseIngredient(text as string, "en");
      expect(result?.quantity ?? -1).toBe(quantity);
      expect(result?.quantityText ?? -1).toBe(quantityText);
      expect(result?.unit ?? -1).toBe(unit);
      expect(result?.ingredient ?? -1).toBe(ingredient);
      expect(result?.extra ?? -1).toBe(extra);
    }
  );
});

describe("Parse instruction EN", () => {
  const table = [
    ["", -1, -1, -1],
    ["Bake for 10min", 600, 0, ""],
    ["Wait 1 hour, knead some more and wait another 15 min", 4500, 0, ""],
    ["Preheat the oven at 450 fahrenheit", 0, 450, "fahrenheit"],
    ["Preheat the oven at 450° fahrenheit", 0, 450, "fahrenheit"],
    ["Preheat the oven at 450°F", 0, 450, "fahrenheit"],
    [
      "Preheat the oven at 450 fahrenheit then adjust to 500F",
      0,
      500, // keep the last temperature
      "fahrenheit",
    ],
    ["Shape and proof for about 2 hours", 7200, 0, ""],
    ["Mix all ingredients", 0, 0, ""],
  ];
  it.each(table)(
    "parse %s",
    (text, timeInSeconds, temperature, temperatureUnit) => {
      const result = parseInstruction(text as string, "en");
      expect(result?.timeInSeconds ?? -1).toBe(timeInSeconds);
      expect(result?.temperature ?? -1).toBe(temperature);
      expect(result?.temperatureUnit ?? -1).toBe(temperatureUnit);
    }
  );
});
