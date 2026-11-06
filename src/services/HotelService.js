// HB-001: Hotel Search and Browse - Service Layer

const Hotel = require('../models/Hotel');

class HotelService {
  constructor() {
    this.hotels = [];
  }

  // Add hotel to database
  addHotel(hotelData) {
    const hotel = new Hotel(
      hotelData.id,
      hotelData.name,
      hotelData.location,
      hotelData.pricePerNight,
      hotelData.rating,
      hotelData.amenities,
      hotelData.availability
    );
    this.hotels.push(hotel);
    return hotel;
  }

  // Get all hotels
  getAllHotels() {
    return this.hotels;
  }

  // Get hotel by ID
  getHotelById(id) {
    return this.hotels.find(hotel => hotel.id === id);
  }

  // Search hotels with filters
  searchHotels(filters = {}) {
    let results = [...this.hotels];

    // Filter by location
    if (filters.location) {
      results = Hotel.searchByLocation(results, filters.location);
    }

    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice || 0;
      const max = filters.maxPrice || Infinity;
      results = Hotel.filterByPrice(results, min, max);
    }

    // Filter by rating
    if (filters.minRating) {
      results = Hotel.filterByRating(results, filters.minRating);
    }

    // Sort results
    if (filters.sortBy) {
      results = Hotel.sortHotels(results, filters.sortBy);
    }

    return results;
  }

  // Check hotel availability
  checkAvailability(hotelId, checkIn, checkOut) {
    const hotel = this.getHotelById(hotelId);
    if (!hotel) {
      return { available: false, error: 'Hotel not found' };
    }
    return { available: hotel.availability };
  }
}

module.exports = HotelService;
