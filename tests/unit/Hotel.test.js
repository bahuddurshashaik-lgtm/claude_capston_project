// Unit tests for HB-001: Hotel Search and Browse

const Hotel = require('../../src/models/Hotel');

describe('Hotel Model - HB-001', () => {
  const sampleHotels = [
    new Hotel(1, 'Grand Plaza', 'New York, NY', 250, 4.5, ['WiFi', 'Pool'], true),
    new Hotel(2, 'Beach Resort', 'Miami, FL', 350, 4.8, ['WiFi', 'Beach'], true),
    new Hotel(3, 'City Inn', 'New York, NY', 150, 4.2, ['WiFi'], true),
    new Hotel(4, 'Mountain Lodge', 'Denver, CO', 200, 4.6, ['Hiking'], true),
  ];

  describe('Hotel Constructor', () => {
    test('should create hotel with all properties', () => {
      const hotel = new Hotel(1, 'Test Hotel', 'Test City', 100, 4.0, ['WiFi'], true);

      expect(hotel.id).toBe(1);
      expect(hotel.name).toBe('Test Hotel');
      expect(hotel.location).toBe('Test City');
      expect(hotel.pricePerNight).toBe(100);
      expect(hotel.rating).toBe(4.0);
      expect(hotel.amenities).toEqual(['WiFi']);
      expect(hotel.availability).toBe(true);
    });

    test('should set default amenities and availability', () => {
      const hotel = new Hotel(1, 'Test Hotel', 'Test City', 100, 4.0);

      expect(hotel.amenities).toEqual([]);
      expect(hotel.availability).toBe(true);
    });
  });

  describe('searchByLocation', () => {
    test('should find hotels by exact location', () => {
      const results = Hotel.searchByLocation(sampleHotels, 'New York, NY');

      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('Grand Plaza');
      expect(results[1].name).toBe('City Inn');
    });

    test('should find hotels by partial location (case insensitive)', () => {
      const results = Hotel.searchByLocation(sampleHotels, 'new york');

      expect(results).toHaveLength(2);
    });

    test('should return empty array for non-existent location', () => {
      const results = Hotel.searchByLocation(sampleHotels, 'Paris');

      expect(results).toHaveLength(0);
    });
  });

  describe('filterByPrice', () => {
    test('should filter hotels within price range', () => {
      const results = Hotel.filterByPrice(sampleHotels, 100, 250);

      expect(results).toHaveLength(3);
      expect(results.every(h => h.pricePerNight >= 100 && h.pricePerNight <= 250)).toBe(true);
    });

    test('should include hotels at exact boundaries', () => {
      const results = Hotel.filterByPrice(sampleHotels, 150, 250);

      expect(results).toHaveLength(3);
      expect(results.some(h => h.pricePerNight === 150)).toBe(true);
      expect(results.some(h => h.pricePerNight === 250)).toBe(true);
    });

    test('should return all hotels with wide range', () => {
      const results = Hotel.filterByPrice(sampleHotels, 0, 1000);

      expect(results).toHaveLength(4);
    });
  });

  describe('filterByRating', () => {
    test('should filter hotels by minimum rating', () => {
      const results = Hotel.filterByRating(sampleHotels, 4.5);

      expect(results).toHaveLength(3);
      expect(results.every(h => h.rating >= 4.5)).toBe(true);
    });

    test('should include hotels with exact rating', () => {
      const results = Hotel.filterByRating(sampleHotels, 4.5);

      expect(results.some(h => h.rating === 4.5)).toBe(true);
    });

    test('should return empty for very high rating', () => {
      const results = Hotel.filterByRating(sampleHotels, 5.0);

      expect(results).toHaveLength(0);
    });
  });

  describe('sortHotels', () => {
    test('should sort by price ascending', () => {
      const results = Hotel.sortHotels(sampleHotels, 'price-asc');

      expect(results[0].pricePerNight).toBe(150);
      expect(results[3].pricePerNight).toBe(350);
    });

    test('should sort by price descending', () => {
      const results = Hotel.sortHotels(sampleHotels, 'price-desc');

      expect(results[0].pricePerNight).toBe(350);
      expect(results[3].pricePerNight).toBe(150);
    });

    test('should sort by rating', () => {
      const results = Hotel.sortHotels(sampleHotels, 'rating');

      expect(results[0].rating).toBe(4.8);
      expect(results[3].rating).toBe(4.2);
    });

    test('should not modify original array', () => {
      const original = [...sampleHotels];
      Hotel.sortHotels(sampleHotels, 'price-asc');

      expect(sampleHotels).toEqual(original);
    });

    test('should return unsorted for unknown sortBy', () => {
      const results = Hotel.sortHotels(sampleHotels, 'unknown');

      expect(results).toEqual(sampleHotels);
    });
  });
});
