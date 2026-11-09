# Hotel Booking System - Setup Guide

## Quick Start

This guide will help you set up and run the Hotel Booking System with HB-001: Hotel Search and Browse feature.

## Prerequisites

### Required Software
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **PostgreSQL** >= 12 ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

### Check Your Installation
```bash
node --version   # Should be >= 18.0.0
npm --version    # Should be >= 8.0.0
psql --version   # Should be >= 12
```

## Step 1: Database Setup

### Create PostgreSQL Database

1. Start PostgreSQL service
2. Open PostgreSQL command line or pgAdmin
3. Create database and user:

```sql
-- Create user
CREATE USER hotel_app WITH PASSWORD 'secure_password';

-- Create database
CREATE DATABASE hotel_booking OWNER hotel_app;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hotel_booking TO hotel_app;

-- Connect to database
\c hotel_booking

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO hotel_app;
```

### Test Database (for running tests)

```sql
-- Create test database
CREATE DATABASE hotel_booking_test OWNER hotel_app;
GRANT ALL PRIVILEGES ON DATABASE hotel_booking_test TO hotel_app;
```

## Step 2: Project Setup

### Clone/Navigate to Project Directory

```bash
cd C:\Users\shaiksai_bahuddursha\Documents\GitHub_Copilot_Capstone_Project\claude_capston_project
```

### Install Dependencies

```bash
npm install
```

This will install all required packages:
- express (web framework)
- knex & pg (database)
- joi (validation)
- helmet & cors (security)
- winston (logging)
- express-rate-limit (rate limiting)
- jest & supertest (testing)

### Configure Environment

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` with your database credentials:
```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=0.0.0.0

# Database Configuration
DATABASE_URL=postgresql://hotel_app:secure_password@localhost:5432/hotel_booking
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50

# Test Database
TEST_DATABASE_URL=postgresql://hotel_app:secure_password@localhost:5432/hotel_booking_test

# Security Configuration
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging Configuration
LOG_LEVEL=info
```

## Step 3: Database Migration and Seeding

### Run Migrations

This creates all database tables with proper indexes and constraints:

```bash
npm run migrate:latest
```

Expected output:
```
Batch 1 run: 2 migrations
✓ 20261109000001_create_hotels_table.js
✓ 20261109000002_create_amenities_tables.js
```

### Seed Database

This populates the database with sample data (52 hotels, 10 amenities):

```bash
npm run seed:run
```

Expected output:
```
Ran 2 seed files
✓ 01_amenities.js
✓ 02_hotels.js
```

## Step 4: Start the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Verify Server is Running

You should see:
```
info: Database connection established successfully
info: Server started successfully {"port":3000,"host":"0.0.0.0","environment":"development"}
info: API endpoints available {
  "health": "http://0.0.0.0:3000/health",
  "apiHealth": "http://0.0.0.0:3000/api/v1/health",
  "hotels": "http://0.0.0.0:3000/api/v1/hotels",
  "search": "http://0.0.0.0:3000/api/v1/hotels/search"
}
```

## Step 5: Test the API

### Using curl

#### Health Check
```bash
curl http://localhost:3000/health
```

#### Get All Hotels
```bash
curl http://localhost:3000/api/v1/hotels
```

#### Search Hotels by Location
```bash
curl "http://localhost:3000/api/v1/hotels/search?location=Miami"
```

#### Search with Multiple Filters
```bash
curl "http://localhost:3000/api/v1/hotels/search?location=Miami&minPrice=100&maxPrice=300&minRating=4.0&sortBy=price:asc"
```

#### Get Hotel by ID
```bash
curl http://localhost:3000/api/v1/hotels/1
```

### Using Browser

Open your browser and navigate to:
- http://localhost:3000/health
- http://localhost:3000/api/v1/hotels
- http://localhost:3000/api/v1/hotels/1

### Using Postman or Thunder Client

Import these endpoints:
- GET http://localhost:3000/api/v1/hotels
- GET http://localhost:3000/api/v1/hotels/search?location=Miami
- GET http://localhost:3000/api/v1/hotels/1

## Step 6: Run Tests

### Run All Tests with Coverage

```bash
npm test
```

Expected output:
```
Test Suites: X passed, X total
Tests:       X passed, X total
Coverage:    > 80%
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Integration Tests Only

