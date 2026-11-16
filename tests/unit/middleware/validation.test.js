/**
 * Validation Middleware Unit Tests
 */

const { validateSearchHotels, validateHotelId } = require('../../../src/middleware/validation');
const { HTTP_STATUS, ERROR_CODES } = require('../../../src/utils/constants');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('validateSearchHotels', () => {
    it('should pass valid search parameters', () => {
      req.query = {
        location: 'Miami',
        minPrice: 100,
        maxPrice: 300,
        minRating: 4.0,
        sortBy: 'price:asc',
        limit: 50,
        offset: 0
      };

      validateSearchHotels(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should apply default values', () => {
      req.query = {};

      validateSearchHotels(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.query.sortBy).toBe('rating:desc');
      expect(req.query.limit).toBe(100);
      expect(req.query.offset).toBe(0);
    });

    it('should trim location string', () => {
      req.query = { location: '  Miami  ' };

      validateSearchHotels(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.query.location).toBe('Miami');
    });

    it('should reject location too short', () => {
      req.query = { location: 'a' };

      validateSearchHotels(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: ERROR_CODES.VALIDATION_ERROR
          })
        })
      );
    });

    it('should reject invalid minRating', () => {
      req.query = { minRating: 6.0 };

      validateSearchHotels(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });

    it('should reject invalid sortBy', () => {
      req.query = { sortBy: 'invalid' };

      validateSearchHotels(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });

    it('should reject maxPrice < minPrice', () => {
      req.query = { minPrice: 300, maxPrice: 100 };

      validateSearchHotels(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });

    it('should enforce maximum limit', () => {
      req.query = { limit: 200 };

      validateSearchHotels(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });

    it('should strip unknown fields', () => {
      req.query = {
        location: 'Miami',
        unknownField: 'should be removed'
      };

      validateSearchHotels(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.query.unknownField).toBeUndefined();
    });

    it('should return all validation errors', () => {
      req.query = {
        location: 'a',
        minRating: 10,
        sortBy: 'invalid',
        limit: 200
      };

      validateSearchHotels(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            details: expect.any(Array)
          })
        })
      );

      const errorDetails = res.json.mock.calls[0][0].error.details;
      expect(errorDetails.length).toBeGreaterThan(1);
    });
  });

  describe('validateHotelId', () => {
    it('should pass valid hotel ID', () => {
      req.params = { id: '1' };

      validateHotelId(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.params.id).toBe(1);
    });

    it('should reject non-numeric ID', () => {
      req.params = { id: 'invalid' };

      validateHotelId(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });

    it('should reject negative ID', () => {
      req.params = { id: '-1' };

      validateHotelId(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });

    it('should reject zero ID', () => {
      req.params = { id: '0' };

      validateHotelId(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
    });
  });
});
