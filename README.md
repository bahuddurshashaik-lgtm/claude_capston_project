# Hotel Booking System

A basic hotel booking application implementing 5 core user stories using vanilla JavaScript and Node.js.

## 🎯 Project Overview

This project demonstrates a complete hotel booking system with:
- Hotel search and browsing
- Booking and reservations
- Payment processing
- User authentication
- Booking management and cancellation

**Built with:** Pure JavaScript (Node.js) - No frameworks, no database - Simple and educational!

## 📋 User Stories Implemented

| ID | User Story | Status |
|----|-----------|--------|
| HB-001 | Hotel Search and Browse | ✅ Complete |
| HB-002 | Hotel Booking and Reservation | ✅ Complete |
| HB-003 | Payment Processing | ✅ Complete |
| HB-004 | User Authentication and Profiles | ✅ Complete |
| HB-005 | Booking Management and Cancellation | ✅ Complete |

**Total Story Points:** 39

## 🚀 Quick Start

### Prerequisites
- Node.js 14 or higher

### Installation & Run

```bash
# Clone the repository
git clone <repository-url>
cd claude_capston_project

# Run the demo
npm start
```

The demo will execute all 5 user stories and show the complete workflow.

## 📁 Project Structure

```
src/
├── models/              # Data models (Hotel, Booking, Payment, User)
├── services/            # Business logic services
├── data/                # Sample data
└── app.js               # Main application

.github/
├── agents/              # 9 SDLC agents
├── instructions/        # Coding standards
└── prompts/             # 8 workflow prompts

docs/                    # Documentation
mcp.json                 # MCP configuration
```

## 💡 Features

### HB-001: Hotel Search
- Search by location
- Filter by price range
- Filter by rating
- Sort results (price, rating)

### HB-002: Booking
- Create reservations
- Date validation
- Automatic price calculation
- Guest count management

### HB-003: Payment
- Multiple payment methods
- Card validation (Luhn algorithm)
- Transaction processing
- Refund handling

### HB-004: Authentication
- User registration
- Email validation
- Password strength validation
- Login/logout
- Profile management

### HB-005: Booking Management
- View all bookings
- Modify bookings
- Cancel bookings
- Automatic refunds

## 📚 Documentation

- [USER_STORIES.md](./USER_STORIES.md) - Detailed user stories implementation
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Complete project structure

## 🧪 Testing

### Test Coverage: 99.2% ✅

**137 tests** covering all 5 user stories with comprehensive edge cases.

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Coverage Breakdown
- **Statements:** 99.2%
- **Branches:** 94.73%
- **Functions:** 100%
- **Lines:** 99.14%

See [TEST_COVERAGE.md](./TEST_COVERAGE.md) for detailed coverage report.

### Demo Application
Run the built-in demo:
```bash
npm start
```

### Sample Test Data
- **5 Hotels** in different locations (New York, Miami, Chicago, Denver, Los Angeles)
- **2 Users** pre-registered
- **Test Card:** 4532015112830366 (valid Luhn checksum)

### Manual Testing Example

```javascript
const HotelBookingApp = require('./src/app');
const app = new HotelBookingApp();

// Search hotels
const hotels = app.searchHotels({ location: 'New York', minRating: 4.0 });

// Register user
const user = app.registerUser({
  email: 'test@example.com',
  password: 'TestPass123',
  firstName: 'Test',
  lastName: 'User',
  phone: '555-0000'
});

// Create booking
const booking = app.createBooking(user.user.id, 1, '2026-12-01', '2026-12-05', 2);

// Process payment
app.processPayment(booking.booking.id, 'credit_card', '4532015112830366');

// View bookings
app.viewUserBookings(user.user.id);

// Cancel booking
app.cancelBooking(booking.booking.id);
```

## 🛠️ Technology Stack

- **Language:** JavaScript (ES6+)
- **Runtime:** Node.js
- **Architecture:** Service-Oriented (Models + Services)
- **Data Storage:** In-memory (no database)

## 🤖 Agentic SDLC Integration

This project uses Claude Code's Agentic SDLC workflow with 9 specialized agents:

1. **Requirements Analyst** - Gathers requirements
2. **Solution Architect** - Designs architecture
3. **Design Reviewer** - Reviews design
4. **Implementation Planner** - Plans implementation
5. **Implementer** - Writes code
6. **Code Reviewer** - Reviews code quality
7. **Verifier** - Tests and validates
8. **PR Author** - Creates pull requests
9. **SDLC Orchestrator** - Coordinates workflow

### MCP Integration
- Confluence server for documentation
- Custom agents for SDLC automation

## 📊 API Overview

### Services Available

```javascript
// Hotel Service
hotelService.searchHotels(filters)
hotelService.getHotelById(id)

// Booking Service
bookingService.createBooking(data)
bookingService.getUserBookings(userId)
bookingService.modifyBooking(id, updates)
bookingService.cancelBooking(id)

// Payment Service
paymentService.processPayment(data)
paymentService.refundPayment(bookingId)

// User Service
userService.register(userData)
userService.login(email, password)
userService.updateProfile(id, updates)
```

## 🔒 Validation Rules

### Dates
- Check-in must be in the future
- Check-out must be after check-in

### Payments
- Valid methods: credit_card, debit_card, paypal
- Card numbers validated with Luhn algorithm

### Users
- Email must be valid format
- Password: 8+ chars, uppercase, lowercase, number
- Unique email addresses

## 📝 Sample Output

```
==================================================
🏨 Hotel Booking System - Complete Demo
==================================================

🔍 HB-001: Searching hotels... { location: 'New York', minRating: 4 }
Found 1 hotels

👤 HB-004: Registering user...
✅ User registered: demo.user@example.com

🔐 HB-004: Logging in user...
✅ Login successful: demo.user@example.com

📅 HB-002: Creating booking...
✅ Booking created successfully: 1

💳 HB-003: Processing payment...
✅ Payment processed: TXN-1234567890-abc123

📋 HB-005: Viewing user bookings...
Found 1 bookings

✏️ HB-005: Modifying booking...
✅ Booking modified successfully

==================================================
✅ Demo completed successfully!
==================================================
```

## 🌟 Key Highlights

- ✅ Complete implementation of all 5 user stories
- ✅ 39 story points delivered
- ✅ Modular, service-oriented architecture
- ✅ Comprehensive validation
- ✅ In-memory data storage (no setup required)
- ✅ Full booking lifecycle (create → pay → manage → cancel)

## 🚧 Future Enhancements

This is a basic implementation. For production:
- Add database (PostgreSQL/MongoDB)
- Use bcrypt for password hashing
- Add JWT authentication tokens
- Implement REST API with Express
- Add frontend UI
- Add comprehensive test suite
- Add error logging
- Implement real payment gateway integration

## 📄 License

MIT

## 👥 Contributing

This is an educational project demonstrating Agentic SDLC with Claude Code.

---

**Built with Claude Code** 🤖
