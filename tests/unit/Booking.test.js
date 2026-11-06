// Unit tests for HB-002: Hotel Booking and Reservation

const Booking = require('../../src/models/Booking');

describe('Booking Model - HB-002', () => {
  describe('Booking Constructor', () => {
    test('should create booking with all properties', () => {
      const booking = new Booking(1, 101, 1, '2026-12-01', '2026-12-05', 2, 1000);

      expect(booking.id).toBe(1);
      expect(booking.userId).toBe(101);
      expect(booking.hotelId).toBe(1);
      expect(booking.checkInDate).toBeInstanceOf(Date);
      expect(booking.checkOutDate).toBeInstanceOf(Date);
      expect(booking.guests).toBe(2);
      expect(booking.totalPrice).toBe(1000);
      expect(booking.status).toBe('pending');
      expect(booking.createdAt).toBeInstanceOf(Date);
    });

    test('should set default status to pending', () => {
      const booking = new Booking(1, 101, 1, '2026-12-01', '2026-12-05', 2, 1000);

      expect(booking.status).toBe('pending');
    });
  });

  describe('getTotalNights', () => {
    test('should calculate nights correctly', () => {
      const booking = new Booking(1, 101, 1, '2026-12-01', '2026-12-05', 2, 1000);

      expect(booking.getTotalNights()).toBe(4);
    });

    test('should calculate single night stay', () => {
      const booking = new Booking(1, 101, 1, '2026-12-01', '2026-12-02', 2, 250);

      expect(booking.getTotalNights()).toBe(1);
    });

    test('should handle week-long stays', () => {
      const booking = new Booking(1, 101, 1, '2026-12-01', '2026-12-08', 2, 1750);

      expect(booking.getTotalNights()).toBe(7);
    });
  });

  describe('validateDates', () => {
    test('should accept valid future dates', () => {
      const result = Booking.validateDates('2026-12-01', '2026-12-05');

      expect(result.valid).toBe(true);
    });

    test('should reject past check-in date', () => {
      const result = Booking.validateDates('2020-01-01', '2020-01-05');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('future');
    });

    test('should reject check-out before check-in', () => {
      const result = Booking.validateDates('2026-12-05', '2026-12-01');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('after check-in');
    });

    test('should reject same check-in and check-out', () => {
      const result = Booking.validateDates('2026-12-01', '2026-12-01');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('after check-in');
    });
  });

  describe('calculatePrice', () => {
    test('should calculate price for multiple nights', () => {
      const price = Booking.calculatePrice(250, '2026-12-01', '2026-12-05');

      expect(price).toBe(1000); // 4 nights * 250
    });

    test('should calculate price for single night', () => {
      const price = Booking.calculatePrice(250, '2026-12-01', '2026-12-02');

      expect(price).toBe(250);
    });

    test('should handle decimal prices', () => {
      const price = Booking.calculatePrice(99.99, '2026-12-01', '2026-12-03');

      expect(price).toBeCloseTo(199.98, 2);
    });
  });

  describe('confirm', () => {
    test('should change status to confirmed', () => {
      const booking = new Booking(1, 101, 1, '2026-12-01', '2026-12-05', 2, 1000);
      booking.confirm();

      expect(booking.status).toBe('confirmed');
    });
  });

  describe('cancel', () => {
    test('should change status to cancelled', () => {
      const booking = new Booking(1, 101, 1, '2026-12-01', '2026-12-05', 2, 1000);
      booking.cancel();

      expect(booking.status).toBe('cancelled');
    });
  });
});
