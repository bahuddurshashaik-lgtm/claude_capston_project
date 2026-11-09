/**
 * Test Fixtures - Hotels
 * Reusable test data for hotel-related tests
 */

module.exports = {
  // Valid hotel data
  validHotel: {
    name: 'Test Hotel',
    description: 'A test hotel for unit testing',
    city: 'Miami',
    region: 'Florida',
    address: '123 Test St, Miami, FL 33139',
    price_per_night: 150.00,
    rating: 4.5,
    is_active: true
  },

  // Inactive hotel
  inactiveHotel: {
    name: 'Inactive Hotel',
    description: 'This hotel is inactive',
    city: 'Miami',
    region: 'Florida',
    address: '999 Closed St, Miami, FL',
    price_per_night: 100.00,
    rating: 3.0,
    is_active: false
  },

  // Hotel without rating
  unratedHotel: {
    name: 'Unrated Hotel',
    description: 'New hotel without ratings',
    city: 'New York',
    region: 'New York',
    address: '456 Broadway, New York, NY 10013',
    price_per_night: 200.00,
    rating: null,
    is_active: true
  },

  // Expensive hotel
  luxuryHotel: {
    name: 'Luxury Hotel',
    description: 'High-end luxury accommodation',
    city: 'New York',
    region: 'New York',
    address: '768 5th Ave, New York, NY 10019',
    price_per_night: 599.99,
    rating: 4.9,
    is_active: true
  },

  // Budget hotel
  budgetHotel: {
    name: 'Budget Inn',
    description: 'Affordable clean accommodation',
    city: 'Miami',
    region: 'Florida',
    address: '789 NW 7th St, Miami, FL 33125',
    price_per_night: 79.99,
    rating: 3.5,
    is_active: true
  },

  // Hotel with unicode characters
  unicodeHotel: {
    name: 'Hôtel Montréal',
    description: 'French-inspired boutique hotel',
    city: 'Montréal',
    region: 'Quebec',
    address: '1234 Rue Sainte-Catherine, Montréal, QC H3G 1P5',
    price_per_night: 199.99,
    rating: 4.6,
    is_active: true
  },

  // Sample amenities
  amenities: [
    { name: 'WiFi', icon: 'wifi' },
    { name: 'Pool', icon: 'pool' },
    { name: 'Parking', icon: 'parking' },
    { name: 'Gym', icon: 'gym' }
  ],

  // Search filter examples
  searchFilters: {
    locationOnly: {
      location: 'Miami'
    },
    withPriceRange: {
      location: 'Miami',
      minPrice: 100,
      maxPrice: 200
    },
    withRating: {
      location: 'New York',
      minRating: 4.0
    },
    fullFilters: {
      location: 'Los Angeles',
      minPrice: 150,
      maxPrice: 300,
      minRating: 4.0,
      sortBy: 'rating:desc'
    },
    invalidPriceRange: {
      location: 'Miami',
      minPrice: 200,
      maxPrice: 100
    }
  }
};
