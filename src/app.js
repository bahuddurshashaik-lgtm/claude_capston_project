/**
 * Express Application
 * Main application setup with complete middleware pipeline
 * HB-001: Hotel Search and Browse
 *
 * CRITICAL FIXES:
 * - M-3 FIX: API versioning with /api/v1/ prefix
 * - M-5 FIX: CORS middleware properly configured
 */

const express = require('express');
const { applyCors, applyHelmet, securityHeaders, requestLogger } = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');
const { createLogger } = require('./utils/logger');

const logger = createLogger('app');

/**
 * Create and configure Express application
 * @returns {Object} - Configured Express app
 */
function createApp() {
  const app = express();

  // Trust proxy (required for rate limiting and IP detection behind proxies)
  app.set('trust proxy', 1);

  // ========================================
  // SECURITY MIDDLEWARE (M-5 FIX)
  // ========================================

  // Helmet - Sets various HTTP headers for security
  app.use(applyHelmet);

  // CORS - Cross-Origin Resource Sharing (M-5 FIX - CRITICAL)
  app.use(applyCors);

  // Custom security headers
  app.use(securityHeaders);

  // ========================================
  // BODY PARSING MIDDLEWARE
  // ========================================

  // Parse JSON request bodies
  app.use(express.json({ limit: '10mb' }));

  // Parse URL-encoded request bodies
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ========================================
  // LOGGING MIDDLEWARE
  // ========================================

  // Request logging for security monitoring
  if (process.env.NODE_ENV !== 'test') {
    app.use(requestLogger);
  }

  // ========================================
  // RATE LIMITING MIDDLEWARE
  // ========================================

  // General API rate limiter (100 req/min per IP)
  app.use(apiLimiter);

  // ========================================
  // ROUTES (M-3 FIX: /api/v1/ prefix)
  // ========================================

  // Mount all routes
  app.use('/', routes);

  // ========================================
  // ERROR HANDLING MIDDLEWARE
  // ========================================

  // 404 handler - must come after all routes
  app.use(notFoundHandler);

  // Centralized error handler - must be last
  app.use(errorHandler);

  logger.info('Express application configured successfully');

  return app;
}

module.exports = createApp;
