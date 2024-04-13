import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  {
    plugins: {
      prettier: prettier,
      jsdoc: jsdoc,
    },
    rules: {
      "prettier/prettier": ["error"],
      ...js.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
];