```bash
npm run test:integration
```

## Troubleshooting

### Database Connection Issues

**Error:** "Connection refused"
- ✅ Ensure PostgreSQL is running
- ✅ Check DATABASE_URL in .env
- ✅ Verify credentials are correct

**Error:** "Database does not exist"
```bash
# Recreate database
psql -U postgres
CREATE DATABASE hotel_booking OWNER hotel_app;
```

### Port Already in Use

**Error:** "Port 3000 is already in use"
- Change PORT in .env to another port (e.g., 3001)
- Or stop the process using port 3000

**On Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Migration Issues

**Reset Database (WARNING: Deletes all data)**
```bash
npm run migrate:rollback
npm run migrate:latest
npm run seed:run
```

### Missing Dependencies

```bash
# Reinstall all dependencies
rm -rf node_modules
npm install
```

## Directory Structure

```
claude_capston_project/
├── src/
│   ├── config/
│   │   └── database.js           # Database connection
│   ├── controllers/
│   │   └── hotelController.js    # HTTP handlers
│   ├── middleware/
│   │   ├── errorHandler.js       # Error handling
│   │   ├── rateLimiter.js        # Rate limiting
│   │   ├── security.js           # CORS & Helmet
│   │   └── validation.js         # Joi validation
│   ├── models/
│   │   └── Hotel.js              # Hotel entity
│   ├── repositories/
│   │   └── hotelRepository.js    # Data access
│   ├── routes/
│   │   ├── hotels.js             # Hotel routes
│   │   └── index.js              # Route aggregator
│   ├── services/
│   │   └── hotelService.js       # Business logic
│   ├── utils/
│   │   ├── constants.js          # Constants
│   │   ├── logger.js             # Winston logger
│   │   └── validators.js         # Validation utils
│   ├── app.js                    # Express app
│   └── server.js                 # Server entry point
├── migrations/                   # Database migrations
├── seeds/                        # Database seeds
├── tests/                        # Test files
├── .env.example                  # Environment template
├── knexfile.js                   # Knex configuration
├── package.json                  # Dependencies
└── HB001_IMPLEMENTATION.md       # Implementation details
```

## Logs

Logs are written to:
- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs
- Console - In development mode

## Next Steps

1. ✅ Server is running
2. ✅ Tests are passing
3. ✅ API endpoints are accessible

### Explore the API
- Read `HB001_IMPLEMENTATION.md` for detailed API documentation
- Test all endpoints with different filters
- Check rate limiting behavior
- Explore security headers

### Development
- Run tests in watch mode while developing
- Check logs for errors and slow queries
- Monitor database connection pool

### Production Deployment
- Set NODE_ENV=production
- Configure proper DATABASE_URL
- Set secure ALLOWED_ORIGINS
- Configure external logging service
- Set up Redis for rate limiting (future enhancement)

## Support

For issues or questions:
1. Check `HB001_IMPLEMENTATION.md` for detailed documentation
2. Review error logs in `logs/` directory
3. Ensure all prerequisites are installed
4. Verify database connection and migrations

## Key Features Implemented

✅ Hotel search with location, price, and rating filters  
✅ Sorting by price and rating  
✅ Pagination support  
✅ Rate limiting (100 req/min)  
✅ CORS and security headers  
✅ Input validation  
✅ Comprehensive error handling  
✅ Structured logging  
✅ 80%+ test coverage  
✅ Optimized database queries with indexes  
✅ Separate amenity loading (H-2 FIX)  
✅ API versioning (/api/v1/)  

Enjoy using the Hotel Booking System! 🏨
