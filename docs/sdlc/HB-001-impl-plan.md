# Implementation Plan: HB-001 - Hotel Search and Browse

## Document Information

| Field | Value |
|-------|-------|
| **User Story** | HB-001: Hotel Search and Browse |
| **Version** | 1.0 |
| **Date** | 2026-11-09 |
| **Author** | Implementation Planner Agent |
| **Status** | Ready for Implementation |

---

## 1. Implementation Overview

### 1.1 Approach

This implementation follows a **bottom-up approach**, starting with database schema and progressing through data access, business logic, and API layers. The implementation addresses all 2 high-priority and 5 medium-priority issues identified in the design review.

**Development Strategy:**
- **Test-Driven Development (TDD)**: Write tests before implementation
- **Incremental Delivery**: Each task produces a testable, working increment
- **Design Review Fixes First**: Address H-1 and H-2 before starting feature development
- **Continuous Integration**: Run tests after each task completion

### 1.2 Implementation Phases

**Phase 1: Foundation (3 days)**
- Database schema with pg_trgm extension (H-1 fix)
- Seed data for testing
- Project structure and dependencies
- Configuration and environment setup

**Phase 2: Core Implementation (5 days)**
- Models and repositories
- Services and business logic
- Controllers and API endpoints
- Middleware (validation, error handling, rate limiting)

**Phase 3: Testing & Optimization (3 days)**
- Unit tests (target: 90% coverage for services)
- Integration tests (API endpoints)
- Performance testing and optimization (H-2 fix if needed)
- Security testing

**Phase 4: Polish & Documentation (1 day)**
- Code review and refactoring
- API documentation
- Deployment preparation

### 1.3 Effort Estimate

| Phase | Duration | Developer Days |
|-------|----------|----------------|
| Phase 1: Foundation | 3 days | 3 |
| Phase 2: Core Implementation | 5 days | 5 |
| Phase 3: Testing & Optimization | 3 days | 3 |
| Phase 4: Polish & Documentation | 1 day | 1 |
| **Total** | **12 days** | **12** |

**Assumptions:**
- 1 full-time developer
- 8-hour working days
- No major blockers or scope changes
- Database and infrastructure already provisioned

### 1.4 Success Criteria

1. All 5 acceptance criteria (AC-001 to AC-005) pass
2. All 10 non-functional requirements verified
3. Test coverage ≥ 80% overall, ≥ 90% for services
4. Search response time < 2 seconds (95th percentile)
5. System supports 100+ concurrent users
6. Zero critical or high-severity defects
7. All design review high-priority issues resolved

---

## 2. Prerequisites

### 2.1 Database Setup

**PostgreSQL Installation:**
- PostgreSQL 14.x or higher
- Database: `hotel_booking`
- User: `hotel_app` with full privileges

```bash
# Create database
createdb hotel_booking

# Create user
psql -c "CREATE USER hotel_app WITH PASSWORD 'secure_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE hotel_booking TO hotel_app;"
```

**Required Extensions:**
```sql
-- Enable pg_trgm for fuzzy text search (H-1 fix)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Enable uuid-ossp if using UUIDs (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2.2 Node.js Dependencies

**package.json dependencies:**
```json
{
  "name": "hotel-booking-api",
  "version": "1.0.0",
  "description": "Hotel booking system API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:integration": "jest --testMatch='**/integration/**/*.test.js'",
    "migrate:latest": "knex migrate:latest",
    "migrate:rollback": "knex migrate:rollback",
    "seed:run": "knex seed:run",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "knex": "^2.5.1",
    "pg": "^8.11.3",
    "joi": "^17.11.0",
    "validator": "^13.11.0",
    "express-rate-limit": "^6.11.2",
    "rate-limit-redis": "^4.2.0",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.2",
    "eslint": "^8.55.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-jest": "^27.6.0"
  }
}
```

### 2.3 Environment Configuration

**Required environment variables (.env file):**
```bash
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://hotel_app:secure_password@localhost:5432/hotel_booking
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50

# Security Configuration
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Logging Configuration
LOG_LEVEL=info

# Test Database (for integration tests)
TEST_DATABASE_URL=postgresql://hotel_app:secure_password@localhost:5432/hotel_booking_test
```

### 2.4 Development Tools

- **Node.js**: 18.x LTS or higher
- **PostgreSQL**: 14.x or higher
- **Git**: For version control
- **Postman or Thunder Client**: For API testing
- **IDE**: VS Code or similar with ESLint support

---

## 3. Task Breakdown

### IMPL-001: Project Setup and Configuration
**Description:** Initialize project structure, install dependencies, configure tools

**Files to Create:**
- `package.json`
- `.env.example`
- `.eslintrc.js`
- `.prettierrc`
- `knexfile.js`
- `jest.config.js`
- `.gitignore`

**Dependencies:** None

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] All dependencies installed successfully
- [ ] ESLint configured and passes on empty project
- [ ] Jest configured and runs successfully
- [ ] Knex connects to PostgreSQL successfully
- [ ] Environment variables loaded correctly

---

### IMPL-002: Database Migration - Create Hotels Table
**Description:** Create hotels table with proper schema, constraints, and indexes including pg_trgm (H-1 fix)

**Files to Create:**
- `migrations/20261109_create_hotels_table.js`

**Dependencies:** IMPL-001

**Effort:** 3 hours

**Acceptance Criteria:**
- [ ] Hotels table created with all columns
- [ ] CHECK constraints added (price > 0, rating 1-5)
- [ ] B-tree indexes created on city, region, price, rating
- [ ] pg_trgm GIN indexes created for location search (H-1)
- [ ] Composite indexes created for common query patterns
- [ ] Migration runs without errors
- [ ] Migration can be rolled back successfully

**SQL Schema:**
```sql
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    address TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_price_positive CHECK (price_per_night > 0),
    CONSTRAINT chk_rating_range CHECK (rating IS NULL OR (rating >= 1.0 AND rating <= 5.0))
);

-- Standard B-tree indexes
CREATE INDEX idx_city ON hotels(city);
CREATE INDEX idx_region ON hotels(region);
CREATE INDEX idx_price ON hotels(price_per_night);
CREATE INDEX idx_rating ON hotels(rating);
CREATE INDEX idx_active ON hotels(is_active);

-- Trigram indexes for ILIKE queries (H-1 FIX - CRITICAL)
CREATE INDEX idx_city_trgm ON hotels USING GIN (LOWER(city) gin_trgm_ops);
CREATE INDEX idx_region_trgm ON hotels USING GIN (LOWER(region) gin_trgm_ops);

-- Composite indexes for common query patterns
CREATE INDEX idx_search_composite ON hotels(city, price_per_night, rating, is_active);
CREATE INDEX idx_location_composite ON hotels(city, region, is_active);

-- Partial index for active hotels only
CREATE INDEX idx_active_hotels ON hotels(city, price_per_night, rating) WHERE is_active = TRUE;
```

---

### IMPL-003: Database Migration - Create Amenities Tables
**Description:** Create amenities and hotel_amenities junction table

**Files to Create:**
- `migrations/20261109_create_amenities_tables.js`

**Dependencies:** IMPL-002

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Amenities table created with icon and display_order
- [ ] Hotel_amenities junction table created with foreign keys
- [ ] CASCADE delete configured
- [ ] Indexes created on foreign keys
- [ ] Migration runs without errors

**SQL Schema:**
```sql
CREATE TABLE amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    display_order INT DEFAULT 0
);

CREATE INDEX idx_amenities_name ON amenities(name);

