/**
 * Validation Utilities
 * Reusable validation functions for input validation
 */

const validator = require('validator');
const { VALIDATION } = require('./constants');

/**
 * Validate location string
 * @param {string} location - Location name to validate
 * @returns {boolean} - True if valid
 */
function isValidLocation(location) {
  if (!location || typeof location !== 'string') {
    return false;
  }

  const trimmed = location.trim();
  return trimmed.length >= VALIDATION.LOCATION_MIN_LENGTH &&
         trimmed.length <= VALIDATION.LOCATION_MAX_LENGTH;
}

/**
 * Validate price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {boolean} - True if valid
 */
function isValidPriceRange(minPrice, maxPrice) {
  if (minPrice !== undefined && maxPrice !== undefined) {
    return minPrice <= maxPrice;
  }
  return true;
}

/**
 * Validate rating value
 * @param {number} rating - Rating value to validate
 * @returns {boolean} - True if valid
 */
function isValidRating(rating) {
  if (rating === undefined || rating === null) {
    return true;
  }

  const numRating = parseFloat(rating);
  return !isNaN(numRating) &&
         numRating >= VALIDATION.MIN_RATING &&
         numRating <= VALIDATION.MAX_RATING;
}

/**
 * Sanitize input string to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return validator.escape(input.trim());
}

/**
 * Validate sort option
 * @param {string} sortBy - Sort option
 * @returns {boolean} - True if valid
 */
function isValidSortOption(sortBy) {
  const validOptions = ['price:asc', 'price:desc', 'rating:asc', 'rating:desc'];
  return validOptions.includes(sortBy);
}

module.exports = {
  isValidLocation,
  isValidPriceRange,
  isValidRating,
  sanitizeInput,
  isValidSortOption
};
