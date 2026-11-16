/**
 * Rate Limiter Middleware
 * Prevents abuse by limiting requests per IP address
 * HB-001: Hotel Search and Browse
 *
 * Rate Limit: 100 requests per minute per IP
 */

const rateLimit = require('express-rate-limit');
const { HTTP_STATUS, ERROR_CODES } = require('../utils/constants');
const { createLogger } = require('../utils/logger');

const logger = createLogger('rateLimiter');

/**
 * General API rate limiter
 * 100 requests per minute per IP
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers

  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.originalUrl,
      method: req.method
    });

    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000) // Seconds until reset
      }
    });
  },

  // Skip rate limiting for certain conditions (e.g., trusted IPs in production)
  skip: (req) => {
    // Skip rate limiting for health checks
    if (req.path === '/health' || req.path === '/api/v1/health') {
      return true;
    }
    return false;
  },

  // Store rate limit data in memory (for production, use Redis)
  // For production: import RedisStore and configure
  // store: new RedisStore({ client: redisClient })

  // Key generator function
  keyGenerator: (req) => {
    // Use forwarded IP if behind a proxy, otherwise use connection IP
    return req.ip || req.connection.remoteAddress;
  }
});

/**
 * Stricter rate limiter for search endpoints
 * 60 requests per minute per IP
 */
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 search requests per minute
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    logger.warn('Search rate limit exceeded', {
      ip: req.ip,
      url: req.originalUrl,
      query: req.query
    });

    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message: 'Too many search requests. Please try again later.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      }
    });
  },

  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

module.exports = {
  apiLimiter,
  searchLimiter
};