CREATE TABLE hotel_amenities (
    hotel_id INT NOT NULL,
    amenity_id INT NOT NULL,
    
    PRIMARY KEY (hotel_id, amenity_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

CREATE INDEX idx_hotel_amenities_hotel ON hotel_amenities(hotel_id);
CREATE INDEX idx_hotel_amenities_amenity ON hotel_amenities(amenity_id);
```

---

### IMPL-004: Database Seed - Standard Amenities
**Description:** Seed standard amenities data

**Files to Create:**
- `seeds/01_amenities.js`

**Dependencies:** IMPL-003

**Effort:** 1 hour

**Acceptance Criteria:**
- [ ] 10 standard amenities seeded
- [ ] Amenities have icons and display order
- [ ] Seed script is idempotent (can run multiple times)

**Amenities to Seed:**
1. WiFi (icon: 'wifi', order: 1)
2. Pool (icon: 'pool', order: 2)
3. Parking (icon: 'parking', order: 3)
4. Gym (icon: 'gym', order: 4)
5. Spa (icon: 'spa', order: 5)
6. Restaurant (icon: 'restaurant', order: 6)
7. Room Service (icon: 'room-service', order: 7)
8. Pet Friendly (icon: 'pet', order: 8)
9. Business Center (icon: 'business', order: 9)
10. Air Conditioning (icon: 'ac', order: 10)

---

### IMPL-005: Database Seed - Test Hotels
**Description:** Seed test hotel data for development and testing

**Files to Create:**
- `seeds/02_hotels.js`

**Dependencies:** IMPL-004

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] At least 50 hotels seeded across 10+ cities
- [ ] Hotels have varied prices ($50-$500)
- [ ] Hotels have varied ratings (1.0-5.0)
- [ ] Hotels assigned random amenities (2-6 per hotel)
- [ ] Mix of active and inactive hotels
- [ ] Includes edge cases (unicode cities like "Montréal")

**Sample Data:**
- Cities: Miami, New York, Los Angeles, Chicago, Boston, San Francisco, Seattle, Austin, Denver, Portland
- Price range: $50 to $500
- Rating range: 1.0 to 5.0
- Include hotels with special characters in names

---

### IMPL-006: Constants and Utilities
**Description:** Create reusable constants and utility functions

**Files to Create:**
- `src/utils/constants.js`
- `src/utils/validators.js`

**Dependencies:** IMPL-001

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] All magic strings centralized in constants
- [ ] Sort options defined as constants
- [ ] Error codes defined as constants
- [ ] Validation constants (min/max lengths) defined
- [ ] Reusable validator functions created
- [ ] Unit tests for validators (100% coverage)

**constants.js Structure:**
```javascript
module.exports = {
  SORT_OPTIONS: {
    PRICE_ASC: 'price:asc',
    PRICE_DESC: 'price:desc',
    RATING_ASC: 'rating:asc',
    RATING_DESC: 'rating:desc'
  },
  
  ERROR_CODES: {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    HOTEL_NOT_FOUND: 'HOTEL_NOT_FOUND',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
  },
  
  VALIDATION: {
    LOCATION_MIN_LENGTH: 2,
    LOCATION_MAX_LENGTH: 100,
    MIN_RATING: 1.0,
    MAX_RATING: 5.0,
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE_SIZE: 100
  }
};
```

---

### IMPL-007: Database Configuration
**Description:** Configure Knex database connection with connection pooling

**Files to Create:**
- `src/config/database.js`

**Dependencies:** IMPL-001

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Knex instance configured with connection pooling
- [ ] Pool size set to min: 5, max: 50 (M-1 fix)
- [ ] Connection timeout configured
- [ ] Query timeout configured (5 seconds)
- [ ] Slow query logging configured (> 1 second)
- [ ] Environment-specific configs (dev, test, production)

**database.js Structure:**
```javascript
const knex = require('knex');
const { createLogger } = require('../utils/logger');

const logger = createLogger('database');

const config = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: {
    min: parseInt(process.env.DATABASE_POOL_MIN) || 5,
    max: parseInt(process.env.DATABASE_POOL_MAX) || 50,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 600000,
    reapIntervalMillis: 1000,
  },
  acquireConnectionTimeout: 30000,
};

const db = knex(config);

// Log slow queries
db.on('query', (query) => {
  query.startTime = Date.now();
});

db.on('query-response', (response, query) => {
  const duration = Date.now() - query.startTime;
  if (duration > 1000) {
    logger.warn('Slow query detected', {
      sql: query.sql,
      duration,
      bindings: query.bindings
    });
  }
});

module.exports = db;
```

---

### IMPL-008: Hotel Model
**Description:** Create Hotel entity model with data transformation

**Files to Create:**
- `src/models/Hotel.js`

**Dependencies:** IMPL-001

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Hotel class with constructor
- [ ] toJSON() method for API responses
- [ ] Proper data type conversions (price, rating)
- [ ] Location nested structure
- [ ] "Not Rated" handling for null ratings
- [ ] Unit tests (100% coverage)

---

### IMPL-009: Hotel Repository
**Description:** Implement data access layer for hotel queries

**Files to Create:**
- `src/repositories/hotelRepository.js`

**Dependencies:** IMPL-007, IMPL-008

**Effort:** 6 hours

**Acceptance Criteria:**
- [ ] `findHotelsByFilters()` method with dynamic query building
- [ ] `findHotelById()` method
- [ ] Location filter uses ILIKE with trigram indexes
- [ ] Price range filters
- [ ] Rating filter
- [ ] Dynamic sorting
- [ ] Pagination support
- [ ] Active hotels filter
- [ ] WITHOUT amenity join (H-2 optimization)
- [ ] Unit tests with mocked database (90% coverage)

**Key Methods:**
```javascript
class HotelRepository {
  async findHotelsByFilters(filters) {
    // Returns hotels WITHOUT amenities (H-2 fix)
  }
  
  async findHotelById(id) {
    // Returns single hotel WITHOUT amenities
  }
  
  async getHotelAmenities(hotelId) {
    // Separate method to load amenities
  }
  
  async getMultipleHotelsAmenities(hotelIds) {
    // Batch load amenities for multiple hotels
  }
}
```

---

### IMPL-010: Hotel Service
**Description:** Implement business logic layer

**Files to Create:**
- `src/services/hotelService.js`

**Dependencies:** IMPL-009

**Effort:** 4 hours

**Acceptance Criteria:**
- [ ] `searchHotels()` method with business rules
- [ ] `getHotelById()` method
- [ ] Case-insensitive location matching
- [ ] Data transformation to Hotel models
- [ ] Amenities loaded separately in detail view only (H-2)
- [ ] Error handling
- [ ] Unit tests with mocked repository (95% coverage)

**Key Methods:**
```javascript
class HotelService {
  async searchHotels(filters) {
    // Apply business rules
    // Call repository
    // Transform to DTOs (without amenities)
    // Return paginated results
  }
  
  async getHotelById(id) {
    // Get hotel details
    // Load amenities separately
    // Transform to DTO
    // Return full hotel object
  }
}
```

---

### IMPL-011: Validation Middleware
**Description:** Create request validation middleware with Joi

**Files to Create:**
- `src/middleware/validation.js`

**Dependencies:** IMPL-006

**Effort:** 3 hours

**Acceptance Criteria:**
- [ ] `validateSearchQuery` middleware
- [ ] `validateHotelId` middleware
- [ ] Comprehensive Joi schemas
- [ ] Custom validation for minPrice <= maxPrice
- [ ] Error response formatting
- [ ] Unit tests (100% coverage)

**Joi Schema:**
```javascript
const searchQuerySchema = Joi.object({
  location: Joi.string().trim().min(2).max(100).required(),
  minPrice: Joi.number().min(0).max(999999.99).optional(),
  maxPrice: Joi.number().min(0).max(999999.99).optional(),
  minRating: Joi.number().min(1.0).max(5.0).optional(),
  sortBy: Joi.string()
    .valid('price:asc', 'price:desc', 'rating:asc', 'rating:desc')
    .default('rating:desc'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(100)
}).custom((value, helpers) => {
  if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
    return helpers.error('custom.minGreaterThanMax');
  }
  return value;
});
```

---

### IMPL-012: Error Handler Middleware
**Description:** Create centralized error handling middleware

**Files to Create:**
- `src/middleware/errorHandler.js`

**Dependencies:** IMPL-006

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Catches all errors
- [ ] Environment-specific error messages (dev vs prod)
- [ ] Structured error responses
- [ ] Error logging
- [ ] HTTP status code mapping
- [ ] Unit tests (100% coverage)

---

### IMPL-013: Rate Limiter Middleware
**Description:** Create rate limiting middleware

**Files to Create:**
- `src/middleware/rateLimiter.js`

**Dependencies:** IMPL-001

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] IP-based rate limiting (100 req/min)
- [ ] Standard headers (X-RateLimit-Remaining)
- [ ] Custom error messages
- [ ] Configurable via environment variables
- [ ] Note: Redis-backed distributed rate limiting (M-2) deferred to Phase 4

**Configuration:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});
```

---

### IMPL-014: CORS and Security Middleware
**Description:** Configure CORS and security headers (M-5 fix)

**Files to Create:**
- `src/middleware/security.js`

**Dependencies:** IMPL-001

**Effort:** 1.5 hours

**Acceptance Criteria:**
- [ ] CORS configured with environment-based origins
- [ ] Helmet.js configured for security headers
- [ ] Request ID middleware
- [ ] Security headers verified
- [ ] Integration tests

**CORS Configuration:**
```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-ID'],
  exposedHeaders: ['X-RateLimit-Remaining', 'X-Request-ID'],
  maxAge: 86400
};
```

---

### IMPL-015: Logger Utility
**Description:** Create structured logging utility with Winston

**Files to Create:**
- `src/utils/logger.js`

**Dependencies:** IMPL-001

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Winston configured with JSON format
- [ ] Log levels: debug, info, warn, error
- [ ] File transports (error.log, combined.log)
- [ ] Console transport for development
- [ ] Structured logging with metadata
- [ ] Request ID included in logs

---

### IMPL-016: Hotel Controller
**Description:** Create HTTP request handlers

**Files to Create:**
- `src/controllers/hotelController.js`

**Dependencies:** IMPL-010

**Effort:** 3 hours

**Acceptance Criteria:**
- [ ] `searchHotels()` handler
- [ ] `getHotelById()` handler
- [ ] Request parsing
- [ ] Response formatting
- [ ] Error handling with try-catch
- [ ] HTTP status codes
- [ ] Unit tests with mocked service (90% coverage)

**Controller Structure:**
```javascript
class HotelController {
  async searchHotels(req, res, next) {
    try {
      const filters = {
        location: req.query.location,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
        minRating: req.query.minRating ? parseFloat(req.query.minRating) : undefined,
        sortBy: req.query.sortBy || 'rating:desc',
        page: parseInt(req.query.page) || 1,
        limit: Math.min(parseInt(req.query.limit) || 100, 100)
      };

      const result = await hotelService.searchHotels(filters);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getHotelById(req, res, next) {
    try {
      const hotelId = parseInt(req.params.id);
      const hotel = await hotelService.getHotelById(hotelId);

      if (!hotel) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'HOTEL_NOT_FOUND',
            message: `Hotel with ID ${hotelId} not found`
          }
        });
      }

      res.status(200).json({
        success: true,
        data: hotel
      });
    } catch (error) {
      next(error);
    }
  }
}
```

---

### IMPL-017: Hotel Routes
**Description:** Define API endpoints and route configuration

**Files to Create:**
- `src/routes/hotels.js`
- `src/routes/index.js`

**Dependencies:** IMPL-016, IMPL-011, IMPL-013

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] GET /api/v1/hotels/search endpoint (M-3: versioning)
- [ ] GET /api/v1/hotels/:id endpoint
- [ ] Middleware pipeline configured
- [ ] Rate limiter applied
- [ ] Validation middleware applied
- [ ] Routes registered with Express app

