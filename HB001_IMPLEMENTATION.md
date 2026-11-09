# HB-001: Hotel Search and Browse - Implementation Guide

## Overview

This document describes the complete implementation of HB-001: Hotel Search and Browse feature for the Hotel Booking System.

## Implementation Summary

### Files Created/Updated

#### Models
- `src/models/Hotel.js` - Hotel entity with toJSON() transformation

#### Data Access Layer
- `src/repositories/hotelRepository.js` - Database queries with H-2 FIX (separate amenity loading)

#### Business Logic Layer
- `src/services/hotelService.js` - Business logic with validation and error handling

#### Controllers
- `src/controllers/hotelController.js` - HTTP request handlers

#### Middleware
- `src/middleware/validation.js` - Joi validation schemas
- `src/middleware/errorHandler.js` - Centralized error handling
- `src/middleware/rateLimiter.js` - Rate limiting (100 req/min)
- `src/middleware/security.js` - CORS and Helmet security (M-5 FIX)

#### Routes
- `src/routes/hotels.js` - Hotel-specific routes
- `src/routes/index.js` - Main route aggregator with /api/v1/ prefix (M-3 FIX)

#### Application
- `src/app.js` - Express app with complete middleware pipeline
- `src/server.js` - Server startup and graceful shutdown

#### Tests
- `tests/unit/models/Hotel.test.js` - Hotel model tests
- `tests/unit/repositories/hotelRepository.test.js` - Repository tests
- `tests/unit/services/hotelService.test.js` - Service layer tests
- `tests/unit/middleware/validation.test.js` - Validation middleware tests
- `tests/integration/hotelApi.test.js` - End-to-end API tests

## Critical Fixes Implemented

### H-1 FIX: Optimized ILIKE Queries
- ✅ `pg_trgm` extension enabled in migration
- ✅ Trigram GIN indexes on city and region columns
- ✅ Enables fast fuzzy text search with ILIKE

### H-2 FIX: Separate Amenity Loading
- ✅ Hotels searched WITHOUT amenities in main query
- ✅ Amenities loaded separately using `loadAmenitiesForHotels()`
- ✅ Single optimized query for all hotel amenities (no N+1 problem)

### M-3 FIX: API Versioning
- ✅ All routes use `/api/v1/` prefix
- ✅ Health check available at both `/health` and `/api/v1/health`

### M-4 FIX: Database Constraints
- ✅ CHECK constraints on price (> 0) and rating (1.0-5.0)
- ✅ Implemented in migration

### M-5 FIX: CORS Middleware
- ✅ Proper CORS configuration with allowed origins
- ✅ Credentials support
- ✅ Exposed headers for pagination and rate limiting

## Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Controllers                 │  HTTP handlers
├─────────────────────────────────────┤
│         Services                    │  Business logic
├─────────────────────────────────────┤
│         Repositories                │  Data access
├─────────────────────────────────────┤
│         Models                      │  Entities
└─────────────────────────────────────┘
```

### Middleware Pipeline

1. **Security** - Helmet headers, CORS
2. **Parsing** - JSON and URL-encoded bodies
3. **Logging** - Request/response logging
4. **Rate Limiting** - 100 req/min (60 for search)
5. **Validation** - Joi schemas
6. **Routes** - API endpoints
7. **Error Handling** - Centralized error handler

## API Endpoints

### GET /api/v1/hotels
Get all hotels with pagination

**Query Parameters:**
- `limit` (optional): Results per page (default: 100, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Oceanview Resort",
      "description": "Luxury beachfront hotel",
      "location": {
        "city": "Miami",
        "region": "Florida",
        "address": "123 Ocean Drive"
      },
      "pricePerNight": 249.99,
      "rating": 4.8,
      "amenities": ["WiFi", "Pool", "Spa"],
      "isActive": true
    }
  ],
  "pagination": {
    "total": 52,
    "limit": 100,
    "offset": 0,
    "hasMore": false
  }
}
```

### GET /api/v1/hotels/search
Search hotels with filters

