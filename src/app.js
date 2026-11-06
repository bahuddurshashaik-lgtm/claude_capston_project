// Main Application - Demonstrates all 5 user stories

const HotelService = require('./services/HotelService');
const BookingService = require('./services/BookingService');
const PaymentService = require('./services/PaymentService');
const UserService = require('./services/UserService');
const { sampleHotels, sampleUsers } = require('./data/sampleData');

class HotelBookingApp {
  constructor() {
    // Initialize services
    this.hotelService = new HotelService();
    this.bookingService = new BookingService(this.hotelService);
    this.paymentService = new PaymentService(this.bookingService);
    this.userService = new UserService();

    // Load sample data
    this.loadSampleData();
  }

  loadSampleData() {
    // Load sample hotels
    sampleHotels.forEach(hotel => this.hotelService.addHotel(hotel));

    // Register sample users
    sampleUsers.forEach(user => this.userService.register(user));

    console.log('✅ Sample data loaded successfully');
  }

  // ===== HB-001: Hotel Search and Browse =====
  searchHotels(filters) {
    console.log('\n🔍 HB-001: Searching hotels...', filters);
    const results = this.hotelService.searchHotels(filters);
    console.log(`Found ${results.length} hotels`);
    return results;
  }

  // ===== HB-002: Hotel Booking and Reservation =====
  createBooking(userId, hotelId, checkInDate, checkOutDate, guests) {
    console.log('\n📅 HB-002: Creating booking...');
    const result = this.bookingService.createBooking({
      userId,
      hotelId,
      checkInDate,
      checkOutDate,
      guests
    });

    if (result.success) {
      console.log('✅ Booking created successfully:', result.booking.id);
    } else {
      console.log('❌ Booking failed:', result.error);
    }
    return result;
  }

  // ===== HB-003: Payment Processing =====
  processPayment(bookingId, paymentMethod, cardNumber = null) {
    console.log('\n💳 HB-003: Processing payment...');
    const result = this.paymentService.processPayment({
      bookingId,
      paymentMethod,
      cardNumber
    });

    if (result.success) {
      console.log('✅ Payment processed:', result.transactionId);
    } else {
      console.log('❌ Payment failed:', result.error);
    }
    return result;
  }

  // ===== HB-004: User Authentication and Profiles =====
  registerUser(userData) {
    console.log('\n👤 HB-004: Registering user...');
    const result = this.userService.register(userData);

    if (result.success) {
      console.log('✅ User registered:', result.user.email);
    } else {
      console.log('❌ Registration failed:', result.error);
    }
    return result;
  }

  loginUser(email, password) {
    console.log('\n🔐 HB-004: Logging in user...');
    const result = this.userService.login(email, password);

    if (result.success) {
      console.log('✅ Login successful:', result.user.email);
    } else {
      console.log('❌ Login failed:', result.error);
    }
    return result;
  }

  // ===== HB-005: Booking Management and Cancellation =====
  viewUserBookings(userId) {
    console.log('\n📋 HB-005: Viewing user bookings...');
    const bookings = this.bookingService.getUserBookings(userId);
    console.log(`Found ${bookings.length} bookings`);
    return bookings;
  }

  modifyBooking(bookingId, updates) {
    console.log('\n✏️ HB-005: Modifying booking...');
    const result = this.bookingService.modifyBooking(bookingId, updates);

    if (result.success) {
      console.log('✅ Booking modified successfully');
    } else {
      console.log('❌ Modification failed:', result.error);
    }
    return result;
  }

  cancelBooking(bookingId) {
    console.log('\n❌ HB-005: Cancelling booking...');
    const result = this.bookingService.cancelBooking(bookingId);

    if (result.success) {
      console.log('✅ Booking cancelled');
      // Process refund
      const refund = this.paymentService.refundPayment(bookingId);
      if (refund.success) {
        console.log('✅ Refund processed:', refund.refundId);
      }
    } else {
      console.log('❌ Cancellation failed:', result.error);
    }
    return result;
  }

  // Demo all user stories
  runDemo() {
    console.log('\n' + '='.repeat(50));
    console.log('🏨 Hotel Booking System - Complete Demo');
    console.log('='.repeat(50));

    // HB-001: Search Hotels
    const hotels = this.searchHotels({ location: 'New York', minRating: 4.0 });

    // HB-004: Register & Login
    const newUser = this.registerUser({
      email: 'demo.user@example.com',
      password: 'DemoPass123',
      firstName: 'Demo',
      lastName: 'User',
      phone: '555-9999'
    });

    const login = this.loginUser('demo.user@example.com', 'DemoPass123');

    // HB-002: Create Booking
    const booking = this.createBooking(
      newUser.user.id,
      1,
      '2026-12-01',
      '2026-12-05',
      2
    );

    // HB-003: Process Payment
    if (booking.success) {
      this.processPayment(
        booking.booking.id,
        'credit_card',
        '4532015112830366'
      );
    }

    // HB-005: View, Modify, and Cancel Bookings
    this.viewUserBookings(newUser.user.id);

    if (booking.success) {
      this.modifyBooking(booking.booking.id, {
        checkOutDate: '2026-12-06',
        guests: 3
      });

      // Uncomment to test cancellation
      // this.cancelBooking(booking.booking.id);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Demo completed successfully!');
    console.log('='.repeat(50) + '\n');
  }
}

// Run the application
if (require.main === module) {
  const app = new HotelBookingApp();
  app.runDemo();
}

module.exports = HotelBookingApp;
