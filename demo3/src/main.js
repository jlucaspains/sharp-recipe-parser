import './style.css'
import githubLogo from './assets/github.svg'
import { createElement, toggleVisibility } from './utils/dom.js'
import { createIngredientParser } from './parsers/ingredient.js'
import { createInstructionParser } from './parsers/instruction.js'

// Application state
let showInstruction = false;
let ingredientParser = null;
let instructionParser = null;

/**
 * Creates the header with GitHub link
 */
function createHeader() {
  const header = createElement('header', {
    className: 'flex justify-between'
  });

  const leftCorner = createElement('div', { className: 'corner w-10 h-10 sm:w-12 sm:h-12' });
  const title = createElement('h1', {
    className: 'mb-6 text-center text-2xl font-extrabold leading-tight tracking-tight sm:mb-8 sm:text-3xl md:mb-12 md:text-4xl lg:text-5xl xl:text-6xl'
  }, 'sharp-recipe-parser');

  const rightCorner = createElement('div', { className: 'corner w-10 h-10 sm:w-12 sm:h-12' });
  const githubLink = createElement('a', {
    href: 'https://github.com/jlucaspains/sharp-recipe-parser',
    className: 'flex items-center justify-center w-full h-full hover:opacity-75 transition-opacity p-1 sm:p-0'
  });
  
  const githubImg = createElement('img', {
    src: githubLogo,
    alt: 'GitHub',
    className: 'w-6 h-6 sm:w-8 sm:h-8'
  });
  
  githubLink.appendChild(githubImg);
  rightCorner.appendChild(githubLink);
  header.appendChild(leftCorner);
  header.appendChild(title);
  header.appendChild(rightCorner);
  
  return header;
}

/**
 * Creates the toggle switch for switching between parsers
 */
function createToggleSwitch() {
  const toggleContainer = createElement('div', { 
    className: 'mx-auto my-4 sm:my-6 md:my-8'
  });

  const switchContainer = createElement('div', {
    className: 'flex items-center justify-center gap-2 sm:gap-0'
  });

  // Ingredient label
  const ingredientLabel = createElement('span', {
    className: 'text-xs font-medium text-gray-300 mr-2 sm:ml-3 sm:mr-2 sm:text-sm'
  }, 'Ingredient line parser');

  // Toggle switch
  const toggleLabel = createElement('label', {
    className: 'relative inline-flex cursor-pointer items-center'
  });

  const toggleInput = createElement('input', {
    type: 'checkbox',
    className: 'peer sr-only'
  });

  const toggleBackground = createElement('div', {
    className: 'peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[\'\'] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800'
  });

  // Instruction label
  const instructionLabel = createElement('span', {
    className: 'text-xs font-medium text-gray-300 ml-2 sm:ml-3 sm:text-sm'
  }, 'Instruction line parser');

  // Handle toggle change
  toggleInput.addEventListener('change', (event) => {
    showInstruction = event.target.checked;
    updateParserVisibility();
  });

  toggleLabel.appendChild(toggleInput);
  toggleLabel.appendChild(toggleBackground);
  
  switchContainer.appendChild(ingredientLabel);
  switchContainer.appendChild(toggleLabel);
  switchContainer.appendChild(instructionLabel);
  
  toggleContainer.appendChild(switchContainer);
  
  return toggleContainer;
}

/**
 * Updates parser visibility based on toggle state
 */
function updateParserVisibility() {
  if (ingredientParser && instructionParser) {
    toggleVisibility(ingredientParser.container, !showInstruction);
    toggleVisibility(instructionParser.container, showInstruction);
  }
}

/**
 * Creates the main application layout
 */
function createApp() {
  const app = document.querySelector('#app');
  
  // Main wrapper
  const wrapper = createElement('div', {
    className: 'flex min-h-screen flex-col bg-gray-900 px-4 py-6 text-white sm:px-8 md:px-12 md:py-10'
  });

  // Header
  const header = createHeader();
  wrapper.appendChild(header);

  // Main content
  const main = createElement('main', {
    className: 'mx-auto my-0 flex w-full max-w-5xl flex-1 flex-col p-2 sm:p-4'
  });

  const section = createElement('section');

  // Toggle switch
  const toggleSwitch = createToggleSwitch();
  section.appendChild(toggleSwitch);

  // Parser containers
  const parserContainer = createElement('div', {
    className: 'parser-container'
  });

  // Create ingredient parser
  ingredientParser = createIngredientParser(parserContainer);
  
  // Create instruction parser
  instructionParser = createInstructionParser(parserContainer);

  // Initially hide instruction parser
  updateParserVisibility();

  section.appendChild(parserContainer);
  main.appendChild(section);
  wrapper.appendChild(main);

  // Footer
  const footer = createElement('footer', {
    className: 'text-center text-sm text-gray-400'
  }, 'v' + import.meta.env.VITE_PACKAGE_VERSION);

  wrapper.appendChild(footer);
  app.appendChild(wrapper);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  createApp();
});
