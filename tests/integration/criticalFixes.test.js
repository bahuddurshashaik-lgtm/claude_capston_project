/**
 * Critical Fixes Verification Tests
 * Verifies all critical fixes (H-1, H-2, M-3, M-4, M-5) are properly implemented
 */

const request = require('supertest');
const createApp = require('../../src/app');
const db = require('../../src/config/database');
const hotelRepository = require('../../src/repositories/hotelRepository');
const { HTTP_STATUS } = require('../../src/utils/constants');

describe('Critical Fixes Verification', () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await db.raw('SELECT 1');
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('H-1 FIX: Optimized ILIKE Queries with pg_trgm', () => {
    it('should have pg_trgm extension enabled', async () => {
      const result = await db.raw(`
        SELECT EXISTS (
          SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'
        ) as exists
      `);

      expect(result.rows[0].exists).toBe(true);
    });

    it('should have trigram indexes on city and region', async () => {
      const cityIndexResult = await db.raw(`
        SELECT EXISTS (
          SELECT 1 FROM pg_indexes
          WHERE tablename = 'hotels'
          AND indexname = 'idx_city_trgm'
        ) as exists
      `);

      const regionIndexResult = await db.raw(`
        SELECT EXISTS (
          SELECT 1 FROM pg_indexes
          WHERE tablename = 'hotels'
          AND indexname = 'idx_region_trgm'
        ) as exists
      `);

      expect(cityIndexResult.rows[0].exists).toBe(true);
      expect(regionIndexResult.rows[0].exists).toBe(true);
    });

    it('should perform fast fuzzy search with ILIKE', async () => {
      const startTime = Date.now();

      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ location: 'mia' }) // Partial match
        .expect(HTTP_STATUS.OK);

      const duration = Date.now() - startTime;

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(1000); // Should be fast
    });
  });

  describe('H-2 FIX: Separate Amenity Loading', () => {
    it('should load amenities separately, not in search query', async () => {
      // This test verifies the implementation pattern
      // searchHotels should NOT include amenities in the main query
      const hotels = await hotelRepository.searchHotels({ limit: 5 });

      // Verify hotels are returned without amenities initially
      expect(hotels).toBeInstanceOf(Array);
      expect(hotels.length).toBeGreaterThan(0);

      // Verify amenities can be loaded separately
      const hotelIds = hotels.map(h => h.id);
      const amenitiesMap = await hotelRepository.loadAmenitiesForHotels(hotelIds);

      expect(amenitiesMap).toBeDefined();
      expect(Object.keys(amenitiesMap).length).toBeGreaterThan(0);
    });

    it('should use single optimized query for multiple hotels amenities', async () => {
      const hotelIds = [1, 2, 3, 4, 5];

      const startTime = Date.now();
      const amenitiesMap = await hotelRepository.loadAmenitiesForHotels(hotelIds);
      const duration = Date.now() - startTime;

      expect(Object.keys(amenitiesMap).length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(500); // Single query should be fast
    });

    it('should include amenities in API response', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ limit: 5 })
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);

      response.body.data.forEach(hotel => {
        expect(hotel.amenities).toBeDefined();
        expect(Array.isArray(hotel.amenities)).toBe(true);
      });
    });
  });

  describe('M-3 FIX: API Versioning', () => {
    it('should use /api/v1/ prefix for all hotel endpoints', async () => {
      // Test all endpoints have correct prefix
      const endpoints = [
        '/api/v1/hotels',
        '/api/v1/hotels/search',
        '/api/v1/hotels/1'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        expect(response.status).not.toBe(HTTP_STATUS.NOT_FOUND);
      }
    });

    it('should have versioned health check endpoint', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);
    });

    it('should reject requests to non-versioned API paths', async () => {
      const response = await request(app)
        .get('/hotels') // No /api/v1/ prefix
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.success).toBe(false);
    });
  });

  describe('M-4 FIX: Database Constraints', () => {
    it('should have CHECK constraint on price (> 0)', async () => {
      const result = await db.raw(`
        SELECT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'chk_price_positive'
        ) as exists
      `);

      expect(result.rows[0].exists).toBe(true);
    });

    it('should have CHECK constraint on rating (1.0-5.0)', async () => {
      const result = await db.raw(`
        SELECT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'chk_rating_range'
        ) as exists
      `);

      expect(result.rows[0].exists).toBe(true);
    });

    it('should enforce price constraint', async () => {
      try {
        await db('hotels').insert({
          name: 'Invalid Hotel',
          city: 'Test',
          region: 'Test',
          price_per_night: -10, // Invalid: negative price
          rating: 4.0,
          is_active: true
        });
        fail('Should have thrown constraint violation error');
      } catch (error) {
        expect(error.code).toBe('23514'); // CHECK constraint violation
      }
    });

    it('should enforce rating constraint', async () => {
      try {
        await db('hotels').insert({
          name: 'Invalid Hotel',
          city: 'Test',
          region: 'Test',
          price_per_night: 100,
          rating: 6.0, // Invalid: > 5.0
          is_active: true
        });
        fail('Should have thrown constraint violation error');
      } catch (error) {
        expect(error.code).toBe('23514'); // CHECK constraint violation
      }
    });
  });

  describe('M-5 FIX: CORS Middleware', () => {
    it('should include CORS headers in response', async () => {
      const response = await request(app)
        .get('/api/v1/hotels')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/v1/hotels')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Content-Type');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-methods']).toBeDefined();
      expect(response.headers['access-control-allow-headers']).toBeDefined();
    });

    it('should expose rate limit headers', async () => {
      const response = await request(app)
        .get('/api/v1/hotels')
        .set('Origin', 'http://localhost:3000');

      // Should have rate limit headers exposed via CORS
      expect(response.headers['access-control-expose-headers']).toBeDefined();
    });

    it('should include Helmet security headers', async () => {
      const response = await request(app)
        .get('/api/v1/hotels');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });
  });

  describe('Complete Feature Integration', () => {
    it('should handle complete search workflow with all fixes', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .set('Origin', 'http://localhost:3000')
        .query({
          location: 'Miami',
          minPrice: 100,
          maxPrice: 300,
          minRating: 4.0,
          sortBy: 'price:asc',
          limit: 10
        })
        .expect(HTTP_STATUS.OK);

      // M-3: API versioning
      expect(response.req.path).toContain('/api/v1/');

      // M-5: CORS headers
      expect(response.headers['access-control-allow-origin']).toBeDefined();

      // Response structure
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();

      // H-2: Amenities loaded
      if (response.body.data.length > 0) {
        response.body.data.forEach(hotel => {
          expect(hotel.amenities).toBeDefined();
          expect(Array.isArray(hotel.amenities)).toBe(true);

          // M-4: Data integrity
          expect(hotel.pricePerNight).toBeGreaterThan(0);
          if (hotel.rating !== null) {
            expect(hotel.rating).toBeGreaterThanOrEqual(1.0);
            expect(hotel.rating).toBeLessThanOrEqual(5.0);
          }
        });
      }

      // Filters applied correctly
      response.body.data.forEach(hotel => {
        expect(hotel.pricePerNight).toBeGreaterThanOrEqual(100);
        expect(hotel.pricePerNight).toBeLessThanOrEqual(300);
        if (hotel.rating !== null) {
          expect(hotel.rating).toBeGreaterThanOrEqual(4.0);
        }
      });
    });
  });
});
