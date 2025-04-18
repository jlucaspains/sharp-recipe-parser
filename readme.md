[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=jlucaspains_sharp-recipe-parser&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=jlucaspains_sharp-recipe-parser)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=jlucaspains_sharp-recipe-parser&metric=coverage)](https://sonarcloud.io/summary/new_code?id=jlucaspains_sharp-recipe-parser)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=jlucaspains_sharp-recipe-parser&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=jlucaspains_sharp-recipe-parser)

A simple recipe ingredient and instruction parser that avoids regexes as much as possible.

See online demo at [share-recipe-parser.lpains.net](https://sharp-recipe-parser.lpains.net/).

## Getting started
Install package from [npmjs.com](https://www.npmjs.com/package/@jlucaspains/sharp-recipe-parser):
```bash
npm install @jlucaspains/sharp-recipe-parser
# or
yarn add @jlucaspains/sharp-recipe-parser
```

Then:
```javascript
import { parseIngredient, parseInstruction } from '@jlucaspains/sharp-recipe-parser';

// with default options
parseIngredient('300g flour', 'en');
// results in
// {
//   quantity: 300,
//   quantityText: '300',
//   minQuantity: 300,
//   maxQuantity: 300,
//   unit: 'gram',
//   unitText: 'g',
//   ingredient: 'flour',
//   extra: '',
//   alternativeQuantities: []
// }

// with explicit options
parseIngredient('300g flour, very fine', 'en', { includeAlternativeUnits: true, includeExtra: true});
// results in
// {
//   quantity: 300,
//   quantityText: '300',
//   minQuantity: 300,
//   maxQuantity: 300,
//   unit: 'gram',
//   unitText: 'g',
//   ingredient: 'flour',
//   extra: 'very fine',
//   alternativeQuantities: [
//     {
//       quantity: 0.6614,
//       unit: 'lb',
//       unitText: 'pound',
//       minQuantity: 0.6614,
//       maxQuantity: 0.6614
//     },
//     {
//       quantity: 0.3,
//       unit: 'kg',
//       unitText: 'kilogram',
//       minQuantity: 0.3,
//       maxQuantity: 0.3
//     },
//     {
//       quantity: 10.5822,
//       unit: 'oz',
//       unitText: 'ounce',
//       minQuantity: 10.5822,
//       maxQuantity: 10.5822
//     },
//     {
//       quantity: 300000,
//       unit: 'mg',
//       unitText: 'milligram',
//       minQuantity: 300000,
//       maxQuantity: 300000
//     }
//   ]
// }

// with default options
parseInstruction('Bake at 400F for 30 minutes.');
// results in
// {
//   totalTimeInSeconds: 1800,
//   timeItems: [ { timeInSeconds: 1800, timeUnitText: 'minutes', timeText: '30' } ],
//   temperature: 400,
//   temperatureText: '400',
//   temperatureUnit: 'fahrenheit',
//   temperatureUnitText: 'F'
// }

// with explicit options
parseInstruction('Bake at 400F for 30 minutes.', { includeAlternativeTemperatureUnit: true });
// {
//   totalTimeInSeconds: 1800,
//   timeItems: [ { timeInSeconds: 1800, timeUnitText: 'minutes', timeText: '30' } ],
//   temperature: 400,
//   temperatureText: '400',
//   temperatureUnit: 'fahrenheit',
//   temperatureUnitText: 'F',
//   alternativeTemperatures: [
//     {
//       quantity: 204.4444,
//       unit: 'C',
//       minQuantity: 204.4444,
//       maxQuantity: 204.4444
//     }
//   ]
// }
```

## How it works
sharp-recipe-parser uses a simple technique that preserves words and punctuation in order to tokenize the ingredient and instruction phrases. After tokenization, rules developed specifically for recipe parsing are executed like so:

1. Look through the tokens for numbers (e.g. 1, 10, 1.5, 1/2, 1 1/4, one, etc)
   1. Fractions are parsed using [fraction.js](https://www.npmjs.com/package/fraction.js)
   2. Word numbers (e.g. one, two, etc) are lookup in a language specific dictionary
   3. Ranges for min and max are determined by markers defined in a language specific dictionary (e.g. -, to)
   4. If no numbers are found, reset the index so next step starts at token 0
2. Assume the next word is a UOM, singularize the word, lookup in language specific UOM dictionary
3. Assume the next words up to a comma is the ingredient description
4. Anything after the comma is an extra

## Features
### parseIngredient
1. Identify the quantity from whole numbers (2), decimals (1.5), fractions (1/2), Unicode fractions (½), composite fractions (1 1/2), and ranges (1-2)
2. Identify 58 notations of english language UOMs plus appropriate plural words (e.g. cup, cups, g, gram, grams, etc). See all UOMs in `units.en.ts` in source code.
3. Calculate alternative quantity UOMs
4. Identify the ingredient
   1. Note that parenthesis are ignored so 1 cup (150g) flour will only identify flour as the ingredient
5. Automatically removes prepositions from ingredients (e.g. 10g of flour; only flour is identified as ingredient)
6. Identify extra instructions (e.g. 1 cup of carrots, cut small; cut small becomes extra)

### parseInstruction
1. Identify instances of time units in minutes, hours, and days
   1. "Bake for 30 minutes"
   1. "Rise for 2 hours"
   1. "Wait 3 days"
2. Identify the temperature in Farenheit or Celcius.
   1. "180C"
   1. "350F"
   1. "180°C"
   1. "180 degree celsius"

## Contribute
1. By default regex is not allowed. If absolutely necessary, they will be reviewed in a case-by-case basis
2. All changes need to have appropriate translation in the same PR
3. Open an issue describing the problem you are trying to fix before opening a PR. That should help ensure all PRs are reviewed and approved.
4. Please be nice. This is a work of love, not money.

## FAQ
1. Why not use AI?
I've tried a few models such as the [New York Times Ingredient Phrase Tagger](https://github.com/nytimes/ingredient-phrase-tagger) but nothing yielded the results in a satisfactory way. Mostly, they introduced dependencies that were less than ideal.

2. Where is this used?
The library was developed side-by-side with [Sharp Cooking](https://github.com/jlucaspains/sharp-cooking-web). As soon as version 1 of the library is released, I expected Sharp Cooking will leverage it in PROD as well.

4. Why not regex?
Regex quickly becomes clunky and hard to understand at a glance. There are reasonably simple rules that can be followed to parse and understand a recipe using a tokenizer and dictionaries to lookup specific data. 
