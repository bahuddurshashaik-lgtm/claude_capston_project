/**
 * Hotel Model
 * Entity class representing a hotel with transformation methods
 * HB-001: Hotel Search and Browse
 */

class Hotel {
  /**
   * Create a Hotel instance
   * @param {Object} data - Hotel data from database
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.city = data.city;
    this.region = data.region;
    this.address = data.address;
    this.pricePerNight = parseFloat(data.price_per_night);
    this.rating = data.rating ? parseFloat(data.rating) : null;
    this.isActive = data.is_active;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.amenities = data.amenities || [];
  }

  /**
   * Transform hotel instance to JSON response format
   * Converts snake_case database fields to camelCase API fields
   * @returns {Object} - JSON representation of hotel
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      location: {
        city: this.city,
        region: this.region,
        address: this.address
      },
      pricePerNight: this.pricePerNight,
      rating: this.rating,
      amenities: this.amenities,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create Hotel instance from database row
   * @param {Object} row - Database row
   * @returns {Hotel} - Hotel instance
   */
  static fromDatabase(row) {
    return new Hotel(row);
  }

  /**
   * Create multiple Hotel instances from database rows
   * @param {Array} rows - Array of database rows
   * @returns {Array<Hotel>} - Array of Hotel instances
   */
  static fromDatabaseArray(rows) {
    return rows.map(row => Hotel.fromDatabase(row));
  }
}

module.exports = Hotel;
