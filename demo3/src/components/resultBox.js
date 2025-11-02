/**
 * ResultBox component - displays a value with description in a styled box
 * Converted from Svelte ResultBox component
 */

import { createElement } from '../utils/dom.js';

/**
 * Creates a result box element
 * @param {string} value - The main value to display
 * @param {string} valueDescription - Description of the value
 * @returns {HTMLElement} - The result box element
 */
export function createResultBox(value = '', valueDescription = '') {
  // Main container with hover effect
  const container = createElement('div', {
    className: 'my-2 flex flex-col rounded bg-gray-800 p-3 shadow-lg shadow-gray-900 duration-300 hover:-translate-y-1 sm:my-4 sm:p-4'
  });

  // Value span (large text)
  const valueSpan = createElement('span', {
    className: 'mb-2 flex-grow text-xl text-white sm:text-2xl lg:text-3xl'
  }, value || '—');

  // Description container
  const descriptionDiv = createElement('div');
  const descriptionSpan = createElement('span', {
    className: 'text-normal text-neutral-600'
  }, valueDescription);

  descriptionDiv.appendChild(descriptionSpan);
  container.appendChild(valueSpan);
  container.appendChild(descriptionDiv);

  return container;
}

/**
 * Updates an existing result box with new values
 * @param {HTMLElement} resultBox - The result box element to update
 * @param {string} value - New value to display
 * @param {string} valueDescription - New description
 */
export function updateResultBox(resultBox, value = '', valueDescription = '') {
  const valueSpan = resultBox.querySelector('.text-3xl');
  const descriptionSpan = resultBox.querySelector('.text-normal');
  
  if (valueSpan) {
    valueSpan.textContent = value || '—';
  }
  
  if (descriptionSpan) {
    descriptionSpan.textContent = valueDescription;
  }
}

/**
 * Creates multiple result boxes in a grid layout
 * @param {Array} results - Array of {value, valueDescription} objects
 * @returns {HTMLElement} - Grid container with result boxes
 */
export function createResultGrid(results = []) {
  const grid = createElement('div', {
    className: 'grid grid-flow-row gap-3 text-neutral-600 sm:gap-4 md:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  });

  results.forEach(result => {
    const resultBox = createResultBox(result.value.toString(), result.valueDescription);
    grid.appendChild(resultBox);
  });

  return grid;
}