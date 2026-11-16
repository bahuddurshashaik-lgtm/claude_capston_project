/**
 * Hotel Repository Unit Tests
 * Tests for data access layer
 */

const hotelRepository = require('../../../src/repositories/hotelRepository');
const db = require('../../../src/config/database');
const Hotel = require('../../../src/models/Hotel');

// Mock the database
jest.mock('../../../src/config/database');

describe('Hotel Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchHotels', () => {
    it('should search hotels without amenities (H-2 FIX)', async () => {
      const mockRows = [
        {
          id: 1,
          name: 'Test Hotel',
          city: 'Miami',
          region: 'Florida',
          price_per_night: 199.99,
          rating: 4.5,
          is_active: true
        }
      ];

      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        whereRaw: jest.fn().mockReturnThis(),
        orWhereRaw: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue(mockRows)
      };

      db.mockReturnValue(mockQuery);

      const results = await hotelRepository.searchHotels({ location: 'Miami' });

      expect(results).toHaveLength(1);
      expect(results[0]).toBeInstanceOf(Hotel);
      expect(mockQuery.where).toHaveBeenCalledWith('is_active', true);
    });

    it('should apply location filter with ILIKE', async () => {
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        whereRaw: jest.fn().mockReturnThis(),
        orWhereRaw: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([])
      };

      db.mockReturnValue(mockQuery);

      await hotelRepository.searchHotels({ location: 'Miami' });

      expect(mockQuery.where).toHaveBeenCalled();
    });

    it('should apply price range filters', async () => {
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([])
      };

      db.mockReturnValue(mockQuery);

      await hotelRepository.searchHotels({ minPrice: 100, maxPrice: 300 });

      expect(mockQuery.where).toHaveBeenCalledWith('price_per_night', '>=', 100);
      expect(mockQuery.where).toHaveBeenCalledWith('price_per_night', '<=', 300);
    });

    it('should apply rating filter', async () => {
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([])
      };

      db.mockReturnValue(mockQuery);

      await hotelRepository.searchHotels({ minRating: 4.0 });

      expect(mockQuery.where).toHaveBeenCalledWith('rating', '>=', 4.0);
    });

    it('should apply sorting', async () => {
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([])
      };

      db.mockReturnValue(mockQuery);

      await hotelRepository.searchHotels({ sortBy: 'price:asc' });

      expect(mockQuery.orderBy).toHaveBeenCalledWith('price_per_night', 'asc');
    });

    it('should apply pagination', async () => {
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([])
      };

      db.mockReturnValue(mockQuery);

      await hotelRepository.searchHotels({ limit: 50, offset: 10 });

      expect(mockQuery.limit).toHaveBeenCalledWith(50);
      expect(mockQuery.offset).toHaveBeenCalledWith(10);
    });
  });

  describe('findById', () => {
    it('should find hotel by ID without amenities', async () => {
      const mockRow = {
        id: 1,
        name: 'Test Hotel',
        city: 'Miami',
        price_per_night: 199.99
      };

      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockRow)
      };

      db.mockReturnValue(mockQuery);

      const hotel = await hotelRepository.findById(1);

      expect(hotel).toBeInstanceOf(Hotel);
      expect(hotel.id).toBe(1);
      expect(mockQuery.where).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if hotel not found', async () => {
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null)
      };

      db.mockReturnValue(mockQuery);

      const hotel = await hotelRepository.findById(999);

      expect(hotel).toBeNull();
    });
  });

  describe('loadAmenitiesForHotel', () => {
    it('should load amenities for a single hotel (H-2 FIX)', async () => {
      const mockAmenities = [
        { name: 'WiFi', icon: 'wifi' },
        { name: 'Pool', icon: 'pool' }
      ];

      const mockQuery = {
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockAmenities)
      };

      db.mockReturnValue(mockQuery);

      const amenities = await hotelRepository.loadAmenitiesForHotel(1);

      expect(amenities).toEqual(['WiFi', 'Pool']);
      expect(mockQuery.join).toHaveBeenCalled();
      expect(mockQuery.where).toHaveBeenCalledWith('hotel_amenities.hotel_id', 1);
    });
  });

  describe('loadAmenitiesForHotels', () => {
    it('should load amenities for multiple hotels in single query (H-2 FIX)', async () => {
      const mockAmenities = [
        { hotel_id: 1, name: 'WiFi' },
        { hotel_id: 1, name: 'Pool' },
        { hotel_id: 2, name: 'WiFi' }
      ];

      const mockQuery = {
        join: jest.fn().mockReturnThis(),
        whereIn: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockResolvedValue(mockAmenities)
      };

      db.mockReturnValue(mockQuery);

      const amenitiesMap = await hotelRepository.loadAmenitiesForHotels([1, 2]);

      expect(amenitiesMap[1]).toEqual(['WiFi', 'Pool']);
      expect(amenitiesMap[2]).toEqual(['WiFi']);
      expect(mockQuery.whereIn).toHaveBeenCalledWith('hotel_amenities.hotel_id', [1, 2]);
    });

    it('should return empty object for empty hotel IDs array', async () => {
      const amenitiesMap = await hotelRepository.loadAmenitiesForHotels([]);

      expect(amenitiesMap).toEqual({});
    });
  });

  describe('countHotels', () => {
    it('should count hotels matching filters', async () => {
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        count: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue({ count: '25' })
      };

      db.mockReturnValue(mockQuery);

      const count = await hotelRepository.countHotels({});

      expect(count).toBe(25);
    });
  });
});
