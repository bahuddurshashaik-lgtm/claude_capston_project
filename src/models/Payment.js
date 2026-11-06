// HB-003: Payment Processing - Payment Model

class Payment {
  constructor(id, bookingId, amount, paymentMethod, status = 'pending') {
    this.id = id;
    this.bookingId = bookingId;
    this.amount = amount;
    this.paymentMethod = paymentMethod; // credit_card, debit_card, paypal
    this.status = status; // pending, completed, failed, refunded
    this.transactionId = null;
    this.createdAt = new Date();
  }

  // Validate payment method
  static validatePaymentMethod(method) {
    const validMethods = ['credit_card', 'debit_card', 'paypal'];
    return validMethods.includes(method);
  }

  // Validate card number (basic Luhn algorithm)
  static validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Process payment
  process() {
    this.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.status = 'completed';
    return { success: true, transactionId: this.transactionId };
  }

  // Refund payment
  refund() {
    if (this.status !== 'completed') {
      return { success: false, error: 'Payment not completed' };
    }
    this.status = 'refunded';
    return { success: true, refundId: `REF-${this.transactionId}` };
  }
}

module.exports = Payment;
