import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  verbose: true,
  detectOpenHandles: true,
};

export default config;
