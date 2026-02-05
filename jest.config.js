module.exports = {
  testEnvironment: 'node',

  // Only run unit + integration by default
  testMatch: [
    '<rootDir>/test/unit/**/*.test.js',
    '<rootDir>/test/integration/**/*.test.js'
  ],

  // Never touch E2E folders
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e-ui/',
    '/test/e2e/'
  ],
};
