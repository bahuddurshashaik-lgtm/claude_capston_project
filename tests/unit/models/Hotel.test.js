/**
 * Hotel Model Unit Tests
 * Tests for Hotel entity class
 */

const Hotel = require('../../../src/models/Hotel');

describe('Hotel Model', () => {
  const mockHotelData = {
    id: 1,
    name: 'Test Hotel',
    description: 'A test hotel',
    city: 'Miami',
    region: 'Florida',
    address: '123 Test St',
    price_per_night: 199.99,
    rating: 4.5,
    is_active: true,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-02'),
    amenities: ['WiFi', 'Pool']
  };

  describe('constructor', () => {
    it('should create a Hotel instance with all properties', () => {
      const hotel = new Hotel(mockHotelData);

      expect(hotel.id).toBe(1);
      expect(hotel.name).toBe('Test Hotel');
      expect(hotel.description).toBe('A test hotel');
      expect(hotel.city).toBe('Miami');
      expect(hotel.region).toBe('Florida');
      expect(hotel.address).toBe('123 Test St');
      expect(hotel.pricePerNight).toBe(199.99);
      expect(hotel.rating).toBe(4.5);
      expect(hotel.isActive).toBe(true);
      expect(hotel.amenities).toEqual(['WiFi', 'Pool']);
    });

    it('should handle null rating', () => {
      const dataWithNullRating = { ...mockHotelData, rating: null };
      const hotel = new Hotel(dataWithNullRating);

      expect(hotel.rating).toBeNull();
    });

    it('should default amenities to empty array if not provided', () => {
      const dataWithoutAmenities = { ...mockHotelData };
      delete dataWithoutAmenities.amenities;

      const hotel = new Hotel(dataWithoutAmenities);

      expect(hotel.amenities).toEqual([]);
    });

    it('should parse string prices to float', () => {
      const dataWithStringPrice = { ...mockHotelData, price_per_night: '299.99' };
      const hotel = new Hotel(dataWithStringPrice);

      expect(hotel.pricePerNight).toBe(299.99);
      expect(typeof hotel.pricePerNight).toBe('number');
    });
  });

  describe('toJSON', () => {
    it('should transform hotel to JSON with camelCase properties', () => {
      const hotel = new Hotel(mockHotelData);
      const json = hotel.toJSON();

      expect(json).toEqual({
        id: 1,
        name: 'Test Hotel',
        description: 'A test hotel',
        location: {
          city: 'Miami',
          region: 'Florida',
          address: '123 Test St'
        },
        pricePerNight: 199.99,
        rating: 4.5,
        amenities: ['WiFi', 'Pool'],
        isActive: true,
        createdAt: mockHotelData.created_at,
        updatedAt: mockHotelData.updated_at
      });
    });

    it('should group location fields in JSON output', () => {
      const hotel = new Hotel(mockHotelData);
      const json = hotel.toJSON();

      expect(json.location).toBeDefined();
      expect(json.location.city).toBe('Miami');
      expect(json.location.region).toBe('Florida');
      expect(json.location.address).toBe('123 Test St');
    });
  });

  describe('fromDatabase', () => {
    it('should create Hotel instance from database row', () => {
      const hotel = Hotel.fromDatabase(mockHotelData);

      expect(hotel).toBeInstanceOf(Hotel);
      expect(hotel.id).toBe(1);
      expect(hotel.name).toBe('Test Hotel');
    });
  });

  describe('fromDatabaseArray', () => {
    it('should create multiple Hotel instances from array of rows', () => {
      const rows = [
        mockHotelData,
        { ...mockHotelData, id: 2, name: 'Hotel Two' },
        { ...mockHotelData, id: 3, name: 'Hotel Three' }
      ];

      const hotels = Hotel.fromDatabaseArray(rows);

      expect(hotels).toHaveLength(3);
      expect(hotels[0]).toBeInstanceOf(Hotel);
      expect(hotels[1]).toBeInstanceOf(Hotel);
      expect(hotels[2]).toBeInstanceOf(Hotel);
      expect(hotels[0].id).toBe(1);
      expect(hotels[1].id).toBe(2);
      expect(hotels[2].id).toBe(3);
    });

    it('should handle empty array', () => {
      const hotels = Hotel.fromDatabaseArray([]);

      expect(hotels).toEqual([]);
    });
  });
});