**Query Parameters:**
- `location` (optional): City or region to search
- `minPrice` (optional): Minimum price per night
- `maxPrice` (optional): Maximum price per night
- `minRating` (optional): Minimum rating (1.0-5.0)
- `sortBy` (optional): Sort order (price:asc, price:desc, rating:asc, rating:desc)
- `limit` (optional): Results per page (default: 100, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example:**
```
GET /api/v1/hotels/search?location=Miami&minPrice=100&maxPrice=300&minRating=4.0&sortBy=price:asc
```

### GET /api/v1/hotels/:id
Get hotel by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Oceanview Resort",
    "description": "Luxury beachfront hotel",
    "location": {
      "city": "Miami",
      "region": "Florida",
      "address": "123 Ocean Drive"
    },
    "pricePerNight": 249.99,
    "rating": 4.8,
    "amenities": ["WiFi", "Pool", "Spa"],
    "isActive": true
  }
}
```

### GET /health or GET /api/v1/health
Health check endpoint

## Setup and Running

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 12

### Installation

1. Install dependencies:
```bash
npm install
```

2. Setup environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run migrations:
```bash
npm run migrate:latest
```

4. Seed database:
```bash
npm run seed:run
```

### Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

### Running Tests

Run all tests with coverage:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run integration tests only:
```bash
npm run test:integration
```

## Test Coverage

The implementation includes comprehensive tests:

### Unit Tests
- ✅ Hotel model transformation
- ✅ Repository data access
- ✅ Service business logic
- ✅ Validation middleware

### Integration Tests
- ✅ Full API endpoint testing
- ✅ Search with various filters
- ✅ Pagination
- ✅ Sorting
- ✅ Validation errors
- ✅ Rate limiting
- ✅ Security headers (CORS, Helmet)
- ✅ 404 handling

**Target Coverage: 80%+**

## Performance Optimizations

### Database Indexes
- Trigram GIN indexes for ILIKE queries (H-1)
- B-tree indexes on city, region, price, rating
- Composite indexes for common query patterns
- Partial index for active hotels only

### Query Optimizations
- Separate amenity loading (H-2) - prevents N+1 queries
- Single optimized query for multiple hotels' amenities
- Connection pooling (5-50 connections)
- Slow query monitoring (> 1 second logged)

### Rate Limiting
- 100 requests per minute per IP (general)
- 60 requests per minute per IP (search endpoint)
- Prevents abuse and ensures fair usage

## Security Features

### CORS Configuration (M-5 FIX)
- Configurable allowed origins
- Credentials support
- Preflight request handling

### Helmet Security Headers
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
- X-XSS-Protection

### Input Validation
- Joi schema validation
- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)

### Error Handling
- No sensitive data in error responses
- Stack traces only in development
- Structured error codes for client handling

## Monitoring and Logging

### Structured Logging (Winston)
- Request/response logging
- Error logging with stack traces
- Slow query detection
- Security event logging

### Log Levels
- `error`: Critical errors
- `warn`: Warnings and security events
- `info`: General information
- `debug`: Debugging information

## Environment Variables

Required variables (see `.env.example`):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/hotel_booking
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=http://localhost:3000
LOG_LEVEL=info
```

## Error Codes

- `VALIDATION_ERROR` - Invalid input parameters
- `HOTEL_NOT_FOUND` - Hotel does not exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `DATABASE_ERROR` - Database operation failed
- `INTERNAL_SERVER_ERROR` - Unexpected server error
- `NOT_FOUND` - Route not found

## Future Enhancements

1. **Caching** - Redis for frequent queries
2. **Search** - Elasticsearch for advanced search
3. **Authentication** - JWT tokens for user authentication
4. **Pagination Cursor** - Cursor-based pagination for large datasets
5. **API Documentation** - OpenAPI/Swagger documentation
6. **Monitoring** - Application monitoring (Datadog, New Relic)
7. **Rate Limiting Store** - Redis for distributed rate limiting

## Contributing

All code follows:
- ESLint rules (Airbnb style guide)
- JSDoc comments
- Unit and integration tests
- Proper error handling
- Structured logging

## License

MIT
