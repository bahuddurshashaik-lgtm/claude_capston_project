/**
 * Validation Middleware
 * Joi-based request validation for hotel search and retrieval
 * HB-001: Hotel Search and Browse
 */

const Joi = require('joi');
const { HTTP_STATUS, ERROR_CODES, VALIDATION } = require('../utils/constants');
const { createLogger } = require('../utils/logger');

const logger = createLogger('validation');

/**
 * Hotel search validation schema
 */
const searchHotelsSchema = Joi.object({
  location: Joi.string()
    .min(VALIDATION.LOCATION_MIN_LENGTH)
    .max(VALIDATION.LOCATION_MAX_LENGTH)
    .trim()
    .optional()
    .messages({
      'string.min': 'Location must be at least 2 characters',
      'string.max': 'Location must not exceed 100 characters'
    }),

  minPrice: Joi.number()
    .min(VALIDATION.MIN_PRICE)
    .max(VALIDATION.MAX_PRICE)
    .optional()
    .messages({
      'number.min': 'Minimum price must be at least 0',
      'number.max': 'Minimum price must not exceed 999999.99'
    }),

  maxPrice: Joi.number()
    .min(VALIDATION.MIN_PRICE)
    .max(VALIDATION.MAX_PRICE)
    .optional()
    .messages({
      'number.min': 'Maximum price must be at least 0',
      'number.max': 'Maximum price must not exceed 999999.99'
    }),

  minRating: Joi.number()
    .min(VALIDATION.MIN_RATING)
    .max(VALIDATION.MAX_RATING)
    .optional()
    .messages({
      'number.min': 'Minimum rating must be at least 1.0',
      'number.max': 'Minimum rating must not exceed 5.0'
    }),

  sortBy: Joi.string()
    .valid('price:asc', 'price:desc', 'rating:asc', 'rating:desc')
    .default(VALIDATION.DEFAULT_SORT)
    .optional()
    .messages({
      'any.only': 'Sort option must be one of: price:asc, price:desc, rating:asc, rating:desc'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(VALIDATION.MAX_PAGE_SIZE)
    .default(VALIDATION.DEFAULT_PAGE_SIZE)
    .optional()
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': `Limit must not exceed ${VALIDATION.MAX_PAGE_SIZE}`
    }),

  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .optional()
    .messages({
      'number.min': 'Offset must be at least 0'
    })
}).custom((value, helpers) => {
  // Custom validation: maxPrice should be greater than or equal to minPrice
  if (value.minPrice !== undefined && value.maxPrice !== undefined) {
    if (value.maxPrice < value.minPrice) {
      return helpers.error('any.invalid', {
        message: 'Maximum price must be greater than or equal to minimum price'
      });
    }
  }
  return value;
});

/**
 * Hotel ID parameter validation schema
 */
const hotelIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'Hotel ID must be a number',
      'number.positive': 'Hotel ID must be a positive number',
      'any.required': 'Hotel ID is required'
    })
});

/**
 * Validate request against schema
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Request property to validate (query, params, body)
 * @returns {Function} - Express middleware function
 */
function validate(schema, source = 'query') {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation failed', {
        source,
        errors: errorDetails,
        data: dataToValidate
      });

      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Validation failed',
          details: errorDetails
        }
      });
    }

    // Replace request data with validated and sanitized values
    req[source] = value;
    next();
  };
}

/**
 * Middleware: Validate hotel search query parameters
 */
const validateSearchHotels = validate(searchHotelsSchema, 'query');

/**
 * Middleware: Validate hotel ID parameter
 */
const validateHotelId = validate(hotelIdSchema, 'params');

module.exports = {
  validateSearchHotels,
  validateHotelId,
  validate
};
