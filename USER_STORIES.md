# Hotel Booking System - User Stories Implementation

## Overview
This project implements 5 core user stories for a hotel booking system using basic JavaScript.

## User Stories Coverage

### ✅ HB-001: Hotel Search and Browse
**Files:** `src/models/Hotel.js`, `src/services/HotelService.js`

**Features Implemented:**
- Search hotels by location
- Filter by price range (min/max)
- Filter by rating
- Sort by price (ascending/descending) or rating
- View hotel details and amenities

**Demo Usage:**
```javascript
const hotels = app.searchHotels({ 
  location: 'New York', 
  minPrice: 100, 
  maxPrice: 300,
  minRating: 4.0,
  sortBy: 'price-asc'
});
```

---

### ✅ HB-002: Hotel Booking and Reservation
**Files:** `src/models/Booking.js`, `src/services/BookingService.js`

**Features Implemented:**
- Create new booking with dates and guest count
- Validate booking dates (future dates, check-out after check-in)
- Calculate total price based on nights
- Automatic price calculation
- Booking confirmation

**Demo Usage:**
```javascript
const booking = app.createBooking(
  userId,
  hotelId,
  '2026-12-01',  // check-in
  '2026-12-05',  // check-out
  2              // guests
);
```

---

### ✅ HB-003: Payment Processing
**Files:** `src/models/Payment.js`, `src/services/PaymentService.js`

**Features Implemented:**
- Multiple payment methods (credit card, debit card, PayPal)
- Card number validation (Luhn algorithm)
- Payment processing with transaction ID generation
- Payment status tracking
- Refund processing

**Demo Usage:**
```javascript
const payment = app.processPayment(
  bookingId,
  'credit_card',
  '4532015112830366'  // valid test card
);
```

---

### ✅ HB-004: User Authentication and Profiles
**Files:** `src/models/User.js`, `src/services/UserService.js`

**Features Implemented:**
- User registration with validation
- Email format validation
- Password strength validation (8+ chars, uppercase, lowercase, number)
- Password hashing (basic implementation)
- User login with credential verification
- Profile management (update name, phone)

**Demo Usage:**
```javascript
// Register
const user = app.registerUser({
  email: 'user@example.com',
  password: 'SecurePass123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '555-0101'
});

// Login
const login = app.loginUser('user@example.com', 'SecurePass123');
```

---

### ✅ HB-005: Booking Management and Cancellation
**Files:** `src/services/BookingService.js`, `src/services/PaymentService.js`

**Features Implemented:**
- View all user bookings
- Modify existing bookings (dates, guests)
- Cancel bookings
- Automatic refund on cancellation
- Booking status tracking (pending, confirmed, cancelled)

**Demo Usage:**
```javascript
// View bookings
const bookings = app.viewUserBookings(userId);

// Modify booking
app.modifyBooking(bookingId, {
  checkOutDate: '2026-12-06',
  guests: 3
});

// Cancel booking (with refund)
app.cancelBooking(bookingId);
```

---

## Project Structure

```
src/
├── models/                  # Data models
│   ├── Hotel.js            # HB-001: Hotel model with search methods
│   ├── Booking.js          # HB-002: Booking model with validation
│   ├── Payment.js          # HB-003: Payment model with validation
│   └── User.js             # HB-004: User model with auth
│
├── services/                # Business logic
│   ├── HotelService.js     # HB-001: Hotel search service
│   ├── BookingService.js   # HB-002 & HB-005: Booking management
│   ├── PaymentService.js   # HB-003: Payment processing
│   └── UserService.js      # HB-004: User authentication
│
├── data/                    # Sample data
│   └── sampleData.js       # 5 hotels, 2 users
│
└── app.js                   # Main application with demo

```

## Running the Application

### Prerequisites
- Node.js 14+

### Setup & Run
```bash
# Install dependencies (none required for basic version)
npm install

# Run the demo
npm start
```

### Expected Output
The demo will execute all 5 user stories in sequence:
1. Search hotels in New York
2. Register and login a new user
3. Create a booking
4. Process payment
5. View, modify bookings (cancel is commented out)

## Testing

### Test Data Provided
- **5 Sample Hotels** in different locations
- **2 Sample Users** pre-registered
- **Valid Test Card:** 4532015112830366

### Manual Testing Examples

```javascript
const app = new HotelBookingApp();

// Test HB-001: Search
app.searchHotels({ location: 'Miami' });

// Test HB-002: Book
const booking = app.createBooking(1, 2, '2026-12-10', '2026-12-15', 2);

// Test HB-003: Pay
app.processPayment(booking.booking.id, 'paypal');

// Test HB-004: Login
app.loginUser('john.doe@example.com', 'Password123');

// Test HB-005: Cancel
app.cancelBooking(booking.booking.id);
```

## Validation Rules

### Booking Dates
- ✅ Check-in must be in the future
- ✅ Check-out must be after check-in
- ✅ Automatic night calculation

### Payment
- ✅ Valid payment methods: credit_card, debit_card, paypal
- ✅ Card validation using Luhn algorithm
- ✅ Automatic transaction ID generation

### User Registration
- ✅ Valid email format
- ✅ Password: 8+ characters, uppercase, lowercase, number
- ✅ Unique email addresses

## API Summary

### HotelService
- `getAllHotels()` - Get all hotels
- `getHotelById(id)` - Get specific hotel
- `searchHotels(filters)` - Search with filters
- `checkAvailability(hotelId, checkIn, checkOut)` - Check availability

### BookingService
- `createBooking(data)` - Create new booking
- `getBookingById(id)` - Get booking details
- `getUserBookings(userId)` - Get user's bookings
- `confirmBooking(id)` - Confirm booking
- `modifyBooking(id, updates)` - Modify booking
- `cancelBooking(id)` - Cancel booking

### PaymentService
- `processPayment(data)` - Process payment
- `getPaymentByBookingId(id)` - Get payment details
- `refundPayment(bookingId)` - Process refund
- `getPaymentStatus(bookingId)` - Check payment status

### UserService
- `register(userData)` - Register new user
- `login(email, password)` - Login user
- `getUserById(id)` - Get user details
- `updateProfile(id, updates)` - Update user profile

## Story Points Delivered
- HB-001: Hotel Search (8 points) ✅
- HB-002: Booking (8 points) ✅
- HB-003: Payment (13 points) ✅
- HB-004: Authentication (5 points) ✅
- HB-005: Management (5 points) ✅

**Total: 39 Story Points**

## Notes
- This is a basic implementation for demonstration purposes
- No database - uses in-memory storage
- No external API integrations
- Password hashing is simplified (use bcrypt in production)
- All validations are basic (enhance for production)
- No authentication tokens (add JWT in production)
