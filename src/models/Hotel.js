// HB-001: Hotel Search and Browse - Hotel Model

class Hotel {
  constructor(id, name, location, pricePerNight, rating, amenities, availability) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.pricePerNight = pricePerNight;
    this.rating = rating;
    this.amenities = amenities || [];
    this.availability = availability !== undefined ? availability : true;
  }

  // Search hotel by location
  static searchByLocation(hotels, location) {
    return hotels.filter(hotel =>
      hotel.location.toLowerCase().includes(location.toLowerCase())
    );
  }

  // Filter by price range
  static filterByPrice(hotels, minPrice, maxPrice) {
    return hotels.filter(hotel =>
      hotel.pricePerNight >= minPrice && hotel.pricePerNight <= maxPrice
    );
  }

  // Filter by rating
  static filterByRating(hotels, minRating) {
    return hotels.filter(hotel => hotel.rating >= minRating);
  }

  // Sort hotels
  static sortHotels(hotels, sortBy = 'price') {
    const sorted = [...hotels];
    switch(sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'price-desc':
        return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }
}

module.exports = Hotel;
