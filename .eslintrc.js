module.exports = {
  root: true,
  extends: "plugin:@dungeon-crawler/recommended",
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
  },
  rules: {
    "sort-imports": ["warn"],
  },
};
