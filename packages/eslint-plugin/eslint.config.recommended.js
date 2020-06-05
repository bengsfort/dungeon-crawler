module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:promise/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended", // MAKE SURE PRETTIER IS LAST
  ],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // TYPESCRIPT: https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};
