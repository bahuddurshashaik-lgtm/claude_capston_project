// Unit tests for HB-002 & HB-005: Booking Service

const BookingService = require('../../src/services/BookingService');
const HotelService = require('../../src/services/HotelService');

describe('BookingService - HB-002 & HB-005', () => {
  let bookingService;
  let hotelService;

  beforeEach(() => {
    hotelService = new HotelService();
    hotelService.addHotel({
      id: 1,
      name: 'Test Hotel',
      location: 'Test City',
      pricePerNight: 250,
      rating: 4.5,
      amenities: ['WiFi'],
      availability: true
    });

    bookingService = new BookingService(hotelService);
  });

  describe('createBooking - HB-002', () => {
    test('should create valid booking', () => {
      const result = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      expect(result.success).toBe(true);
      expect(result.booking.id).toBe(1);
      expect(result.booking.totalPrice).toBe(1000); // 4 nights * 250
      expect(result.booking.status).toBe('pending');
    });

    test('should reject past check-in date', () => {
      const result = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2020-01-01',
        checkOutDate: '2020-01-05',
        guests: 2
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('future');
    });

    test('should reject check-out before check-in', () => {
      const result = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-05',
        checkOutDate: '2026-12-01',
        guests: 2
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('after check-in');
    });

    test('should reject non-existent hotel', () => {
      const result = bookingService.createBooking({
        userId: 1,
        hotelId: 999,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('should auto-increment booking IDs', () => {
      const result1 = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      const result2 = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-10',
        checkOutDate: '2026-12-15',
        guests: 2
      });

      expect(result1.booking.id).toBe(1);
      expect(result2.booking.id).toBe(2);
    });
  });

  describe('getBookingById', () => {
    test('should return booking by id', () => {
      bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      const booking = bookingService.getBookingById(1);

      expect(booking.id).toBe(1);
    });

    test('should return undefined for non-existent booking', () => {
      const booking = bookingService.getBookingById(999);

      expect(booking).toBeUndefined();
    });
  });

  describe('getUserBookings - HB-005', () => {
    test('should return all user bookings', () => {
      bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-10',
        checkOutDate: '2026-12-15',
        guests: 2
      });

      const bookings = bookingService.getUserBookings(1);

      expect(bookings).toHaveLength(2);
    });

    test('should return empty array for user with no bookings', () => {
      const bookings = bookingService.getUserBookings(999);

      expect(bookings).toHaveLength(0);
    });
  });

  describe('confirmBooking', () => {
    test('should confirm booking', () => {
      bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      const result = bookingService.confirmBooking(1);

      expect(result.success).toBe(true);
      expect(result.booking.status).toBe('confirmed');
    });

    test('should return error for non-existent booking', () => {
      const result = bookingService.confirmBooking(999);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('cancelBooking - HB-005', () => {
    test('should cancel booking', () => {
      bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      const result = bookingService.cancelBooking(1);

      expect(result.success).toBe(true);
      expect(result.booking.status).toBe('cancelled');
    });

    test('should not cancel already cancelled booking', () => {
      bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      bookingService.cancelBooking(1);
      const result = bookingService.cancelBooking(1);

      expect(result.success).toBe(false);
      expect(result.error).toContain('already cancelled');
    });
  });

  describe('modifyBooking - HB-005', () => {
    beforeEach(() => {
      bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });
    });

    test('should modify check-out date', () => {
      const result = bookingService.modifyBooking(1, {
        checkOutDate: '2026-12-06'
      });

      expect(result.success).toBe(true);
      expect(result.booking.totalPrice).toBe(1250); // 5 nights * 250
    });

    test('should modify guest count', () => {
      const result = bookingService.modifyBooking(1, {
        guests: 3
      });

      expect(result.success).toBe(true);
      expect(result.booking.guests).toBe(3);
    });

    test('should modify multiple fields', () => {
      const result = bookingService.modifyBooking(1, {
        checkOutDate: '2026-12-07',
        guests: 4
      });

      expect(result.success).toBe(true);
      expect(result.booking.guests).toBe(4);
      expect(result.booking.totalPrice).toBe(1500); // 6 nights * 250
    });

    test('should not modify cancelled booking', () => {
      bookingService.cancelBooking(1);

      const result = bookingService.modifyBooking(1, {
        guests: 3
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('cancelled');
    });

    test('should validate modified dates', () => {
      const result = bookingService.modifyBooking(1, {
        checkInDate: '2020-01-01'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
