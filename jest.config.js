module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/data/**',
    '!src/mcp-servers/**',
    '!src/agents/**'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/services/**/*.js': {
      lines: 90
    },
    './src/repositories/**/*.js': {
      lines: 85
    },
    './src/middleware/**/*.js': {
      lines: 90
    }
  },
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
