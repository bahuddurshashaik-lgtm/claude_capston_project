/**
 * Hotel Controller
 * HTTP request handlers for hotel endpoints
 * HB-001: Hotel Search and Browse
 */

const hotelService = require('../services/hotelService');
const { HTTP_STATUS, ERROR_CODES } = require('../utils/constants');
const { createLogger } = require('../utils/logger');

const logger = createLogger('hotelController');

/**
 * Search hotels with filters
 * GET /api/v1/hotels/search
 *
 * Query parameters:
 * - location: string (optional) - City or region to search
 * - minPrice: number (optional) - Minimum price per night
 * - maxPrice: number (optional) - Maximum price per night
 * - minRating: number (optional) - Minimum rating (1.0-5.0)
 * - sortBy: string (optional) - Sort order: price:asc, price:desc, rating:asc, rating:desc
 * - limit: number (optional) - Results per page (default: 100, max: 100)
 * - offset: number (optional) - Pagination offset (default: 0)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function searchHotels(req, res, next) {
  try {
    logger.info('Search hotels request', { query: req.query });

    const filters = {
      location: req.query.location,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      minRating: req.query.minRating,
      sortBy: req.query.sortBy,
      limit: req.query.limit,
      offset: req.query.offset
    };

    const result = await hotelService.searchHotels(filters);

    logger.info('Search hotels success', {
      resultCount: result.hotels.length,
      totalCount: result.pagination.total
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.hotels,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Search hotels error', { error: error.message });
    next(error);
  }
}

/**
 * Get hotel by ID
 * GET /api/v1/hotels/:id
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function getHotelById(req, res, next) {
  try {
    const hotelId = req.params.id;

    logger.info('Get hotel by ID request', { hotelId });

    const hotel = await hotelService.getHotelById(hotelId);

    if (!hotel) {
      logger.info('Hotel not found', { hotelId });

      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: {
          code: ERROR_CODES.HOTEL_NOT_FOUND,
          message: 'Hotel not found'
        }
      });
    }

    logger.info('Get hotel by ID success', { hotelId });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    logger.error('Get hotel by ID error', {
      hotelId: req.params.id,
      error: error.message
    });
    next(error);
  }
}

/**
 * Get all hotels with pagination
 * GET /api/v1/hotels
 *
 * Query parameters:
 * - limit: number (optional) - Results per page (default: 100, max: 100)
 * - offset: number (optional) - Pagination offset (default: 0)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function getAllHotels(req, res, next) {
  try {
    logger.info('Get all hotels request', { query: req.query });

    const options = {
      limit: req.query.limit,
      offset: req.query.offset
    };

    const result = await hotelService.getAllHotels(options);

    logger.info('Get all hotels success', {
      resultCount: result.hotels.length,
      totalCount: result.pagination.total
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: result.hotels,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Get all hotels error', { error: error.message });
    next(error);
  }
}

/**
 * Health check endpoint
 * GET /api/v1/health
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function healthCheck(req, res) {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
}

module.exports = {
  searchHotels,
  getHotelById,
  getAllHotels,
  healthCheck
};
