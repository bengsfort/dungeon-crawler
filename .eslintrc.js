module.exports = {
  root: true,
  extends: "plugin:@dungeon-crawler/recommended",
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
  },
  rules: {
    "sort-imports": ["warn"],
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
  },
};
