import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'src/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};

// eslint-disable-next-line no-restricted-exports
export default config;
