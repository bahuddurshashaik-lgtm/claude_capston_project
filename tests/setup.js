/**
 * Jest Test Setup
 * Global setup for all tests
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Increase test timeout for integration tests
jest.setTimeout(10000);

// Suppress console output during tests (optional)
global.console = {
  ...console,
  // Uncomment to suppress logs during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: console.error // Keep errors visible
};

// Global test cleanup
afterAll(async () => {
  // Close database connections
  const db = require('../src/config/database');
  if (db && typeof db.destroy === 'function') {
    await db.destroy();
  }
});
