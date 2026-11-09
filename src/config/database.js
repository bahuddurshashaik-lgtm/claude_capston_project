/**
 * Database Configuration
 * Knex instance with connection pooling and query monitoring
 */

const knex = require('knex');
const knexConfig = require('../../knexfile');
const { createLogger } = require('../utils/logger');

const logger = createLogger('database');
const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Create Knex instance
const db = knex(config);

// Log slow queries (queries taking more than 1 second)
db.on('query', (query) => {
  query.startTime = Date.now();
});

db.on('query-response', (response, query) => {
  const duration = Date.now() - query.startTime;
  if (duration > 1000) {
    logger.warn('Slow query detected', {
      sql: query.sql,
      duration,
      bindings: query.bindings
    });
  }
});

// Log database errors
db.on('query-error', (error, query) => {
  logger.error('Database query error', {
    error: error.message,
    sql: query.sql,
    bindings: query.bindings
  });
});

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    logger.info('Database connection established successfully');
  })
  .catch((error) => {
    logger.error('Failed to establish database connection', { error: error.message });
  });

module.exports = db;
