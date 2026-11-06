// HB-002: Hotel Booking and Reservation - Booking Model

class Booking {
  constructor(id, userId, hotelId, checkInDate, checkOutDate, guests, totalPrice, status = 'pending') {
    this.id = id;
    this.userId = userId;
    this.hotelId = hotelId;
    this.checkInDate = new Date(checkInDate);
    this.checkOutDate = new Date(checkOutDate);
    this.guests = guests;
    this.totalPrice = totalPrice;
    this.status = status; // pending, confirmed, cancelled
    this.createdAt = new Date();
  }

  // Calculate total nights
  getTotalNights() {
    const diffTime = Math.abs(this.checkOutDate - this.checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Validate booking dates
  static validateDates(checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();

    if (checkInDate < today) {
      return { valid: false, error: 'Check-in date must be in the future' };
    }
    if (checkOutDate <= checkInDate) {
      return { valid: false, error: 'Check-out date must be after check-in date' };
    }
    return { valid: true };
  }

  // Calculate total price
  static calculatePrice(pricePerNight, checkIn, checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    return pricePerNight * nights;
  }

  // Confirm booking
  confirm() {
    this.status = 'confirmed';
  }

  // Cancel booking
  cancel() {
    this.status = 'cancelled';
  }
}

module.exports = Booking;
