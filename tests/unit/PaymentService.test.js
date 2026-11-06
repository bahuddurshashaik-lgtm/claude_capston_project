// Unit tests for HB-003: Payment Service

const PaymentService = require('../../src/services/PaymentService');
const BookingService = require('../../src/services/BookingService');
const HotelService = require('../../src/services/HotelService');

describe('PaymentService - HB-003', () => {
  let paymentService;
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
    paymentService = new PaymentService(bookingService);
  });

  describe('processPayment', () => {
    test('should process payment successfully', () => {
      const bookingResult = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      const result = paymentService.processPayment({
        bookingId: bookingResult.booking.id,
        paymentMethod: 'credit_card',
        cardNumber: '4532015112830366'
      });

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
      expect(result.payment.status).toBe('completed');
    });

    test('should reject payment for non-existent booking', () => {
      const result = paymentService.processPayment({
        bookingId: 999,
        paymentMethod: 'credit_card',
        cardNumber: '4532015112830366'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('should reject invalid payment method', () => {
      const bookingResult = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      const result = paymentService.processPayment({
        bookingId: bookingResult.booking.id,
        paymentMethod: 'bitcoin',
        cardNumber: '4532015112830366'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid payment method');
    });

    test('should require card number for credit card', () => {
      const bookingResult = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      const result = paymentService.processPayment({
        bookingId: bookingResult.booking.id,
        paymentMethod: 'credit_card'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Card number required');
    });

    test('should validate card number', () => {
      const bookingResult = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      const result = paymentService.processPayment({
        bookingId: bookingResult.booking.id,
        paymentMethod: 'credit_card',
        cardNumber: '1234567890123456'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid card number');
    });

    test('should process PayPal without card number', () => {
      const bookingResult = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      const result = paymentService.processPayment({
        bookingId: bookingResult.booking.id,
        paymentMethod: 'paypal'
      });

      expect(result.success).toBe(true);
    });
  });

  describe('getPaymentByBookingId', () => {
    test('should return payment for booking', () => {
      const bookingResult = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      paymentService.processPayment({
        bookingId: bookingResult.booking.id,
        paymentMethod: 'paypal'
      });

      const payment = paymentService.getPaymentByBookingId(bookingResult.booking.id);

      expect(payment).toBeDefined();
      expect(payment.bookingId).toBe(bookingResult.booking.id);
    });
  });

  describe('refundPayment', () => {
    test('should refund completed payment', () => {
      const bookingResult = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      paymentService.processPayment({
        bookingId: bookingResult.booking.id,
        paymentMethod: 'paypal'
      });

      const result = paymentService.refundPayment(bookingResult.booking.id);

      expect(result.success).toBe(true);
      expect(result.refundId).toBeDefined();
    });

    test('should not refund non-existent payment', () => {
      const result = paymentService.refundPayment(999);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });

  describe('getPaymentStatus', () => {
    test('should return payment status', () => {
      const bookingResult = bookingService.createBooking({
        userId: 1,
        hotelId: 1,
        checkInDate: '2026-12-01',
        checkOutDate: '2026-12-05',
        guests: 2
      });

      paymentService.processPayment({
        bookingId: bookingResult.booking.id,
        paymentMethod: 'paypal'
      });

      const status = paymentService.getPaymentStatus(bookingResult.booking.id);

      expect(status.found).toBe(true);
      expect(status.status).toBe('completed');
      expect(status.transactionId).toBeDefined();
    });

    test('should return not found for non-existent payment', () => {
      const status = paymentService.getPaymentStatus(999);

      expect(status.found).toBe(false);
    });
  });
});
