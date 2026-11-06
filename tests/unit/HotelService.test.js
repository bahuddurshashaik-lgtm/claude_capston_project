// Unit tests for HB-001: Hotel Service

const HotelService = require('../../src/services/HotelService');

describe('HotelService - HB-001', () => {
  let hotelService;

  beforeEach(() => {
    hotelService = new HotelService();
    // Add sample hotels
    hotelService.addHotel({
      id: 1,
      name: 'Grand Plaza',
      location: 'New York, NY',
      pricePerNight: 250,
      rating: 4.5,
      amenities: ['WiFi', 'Pool'],
      availability: true
    });
    hotelService.addHotel({
      id: 2,
      name: 'Beach Resort',
      location: 'Miami, FL',
      pricePerNight: 350,
      rating: 4.8,
      amenities: ['WiFi', 'Beach'],
      availability: true
    });
    hotelService.addHotel({
      id: 3,
      name: 'City Inn',
      location: 'New York, NY',
      pricePerNight: 150,
      rating: 4.2,
      amenities: ['WiFi'],
      availability: false
    });
  });

  describe('addHotel', () => {
    test('should add hotel to collection', () => {
      const result = hotelService.addHotel({
        id: 4,
        name: 'Test Hotel',
        location: 'Test City',
        pricePerNight: 200,
        rating: 4.0,
        amenities: ['WiFi'],
        availability: true
      });

      expect(result.id).toBe(4);
      expect(hotelService.getAllHotels()).toHaveLength(4);
    });
  });

  describe('getAllHotels', () => {
    test('should return all hotels', () => {
      const hotels = hotelService.getAllHotels();

      expect(hotels).toHaveLength(3);
    });
  });

  describe('getHotelById', () => {
    test('should return hotel by id', () => {
      const hotel = hotelService.getHotelById(1);

      expect(hotel.name).toBe('Grand Plaza');
    });

    test('should return undefined for non-existent id', () => {
      const hotel = hotelService.getHotelById(999);

      expect(hotel).toBeUndefined();
    });
  });

  describe('searchHotels', () => {
    test('should return all hotels with no filters', () => {
      const results = hotelService.searchHotels();

      expect(results).toHaveLength(3);
    });

    test('should filter by location', () => {
      const results = hotelService.searchHotels({ location: 'New York' });

      expect(results).toHaveLength(2);
    });

    test('should filter by price range', () => {
      const results = hotelService.searchHotels({
        minPrice: 200,
        maxPrice: 300
      });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Grand Plaza');
    });

    test('should filter by rating', () => {
      const results = hotelService.searchHotels({ minRating: 4.5 });

      expect(results).toHaveLength(2);
    });

    test('should sort results', () => {
      const results = hotelService.searchHotels({ sortBy: 'price-asc' });

      expect(results[0].pricePerNight).toBe(150);
      expect(results[2].pricePerNight).toBe(350);
    });

    test('should apply multiple filters', () => {
      const results = hotelService.searchHotels({
        location: 'New York',
        minPrice: 200,
        minRating: 4.0,
        sortBy: 'rating'
      });

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Grand Plaza');
    });
  });

  describe('checkAvailability', () => {
    test('should return available for available hotel', () => {
      const result = hotelService.checkAvailability(1, '2026-12-01', '2026-12-05');

      expect(result.available).toBe(true);
    });

    test('should return unavailable for unavailable hotel', () => {
      const result = hotelService.checkAvailability(3, '2026-12-01', '2026-12-05');

      expect(result.available).toBe(false);
    });

    test('should return error for non-existent hotel', () => {
      const result = hotelService.checkAvailability(999, '2026-12-01', '2026-12-05');

      expect(result.available).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});
