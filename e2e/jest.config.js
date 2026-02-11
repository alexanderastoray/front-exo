/**
 * Jest Configuration for E2E Tests
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.e2e.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['**/*.ts', '!**/*.d.ts', '!**/node_modules/**'],
  testTimeout: 60000, // 60 seconds for E2E tests
  verbose: true,
  bail: false, // Continue running tests even if one fails
  maxWorkers: 1, // Run tests serially to avoid conflicts
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
};
