/**
 * Hotel API Integration Tests
 * End-to-end tests for hotel search and retrieval endpoints
 * Tests M-3 (API versioning) and M-5 (CORS) fixes
 */

const request = require('supertest');
const createApp = require('../../src/app');
const db = require('../../src/config/database');
const { HTTP_STATUS } = require('../../src/utils/constants');

describe('Hotel API Integration Tests', () => {
  let app;

  beforeAll(async () => {
    app = createApp();

    // Ensure database is connected
    await db.raw('SELECT 1');
  });

  afterAll(async () => {
    // Close database connection
    await db.destroy();
  });

  describe('Health Check Endpoints', () => {
    it('should respond to /health endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('healthy');
    });

    it('should respond to /api/v1/health endpoint (M-3 FIX)', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('healthy');
    });
  });

  describe('GET /api/v1/hotels - Get All Hotels', () => {
    it('should get all hotels with default pagination', async () => {
      const response = await request(app)
        .get('/api/v1/hotels')
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBeGreaterThan(0);
    });

    it('should support pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/hotels')
        .query({ limit: 5, offset: 0 })
        .expect(HTTP_STATUS.OK);

      expect(response.body.data.length).toBeLessThanOrEqual(5);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('should include CORS headers (M-5 FIX)', async () => {
      const response = await request(app)
        .get('/api/v1/hotels')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('GET /api/v1/hotels/search - Search Hotels', () => {
    it('should search hotels by location', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ location: 'Miami' })
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);

      if (response.body.data.length > 0) {
        const hotel = response.body.data[0];
        expect(hotel.location.city.toLowerCase()).toContain('miami');
      }
    });

    it('should search hotels by price range', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ minPrice: 100, maxPrice: 200 })
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);

      response.body.data.forEach(hotel => {
        expect(hotel.pricePerNight).toBeGreaterThanOrEqual(100);
        expect(hotel.pricePerNight).toBeLessThanOrEqual(200);
      });
    });

    it('should search hotels by minimum rating', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ minRating: 4.5 })
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);

      response.body.data.forEach(hotel => {
        if (hotel.rating !== null) {
          expect(hotel.rating).toBeGreaterThanOrEqual(4.5);
        }
      });
    });

    it('should sort hotels by price ascending', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ sortBy: 'price:asc', limit: 10 })
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);

      if (response.body.data.length > 1) {
        for (let i = 1; i < response.body.data.length; i++) {
          expect(response.body.data[i].pricePerNight)
            .toBeGreaterThanOrEqual(response.body.data[i - 1].pricePerNight);
        }
      }
    });

    it('should sort hotels by rating descending', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ sortBy: 'rating:desc', limit: 10 })
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);

      if (response.body.data.length > 1) {
        for (let i = 1; i < response.body.data.length; i++) {
          const currentRating = response.body.data[i].rating || 0;
          const previousRating = response.body.data[i - 1].rating || 0;
          expect(currentRating).toBeLessThanOrEqual(previousRating);
        }
      }
    });

    it('should include amenities in search results (H-2 FIX)', async () => {
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

    it('should combine multiple search filters', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({
          location: 'New York',
          minPrice: 200,
          maxPrice: 500,
          minRating: 4.0,
          sortBy: 'price:asc'
        })
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);

      response.body.data.forEach(hotel => {
        expect(hotel.pricePerNight).toBeGreaterThanOrEqual(200);
        expect(hotel.pricePerNight).toBeLessThanOrEqual(500);
        if (hotel.rating !== null) {
          expect(hotel.rating).toBeGreaterThanOrEqual(4.0);
        }
      });
    });
  });

  describe('GET /api/v1/hotels/:id - Get Hotel by ID', () => {
    it('should get hotel by ID with amenities', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/1')
        .expect(HTTP_STATUS.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.amenities).toBeDefined();
      expect(Array.isArray(response.body.data.amenities)).toBe(true);
    });

    it('should return 404 for non-existent hotel', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/99999')
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('HOTEL_NOT_FOUND');
    });

    it('should return 400 for invalid hotel ID', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/invalid')
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Validation Tests', () => {
    it('should reject invalid location (too short)', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ location: 'a' })
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid minRating', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ minRating: 6.0 })
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid sortBy option', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ sortBy: 'invalid' })
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject maxPrice < minPrice', async () => {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ minPrice: 300, maxPrice: 100 })
        .expect(HTTP_STATUS.BAD_REQUEST);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Rate Limiting Tests', () => {
    it('should enforce rate limiting on search endpoint', async () => {
      // Make 61 requests (limit is 60 per minute for search)
      const requests = [];
      for (let i = 0; i < 61; i++) {
        requests.push(
          request(app)
            .get('/api/v1/hotels/search')
            .query({ location: 'Miami' })
        );
      }

      const responses = await Promise.all(requests);
      const rateLimitedResponse = responses.find(r => r.status === HTTP_STATUS.TOO_MANY_REQUESTS);

      // At least one request should be rate limited
      expect(rateLimitedResponse).toBeDefined();
      if (rateLimitedResponse) {
        expect(rateLimitedResponse.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
      }
    }, 30000); // Increase timeout for this test
  });

  describe('404 Not Found Handler', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/api/v1/undefined-route')
        .expect(HTTP_STATUS.NOT_FOUND);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Security Headers Tests (M-5 FIX)', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/v1/health');

      // Check for helmet security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-xss-protection']).toBeDefined();
    });

    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/v1/hotels')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });
  });
});
