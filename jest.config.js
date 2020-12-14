module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  projects: ["<rootDir>/packages/*"],
  roots: [
    "<rootDir>/packages/core/src",
    "<rootDir>/packages/network/src",
    "<rootDir>/packages/runtime/src",
    "<rootDir>/packages/renderer/src",
    "<rootDir>/packages/world-configs/src",
  ],
};
