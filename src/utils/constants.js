/**
 * Application Constants
 * Centralized constants for the hotel booking system
 */

module.exports = {
  // Sort options for hotel search results
  SORT_OPTIONS: {
    PRICE_ASC: 'price:asc',
    PRICE_DESC: 'price:desc',
    RATING_ASC: 'rating:asc',
    RATING_DESC: 'rating:desc'
  },

  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    HOTEL_NOT_FOUND: 'HOTEL_NOT_FOUND',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    DATABASE_ERROR: 'DATABASE_ERROR'
  },

  // Validation constants
  VALIDATION: {
    LOCATION_MIN_LENGTH: 2,
    LOCATION_MAX_LENGTH: 100,
    MIN_RATING: 1.0,
    MAX_RATING: 5.0,
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_SORT: 'rating:desc',
    MIN_PRICE: 0,
    MAX_PRICE: 999999.99
  },

  // HTTP status codes
  HTTP_STATUS: {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  }
};
