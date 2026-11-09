/**
 * Hotel Repository
 * Data access layer for hotels with optimized queries
 * HB-001: Hotel Search and Browse
 *
 * CRITICAL FIXES:
 * - H-2 FIX: Load amenities separately, NOT in search query
 * - Uses pg_trgm indexes for efficient ILIKE queries
 */

const db = require('../config/database');
const Hotel = require('../models/Hotel');
const { createLogger } = require('../utils/logger');

const logger = createLogger('hotelRepository');

/**
 * Search hotels with filters (WITHOUT amenities - H-2 FIX)
 * @param {Object} filters - Search filters
 * @param {string} filters.location - Location (city or region) to search
 * @param {number} filters.minPrice - Minimum price per night
 * @param {number} filters.maxPrice - Maximum price per night
 * @param {number} filters.minRating - Minimum rating
 * @param {string} filters.sortBy - Sort option (price:asc, price:desc, rating:asc, rating:desc)
 * @param {number} filters.limit - Maximum results to return
 * @param {number} filters.offset - Offset for pagination
 * @returns {Promise<Array<Hotel>>} - Array of hotels
 */
async function searchHotels(filters = {}) {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      minRating,
      sortBy = 'rating:desc',
      limit = 100,
      offset = 0
    } = filters;

    logger.info('Searching hotels', { filters });

    // Build query
    let query = db('hotels')
      .where('is_active', true)
      .select(
        'id',
        'name',
        'description',
        'city',
        'region',
        'address',
        'price_per_night',
        'rating',
        'is_active',
        'created_at',
        'updated_at'
      );

    // Location filter with ILIKE for fuzzy matching (uses pg_trgm indexes - H-1 FIX)
    if (location) {
      const locationLower = location.toLowerCase();
      query = query.where(function() {
        this.whereRaw('LOWER(city) LIKE ?', [`%${locationLower}%`])
          .orWhereRaw('LOWER(region) LIKE ?', [`%${locationLower}%`]);
      });
    }

    // Price range filter
    if (minPrice !== undefined) {
      query = query.where('price_per_night', '>=', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.where('price_per_night', '<=', maxPrice);
    }

    // Rating filter
    if (minRating !== undefined) {
      query = query.where('rating', '>=', minRating);
    }

    // Sorting
    const [sortField, sortOrder] = sortBy.split(':');
    if (sortField === 'price') {
      query = query.orderBy('price_per_night', sortOrder || 'asc');
    } else if (sortField === 'rating') {
      query = query.orderBy('rating', sortOrder || 'desc');
    }

    // Pagination
    query = query.limit(limit).offset(offset);

    const rows = await query;

    logger.info('Hotels search completed', { count: rows.length });

    return Hotel.fromDatabaseArray(rows);
  } catch (error) {
    logger.error('Error searching hotels', { error: error.message, stack: error.stack });
    throw error;
  }
}

/**
 * Get hotel by ID (WITHOUT amenities - H-2 FIX)
 * @param {number} hotelId - Hotel ID
 * @returns {Promise<Hotel|null>} - Hotel instance or null
 */
async function findById(hotelId) {
  try {
    logger.info('Finding hotel by ID', { hotelId });

    const row = await db('hotels')
      .where({ id: hotelId })
      .first();

    if (!row) {
      logger.info('Hotel not found', { hotelId });
      return null;
    }

    return Hotel.fromDatabase(row);
  } catch (error) {
    logger.error('Error finding hotel by ID', { hotelId, error: error.message });
    throw error;
  }
}

/**
 * Load amenities for a single hotel (H-2 FIX - SEPARATE METHOD)
 * @param {number} hotelId - Hotel ID
 * @returns {Promise<Array<string>>} - Array of amenity names
 */
async function loadAmenitiesForHotel(hotelId) {
  try {
    const amenities = await db('hotel_amenities')
      .join('amenities', 'hotel_amenities.amenity_id', 'amenities.id')
      .where('hotel_amenities.hotel_id', hotelId)
      .select('amenities.name', 'amenities.icon')
      .orderBy('amenities.display_order');

    return amenities.map(a => a.name);
  } catch (error) {
    logger.error('Error loading amenities for hotel', { hotelId, error: error.message });
    throw error;
  }
}

/**
 * Load amenities for multiple hotels (H-2 FIX - SEPARATE METHOD)
 * Optimized: Single query with IN clause instead of N+1 queries
 * @param {Array<number>} hotelIds - Array of hotel IDs
 * @returns {Promise<Object>} - Map of hotelId => Array of amenity names
 */
async function loadAmenitiesForHotels(hotelIds) {
  try {
    if (!hotelIds || hotelIds.length === 0) {
      return {};
    }

    const amenities = await db('hotel_amenities')
      .join('amenities', 'hotel_amenities.amenity_id', 'amenities.id')
      .whereIn('hotel_amenities.hotel_id', hotelIds)
      .select(
        'hotel_amenities.hotel_id',
        'amenities.name',
        'amenities.icon'
      )
      .orderBy('amenities.display_order');

    // Group amenities by hotel_id
    const amenitiesMap = {};
    amenities.forEach(row => {
      if (!amenitiesMap[row.hotel_id]) {
        amenitiesMap[row.hotel_id] = [];
      }
      amenitiesMap[row.hotel_id].push(row.name);
    });

    return amenitiesMap;
  } catch (error) {
    logger.error('Error loading amenities for hotels', { hotelIds, error: error.message });
    throw error;
  }
}

/**
 * Get all hotels (without amenities)
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum results
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<Array<Hotel>>} - Array of hotels
 */
async function findAll(options = {}) {
  try {
    const { limit = 100, offset = 0 } = options;

    const rows = await db('hotels')
      .where('is_active', true)
      .limit(limit)
      .offset(offset)
      .orderBy('rating', 'desc');

    return Hotel.fromDatabaseArray(rows);
  } catch (error) {
    logger.error('Error finding all hotels', { error: error.message });
    throw error;
  }
}

/**
 * Count hotels matching filters
 * @param {Object} filters - Search filters
 * @returns {Promise<number>} - Count of matching hotels
 */
async function countHotels(filters = {}) {
  try {
    const { location, minPrice, maxPrice, minRating } = filters;

    let query = db('hotels')
      .where('is_active', true)
      .count('* as count');

    // Apply same filters as search
    if (location) {
      const locationLower = location.toLowerCase();
      query = query.where(function() {
        this.whereRaw('LOWER(city) LIKE ?', [`%${locationLower}%`])
          .orWhereRaw('LOWER(region) LIKE ?', [`%${locationLower}%`]);
      });
    }

    if (minPrice !== undefined) {
      query = query.where('price_per_night', '>=', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.where('price_per_night', '<=', maxPrice);
    }
    if (minRating !== undefined) {
      query = query.where('rating', '>=', minRating);
    }

    const result = await query.first();
    return parseInt(result.count, 10);
  } catch (error) {
    logger.error('Error counting hotels', { error: error.message });
    throw error;
  }
}

module.exports = {
  searchHotels,
  findById,
  loadAmenitiesForHotel,
  loadAmenitiesForHotels,
  findAll,
  countHotels
};
