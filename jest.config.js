module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  passWithNoTests: true,
};
