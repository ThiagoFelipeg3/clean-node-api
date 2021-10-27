module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    preset: '@self/jest-mongodb',
    roots: ['<rootDir>/src'],

    testEnvironment: 'node',
    transform: {
      '.+\\.ts$': 'ts-jest'
    }
}
