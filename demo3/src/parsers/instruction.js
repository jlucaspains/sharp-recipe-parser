/**
 * Instruction Parser Module
 * Converted from InstructionParser.svelte
 */

import { parseInstruction } from '@jlucaspains/sharp-recipe-parser';
import { createElement, clearElement } from '../utils/dom.js';
import { createResultGrid } from '../components/resultBox.js';

/**
 * Creates the instruction parser UI
 * @param {HTMLElement} container - Container element to render into
 * @returns {Object} - Object with methods to interact with the parser
 */
export function createInstructionParser(container) {
  let instruction = '';
  let instructionParseResult = null;
  let timeTaken = '';
  let alternativeTemperature = '';

  // Create input section
  const inputSection = createElement('div', { className: 'mb-6 sm:mb-8 md:mb-12' });
  
  const input = createElement('input', {
    className: 'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:p-2.5',
    type: 'text',
    placeholder: 'Bake at 350F for 30 minutes'
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
   * Handles input changes and parses instructions
   */
  function handleInstructionChange(event) {
    instruction = event.target.value;
    
    if (!instruction.trim()) {
      clearElement(resultsContainer);
      timeSpan.textContent = 'Time taken: 0ms';
      return;
    }

    const startTime = performance.now();
    
    try {
      instructionParseResult = parseInstruction(instruction, 'en-US', {
        includeAlternativeTemperatureUnit: true
      });
      
      const endTime = performance.now();
      timeTaken = (endTime - startTime).toFixed(2);
      timeSpan.textContent = `Time taken: ${timeTaken}ms`;
      
      // Process alternative temperatures
      alternativeTemperature = '';
      if (instructionParseResult?.alternativeTemperatures?.length > 0) {
        instructionParseResult.alternativeTemperatures.forEach((item) => {
          alternativeTemperature = `${item.quantity} ${item.unit}`;
        });
      }
      
      renderResults();
    } catch (error) {
      console.error('Error parsing instruction:', error);
      timeSpan.textContent = 'Error parsing instruction';
    }
  }

  /**
   * Renders the parsing results
   */
  function renderResults() {
    clearElement(resultsContainer);

    if (!instructionParseResult) return;

    // Create results array
    const results = [
      {
        value: instructionParseResult.temperature,
        valueDescription: 'Temperature'
      },
      {
        value: instructionParseResult.temperatureUnit,
        valueDescription: 'Temperature UOM'
      },
      {
        value: instructionParseResult.totalTimeInSeconds,
        valueDescription: 'Time in Seconds'
      },
      {
        value: alternativeTemperature,
        valueDescription: 'Alternative Temperature'
      }
    ];

    const resultsGrid = createResultGrid(results);
    resultsContainer.appendChild(resultsGrid);
  }

  // Add event listener
  input.addEventListener('input', handleInstructionChange);

  // Append to container
  container.appendChild(mainContainer);

  // Return interface
  return {
    container: mainContainer,
    setValue: (value) => {
      input.value = value;
      handleInstructionChange({ target: input });
    },
    getValue: () => instruction,
    getResult: () => instructionParseResult,
    clear: () => {
      input.value = '';
      instruction = '';
      instructionParseResult = null;
      alternativeTemperature = '';
      clearElement(resultsContainer);
      timeSpan.textContent = 'Time taken: 0ms';
    }
  };
}