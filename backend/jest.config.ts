import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/*.spec.ts', '**/*.integration-spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
};

export default config;
