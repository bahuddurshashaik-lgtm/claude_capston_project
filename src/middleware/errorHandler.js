/**
 * Error Handler Middleware
 * Centralized error handling for the application
 * HB-001: Hotel Search and Browse
 */

const { HTTP_STATUS, ERROR_CODES } = require('../utils/constants');
const { createLogger } = require('../utils/logger');

const logger = createLogger('errorHandler');

/**
 * Custom Application Error class
 */
class AppError extends Error {
  constructor(code, message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 * Catches all errors and sends appropriate responses
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function errorHandler(err, req, res, next) {
  // Default error values
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorCode = err.code || ERROR_CODES.INTERNAL_SERVER_ERROR;
  let message = err.message || 'An unexpected error occurred';
  let details = err.details || null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = ERROR_CODES.VALIDATION_ERROR;
  }

  // Handle database errors
  if (err.code && err.code.startsWith('23')) { // PostgreSQL constraint violation codes
    statusCode = HTTP_STATUS.BAD_REQUEST;
    errorCode = ERROR_CODES.DATABASE_ERROR;

    if (err.code === '23505') { // Unique violation
      message = 'A record with this value already exists';
    } else if (err.code === '23503') { // Foreign key violation
      message = 'Referenced record does not exist';
    } else if (err.code === '23502') { // Not null violation
      message = 'Required field is missing';
    }
  }

  // Log error details
  if (statusCode >= 500) {
    logger.error('Internal server error', {
      error: message,
      code: errorCode,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id
    });
  } else {
    logger.warn('Client error', {
      error: message,
      code: errorCode,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
  }

  // Send error response
  const response = {
    success: false,
    error: {
      code: errorCode,
      message
    }
  };

  // Include details in development mode or for validation errors
  if (details || (process.env.NODE_ENV !== 'production' && err.stack)) {
    if (details) {
      response.error.details = details;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV !== 'production') {
      response.error.stack = err.stack;
    }
  }

  res.status(statusCode).json(response);
}

/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundHandler(req, res) {
  logger.warn('Route not found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND,
      message: 'The requested resource was not found'
    }
  });
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped function
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  asyncHandler
};
