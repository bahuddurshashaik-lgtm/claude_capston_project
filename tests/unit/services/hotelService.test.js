/**
 * Hotel Service Unit Tests
 * Tests for business logic layer
 */

const hotelService = require('../../../src/services/hotelService');
const hotelRepository = require('../../../src/repositories/hotelRepository');
const { ERROR_CODES } = require('../../../src/utils/constants');

// Mock the repository
jest.mock('../../../src/repositories/hotelRepository');

describe('Hotel Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchHotels', () => {
    it('should search hotels and load amenities separately (H-2 FIX)', async () => {
      const mockHotels = [
        {
          id: 1,
          name: 'Test Hotel',
          amenities: [],
          toJSON: jest.fn().mockReturnValue({ id: 1, name: 'Test Hotel' })
        }
      ];

      const mockAmenitiesMap = {
        1: ['WiFi', 'Pool']
      };

      hotelRepository.searchHotels.mockResolvedValue(mockHotels);
      hotelRepository.loadAmenitiesForHotels.mockResolvedValue(mockAmenitiesMap);
      hotelRepository.countHotels.mockResolvedValue(1);

      const result = await hotelService.searchHotels({ location: 'Miami' });

      expect(result.hotels).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(hotelRepository.searchHotels).toHaveBeenCalled();
      expect(hotelRepository.loadAmenitiesForHotels).toHaveBeenCalledWith([1]);
      expect(mockHotels[0].amenities).toEqual(['WiFi', 'Pool']);
    });

    it('should sanitize and validate filters', async () => {
      hotelRepository.searchHotels.mockResolvedValue([]);
      hotelRepository.loadAmenitiesForHotels.mockResolvedValue({});
      hotelRepository.countHotels.mockResolvedValue(0);

      await hotelService.searchHotels({
        location: '  Miami  ',
        minPrice: '100',
        maxPrice: '300',
        minRating: '4.5'
      });

      expect(hotelRepository.searchHotels).toHaveBeenCalledWith({
        location: 'Miami',
        minPrice: 100,
        maxPrice: 300,
        minRating: 4.5,
        sortBy: 'rating:desc',
        limit: 100,
        offset: 0
      });
    });

    it('should limit results to maximum 100', async () => {
      hotelRepository.searchHotels.mockResolvedValue([]);
      hotelRepository.loadAmenitiesForHotels.mockResolvedValue({});
      hotelRepository.countHotels.mockResolvedValue(0);

      await hotelService.searchHotels({ limit: 500 });

      expect(hotelRepository.searchHotels).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 })
      );
    });

    it('should handle repository errors', async () => {
      hotelRepository.searchHotels.mockRejectedValue(new Error('Database error'));

      await expect(hotelService.searchHotels({})).rejects.toMatchObject({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to search hotels'
      });
    });
  });

  describe('getHotelById', () => {
    it('should get hotel by ID with amenities', async () => {
      const mockHotel = {
        id: 1,
        name: 'Test Hotel',
        amenities: [],
        toJSON: jest.fn().mockReturnValue({ id: 1, name: 'Test Hotel' })
      };

      hotelRepository.findById.mockResolvedValue(mockHotel);
      hotelRepository.loadAmenitiesForHotel.mockResolvedValue(['WiFi', 'Pool']);

      const result = await hotelService.getHotelById(1);

      expect(result).toBeDefined();
      expect(hotelRepository.findById).toHaveBeenCalledWith(1);
      expect(hotelRepository.loadAmenitiesForHotel).toHaveBeenCalledWith(1);
      expect(mockHotel.amenities).toEqual(['WiFi', 'Pool']);
    });

    it('should return null if hotel not found', async () => {
      hotelRepository.findById.mockResolvedValue(null);

      const result = await hotelService.getHotelById(999);

      expect(result).toBeNull();
    });

    it('should validate hotel ID', async () => {
      await expect(hotelService.getHotelById('invalid')).rejects.toMatchObject({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid hotel ID'
      });

      await expect(hotelService.getHotelById(-1)).rejects.toMatchObject({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid hotel ID'
      });
    });

    it('should handle repository errors', async () => {
      hotelRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(hotelService.getHotelById(1)).rejects.toMatchObject({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to retrieve hotel'
      });
    });
  });

  describe('getAllHotels', () => {
    it('should get all hotels with amenities', async () => {
      const mockHotels = [
        {
          id: 1,
          amenities: [],
          toJSON: jest.fn().mockReturnValue({ id: 1 })
        },
        {
          id: 2,
          amenities: [],
          toJSON: jest.fn().mockReturnValue({ id: 2 })
        }
      ];

      const mockAmenitiesMap = {
        1: ['WiFi'],
        2: ['Pool']
      };

      hotelRepository.findAll.mockResolvedValue(mockHotels);
      hotelRepository.loadAmenitiesForHotels.mockResolvedValue(mockAmenitiesMap);
      hotelRepository.countHotels.mockResolvedValue(2);

      const result = await hotelService.getAllHotels({});

      expect(result.hotels).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(mockHotels[0].amenities).toEqual(['WiFi']);
      expect(mockHotels[1].amenities).toEqual(['Pool']);
    });

    it('should apply pagination limits', async () => {
      hotelRepository.findAll.mockResolvedValue([]);
      hotelRepository.loadAmenitiesForHotels.mockResolvedValue({});
      hotelRepository.countHotels.mockResolvedValue(0);

      await hotelService.getAllHotels({ limit: 50, offset: 10 });

      expect(hotelRepository.findAll).toHaveBeenCalledWith({
        limit: 50,
        offset: 10
      });
    });
  });
});
