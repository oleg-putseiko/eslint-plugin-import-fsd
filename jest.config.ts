import { type Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/rules/**/*.{js,ts}',
    'src/index.{js,ts}',
    'src/utils/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
