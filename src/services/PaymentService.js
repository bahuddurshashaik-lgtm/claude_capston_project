// HB-003: Payment Processing - Service Layer

const Payment = require('../models/Payment');

class PaymentService {
  constructor(bookingService) {
    this.payments = [];
    this.bookingService = bookingService;
    this.nextId = 1;
  }

  // Process payment for booking
  processPayment(paymentData) {
    // Validate booking exists
    const booking = this.bookingService.getBookingById(paymentData.bookingId);
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    // Validate payment method
    if (!Payment.validatePaymentMethod(paymentData.paymentMethod)) {
      return { success: false, error: 'Invalid payment method' };
    }

    // Validate card number if credit/debit card
    if (['credit_card', 'debit_card'].includes(paymentData.paymentMethod)) {
      if (!paymentData.cardNumber) {
        return { success: false, error: 'Card number required' };
      }
      if (!Payment.validateCardNumber(paymentData.cardNumber)) {
        return { success: false, error: 'Invalid card number' };
      }
    }

    // Create payment
    const payment = new Payment(
      this.nextId++,
      paymentData.bookingId,
      booking.totalPrice,
      paymentData.paymentMethod
    );

    // Process the payment
    const result = payment.process();

    if (result.success) {
      this.payments.push(payment);
      // Confirm the booking
      this.bookingService.confirmBooking(paymentData.bookingId);
    }

    return { success: true, payment, transactionId: result.transactionId };
  }

  // Get payment by booking ID
  getPaymentByBookingId(bookingId) {
    return this.payments.find(payment => payment.bookingId === bookingId);
  }

  // Refund payment
  refundPayment(bookingId) {
    const payment = this.getPaymentByBookingId(bookingId);
    if (!payment) {
      return { success: false, error: 'Payment not found' };
    }

    const result = payment.refund();
    if (result.success) {
      // Cancel the booking
      this.bookingService.cancelBooking(bookingId);
    }

    return result;
  }

  // Get payment status
  getPaymentStatus(bookingId) {
    const payment = this.getPaymentByBookingId(bookingId);
    if (!payment) {
      return { found: false };
    }
    return {
      found: true,
      status: payment.status,
      transactionId: payment.transactionId
    };
  }
}

module.exports = PaymentService;
