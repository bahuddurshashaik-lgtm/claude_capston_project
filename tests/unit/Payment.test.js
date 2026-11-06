// Unit tests for HB-003: Payment Processing

const Payment = require('../../src/models/Payment');

describe('Payment Model - HB-003', () => {
  describe('Payment Constructor', () => {
    test('should create payment with all properties', () => {
      const payment = new Payment(1, 101, 1000, 'credit_card');

      expect(payment.id).toBe(1);
      expect(payment.bookingId).toBe(101);
      expect(payment.amount).toBe(1000);
      expect(payment.paymentMethod).toBe('credit_card');
      expect(payment.status).toBe('pending');
      expect(payment.transactionId).toBeNull();
      expect(payment.createdAt).toBeInstanceOf(Date);
    });

    test('should set default status to pending', () => {
      const payment = new Payment(1, 101, 1000, 'paypal');

      expect(payment.status).toBe('pending');
    });
  });

  describe('validatePaymentMethod', () => {
    test('should accept credit_card', () => {
      expect(Payment.validatePaymentMethod('credit_card')).toBe(true);
    });

    test('should accept debit_card', () => {
      expect(Payment.validatePaymentMethod('debit_card')).toBe(true);
    });

    test('should accept paypal', () => {
      expect(Payment.validatePaymentMethod('paypal')).toBe(true);
    });

    test('should reject invalid payment method', () => {
      expect(Payment.validatePaymentMethod('bitcoin')).toBe(false);
      expect(Payment.validatePaymentMethod('cash')).toBe(false);
      expect(Payment.validatePaymentMethod('')).toBe(false);
    });
  });

  describe('validateCardNumber - Luhn Algorithm', () => {
    test('should validate correct card number', () => {
      // Valid test card numbers
      expect(Payment.validateCardNumber('4532015112830366')).toBe(true); // Visa
      expect(Payment.validateCardNumber('5425233430109903')).toBe(true); // Mastercard
      expect(Payment.validateCardNumber('374245455400126')).toBe(true);  // Amex
    });

    test('should validate card with spaces', () => {
      expect(Payment.validateCardNumber('4532 0151 1283 0366')).toBe(true);
    });

    test('should reject invalid card number', () => {
      expect(Payment.validateCardNumber('1234567890123456')).toBe(false);
      // Note: 0000000000000000 passes Luhn but is invalid in real systems
      // For this basic implementation, we only validate Luhn algorithm
    });

    test('should reject too short card number', () => {
      expect(Payment.validateCardNumber('123456789012')).toBe(false);
    });

    test('should reject too long card number', () => {
      expect(Payment.validateCardNumber('12345678901234567890')).toBe(false);
    });

    test('should reject non-numeric card number', () => {
      expect(Payment.validateCardNumber('abcd-efgh-ijkl-mnop')).toBe(false);
    });

    test('should reject empty card number', () => {
      expect(Payment.validateCardNumber('')).toBe(false);
    });
  });

  describe('process', () => {
    test('should process payment successfully', () => {
      const payment = new Payment(1, 101, 1000, 'credit_card');
      const result = payment.process();

      expect(result.success).toBe(true);
      expect(result.transactionId).toBeDefined();
      expect(payment.status).toBe('completed');
      expect(payment.transactionId).toBe(result.transactionId);
    });

    test('should generate unique transaction IDs', () => {
      const payment1 = new Payment(1, 101, 1000, 'credit_card');
      const payment2 = new Payment(2, 102, 2000, 'paypal');

      const result1 = payment1.process();
      const result2 = payment2.process();

      expect(result1.transactionId).not.toBe(result2.transactionId);
    });

    test('should format transaction ID correctly', () => {
      const payment = new Payment(1, 101, 1000, 'credit_card');
      const result = payment.process();

      expect(result.transactionId).toMatch(/^TXN-\d+-[a-z0-9]+$/);
    });
  });

  describe('refund', () => {
    test('should refund completed payment', () => {
      const payment = new Payment(1, 101, 1000, 'credit_card');
      payment.process();

      const result = payment.refund();

      expect(result.success).toBe(true);
      expect(result.refundId).toBeDefined();
      expect(result.refundId).toContain('REF-');
      expect(payment.status).toBe('refunded');
    });

    test('should not refund non-completed payment', () => {
      const payment = new Payment(1, 101, 1000, 'credit_card');

      const result = payment.refund();

      expect(result.success).toBe(false);
      expect(result.error).toContain('not completed');
    });

    test('should generate refund ID based on transaction ID', () => {
      const payment = new Payment(1, 101, 1000, 'credit_card');
      payment.process();

      const result = payment.refund();

      expect(result.refundId).toContain(payment.transactionId);
    });
  });
});
