module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:jsdoc/recommended",
    "prettier",
  ],
  plugins: ["jsdoc", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  root: true,
  rules: {
    "prettier/prettier": ["error"],
  },
};
