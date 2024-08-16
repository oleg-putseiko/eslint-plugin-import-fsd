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
  preset: 'ts-jest',
  testEnvironment: 'node',
};

// eslint-disable-next-line no-restricted-exports
export default config;
