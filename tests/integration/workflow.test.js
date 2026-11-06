// Integration tests - Complete booking workflow covering all 5 user stories

const HotelBookingApp = require('../../src/app');

describe('Complete Booking Workflow - All User Stories', () => {
  let app;

  beforeEach(() => {
    app = new HotelBookingApp();
  });

  describe('End-to-End Booking Flow', () => {
    test('should complete full booking workflow', () => {
      // HB-001: Search hotels
      const hotels = app.searchHotels({
        location: 'New York',
        minRating: 4.0
      });
      expect(hotels.length).toBeGreaterThan(0);
      const selectedHotel = hotels[0];

      // HB-004: Register user
      const userResult = app.registerUser({
        email: 'integration.test@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User',
        phone: '555-9999'
      });
      expect(userResult.success).toBe(true);
      const userId = userResult.user.id;

      // HB-004: Login user
      const loginResult = app.loginUser('integration.test@example.com', 'TestPass123');
      expect(loginResult.success).toBe(true);

      // HB-002: Create booking
      const bookingResult = app.createBooking(
        userId,
        selectedHotel.id,
        '2026-12-01',
        '2026-12-05',
        2
      );
      expect(bookingResult.success).toBe(true);
      const bookingId = bookingResult.booking.id;

      // HB-003: Process payment
      const paymentResult = app.processPayment(
        bookingId,
        'credit_card',
        '4532015112830366'
      );
      expect(paymentResult.success).toBe(true);
      expect(paymentResult.transactionId).toBeDefined();

      // HB-005: View bookings
      const userBookings = app.viewUserBookings(userId);
      expect(userBookings).toHaveLength(1);
      expect(userBookings[0].status).toBe('confirmed');

      // HB-005: Modify booking
      const modifyResult = app.modifyBooking(bookingId, {
        checkOutDate: '2026-12-06',
        guests: 3
      });
      expect(modifyResult.success).toBe(true);
    });

    test('should handle booking cancellation with refund', () => {
      // Register and login
      const userResult = app.registerUser({
        email: 'cancel.test@example.com',
        password: 'TestPass123',
        firstName: 'Cancel',
        lastName: 'User',
        phone: '555-8888'
      });
      const userId = userResult.user.id;

      // Create booking
      const bookingResult = app.createBooking(
        userId,
        1,
        '2026-12-01',
        '2026-12-05',
        2
      );
      const bookingId = bookingResult.booking.id;

      // Process payment
      app.processPayment(bookingId, 'paypal');

      // Cancel booking
      const cancelResult = app.cancelBooking(bookingId);
      expect(cancelResult.success).toBe(true);
      expect(cancelResult.booking.status).toBe('cancelled');
    });
  });

  describe('HB-001: Hotel Search Scenarios', () => {
    test('should search by location', () => {
      const results = app.searchHotels({ location: 'Miami' });
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(h => h.location.includes('Miami'))).toBe(true);
    });

    test('should filter by price range', () => {
      const results = app.searchHotels({
        minPrice: 200,
        maxPrice: 300
      });
      expect(results.every(h => h.pricePerNight >= 200 && h.pricePerNight <= 300)).toBe(true);
    });

    test('should sort by price', () => {
      const results = app.searchHotels({ sortBy: 'price-asc' });
      for (let i = 1; i < results.length; i++) {
        expect(results[i].pricePerNight).toBeGreaterThanOrEqual(results[i-1].pricePerNight);
      }
    });
  });

  describe('HB-002: Booking Validation', () => {
    test('should reject invalid dates', () => {
      const userResult = app.registerUser({
        email: 'dates.test@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User',
        phone: '555-7777'
      });

      const result = app.createBooking(
        userResult.user.id,
        1,
        '2020-01-01',
        '2020-01-05',
        2
      );
      expect(result.success).toBe(false);
    });
  });

  describe('HB-003: Payment Scenarios', () => {
    test('should accept valid payment methods', () => {
      const userResult = app.registerUser({
        email: 'payment.test@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User',
        phone: '555-6666'
      });

      const bookingResult = app.createBooking(
        userResult.user.id,
        1,
        '2026-12-01',
        '2026-12-05',
        2
      );

      const paymentMethods = ['credit_card', 'debit_card', 'paypal'];

      for (const method of paymentMethods) {
        const bookingResult2 = app.createBooking(
          userResult.user.id,
          1,
          '2026-12-10',
          '2026-12-15',
          2
        );

        const cardNumber = method === 'paypal' ? null : '4532015112830366';
        const result = app.processPayment(bookingResult2.booking.id, method, cardNumber);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('HB-004: User Authentication', () => {
    test('should prevent duplicate email registration', () => {
      app.registerUser({
        email: 'duplicate@example.com',
        password: 'TestPass123',
        firstName: 'First',
        lastName: 'User',
        phone: '555-5555'
      });

      const result = app.registerUser({
        email: 'duplicate@example.com',
        password: 'DifferentPass123',
        firstName: 'Second',
        lastName: 'User',
        phone: '555-4444'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('already registered');
    });

    test('should reject invalid credentials', () => {
      app.registerUser({
        email: 'valid@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User',
        phone: '555-3333'
      });

      const result = app.loginUser('valid@example.com', 'WrongPassword123');
      expect(result.success).toBe(false);
    });
  });

  describe('HB-005: Booking Management', () => {
    test('should track multiple bookings per user', () => {
      const userResult = app.registerUser({
        email: 'multi.booking@example.com',
        password: 'TestPass123',
        firstName: 'Multi',
        lastName: 'Booking',
        phone: '555-2222'
      });
      const userId = userResult.user.id;

      // Create 3 bookings
      app.createBooking(userId, 1, '2026-12-01', '2026-12-05', 2);
      app.createBooking(userId, 2, '2026-12-10', '2026-12-15', 3);
      app.createBooking(userId, 3, '2026-12-20', '2026-12-25', 1);

      const bookings = app.viewUserBookings(userId);
      expect(bookings).toHaveLength(3);
    });

    test('should prevent modification of cancelled booking', () => {
      const userResult = app.registerUser({
        email: 'modify.test@example.com',
        password: 'TestPass123',
        firstName: 'Modify',
        lastName: 'Test',
        phone: '555-1111'
      });

      const bookingResult = app.createBooking(
        userResult.user.id,
        1,
        '2026-12-01',
        '2026-12-05',
        2
      );

      app.cancelBooking(bookingResult.booking.id);

      const modifyResult = app.modifyBooking(bookingResult.booking.id, {
        guests: 5
      });

      expect(modifyResult.success).toBe(false);
    });
  });

  describe('Data Integrity', () => {
    test('should maintain booking-payment relationship', () => {
      const userResult = app.registerUser({
        email: 'integrity@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User',
        phone: '555-0000'
      });

      const bookingResult = app.createBooking(
        userResult.user.id,
        1,
        '2026-12-01',
        '2026-12-05',
        2
      );

      const paymentResult = app.processPayment(
        bookingResult.booking.id,
        'credit_card',
        '4532015112830366'
      );

      const bookings = app.viewUserBookings(userResult.user.id);
      expect(bookings[0].status).toBe('confirmed');
      expect(paymentResult.payment.bookingId).toBe(bookingResult.booking.id);
    });
  });
});
