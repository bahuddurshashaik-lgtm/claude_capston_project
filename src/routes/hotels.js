/**
 * Hotel Routes
 * API routes for hotel search and retrieval
 * HB-001: Hotel Search and Browse
 *
 * All routes use /api/v1/ prefix (M-3 FIX)
 */

const express = require('express');
const hotelController = require('../controllers/hotelController');
const { validateSearchHotels, validateHotelId } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');
const { searchLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * @route   GET /api/v1/hotels/search
 * @desc    Search hotels with filters
 * @access  Public
 * @query   location, minPrice, maxPrice, minRating, sortBy, limit, offset
 */
router.get(
  '/search',
  searchLimiter, // Apply rate limiting to search endpoint
  validateSearchHotels, // Validate query parameters
  asyncHandler(hotelController.searchHotels)
);

/**
 * @route   GET /api/v1/hotels/:id
 * @desc    Get hotel by ID
 * @access  Public
 * @params  id - Hotel ID
 */
router.get(
  '/:id',
  validateHotelId, // Validate hotel ID parameter
  asyncHandler(hotelController.getHotelById)
);

/**
 * @route   GET /api/v1/hotels
 * @desc    Get all hotels with pagination
 * @access  Public
 * @query   limit, offset
 */
router.get(
  '/',
  validateSearchHotels, // Reuse validation for pagination params
  asyncHandler(hotelController.getAllHotels)
);

module.exports = router;
