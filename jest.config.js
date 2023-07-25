const mongoPreset = require('@shelf/jest-mongodb/jest-preset')
const tsPreset = require('ts-jest/jest-preset')
const jest = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/src/data/protocols',
    '<rootDir>/src/presentation/protocols',
    '.protocols.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  //preset: '@self/jest-mongodb',
  roots: ['<rootDir>/src'],

  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}

module.exports = { ...tsPreset, ...jest, ...mongoPreset }
