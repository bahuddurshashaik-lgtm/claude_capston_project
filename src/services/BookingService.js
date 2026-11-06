// HB-002 & HB-005: Booking and Booking Management - Service Layer

const Booking = require('../models/Booking');

class BookingService {
  constructor(hotelService) {
    this.bookings = [];
    this.hotelService = hotelService;
    this.nextId = 1;
  }

  // Create new booking (HB-002)
  createBooking(bookingData) {
    // Validate dates
    const dateValidation = Booking.validateDates(
      bookingData.checkInDate,
      bookingData.checkOutDate
    );

    if (!dateValidation.valid) {
      return { success: false, error: dateValidation.error };
    }

    // Check hotel availability
    const hotel = this.hotelService.getHotelById(bookingData.hotelId);
    if (!hotel) {
      return { success: false, error: 'Hotel not found' };
    }

    // Calculate total price
    const totalPrice = Booking.calculatePrice(
      hotel.pricePerNight,
      bookingData.checkInDate,
      bookingData.checkOutDate
    );

    // Create booking
    const booking = new Booking(
      this.nextId++,
      bookingData.userId,
      bookingData.hotelId,
      bookingData.checkInDate,
      bookingData.checkOutDate,
      bookingData.guests,
      totalPrice
    );

    this.bookings.push(booking);
    return { success: true, booking };
  }

  // Get booking by ID
  getBookingById(id) {
    return this.bookings.find(booking => booking.id === id);
  }

  // Get all bookings for a user (HB-005)
  getUserBookings(userId) {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  // Confirm booking
  confirmBooking(bookingId) {
    const booking = this.getBookingById(bookingId);
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }
    booking.confirm();
    return { success: true, booking };
  }

  // Cancel booking (HB-005)
  cancelBooking(bookingId) {
    const booking = this.getBookingById(bookingId);
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (booking.status === 'cancelled') {
      return { success: false, error: 'Booking already cancelled' };
    }

    booking.cancel();
    return { success: true, booking };
  }

  // Modify booking (HB-005)
  modifyBooking(bookingId, updates) {
    const booking = this.getBookingById(bookingId);
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (booking.status === 'cancelled') {
      return { success: false, error: 'Cannot modify cancelled booking' };
    }

    // Update dates if provided
    if (updates.checkInDate || updates.checkOutDate) {
      const newCheckIn = updates.checkInDate || booking.checkInDate;
      const newCheckOut = updates.checkOutDate || booking.checkOutDate;

      const validation = Booking.validateDates(newCheckIn, newCheckOut);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      booking.checkInDate = new Date(newCheckIn);
      booking.checkOutDate = new Date(newCheckOut);

      // Recalculate price
      const hotel = this.hotelService.getHotelById(booking.hotelId);
      booking.totalPrice = Booking.calculatePrice(
        hotel.pricePerNight,
        booking.checkInDate,
        booking.checkOutDate
      );
    }

    // Update guests if provided
    if (updates.guests) {
      booking.guests = updates.guests;
    }

    return { success: true, booking };
  }
}

module.exports = BookingService;
