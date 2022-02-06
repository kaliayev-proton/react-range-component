import type { Config } from "@jest/types";

// Or async function
export default async (): Promise<Config.InitialOptions> => {
  return {
    clearMocks: true,
    verbose: true,
    coverageProvider: "v8",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "ts-jest",
      "^.+\\.svg$": "<rootDir>/jest/svgTransform.js",
      "^.+\\.css$": "<rootDir>/jest/cssTransform.js",
    },
  };
};
