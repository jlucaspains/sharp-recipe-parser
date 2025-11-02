/**
 * Ingredient Parser Module
 * Converted from IngredientParser.svelte
 */

import { parseIngredient } from '@jlucaspains/sharp-recipe-parser';
import { createElement, clearElement } from '../utils/dom.js';
import { createResultGrid, createResultBox } from '../components/resultBox.js';

/**
 * Creates the ingredient parser UI
 * @param {HTMLElement} container - Container element to render into
 * @returns {Object} - Object with methods to interact with the parser
 */
export function createIngredientParser(container) {
  let ingredient = '';
  let ingredientParseResult = null;
  let alternativeQuantities = [];
  let timeTaken = '';

  // Create input section
  const inputSection = createElement('div', { className: 'mb-6 sm:mb-8 md:mb-12' });
  
  const input = createElement('input', {
    className: 'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:p-2.5',
    type: 'text',
    placeholder: '1 cup flour'
  });

  const timeSpan = createElement('span', {
    className: 'text-xs text-gray-500 sm:text-sm'
  }, 'Time taken: 0ms');

  inputSection.appendChild(input);
  inputSection.appendChild(timeSpan);

  // Create results container
  const resultsContainer = createElement('div');

  // Main container
  const mainContainer = createElement('div');
  mainContainer.appendChild(inputSection);
  mainContainer.appendChild(resultsContainer);

  /**
   * Handles input changes and parses ingredients
   */
  function handleIngredientChange(event) {
    ingredient = event.target.value;
    
    if (!ingredient.trim()) {
      clearElement(resultsContainer);
      timeSpan.textContent = 'Time taken: 0ms';
      return;
    }

    const startTime = performance.now();
    
    try {
      ingredientParseResult = parseIngredient(ingredient, 'en-US', {
        includeAlternativeUnits: true,
        includeExtra: true
      });
      
      const endTime = performance.now();
      timeTaken = (endTime - startTime).toFixed(2);
      timeSpan.textContent = `Time taken: ${timeTaken}ms`;
      
      alternativeQuantities = ingredientParseResult?.alternativeQuantities || [];
      
      renderResults();
    } catch (error) {
      console.error('Error parsing ingredient:', error);
      timeSpan.textContent = 'Error parsing ingredient';
    }
  }

  /**
   * Renders the parsing results
   */
  function renderResults() {
    clearElement(resultsContainer);

    if (!ingredientParseResult) return;

    // Main results section
    const resultsTitle = createElement('h2', {
      className: 'text-lg font-semibold mb-3 sm:text-xl sm:mb-4 md:text-2xl'
    }, 'Result');
    resultsContainer.appendChild(resultsTitle);

    const mainResults = [];

    // Quantity handling
    if (ingredientParseResult.minQuantity === ingredientParseResult.maxQuantity) {
      mainResults.push({
        value: ingredientParseResult.quantity,
        valueDescription: 'Quantity'
      });
    } else {
      mainResults.push({
        value: `${ingredientParseResult.minQuantity}-${ingredientParseResult.maxQuantity}`,
        valueDescription: 'Quantity'
      });
    }

    mainResults.push(
      {
        value: ingredientParseResult.unit,
        valueDescription: 'UOM'
      },
      {
        value: ingredientParseResult.ingredient,
        valueDescription: 'Ingredient'
      },
      {
        value: ingredientParseResult.extra,
        valueDescription: 'Extra'
      }
    );

    const mainResultsGrid = createResultGrid(mainResults);
    resultsContainer.appendChild(mainResultsGrid);

    // Alternative quantities section
    if (alternativeQuantities.length > 0) {
      const altTitle = createElement('h2', {
        className: 'text-lg font-semibold mb-3 mt-6 sm:text-xl sm:mb-4 sm:mt-8 md:text-2xl'
      }, 'Alternative UOMs');
      resultsContainer.appendChild(altTitle);

      const altResults = alternativeQuantities.map(item => ({
        value: item.quantity,
        valueDescription: item.unitText
      }));

      const altResultsGrid = createResultGrid(altResults);
      resultsContainer.appendChild(altResultsGrid);
    }
  }

  // Add event listener
  input.addEventListener('input', handleIngredientChange);

  // Append to container
  container.appendChild(mainContainer);

  // Return interface
  return {
    container: mainContainer,
    setValue: (value) => {
      input.value = value;
      handleIngredientChange({ target: input });
    },
    getValue: () => ingredient,
    getResult: () => ingredientParseResult,
    clear: () => {
      input.value = '';
      ingredient = '';
      ingredientParseResult = null;
      alternativeQuantities = [];
      clearElement(resultsContainer);
      timeSpan.textContent = 'Time taken: 0ms';
    }
  };
}