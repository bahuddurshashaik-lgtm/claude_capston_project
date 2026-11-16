/**
 * Server Entry Point
 * Starts the Express server and handles graceful shutdown
 * HB-001: Hotel Search and Browse
 */

require('dotenv').config();
const createApp = require('./app');
const { createLogger } = require('./utils/logger');
const db = require('./config/database');

const logger = createLogger('server');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Express app
const app = createApp();

// Server instance
let server;

/**
 * Start the server
 */
async function startServer() {
  try {
    // Test database connection
    await db.raw('SELECT 1');
    logger.info('Database connection verified');

    // Start listening
    server = app.listen(PORT, HOST, () => {
      logger.info('Server started successfully', {
        port: PORT,
        host: HOST,
        environment: NODE_ENV,
        nodeVersion: process.version,
        pid: process.pid
      });

      // Log available endpoints
      logger.info('API endpoints available', {
        health: `http://${HOST}:${PORT}/health`,
        apiHealth: `http://${HOST}:${PORT}/api/v1/health`,
        hotels: `http://${HOST}:${PORT}/api/v1/hotels`,
        search: `http://${HOST}:${PORT}/api/v1/hotels/search`
      });
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`, { error: error.message });
      } else {
        logger.error('Server error', { error: error.message, stack: error.stack });
      }
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 * @param {string} signal - Signal that triggered shutdown
 */
async function gracefulShutdown(signal) {
  logger.info(`${signal} received, starting graceful shutdown`);

  // Stop accepting new connections
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        // Close database connections
        await db.destroy();
        logger.info('Database connections closed');

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown', {
          error: error.message
        });
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
  process.exit(1);
});

/**
 * Handle termination signals
 */
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, gracefulShutdown };