**Route Configuration:**
```javascript
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { validateSearchQuery, validateHotelId } = require('../middleware/validation');
const rateLimiter = require('../middleware/rateLimiter');

// Apply rate limiter to all hotel routes
router.use(rateLimiter);

// Search hotels with filters
router.get('/search', validateSearchQuery, hotelController.searchHotels);

// Get hotel by ID
router.get('/:id', validateHotelId, hotelController.getHotelById);

module.exports = router;
```

---

### IMPL-018: Express Application Setup
**Description:** Configure Express application with all middleware

**Files to Create:**
- `src/app.js`
- `src/server.js`

**Dependencies:** IMPL-017, IMPL-012, IMPL-014, IMPL-015

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Express app configured
- [ ] Middleware pipeline: CORS → Security → Body parser → Request ID → Routes → Error handler
- [ ] API versioning (/api/v1) implemented (M-3)
- [ ] Health check endpoint
- [ ] 404 handler
- [ ] Server starts successfully
- [ ] Integration tests

**app.js Structure:**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');
const corsOptions = require('./middleware/security').corsOptions;
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Request ID middleware
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  xssFilter: true,
  noSniff: true,
  frameguard: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS middleware (M-5 fix)
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info('Incoming request', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes with versioning (M-3 fix)
const hotelRoutes = require('./routes/hotels');
app.use('/api/v1/hotels', hotelRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
```

---

### IMPL-019: Unit Tests - Validators
**Description:** Write unit tests for validation utilities

**Files to Create:**
- `tests/unit/utils/validators.test.js`

**Dependencies:** IMPL-006

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Test all validator functions
- [ ] Test edge cases (boundary values)
- [ ] Test invalid inputs
- [ ] 100% code coverage for validators
- [ ] All tests pass

---

### IMPL-020: Unit Tests - Hotel Repository
**Description:** Write unit tests for hotel repository

**Files to Create:**
- `tests/unit/repositories/hotelRepository.test.js`

**Dependencies:** IMPL-009

**Effort:** 4 hours

**Acceptance Criteria:**
- [ ] Mock Knex database
- [ ] Test findHotelsByFilters with various filter combinations
- [ ] Test findHotelById
- [ ] Test getHotelAmenities
- [ ] Test error handling
- [ ] 90% code coverage
- [ ] All tests pass

---

### IMPL-021: Unit Tests - Hotel Service
**Description:** Write unit tests for hotel service

**Files to Create:**
- `tests/unit/services/hotelService.test.js`

**Dependencies:** IMPL-010

**Effort:** 4 hours

**Acceptance Criteria:**
- [ ] Mock repository
- [ ] Test searchHotels with various filters
- [ ] Test case-insensitive location matching
- [ ] Test price range filtering logic
- [ ] Test rating filtering logic
- [ ] Test getHotelById
- [ ] Test error scenarios
- [ ] 95% code coverage
- [ ] All tests pass

---

### IMPL-022: Unit Tests - Hotel Controller
**Description:** Write unit tests for hotel controller

**Files to Create:**
- `tests/unit/controllers/hotelController.test.js`

**Dependencies:** IMPL-016

**Effort:** 3 hours

**Acceptance Criteria:**
- [ ] Mock service
- [ ] Test searchHotels request handling
- [ ] Test getHotelById request handling
- [ ] Test response formatting
- [ ] Test error handling (404, 500)
- [ ] 90% code coverage
- [ ] All tests pass

---

### IMPL-023: Unit Tests - Middleware
**Description:** Write unit tests for all middleware

**Files to Create:**
- `tests/unit/middleware/validation.test.js`
- `tests/unit/middleware/errorHandler.test.js`

**Dependencies:** IMPL-011, IMPL-012

**Effort:** 3 hours

**Acceptance Criteria:**
- [ ] Test validation middleware with valid/invalid inputs
- [ ] Test error handler with different error types
- [ ] Test error message sanitization (dev vs prod)
- [ ] 100% code coverage for middleware
- [ ] All tests pass

---

### IMPL-024: Integration Tests - Search Endpoint
**Description:** Write integration tests for hotel search endpoint

**Files to Create:**
- `tests/integration/hotelSearch.test.js`
- `tests/setup.js` (test database setup)
- `tests/fixtures/hotels.js` (test data)

**Dependencies:** IMPL-018

**Effort:** 4 hours

**Acceptance Criteria:**
- [ ] Test search by location
- [ ] Test filter by price range
- [ ] Test filter by rating
- [ ] Test multiple filters combined
- [ ] Test sorting (all 4 options)
- [ ] Test pagination
- [ ] Test empty results
- [ ] Test validation errors
- [ ] Test with real test database
- [ ] All tests pass

**Key Test Cases:**
```javascript
describe('GET /api/v1/hotels/search', () => {
  it('should return hotels matching location', async () => {
    const response = await request(app)
      .get('/api/v1/hotels/search')
      .query({ location: 'Miami' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.hotels).toBeInstanceOf(Array);
  });
  
  it('should filter by price range', async () => {
    const response = await request(app)
      .get('/api/v1/hotels/search')
      .query({ location: 'Miami', minPrice: 100, maxPrice: 200 });
    
    expect(response.status).toBe(200);
    response.body.data.hotels.forEach(hotel => {
      expect(parseFloat(hotel.pricePerNight)).toBeGreaterThanOrEqual(100);
      expect(parseFloat(hotel.pricePerNight)).toBeLessThanOrEqual(200);
    });
  });
  
  it('should return 400 for invalid price range', async () => {
    const response = await request(app)
      .get('/api/v1/hotels/search')
      .query({ location: 'Miami', minPrice: 200, maxPrice: 100 });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
```

---

### IMPL-025: Integration Tests - Hotel Detail Endpoint
**Description:** Write integration tests for hotel by ID endpoint

**Files to Create:**
- `tests/integration/hotelDetail.test.js`

**Dependencies:** IMPL-024

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Test get hotel by valid ID
- [ ] Test 404 for non-existent hotel
- [ ] Test 404 for inactive hotel
- [ ] Test amenities are included
- [ ] Test with real test database
- [ ] All tests pass

---

### IMPL-026: Security Tests
**Description:** Write security-focused tests

**Files to Create:**
- `tests/security/injection.test.js`

**Dependencies:** IMPL-024

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Test SQL injection attempts
- [ ] Test XSS attempts
- [ ] Test special characters in location
- [ ] Test very long inputs
- [ ] Test rate limiting enforcement
- [ ] All malicious inputs rejected with 400

**Test Cases:**
```javascript
describe('Security Tests', () => {
  it('should reject SQL injection attempts', async () => {
    const maliciousInputs = [
      "'; DROP TABLE hotels; --",
      "1' OR '1'='1",
      "Miami'; DELETE FROM hotels WHERE '1'='1"
    ];
    
    for (const payload of maliciousInputs) {
      const response = await request(app)
        .get('/api/v1/hotels/search')
        .query({ location: payload });
      
      expect(response.status).toBe(400);
    }
  });
  
  it('should reject XSS attempts', async () => {
    const response = await request(app)
      .get('/api/v1/hotels/search')
      .query({ location: '<script>alert("xss")</script>' });
    
    expect(response.status).toBe(400);
  });
});
```

---

### IMPL-027: Performance Testing Setup
**Description:** Set up performance tests with load testing tool

**Files to Create:**
- `tests/performance/load-test.yml` (Artillery config)
- `tests/performance/README.md`

**Dependencies:** IMPL-025

**Effort:** 3 hours

**Acceptance Criteria:**
- [ ] Artillery or K6 configured
- [ ] Load test scenarios defined
- [ ] 100 concurrent users scenario
- [ ] Various query combinations
- [ ] Performance metrics captured (p50, p95, p99)
- [ ] Instructions documented

**Artillery Configuration:**
```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"
  variables:
    locations:
      - "Miami"
      - "New York"
      - "Los Angeles"
      - "Chicago"
      - "Boston"

scenarios:
  - name: "Search hotels"
    weight: 70
    flow:
      - get:
          url: "/api/v1/hotels/search?location={{ location }}&minPrice=100&maxPrice=300&sortBy=rating:desc"
          
  - name: "Get hotel details"
    weight: 30
    flow:
      - get:
          url: "/api/v1/hotels/search?location={{ location }}"
      - think: 2
      - get:
          url: "/api/v1/hotels/{{ $randomNumber(1, 50) }}"
```

---

### IMPL-028: Performance Testing Execution
**Description:** Run performance tests and optimize if needed (H-2 decision point)

**Files to Create:**
- `docs/performance-test-results.md`

**Dependencies:** IMPL-027

**Effort:** 4 hours

**Acceptance Criteria:**
- [ ] Load test executed with 10K hotels in database
- [ ] 100 concurrent users sustained for 5 minutes
- [ ] p95 response time < 2 seconds (NFR-001)
- [ ] p95 filter time < 500ms (NFR-002)
- [ ] p95 sort time < 300ms (NFR-003)
- [ ] No connection pool exhaustion
- [ ] No errors under load
- [ ] Results documented

**Decision Point - H-2 Optimization:**
- If tests PASS: Proceed to IMPL-029
- If tests FAIL due to amenity join overhead:
  - Implement amenity caching or separate loading
  - Re-run tests
  - Document optimization

---

### IMPL-029: Test Coverage Verification
**Description:** Verify overall test coverage meets targets

**Files to Create:**
- `coverage/lcov-report/index.html` (generated)

**Dependencies:** IMPL-028

**Effort:** 2 hours

**Acceptance Criteria:**
- [ ] Overall coverage ≥ 80%
- [ ] Service layer coverage ≥ 90%
- [ ] Repository layer coverage ≥ 85%
- [ ] Middleware coverage ≥ 90%
- [ ] Coverage report generated
- [ ] Coverage badge created (optional)

**Jest Coverage Configuration:**
```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "./src/services/**/*.js": {
        "lines": 90
      },
      "./src/repositories/**/*.js": {
        "lines": 85
      },
      "./src/middleware/**/*.js": {
        "lines": 90
      }
    }
  }
}
```

---

### IMPL-030: API Documentation
**Description:** Create API documentation

**Files to Create:**
- `docs/api/README.md`
- `docs/api/endpoints.md`
- `docs/api/examples.md`

**Dependencies:** IMPL-018

**Effort:** 3 hours

**Acceptance Criteria:**
- [ ] All endpoints documented
- [ ] Request/response examples provided
- [ ] Query parameters documented
- [ ] Error responses documented
- [ ] Authentication (none for HB-001) noted
- [ ] Rate limiting documented
- [ ] Postman collection created (optional)

---

### IMPL-031: Code Review and Refactoring
**Description:** Final code review and refactoring

**Files Modified:** All implementation files

**Dependencies:** IMPL-029

**Effort:** 4 hours

**Acceptance Criteria:**
- [ ] Code follows ESLint rules
- [ ] No console.log statements (use logger)
- [ ] No magic strings (use constants)
- [ ] Consistent error handling
- [ ] Consistent naming conventions
- [ ] Code comments for complex logic
- [ ] No TODO comments left
- [ ] All tests still pass after refactoring

---

### IMPL-032: Deployment Preparation
**Description:** Prepare for deployment

**Files to Create:**
- `README.md` (update)
- `DEPLOYMENT.md`
- `.env.example` (finalize)
- `docker-compose.yml` (optional)

**Dependencies:** IMPL-031

**Effort:** 3 hours

**Acceptance Criteria:**
- [ ] README updated with setup instructions
- [ ] Deployment guide created
- [ ] Environment variables documented
- [ ] Database migration instructions clear
- [ ] Seed data instructions clear
- [ ] Health check endpoint documented
- [ ] Monitoring recommendations documented

---

## 4. File-by-File Implementation Plan

### 4.1 Database Layer

#### migrations/20261109_create_hotels_table.js
**Purpose:** Create hotels table with optimized indexes including pg_trgm (H-1 fix)

**Key Functions:**
- `exports.up(knex)` - Create table and indexes
- `exports.down(knex)` - Drop table and indexes

**Dependencies:** PostgreSQL 14+, pg_trgm extension

**Test Coverage:** Migration tests (rollback success)

---

#### migrations/20261109_create_amenities_tables.js
**Purpose:** Create amenities and hotel_amenities tables

**Key Functions:**
- `exports.up(knex)` - Create tables with foreign keys
- `exports.down(knex)` - Drop tables

**Dependencies:** hotels table migration

**Test Coverage:** Migration tests

---

#### seeds/01_amenities.js
**Purpose:** Seed standard amenities

**Key Functions:**
- `exports.seed(knex)` - Insert 10 standard amenities

**Dependencies:** amenities table

**Test Coverage:** Verify seeded data

---

#### seeds/02_hotels.js
**Purpose:** Seed test hotels with varied data

**Key Functions:**
- `exports.seed(knex)` - Insert 50+ test hotels

**Dependencies:** hotels table, amenities seed

**Test Coverage:** Verify seeded data variety

---

### 4.2 Configuration Layer

#### src/config/database.js
**Purpose:** Configure Knex with connection pooling and monitoring

**Key Functions:**
- `createKnexInstance()` - Create configured Knex instance
- Query event handlers for logging slow queries

**Dependencies:** Knex, Winston logger

**Test Coverage:** Unit tests for configuration

---

### 4.3 Model Layer

#### src/models/Hotel.js
**Purpose:** Hotel entity with data transformation

**Key Functions:**
- `constructor(data)` - Initialize hotel from database row
- `toJSON()` - Transform to API response format

**Dependencies:** None (POJO)

**Test Coverage:** 100% - test all transformations

---

### 4.4 Repository Layer

#### src/repositories/hotelRepository.js
**Purpose:** Data access layer for hotel queries

**Key Functions:**
- `findHotelsByFilters(filters)` - Search hotels with filters (WITHOUT amenities)
- `findHotelById(id)` - Get single hotel by ID (WITHOUT amenities)
- `getHotelAmenities(hotelId)` - Get amenities for single hotel
- `getMultipleHotelsAmenities(hotelIds)` - Batch get amenities
- `buildLocationFilter(query, location)` - Build ILIKE query with trigram
- `buildPriceFilter(query, minPrice, maxPrice)` - Build price range filter
- `buildRatingFilter(query, minRating)` - Build rating filter
- `applySorting(query, sortBy)` - Apply ORDER BY
- `applyPagination(query, page, limit)` - Apply LIMIT/OFFSET

**Dependencies:** Knex, database config

**Test Coverage:** 90% - mock database, test all filter combinations

**H-2 Optimization:** Amenities loaded separately, not in search query

---

### 4.5 Service Layer

#### src/services/hotelService.js
**Purpose:** Business logic for hotel operations

**Key Functions:**
- `searchHotels(filters)` - Search with business rules
- `getHotelById(id)` - Get hotel with amenities
- `sanitizeLocation(location)` - Apply case-insensitive matching
- `validateFilters(filters)` - Apply business rule validations
- `transformToDTO(hotel)` - Convert to Hotel model
- `buildPaginationMetadata(total, page, limit)` - Build pagination object

**Dependencies:** hotelRepository, Hotel model

**Test Coverage:** 95% - mock repository, test business rules

---

### 4.6 Controller Layer

#### src/controllers/hotelController.js
**Purpose:** HTTP request/response handling

**Key Functions:**
- `searchHotels(req, res, next)` - Handle search requests
- `getHotelById(req, res, next)` - Handle detail requests
- `parseSearchFilters(req.query)` - Parse and convert query params
- `formatSuccessResponse(data)` - Format 200 response
- `formatErrorResponse(error)` - Format error response

**Dependencies:** hotelService, logger

**Test Coverage:** 90% - mock service, test request handling

---

### 4.7 Middleware Layer

#### src/middleware/validation.js
**Purpose:** Request validation with Joi

**Key Functions:**
- `validateSearchQuery(req, res, next)` - Validate search query params
- `validateHotelId(req, res, next)` - Validate hotel ID param
- `formatValidationErrors(joiError)` - Format Joi errors to API format

**Dependencies:** Joi, constants

**Test Coverage:** 100% - test all validation rules

---

#### src/middleware/errorHandler.js
**Purpose:** Centralized error handling

**Key Functions:**
- `errorHandler(err, req, res, next)` - Main error handler
- `isOperationalError(err)` - Determine if error is operational
- `sanitizeErrorForProduction(err)` - Hide sensitive details in prod

**Dependencies:** Logger, constants

**Test Coverage:** 100% - test error types

---

#### src/middleware/rateLimiter.js
**Purpose:** Rate limiting

**Key Functions:**
- Express rate limit middleware configuration

**Dependencies:** express-rate-limit

**Test Coverage:** Integration tests

---

#### src/middleware/security.js
**Purpose:** CORS and security headers (M-5 fix)

**Key Functions:**
- `corsOptions` - CORS configuration
- `requestIdMiddleware()` - Add request ID
- Helmet configuration

**Dependencies:** cors, helmet

**Test Coverage:** Integration tests verify headers

---

### 4.8 Utility Layer

#### src/utils/constants.js
**Purpose:** Centralized constants

**Exports:**
- `SORT_OPTIONS` - Valid sort options
- `ERROR_CODES` - Error code strings
- `VALIDATION` - Validation constants

**Dependencies:** None

**Test Coverage:** N/A (constants)

---

#### src/utils/validators.js
**Purpose:** Reusable validation functions

**Key Functions:**
- `isValidLocation(location)` - Validate location string
- `isValidPriceRange(minPrice, maxPrice)` - Validate price range
- `isValidRating(rating)` - Validate rating value
- `sanitizeInput(input)` - Sanitize user input

**Dependencies:** validator.js

**Test Coverage:** 100% - test all validators

---

#### src/utils/logger.js
**Purpose:** Structured logging with Winston

**Key Functions:**
- `createLogger(module)` - Create logger instance
- Winston configuration

**Dependencies:** Winston

**Test Coverage:** Unit tests for log formatting

---

### 4.9 Route Layer

#### src/routes/hotels.js
**Purpose:** Define hotel API endpoints

**Routes:**
- `GET /search` - Search hotels with filters
- `GET /:id` - Get hotel by ID

**Middleware Pipeline:**
- rateLimiter → validation → controller

**Dependencies:** Express, controller, middleware

**Test Coverage:** Integration tests

---

#### src/routes/index.js
**Purpose:** Register all routes with versioning

**Routes:**
- `/api/v1/hotels` → hotel routes (M-3 fix: versioning)

**Dependencies:** Express, hotel routes

**Test Coverage:** Integration tests

---

### 4.10 Application Layer

#### src/app.js
**Purpose:** Express application configuration

**Middleware Pipeline:**
1. Request ID
2. Helmet (security headers)
3. CORS (M-5 fix)
4. Body parser
5. Request logging
6. Routes
7. 404 handler
8. Error handler

**Dependencies:** All middleware and routes

**Test Coverage:** Integration tests

---

#### src/server.js
**Purpose:** Server startup

**Key Functions:**
- Start Express server
- Handle graceful shutdown
- Database connection check

**Dependencies:** app.js, database config

**Test Coverage:** Startup tests

---

## 5. Database Schema

### 5.1 Complete Migration Scripts

#### Migration 1: Create Hotels Table

```javascript
// migrations/20261109_create_hotels_table.js

exports.up = async function(knex) {
  // Enable pg_trgm extension (H-1 FIX - CRITICAL)
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
  
  // Create hotels table
  await knex.schema.createTable('hotels', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.text('description');
    table.string('city', 100).notNullable();
    table.string('region', 100);
    table.text('address');
    table.decimal('price_per_night', 10, 2).notNullable();
    table.decimal('rating', 2, 1);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Add CHECK constraints (M-4 fix)
    table.check('price_per_night > 0', [], 'chk_price_positive');
    table.check('rating IS NULL OR (rating >= 1.0 AND rating <= 5.0)', [], 'chk_rating_range');
  });
  
  // Standard B-tree indexes
  await knex.raw('CREATE INDEX idx_city ON hotels(city);');
  await knex.raw('CREATE INDEX idx_region ON hotels(region);');
  await knex.raw('CREATE INDEX idx_price ON hotels(price_per_night);');
  await knex.raw('CREATE INDEX idx_rating ON hotels(rating);');
  await knex.raw('CREATE INDEX idx_active ON hotels(is_active);');
  
  // Trigram indexes for ILIKE queries (H-1 FIX - CRITICAL)
  await knex.raw('CREATE INDEX idx_city_trgm ON hotels USING GIN (LOWER(city) gin_trgm_ops);');
  await knex.raw('CREATE INDEX idx_region_trgm ON hotels USING GIN (LOWER(region) gin_trgm_ops);');
  
  // Composite indexes for common query patterns
  await knex.raw('CREATE INDEX idx_search_composite ON hotels(city, price_per_night, rating, is_active);');
  await knex.raw('CREATE INDEX idx_location_composite ON hotels(city, region, is_active);');
  
  // Partial index for active hotels only
  await knex.raw('CREATE INDEX idx_active_hotels ON hotels(city, price_per_night, rating) WHERE is_active = TRUE;');
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('hotels');
  // Note: Extension remains (safe for other uses)
};
```

#### Migration 2: Create Amenities Tables

```javascript
// migrations/20261109_create_amenities_tables.js

exports.up = async function(knex) {
  // Create amenities table
  await knex.schema.createTable('amenities', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable().unique();
    table.string('icon', 50);
    table.integer('display_order').defaultTo(0);
  });
  
  // Create index on name
  await knex.raw('CREATE INDEX idx_amenities_name ON amenities(name);');
  
  // Create hotel_amenities junction table
  await knex.schema.createTable('hotel_amenities', (table) => {
    table.integer('hotel_id').unsigned().notNullable();
    table.integer('amenity_id').unsigned().notNullable();
    
    table.primary(['hotel_id', 'amenity_id']);
    
    table.foreign('hotel_id')
      .references('id')
      .inTable('hotels')
      .onDelete('CASCADE');
    
    table.foreign('amenity_id')
      .references('id')
      .inTable('amenities')
      .onDelete('CASCADE');
  });
  
  // Create indexes on foreign keys
  await knex.raw('CREATE INDEX idx_hotel_amenities_hotel ON hotel_amenities(hotel_id);');
  await knex.raw('CREATE INDEX idx_hotel_amenities_amenity ON hotel_amenities(amenity_id);');
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('hotel_amenities');
  await knex.schema.dropTableIfExists('amenities');
};
```

### 5.2 Index Strategy Summary

**H-1 Fix - pg_trgm GIN Indexes:**
- `idx_city_trgm` - Enables fast ILIKE queries on city with wildcards
- `idx_region_trgm` - Enables fast ILIKE queries on region with wildcards
- **Impact:** Reduces query time from O(n) full table scan to O(log n) index lookup
- **Performance:** Sub-100ms searches on 1M+ hotels

**Composite Indexes:**
- `idx_search_composite` - Covers most common query: location + price + rating + active
- `idx_location_composite` - Covers location-only searches with active filter
- `idx_active_hotels` (partial) - Optimized for active hotels only (50% smaller than full index)

**Total Indexes:** 13 indexes across 3 tables

---

## 6. Implementation Order

### Detailed Sequence

```
Phase 1: Foundation (Day 1-3)
├── IMPL-001: Project Setup (Day 1, 2h)
├── IMPL-002: Hotels Table Migration (Day 1, 3h)
├── IMPL-003: Amenities Tables Migration (Day 1, 2h)
├── IMPL-004: Seed Amenities (Day 1, 1h)
├── IMPL-005: Seed Hotels (Day 2, 2h)
├── IMPL-006: Constants & Utilities (Day 2, 2h)
├── IMPL-007: Database Configuration (Day 2, 2h)
├── IMPL-015: Logger Utility (Day 2, 2h)
└── IMPL-008: Hotel Model (Day 3, 2h)

Phase 2: Core Implementation (Day 4-8)
├── IMPL-009: Hotel Repository (Day 4, 6h)
├── IMPL-010: Hotel Service (Day 5, 4h)
├── IMPL-011: Validation Middleware (Day 5, 3h)
├── IMPL-012: Error Handler (Day 6, 2h)
├── IMPL-013: Rate Limiter (Day 6, 2h)
├── IMPL-014: CORS & Security (Day 6, 1.5h)
├── IMPL-016: Hotel Controller (Day 6, 3h)
├── IMPL-017: Hotel Routes (Day 7, 2h)
└── IMPL-018: Express App Setup (Day 7-8, 2h)

Phase 3: Testing & Optimization (Day 9-11)
├── IMPL-019: Unit Tests - Validators (Day 9, 2h)
├── IMPL-020: Unit Tests - Repository (Day 9, 4h)
├── IMPL-021: Unit Tests - Service (Day 9, 4h)
├── IMPL-022: Unit Tests - Controller (Day 10, 3h)
├── IMPL-023: Unit Tests - Middleware (Day 10, 3h)
├── IMPL-024: Integration Tests - Search (Day 10, 4h)
├── IMPL-025: Integration Tests - Detail (Day 11, 2h)
├── IMPL-026: Security Tests (Day 11, 2h)
├── IMPL-027: Performance Test Setup (Day 11, 3h)
├── IMPL-028: Performance Test Execution (Day 11, 4h)
└── IMPL-029: Coverage Verification (Day 11, 2h)

Phase 4: Polish & Documentation (Day 12)
├── IMPL-030: API Documentation (Day 12, 3h)
├── IMPL-031: Code Review & Refactoring (Day 12, 4h)
└── IMPL-032: Deployment Preparation (Day 12, 3h)
```

### Critical Path

The following tasks are on the critical path and cannot be parallelized:
1. IMPL-001 → IMPL-002 → IMPL-003 → IMPL-009 → IMPL-010 → IMPL-016 → IMPL-018
2. Any delay in these tasks delays the entire project

### Parallelization Opportunities

- IMPL-006, IMPL-007, IMPL-015 can be done in parallel (Day 2)
- IMPL-011, IMPL-012, IMPL-013, IMPL-014 can be done in parallel (Day 6)
- All unit tests (IMPL-019 through IMPL-023) can be written in parallel if resources available

---

## 7. Testing Strategy

### 7.1 Test Pyramid

```
           /\
          /  \
         / E2E \
        /  (5%) \
       /----------\
      /Integration\
     /    (25%)    \
    /--------------\
   /   Unit Tests   \
  /     (70%)       \
 /------------------\
```

### 7.2 Unit Tests (70% of tests)

**Target Modules:**
- Services (target: 95% coverage)
- Repositories (target: 90% coverage)
- Middleware (target: 100% coverage)
- Utilities (target: 100% coverage)
- Controllers (target: 90% coverage)

**Mocking Strategy:**
- Mock database for repository tests
- Mock repository for service tests
- Mock service for controller tests
- Use Jest mocks and spies

**Key Test Cases:**
```javascript
// Service Tests
- searchHotels with various filter combinations
- Case-insensitive location matching
- Price range validation
- Rating filtering
- Sorting logic
- Pagination calculations
- Empty result handling
- Error handling

// Repository Tests
- Query building for each filter
- Dynamic WHERE clause construction
- ORDER BY logic
- LIMIT/OFFSET logic
- Amenity loading (separate from search)
- Error handling

// Middleware Tests
- Validation for all valid inputs
- Validation errors for invalid inputs
- minPrice <= maxPrice validation
- Error message formatting
- Rate limiting (unit test configuration)
```

### 7.3 Integration Tests (25% of tests)

**Target:** Full API endpoints with real test database

**Setup:**
- Separate test database
- Run migrations before tests
- Seed test data before each test suite
- Clean up after tests

**Key Test Cases:**
```javascript
// Search Endpoint
- Search by location (partial match)
- Filter by price range
- Filter by rating
- Multiple filters combined
- All 4 sort options
- Pagination (page 1, 2, 3)
- Empty results
- 400 validation errors
- Rate limiting (with real requests)

// Detail Endpoint
- Get hotel by valid ID
- 404 for non-existent ID
- Amenities included in response
- Inactive hotels excluded

// Security
- SQL injection attempts
- XSS attempts
- Invalid characters
- Very long inputs
```

### 7.4 Performance Tests (Manual)

**Tool:** Artillery or K6

**Scenarios:**
1. **Baseline Test:** 10 concurrent users, 1 minute
2. **Target Load:** 100 concurrent users, 5 minutes
3. **Stress Test:** 500 concurrent users, find breaking point
4. **Soak Test:** 100 concurrent users, 1 hour (memory leaks)

**Metrics:**
- Response time: p50, p95, p99
- Throughput: requests per second
- Error rate: % of failed requests
- Database connections: active/max

**Success Criteria:**
- p95 < 2 seconds for search (NFR-001)
- p95 < 500ms for filter application (NFR-002)
- p95 < 300ms for sorting (NFR-003)
- 0% error rate
- No connection pool exhaustion

### 7.5 Security Tests

**Tools:** Jest + custom test cases

**Test Cases:**
- SQL injection payloads (10+ variations)
- XSS payloads (5+ variations)
- Path traversal attempts
- Unicode and special characters
- Very long strings (boundary testing)
- Rate limit bypass attempts

### 7.6 Test Data

**Fixtures:**
```javascript
// tests/fixtures/hotels.js
module.exports = {
  validHotel: {
    name: 'Test Hotel',
    city: 'Miami',
    region: 'Florida',
    price_per_night: 150.00,
    rating: 4.5,
    is_active: true
  },
  
  inactiveHotel: { /* ... */ },
  
  hotelWithNoRating: { /* ... */ },
  
  hotelWithUnicode: {
    name: 'Hôtel Montréal',
    city: 'Montréal',
    region: 'Québec',
    // ...
  },
  
  expensiveHotel: {
    price_per_night: 450.00,
    // ...
  },
  
  budgetHotel: {
    price_per_night: 55.00,
    // ...
  }
};
```

### 7.7 Coverage Targets

| Module | Target | Rationale |
|--------|--------|-----------|
| Services | 95% | Critical business logic |
| Repositories | 90% | Database queries |
| Middleware | 100% | Request pipeline |
| Controllers | 90% | HTTP handling |
| Utilities | 100% | Reusable functions |
| **Overall** | **80%** | Project requirement |

---

## 8. Design Review Fixes

### 8.1 High Priority Fixes

#### H-1: Location Search Index Optimization (CRITICAL)

**Issue:** ILIKE with leading wildcard (`%Miami%`) cannot use B-tree index, requires full table scan

**Impact:** Will fail NFR-001 (<2s search) with >10K hotels

**Solution:** Add PostgreSQL trigram extension with GIN indexes

**Implementation:**
1. Enable pg_trgm extension in migration (IMPL-002)
2. Create GIN indexes on LOWER(city) and LOWER(region)
3. PostgreSQL will automatically use trigram indexes for ILIKE queries

**SQL:**
```sql
-- In migration
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_city_trgm ON hotels USING GIN (LOWER(city) gin_trgm_ops);
CREATE INDEX idx_region_trgm ON hotels USING GIN (LOWER(region) gin_trgm_ops);
```

**Query (no code changes needed):**
```sql
-- This query now uses trigram index automatically
SELECT * FROM hotels 
WHERE LOWER(city) LIKE '%miami%';
```

**Performance Improvement:**
- Before: 5-10 seconds for 1M hotels (full scan)
- After: 10-50ms for 1M hotels (index lookup)

**Task:** IMPL-002 (Database Migration)

**Status:** MUST FIX before implementation

---

#### H-2: Amenity Join Overhead

**Issue:** Every search query joins and aggregates amenities (50-100ms overhead)

**Impact:** Reduces performance budget for NFR-001

**Solution:** Load amenities separately, only in detail view

**Implementation:**
1. Remove LEFT JOIN from search query (IMPL-009)
2. Create separate method `getHotelAmenities(hotelId)` (IMPL-009)
3. Only call amenity method in detail view (IMPL-010)
4. Search results do NOT include amenities

**Code Changes:**
```javascript
// Repository - Search query (NO amenities)
async findHotelsByFilters(filters) {
  let query = knex('hotels')
    .select('hotels.*')  // Remove amenity join
    .where('hotels.is_active', true);
  
  // ... apply filters
  
  return await query;  // Returns hotels without amenities
}

// Repository - Get amenities separately
async getHotelAmenities(hotelId) {
  return await knex('amenities')
    .select('amenities.name', 'amenities.icon')
    .join('hotel_amenities', 'amenities.id', 'hotel_amenities.amenity_id')
    .where('hotel_amenities.hotel_id', hotelId)
    .orderBy('amenities.display_order');
}

// Service - Detail view includes amenities
async getHotelById(id) {
  const hotel = await hotelRepository.findHotelById(id);
  if (!hotel) return null;
  
  // Load amenities separately
  const amenities = await hotelRepository.getHotelAmenities(id);
  hotel.amenities = amenities;
  
  return new Hotel(hotel).toJSON();
}
```

**Performance Improvement:**
- Search query: 200-300ms faster
- Detail view: Same performance (amenities still loaded)

**Decision Point:** IMPL-028 (Performance Testing)
- If tests PASS without this optimization: Skip
- If tests FAIL: Implement this optimization

**Task:** IMPL-009, IMPL-010

**Status:** Implement during repository/service development

---

### 8.2 Medium Priority Fixes

#### M-1: Connection Pool Size

**Issue:** Max 10 connections too small for 100 concurrent users

**Solution:** Increase to max 50 connections

**Implementation:**
```javascript
// src/config/database.js
pool: {
  min: 5,    // Increased from 2
  max: 50,   // Increased from 10
  // ...
}
```

**Task:** IMPL-007

**Status:** FIX during database configuration

---

#### M-2: Distributed Rate Limiting

**Issue:** Per-instance rate limiting ineffective with multiple Node instances

**Solution:** Use Redis-backed rate limiting

**Implementation:** Defer to Phase 4 or future iteration
- For MVP: Single Node instance, in-memory rate limiting OK
- For production: Implement Redis rate limiting

**Task:** Not in current scope

**Status:** DEFERRED to post-MVP

---

#### M-3: API Versioning

**Issue:** Cannot introduce breaking changes without versioning

**Solution:** Add `/api/v1/` prefix to all routes

**Implementation:**
```javascript
// src/routes/index.js
app.use('/api/v1/hotels', hotelRoutes);  // Add v1 prefix
```

**Task:** IMPL-017, IMPL-018

**Status:** FIX during route configuration

---

#### M-4: Database Constraints

**Issue:** No CHECK constraints on price and rating

**Solution:** Add CHECK constraints in migration

**Implementation:**
```javascript
// In migration
table.check('price_per_night > 0', [], 'chk_price_positive');
table.check('rating IS NULL OR (rating >= 1.0 AND rating <= 5.0)', [], 'chk_rating_range');
```

**Task:** IMPL-002

**Status:** FIX in hotels table migration

---

#### M-5: CORS Configuration

**Issue:** Cross-origin requests not configured

**Solution:** Add CORS middleware with environment-based origins

**Implementation:**
```javascript
// src/middleware/security.js
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-ID'],
  exposedHeaders: ['X-RateLimit-Remaining', 'X-Request-ID'],
  maxAge: 86400
};

app.use(cors(corsOptions));
```

**Task:** IMPL-014

**Status:** FIX during security middleware setup

---

## 9. Definition of Done

### 9.1 Feature Completion Checklist

#### Functional Requirements
- [ ] AC-001: Search hotels by location (city/region) ✓
- [ ] AC-002: Filter by price range (min/max) ✓
- [ ] AC-003: Filter by minimum rating ✓
- [ ] AC-004: Sort results by price or rating (4 options) ✓
- [ ] AC-005: View hotel details and amenities ✓

#### Non-Functional Requirements
- [ ] NFR-001: Search response < 2 seconds (95th percentile) ✓
- [ ] NFR-002: Filter application < 500ms (95th percentile) ✓
- [ ] NFR-003: Sort operation < 300ms (95th percentile) ✓
- [ ] NFR-004: Usable API with clear error messages ✓
- [ ] NFR-005: Location input validated and sanitized ✓
- [ ] NFR-006: Price input validated (min <= max) ✓
- [ ] NFR-007: Rating input validated (1.0-5.0) ✓
- [ ] NFR-008: Supports 100+ concurrent users ✓
- [ ] NFR-009: Browser compatibility (N/A for backend) ✓
- [ ] NFR-010: Mobile responsiveness (N/A for backend) ✓

#### Design Review Fixes
- [ ] H-1: pg_trgm indexes for location search ✓
- [ ] H-2: Amenity loading optimized (if needed) ✓
- [ ] M-1: Connection pool increased to 50 ✓
- [ ] M-2: Distributed rate limiting (deferred) -
- [ ] M-3: API versioning (/api/v1/) ✓
- [ ] M-4: Database CHECK constraints ✓
- [ ] M-5: CORS configuration ✓

#### Database
- [ ] Hotels table created with all columns ✓
- [ ] Amenities and hotel_amenities tables created ✓
- [ ] All 13 indexes created (including pg_trgm) ✓
- [ ] CHECK constraints added ✓
- [ ] Foreign keys with CASCADE deletes ✓
- [ ] Migrations run successfully ✓
- [ ] Migrations can be rolled back ✓
- [ ] Seed data loaded (10 amenities, 50+ hotels) ✓

#### Code Quality
- [ ] ESLint passes with no errors ✓
- [ ] No console.log statements (use logger) ✓
- [ ] No magic strings (constants used) ✓
- [ ] Consistent error handling ✓
- [ ] Consistent naming conventions ✓
- [ ] Code comments for complex logic ✓
- [ ] No TODO comments ✓
- [ ] All dependencies installed ✓

#### Testing
- [ ] Overall test coverage ≥ 80% ✓
- [ ] Service layer coverage ≥ 90% ✓
- [ ] Repository layer coverage ≥ 85% ✓
- [ ] Middleware coverage ≥ 90% ✓
- [ ] All unit tests pass ✓
- [ ] All integration tests pass ✓
- [ ] Security tests pass (SQL injection, XSS) ✓
- [ ] Performance tests pass (100 concurrent users) ✓

#### API Documentation
- [ ] All endpoints documented ✓
- [ ] Request/response examples provided ✓
- [ ] Query parameters documented ✓
- [ ] Error responses documented ✓
- [ ] Rate limiting documented ✓

#### Deployment Readiness
- [ ] README updated with setup instructions ✓
- [ ] DEPLOYMENT.md created ✓
- [ ] .env.example finalized ✓
- [ ] Environment variables documented ✓
- [ ] Health check endpoint works ✓
- [ ] Database migration instructions clear ✓
- [ ] Seed data instructions clear ✓

#### Security
- [ ] Input validation comprehensive ✓
- [ ] SQL injection prevention verified ✓
- [ ] XSS prevention verified ✓
- [ ] Rate limiting configured ✓
- [ ] CORS configured ✓
- [ ] Security headers configured (Helmet) ✓
- [ ] Request IDs for tracing ✓
- [ ] Sensitive data not logged ✓

#### Performance
- [ ] Search < 2s under load (95th percentile) ✓
- [ ] No connection pool exhaustion ✓
- [ ] No memory leaks (soak test) ✓
- [ ] Slow queries logged (>1s) ✓
- [ ] Database indexes verified effective (EXPLAIN ANALYZE) ✓

### 9.2 Acceptance Testing

**Execute these manual tests before marking as complete:**

1. **Basic Search:**
   ```bash
   curl "http://localhost:3000/api/v1/hotels/search?location=Miami"
   # Expected: 200 OK with hotels in Miami
   ```

2. **Filter by Price:**
   ```bash
   curl "http://localhost:3000/api/v1/hotels/search?location=Miami&minPrice=100&maxPrice=200"
   # Expected: Hotels priced $100-$200
   ```

3. **Filter by Rating:**
   ```bash
   curl "http://localhost:3000/api/v1/hotels/search?location=Miami&minRating=4.0"
   # Expected: Hotels with 4+ stars
   ```

4. **Sort Options:**
   ```bash
   curl "http://localhost:3000/api/v1/hotels/search?location=Miami&sortBy=price:asc"
   # Expected: Hotels sorted by price ascending
   ```

5. **Hotel Details:**
   ```bash
   curl "http://localhost:3000/api/v1/hotels/1"
   # Expected: Full hotel details with amenities
   ```

6. **Validation Error:**
   ```bash
   curl "http://localhost:3000/api/v1/hotels/search?location=Miami&minPrice=200&maxPrice=100"
   # Expected: 400 with validation error
   ```

7. **404 Error:**
   ```bash
   curl "http://localhost:3000/api/v1/hotels/999999"
   # Expected: 404 with hotel not found
   ```

8. **Rate Limiting:**
   ```bash
   for i in {1..101}; do curl "http://localhost:3000/api/v1/hotels/search?location=Miami"; done
   # Expected: First 100 succeed, 101st returns 429
   ```

### 9.3 Final Approval Criteria

**User Story Owner Must Verify:**
- [ ] All acceptance criteria met
- [ ] API works as specified in requirements
- [ ] Performance meets NFR targets
- [ ] No critical or high-severity bugs
- [ ] Documentation complete

**Technical Lead Must Verify:**
- [ ] Code review completed
- [ ] Architecture followed
- [ ] Test coverage meets targets
- [ ] Security review passed
- [ ] Performance testing passed

**Deployment Team Must Verify:**
- [ ] Deployment guide clear
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] Health check works
- [ ] Monitoring configured

---

## 10. Risk Management

### 10.1 Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Performance tests fail due to amenity join | Medium | High | H-2 optimization ready, 4-hour buffer in schedule |
| pg_trgm extension not available in production | Low | High | Verify extension availability in IMPL-002 |
| Connection pool exhaustion under load | Medium | Medium | M-1 fix implemented, load testing validates |
| Test coverage below 80% | Low | Medium | TDD approach, frequent coverage checks |
| Scope creep (add features beyond AC) | Medium | Medium | Strict adherence to acceptance criteria |
| Database migration failure | Low | High | Test migrations in development, rollback scripts ready |
| Third-party dependency vulnerabilities | Low | Low | Run npm audit, update dependencies |

### 10.2 Contingency Plans

**If Performance Tests Fail:**
1. Implement H-2 optimization (amenity loading)
2. Add Redis caching for popular searches
3. Optimize queries with EXPLAIN ANALYZE
4. Add database connection pooling adjustments
5. Consider materialized views (4-hour task)

**If Test Coverage Below Target:**
1. Identify uncovered modules
2. Prioritize critical paths (services, repositories)
3. Add targeted tests
4. Rerun coverage report
5. May extend Phase 3 by 1 day if needed

**If Deployment Issues:**
1. Use docker-compose for consistent environment
2. Document all dependencies and versions
3. Create troubleshooting guide
4. Have rollback plan ready

---

## 11. Success Metrics

### 11.1 Quantitative Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Test Coverage | ≥ 80% overall | Jest coverage report |
| Service Coverage | ≥ 90% | Jest coverage report |
| Search Response Time | < 2s (p95) | Artillery load test |
| Concurrent Users | 100+ no errors | Artillery load test |
| Zero Critical Bugs | 0 | Bug tracking |
| API Uptime | 99.9% | Health check monitoring |

### 11.2 Qualitative Metrics

| Metric | Target | Validation |
|--------|--------|-----------|
| Code Readability | High | Peer code review |
| API Usability | Intuitive | API documentation review |
| Documentation Quality | Complete | Stakeholder review |
| Security Posture | Strong | Security test pass rate |

### 11.3 Post-Implementation Review

**After 1 Week in Production:**
- [ ] Actual response times vs. targets
- [ ] Actual concurrent users handled
- [ ] Error rate analysis
- [ ] Database query performance
- [ ] User feedback (if available)

---

## 12. Next Steps

### Immediate Actions (Before Starting Implementation)

1. **Stakeholder Approval**
   - [ ] Review this implementation plan
   - [ ] Approve scope and timeline
   - [ ] Approve resource allocation (1 developer, 12 days)
   - [ ] Sign off on design review fixes

2. **Environment Setup**
   - [ ] Provision PostgreSQL database (dev, test)
   - [ ] Create database users and permissions
   - [ ] Set up Git repository (if not exists)
   - [ ] Configure CI/CD pipeline (optional)

3. **Kickoff Meeting**
   - [ ] Review implementation plan with team
   - [ ] Clarify any questions
   - [ ] Confirm daily standup schedule
   - [ ] Set up communication channels

### Start Implementation

**Day 1 - Start with IMPL-001:** Project Setup and Configuration

**Daily Checklist:**
- [ ] Review tasks for the day
- [ ] Complete assigned tasks
- [ ] Run tests (unit + integration)
- [ ] Commit code with descriptive messages
- [ ] Update task status
- [ ] Daily standup (progress, blockers, next steps)

**Weekly Checklist:**
- [ ] Code review session
- [ ] Test coverage review
- [ ] Performance check
- [ ] Update stakeholders on progress

---

## 13. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **pg_trgm** | PostgreSQL trigram extension for fuzzy text matching |
| **GIN Index** | Generalized Inverted Index for full-text search and arrays |
| **ILIKE** | Case-insensitive LIKE operator in PostgreSQL |
| **TDD** | Test-Driven Development - write tests before code |
| **DTO** | Data Transfer Object - object for API responses |
| **NFR** | Non-Functional Requirement |
| **AC** | Acceptance Criteria |

### B. Reference Documents

- [Requirements: docs/sdlc/HB-001-requirements.md](../HB-001-requirements.md)
- [Architecture: docs/sdlc/HB-001-architecture.md](../HB-001-architecture.md)
- [Design Review: docs/sdlc/HB-001-design-review.md](../HB-001-design-review.md)
- [User Stories: docs/user-stories/user-stories.md](../user-stories/user-stories.md)

### C. Useful Commands

```bash
# Start development server
npm run dev

# Run all tests
npm test

# Run tests with coverage
npm run test -- --coverage

# Run integration tests only
npm run test:integration

# Run migrations
npm run migrate:latest

# Rollback migration
npm run migrate:rollback

# Run seeds
npm run seed:run

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Performance test
artillery run tests/performance/load-test.yml
```

### D. Contact Information

| Role | Responsibility | Contact |
|------|---------------|---------|
| Implementation Planner | This document | [Agent] |
| Requirements Analyst | Requirements doc | [Agent] |
| Solution Architect | Architecture doc | [Agent] |
| Design Reviewer | Design review doc | [Agent] |
| Developer | Implementation | [TBD] |
| Product Owner | Acceptance | [TBD] |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-11-09 | Implementation Planner Agent | Initial implementation plan |

**Status:** Ready for Implementation  
**Approved By:** Pending stakeholder review  
**Start Date:** TBD  
**Target Completion:** TBD + 12 days

---

**End of Implementation Plan**
