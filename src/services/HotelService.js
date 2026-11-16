/**
 * Hotel Service
 * Business logic layer for hotel operations
 * HB-001: Hotel Search and Browse
 *
 * CRITICAL FIX:
 * - H-2: Amenities loaded separately after search, not during search
 */

const hotelRepository = require('../repositories/hotelRepository');
const { createLogger } = require('../utils/logger');
const { ERROR_CODES } = require('../utils/constants');

const logger = createLogger('hotelService');

/**
 * Search hotels with filters and load amenities separately (H-2 FIX)
 * @param {Object} filters - Search filters
 * @returns {Promise<Object>} - Search results with hotels and metadata
 */
async function searchHotels(filters = {}) {
  try {
    logger.info('Hotel search requested', { filters });

    // Validate and sanitize filters
    const sanitizedFilters = {
      location: filters.location ? filters.location.trim() : undefined,
      minPrice: filters.minPrice !== undefined ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice !== undefined ? parseFloat(filters.maxPrice) : undefined,
      minRating: filters.minRating !== undefined ? parseFloat(filters.minRating) : undefined,
      sortBy: filters.sortBy || 'rating:desc',
      limit: Math.min(filters.limit || 100, 100), // Max 100 results
      offset: filters.offset || 0
    };

    // Search hotels WITHOUT amenities (H-2 FIX)
    const hotels = await hotelRepository.searchHotels(sanitizedFilters);

    // Load amenities separately for all hotels in a single optimized query (H-2 FIX)
    const hotelIds = hotels.map(h => h.id);
    const amenitiesMap = await hotelRepository.loadAmenitiesForHotels(hotelIds);

    // Attach amenities to each hotel
    hotels.forEach(hotel => {
      hotel.amenities = amenitiesMap[hotel.id] || [];
    });

    // Get total count for pagination
    const totalCount = await hotelRepository.countHotels(sanitizedFilters);

    logger.info('Hotel search completed', {
      resultCount: hotels.length,
      totalCount,
      filters: sanitizedFilters
    });

    return {
      hotels: hotels.map(h => h.toJSON()),
      pagination: {
        total: totalCount,
        limit: sanitizedFilters.limit,
        offset: sanitizedFilters.offset,
        hasMore: sanitizedFilters.offset + hotels.length < totalCount
      }
    };
  } catch (error) {
    logger.error('Error in hotel search', { error: error.message, stack: error.stack });
    throw {
      code: ERROR_CODES.DATABASE_ERROR,
      message: 'Failed to search hotels',
      details: error.message
    };
  }
}

/**
 * Get hotel by ID with amenities
 * @param {number} hotelId - Hotel ID
 * @returns {Promise<Object|null>} - Hotel details or null
 */
async function getHotelById(hotelId) {
  try {
    logger.info('Get hotel by ID requested', { hotelId });

    // Validate hotel ID
    const id = parseInt(hotelId, 10);
    if (isNaN(id) || id <= 0) {
      throw {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid hotel ID'
      };
    }

    // Get hotel WITHOUT amenities (H-2 FIX)
    const hotel = await hotelRepository.findById(id);

    if (!hotel) {
      logger.info('Hotel not found', { hotelId: id });
      return null;
    }

    // Load amenities separately (H-2 FIX)
    hotel.amenities = await hotelRepository.loadAmenitiesForHotel(id);

    logger.info('Hotel found', { hotelId: id });

    return hotel.toJSON();
  } catch (error) {
    if (error.code) {
      throw error;
    }
    logger.error('Error getting hotel by ID', { hotelId, error: error.message });
    throw {
      code: ERROR_CODES.DATABASE_ERROR,
      message: 'Failed to retrieve hotel',
      details: error.message
    };
  }
}

/**
 * Get all hotels with pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Hotels with pagination metadata
 */
async function getAllHotels(options = {}) {
  try {
    logger.info('Get all hotels requested', { options });

    const limit = Math.min(options.limit || 100, 100);
    const offset = options.offset || 0;

    const hotels = await hotelRepository.findAll({ limit, offset });

    // Load amenities for all hotels
    const hotelIds = hotels.map(h => h.id);
    const amenitiesMap = await hotelRepository.loadAmenitiesForHotels(hotelIds);

    hotels.forEach(hotel => {
      hotel.amenities = amenitiesMap[hotel.id] || [];
    });

    // Count total hotels
    const totalCount = await hotelRepository.countHotels({});

    logger.info('Get all hotels completed', { count: hotels.length, totalCount });

    return {
      hotels: hotels.map(h => h.toJSON()),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + hotels.length < totalCount
      }
    };
  } catch (error) {
    logger.error('Error getting all hotels', { error: error.message });
    throw {
      code: ERROR_CODES.DATABASE_ERROR,
      message: 'Failed to retrieve hotels',
      details: error.message
    };
  }
}

module.exports = {
  searchHotels,
  getHotelById,
  getAllHotels
};
