/**
 * Security Middleware
 * CORS and Helmet security configuration
 * HB-001: Hotel Search and Browse
 *
 * CRITICAL FIX:
 * - M-5 FIX: Proper CORS middleware configuration
 */

const cors = require('cors');
const helmet = require('helmet');
const { createLogger } = require('../utils/logger');

const logger = createLogger('security');

/**
 * CORS configuration (M-5 FIX)
 * Allows cross-origin requests from specified origins
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // In production, check allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request from unauthorized origin', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],

  // Expose headers to the client
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-Per-Page',
    'RateLimit-Limit',
    'RateLimit-Remaining',
    'RateLimit-Reset'
  ],

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Preflight cache duration (in seconds)
  maxAge: 86400, // 24 hours

  // Success status for preflight requests
  optionsSuccessStatus: 204
};

/**
 * Helmet configuration
 * Sets various HTTP headers for security
 */
const helmetOptions = {
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },

  // Cross-Origin-Embedder-Policy
  crossOriginEmbedderPolicy: false,

  // Cross-Origin-Opener-Policy
  crossOriginOpenerPolicy: { policy: 'same-origin' },

  // Cross-Origin-Resource-Policy
  crossOriginResourcePolicy: { policy: 'cross-origin' },

  // DNS Prefetch Control
  dnsPrefetchControl: { allow: false },

  // X-Frame-Options
  frameguard: { action: 'deny' },

  // Hide X-Powered-By header
  hidePoweredBy: true,

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },

  // IE No Open
  ieNoOpen: true,

  // X-Content-Type-Options
  noSniff: true,

  // X-Permitted-Cross-Domain-Policies
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },

  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

  // X-XSS-Protection
  xssFilter: true
};

/**
 * Apply CORS middleware
 */
const applyCors = cors(corsOptions);

/**
 * Apply Helmet middleware
 */
const applyHelmet = helmet(helmetOptions);

/**
 * Security headers middleware
 * Additional custom security headers
 */
function securityHeaders(req, res, next) {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');

  // Add custom security headers
  res.setHeader('X-API-Version', 'v1');

  // Cache control for API responses
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  next();
}

/**
 * Request logging middleware for security monitoring
 */
function requestLogger(req, res, next) {
  // Log all requests for security monitoring
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    referer: req.get('referer')
  });

  // Log response on finish
  const originalSend = res.send;
  res.send = function(data) {
    logger.info('Outgoing response', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip
    });
    originalSend.call(this, data);
  };

  next();
}

module.exports = {
  applyCors,
  applyHelmet,
  securityHeaders,
  requestLogger,
  corsOptions,
  helmetOptions
};
