/**
 * DOM manipulation utilities for the sharp-recipe-parser demo
 */

/**
 * Creates an HTML element with optional attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {...(string|HTMLElement)} children - Child elements or text content
 * @returns {HTMLElement}
 */
export function createElement(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Add children
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    }
  });
  
  return element;
}

/**
 * Clears all children from an element
 * @param {HTMLElement} element - Element to clear
 */
export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Shows or hides an element
 * @param {HTMLElement} element - Target element
 * @param {boolean} show - Whether to show the element
 */
export function toggleVisibility(element, show) {
  element.style.display = show ? 'block' : 'none';
}