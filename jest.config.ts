import { InitialOptionsTsJest } from "ts-jest/dist/types";

const options: InitialOptionsTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  testPathIgnorePatterns: ["example/"],
};

export default options;
