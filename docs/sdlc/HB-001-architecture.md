# Architecture Document: HB-001 - Hotel Search and Browse

## Document Information

| Field | Value |
|-------|-------|
| **User Story** | HB-001: Hotel Search and Browse |
| **Version** | 1.0 |
| **Date** | 2026-11-09 |
| **Author** | Solution Architect Agent |
| **Status** | Draft |

---

## 1. Architecture Overview

### 1.1 High-Level Approach

The Hotel Search and Browse feature implements a **RESTful API-driven architecture** that separates concerns between data access, business logic, and API presentation layers. The architecture follows **SOLID principles** and employs a **service-oriented design** to ensure maintainability, testability, and scalability.

### 1.2 Design Principles

1. **Separation of Concerns**: Clear separation between routing, business logic, data access, and validation layers
2. **Single Responsibility**: Each module has a single, well-defined purpose
3. **DRY (Don't Repeat Yourself)**: Reusable components for validation, error handling, and data transformation
4. **Fail-Fast Validation**: Input validation at API entry points before business logic execution
5. **Stateless API Design**: RESTful endpoints with no server-side session state
6. **Performance First**: Database indexing, query optimization, and caching strategies built-in from the start
7. **Security by Default**: Input sanitization, SQL injection prevention, and rate limiting

### 1.3 Architecture Style

- **Layered Architecture** with three primary layers:
  - **API Layer**: Express.js routes and controllers
  - **Service Layer**: Business logic and orchestration
  - **Data Access Layer**: Database queries and ORM/query builder
- **Repository Pattern**: Abstraction over data access for testability
- **Middleware Pipeline**: Request validation, error handling, logging, and rate limiting

---

## 2. System Components

### 2.1 Backend Module Structure

```
src/
├── routes/
│   └── hotels.js                 # Hotel API route definitions
├── controllers/
│   └── hotelController.js        # Request handling and response formatting
├── services/
│   └── hotelService.js           # Business logic for search, filter, sort
├── repositories/
│   └── hotelRepository.js        # Data access layer for hotel queries
├── models/
│   ├── Hotel.js                  # Hotel entity/schema definition
│   ├── Location.js               # Location entity (if separate table)
│   └── Amenity.js                # Amenity entity (if separate table)
├── middleware/
│   ├── validation.js             # Request validation middleware
│   ├── errorHandler.js           # Global error handling
│   ├── sanitization.js           # Input sanitization
│   └── rateLimiter.js            # Rate limiting configuration
├── utils/
│   ├── queryBuilder.js           # Dynamic query construction utilities
│   ├── validators.js             # Reusable validation functions
│   └── constants.js              # Application constants (sort options, etc.)
├── config/
│   ├── database.js               # Database connection configuration
│   └── app.js                    # Application-level configuration
└── tests/
    ├── unit/
    │   ├── hotelService.test.js
    │   └── validators.test.js
    └── integration/
        └── hotelAPI.test.js
```

### 2.2 Component Responsibilities

#### 2.2.1 Routes (`routes/hotels.js`)
- Define API endpoints and HTTP methods
- Map routes to controller methods
- Apply route-specific middleware (validation, rate limiting)

#### 2.2.2 Controllers (`controllers/hotelController.js`)
- Parse and validate request parameters
- Call appropriate service methods
- Format and return HTTP responses
- Handle HTTP status codes and error responses

#### 2.2.3 Services (`services/hotelService.js`)
- Implement business logic for search, filter, and sort operations
- Orchestrate calls to repositories
- Apply business rules (e.g., BR-004: case-insensitive location matching)
- Transform repository data for API responses

#### 2.2.4 Repositories (`repositories/hotelRepository.js`)
- Execute database queries using query builder or ORM
- Abstract database-specific logic from services
- Implement efficient queries with proper indexing
- Handle database connection errors

#### 2.2.5 Models (`models/Hotel.js`)
- Define data schema/structure
- Provide validation rules at the data layer
- Define relationships between entities (if using ORM)

#### 2.2.6 Middleware
- **Validation**: Validate query parameters before controller execution
- **Sanitization**: Sanitize inputs to prevent XSS and SQL injection
- **Error Handler**: Catch and format all errors consistently
- **Rate Limiter**: Prevent abuse and ensure fair usage

---

## 3. Data Models

### 3.1 Database Schema

#### 3.1.1 Hotels Table

```sql
CREATE TABLE hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    address TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1) CHECK (rating >= 1.0 AND rating <= 5.0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_city (city),
    INDEX idx_region (region),
    INDEX idx_price (price_per_night),
    INDEX idx_rating (rating),
    INDEX idx_active (is_active),
    INDEX idx_location_composite (city, region, is_active),
    INDEX idx_search_composite (city, price_per_night, rating, is_active)
);
```

**Key Design Decisions:**
- `DECIMAL(10, 2)` for price ensures precision (no floating-point errors)
- `rating` uses DECIMAL(2, 1) to support values like 4.5
- `is_active` flag supports BR-001 (only active hotels in results)
- Multiple indexes optimize search queries (see Section 8)
- Composite indexes for common query patterns (location + price + rating)

#### 3.1.2 Amenities Table

```sql
CREATE TABLE amenities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    
    INDEX idx_name (name)
);
```

**Standard Amenities** (FR-007):
- WiFi
- Pool
- Parking
- Gym
- Spa
- Restaurant
- Room Service
- Pet Friendly
- Business Center
- Air Conditioning

#### 3.1.3 Hotel_Amenities Junction Table

```sql
CREATE TABLE hotel_amenities (
    hotel_id INT NOT NULL,
    amenity_id INT NOT NULL,
    
    PRIMARY KEY (hotel_id, amenity_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE,
    
    INDEX idx_hotel (hotel_id),
    INDEX idx_amenity (amenity_id)
);
```

**Rationale**: Many-to-many relationship allows:
- Flexible amenity management
- Easy addition of new amenities
- Efficient querying of hotels by amenity (future feature)
- Normalized data structure

### 3.2 Data Model Relationships

```
hotels (1) ←→ (N) hotel_amenities (N) ←→ (1) amenities
```

- One hotel can have multiple amenities
- One amenity can belong to multiple hotels
- Junction table implements the many-to-many relationship

### 3.3 Entity Models (Node.js)

#### Hotel Entity (`models/Hotel.js`)

```javascript
class Hotel {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.city = data.city;
        this.region = data.region;
        this.address = data.address;
        this.pricePerNight = parseFloat(data.price_per_night);
        this.rating = data.rating ? parseFloat(data.rating) : null;
        this.amenities = data.amenities || [];
        this.isActive = data.is_active;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            location: {
                city: this.city,
                region: this.region,
                address: this.address
            },
            pricePerNight: this.pricePerNight.toFixed(2),
            rating: this.rating ? this.rating.toFixed(1) : 'Not Rated',
            amenities: this.amenities
        };
    }
}

module.exports = Hotel;
```

---

## 4. API Design

### 4.1 RESTful Endpoints

#### 4.1.1 Search Hotels with Filters

**Endpoint**: `GET /api/hotels/search`

**Query Parameters**:

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `location` | String | Yes | City or region name | `?location=Miami` |
| `minPrice` | Number | No | Minimum price per night | `?minPrice=50` |
| `maxPrice` | Number | No | Maximum price per night | `?maxPrice=200` |
| `minRating` | Number | No | Minimum rating (1.0 - 5.0) | `?minRating=4.0` |
| `sortBy` | String | No | Sort field and order | `?sortBy=price:asc` |
| `page` | Number | No | Page number (default: 1) | `?page=1` |
| `limit` | Number | No | Results per page (default: 100, max: 100) | `?limit=50` |

**Valid `sortBy` Values** (FR-005):
- `price:asc` - Price: Low to High
- `price:desc` - Price: High to Low
- `rating:asc` - Rating: Low to High
- `rating:desc` - Rating: High to Low (default)

**Example Request**:
```
GET /api/hotels/search?location=Miami&minPrice=100&maxPrice=200&minRating=4.0&sortBy=rating:desc
```

**Success Response** (200 OK):
```json
{
    "success": true,
    "data": {
        "hotels": [
            {
                "id": 1,
                "name": "Oceanview Resort",
                "description": "Luxury beachfront hotel with stunning ocean views",
                "location": {
                    "city": "Miami",
                    "region": "Florida",
                    "address": "123 Ocean Drive, Miami, FL 33139"
                },
                "pricePerNight": "149.99",
                "rating": "4.5",
                "amenities": [
                    {"name": "WiFi", "icon": "wifi"},
                    {"name": "Pool", "icon": "pool"},
                    {"name": "Parking", "icon": "parking"},
                    {"name": "Gym", "icon": "gym"}
                ]
            },
            {
                "id": 2,
                "name": "Downtown Suites",
                "description": "Modern hotel in the heart of Miami",
                "location": {
                    "city": "Miami",
                    "region": "Florida",
                    "address": "456 Biscayne Blvd, Miami, FL 33132"
                },
                "pricePerNight": "129.99",
                "rating": "4.2",
                "amenities": [
                    {"name": "WiFi", "icon": "wifi"},
                    {"name": "Business Center", "icon": "business"}
                ]
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 100,
            "totalResults": 2,
            "totalPages": 1
        },
        "appliedFilters": {
            "location": "Miami",
            "minPrice": 100,
            "maxPrice": 200,
            "minRating": 4.0,
            "sortBy": "rating:desc"
        }
    }
}
```

**No Results Response** (200 OK):
```json
{
    "success": true,
    "data": {
        "hotels": [],
        "pagination": {
            "page": 1,
            "limit": 100,
            "totalResults": 0,
            "totalPages": 0
        },
        "message": "No hotels found matching your criteria. Try adjusting your filters or searching a different location."
    }
}
```

**Validation Error Response** (400 Bad Request):
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid query parameters",
        "details": [
            {
                "field": "minPrice",
                "message": "minPrice must be a positive number"
            },
            {
                "field": "maxPrice",
                "message": "maxPrice must be greater than or equal to minPrice"
            }
        ]
    }
}
```

#### 4.1.2 Get Hotel by ID

**Endpoint**: `GET /api/hotels/:id`

**Path Parameters**:
- `id` (Number, Required): Hotel ID

**Example Request**:
```
GET /api/hotels/1
```

**Success Response** (200 OK):
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Oceanview Resort",
        "description": "Luxury beachfront hotel with stunning ocean views. Features spacious rooms, world-class dining, and direct beach access.",
        "location": {
            "city": "Miami",
            "region": "Florida",
            "address": "123 Ocean Drive, Miami, FL 33139"
        },
        "pricePerNight": "149.99",
        "rating": "4.5",
        "amenities": [
            {"name": "WiFi", "icon": "wifi"},
            {"name": "Pool", "icon": "pool"},
            {"name": "Parking", "icon": "parking"},
            {"name": "Gym", "icon": "gym"},
            {"name": "Spa", "icon": "spa"},
            {"name": "Restaurant", "icon": "restaurant"}
        ]
    }
}
```

**Not Found Response** (404 Not Found):
```json
{
    "success": false,
    "error": {
        "code": "HOTEL_NOT_FOUND",
        "message": "Hotel with ID 999 not found"
    }
}
```

### 4.2 HTTP Status Codes

| Status Code | Usage |
|-------------|-------|
| 200 OK | Successful request (including empty results) |
| 400 Bad Request | Invalid query parameters or validation errors |
| 404 Not Found | Hotel ID not found |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | Server-side error |

### 4.3 Rate Limiting

- **Limit**: 100 requests per minute per IP address
- **Response Header**: `X-RateLimit-Remaining: 95`
- **Exceeds Limit**: HTTP 429 with retry-after header

---

## 5. Technology Stack

### 5.1 Backend Stack

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| **Runtime** | Node.js | 18.x LTS | Async I/O, large ecosystem, team familiarity |
| **Web Framework** | Express.js | 4.x | Lightweight, flexible, middleware support |
| **Database** | PostgreSQL | 14.x | ACID compliance, advanced indexing, full-text search |
| **Query Builder** | Knex.js | 2.x | Flexible query building, migrations, connection pooling |
| **Validation** | Joi | 17.x | Declarative schema validation |
| **Sanitization** | validator.js | 13.x | XSS prevention, input sanitization |
| **Rate Limiting** | express-rate-limit | 6.x | IP-based rate limiting |
| **Logging** | Winston | 3.x | Structured logging, multiple transports |
| **Testing** | Jest | 29.x | Unit and integration testing |
| **API Testing** | Supertest | 6.x | HTTP assertion library |
| **Environment Config** | dotenv | 16.x | Environment variable management |

### 5.2 Technology Justification

#### 5.2.1 PostgreSQL over MySQL/MongoDB

**Advantages**:
- **ACID Transactions**: Critical for future booking operations (HB-002)
- **Advanced Indexing**: B-tree, GiST for location-based queries, partial indexes
- **Full-Text Search**: Native support for location name matching (FR-001)
- **Data Integrity**: Strong foreign key constraints and check constraints
- **JSON Support**: Flexible schema for amenities if needed
- **Performance**: Excellent query optimization for complex filters

**Use Cases in HB-001**:
- Composite indexes for `(city, price_per_night, rating)`
- Partial index on `is_active = TRUE` for active hotels only
- Case-insensitive ILIKE queries for location matching

#### 5.2.2 Knex.js over Sequelize ORM

**Advantages**:
- **Query Flexibility**: Easier to optimize complex queries
- **Performance**: Less overhead than full ORM
- **Migration Management**: Built-in migration system
- **Raw Queries**: Easy fallback to raw SQL when needed
- **Learning Curve**: Simpler than full ORM

**Trade-offs**: 
- Less abstraction = more manual query building
- No automatic model associations (manually join tables)

#### 5.2.3 Joi for Validation

**Advantages**:
- **Schema-Based**: Declarative validation rules
- **Composable**: Reusable validation schemas
- **Type Safety**: Automatic type coercion
- **Custom Messages**: User-friendly error messages

### 5.3 Development Tools

- **Nodemon**: Auto-restart during development
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit validation

---

## 6. Component Interactions

### 6.1 Request Flow Diagram

```
┌──────────────┐
│    Client    │
└──────┬───────┘
       │ HTTP GET /api/hotels/search?location=Miami&minPrice=100
       ▼
┌──────────────────────────────────────────────────────┐
│              Express Application                      │
│                                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │         Middleware Pipeline                     │ │
│  │  1. Rate Limiter    → Check request rate       │ │
│  │  2. Sanitization    → Clean inputs             │ │
│  │  3. Validation      → Validate query params    │ │
│  └────────────┬───────────────────────────────────┘ │
│               │                                       │
│               ▼                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │         Hotel Controller                        │ │
│  │  - Parse query parameters                      │ │
│  │  - Call hotelService.searchHotels()           │ │
│  │  - Format response                            │ │
│  └────────────┬───────────────────────────────────┘ │
│               │                                       │
│               ▼                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │         Hotel Service                           │ │
│  │  - Apply business rules                        │ │
│  │  - Build filter criteria                       │ │
│  │  - Call repository methods                     │ │
│  │  - Transform data to DTOs                      │ │
│  └────────────┬───────────────────────────────────┘ │
│               │                                       │
│               ▼                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │         Hotel Repository                        │ │
│  │  - Build SQL query with Knex                   │ │
│  │  - Apply WHERE clauses (filters)               │ │
│  │  - Apply ORDER BY (sorting)                    │ │
│  │  - Execute query                               │ │
│  └────────────┬───────────────────────────────────┘ │
│               │                                       │
└───────────────┼───────────────────────────────────────┘
                │
                ▼
       ┌─────────────────┐
       │   PostgreSQL    │
       │   Database      │
       └─────────┬───────┘
                 │
                 │ Query Result
                 ▼
       ┌─────────────────┐
       │   Transform to  │
       │   Hotel Models  │
       └─────────┬───────┘
                 │
                 ▼
       ┌─────────────────┐
       │   JSON Response │
       │   to Client     │
       └─────────────────┘
```

### 6.2 Search Flow Example

**Scenario**: User searches for hotels in Miami with price $100-$200, 4+ stars

1. **Client Request**:
   ```
   GET /api/hotels/search?location=Miami&minPrice=100&maxPrice=200&minRating=4.0
   ```

2. **Rate Limiter Middleware**: Check if request rate < 100/min

3. **Sanitization Middleware**: 
   - Trim whitespace from `location`
   - Escape special characters

4. **Validation Middleware**:
   ```javascript
   {
       location: Joi.string().trim().min(2).max(100).required(),
       minPrice: Joi.number().min(0).optional(),
       maxPrice: Joi.number().min(0).optional(),
       minRating: Joi.number().min(1).max(5).optional()
   }
   ```

5. **Controller** (`hotelController.searchHotels`):
   ```javascript
   const filters = {
       location: req.query.location,
       minPrice: parseFloat(req.query.minPrice),
       maxPrice: parseFloat(req.query.maxPrice),
       minRating: parseFloat(req.query.minRating),
       sortBy: req.query.sortBy || 'rating:desc'
   };
   
   const hotels = await hotelService.searchHotels(filters);
   res.json({ success: true, data: { hotels } });
   ```

6. **Service** (`hotelService.searchHotels`):
   ```javascript
   async searchHotels(filters) {
       // Apply business rule: case-insensitive location matching
       filters.location = filters.location.toLowerCase();
       
       // Call repository
       const hotels = await hotelRepository.findHotelsByFilters(filters);
       
       // Transform to DTOs
       return hotels.map(hotel => new Hotel(hotel).toJSON());
   }
   ```

7. **Repository** (`hotelRepository.findHotelsByFilters`):
   ```javascript
   async findHotelsByFilters(filters) {
       let query = knex('hotels')
           .select(
               'hotels.*',
               knex.raw('COALESCE(json_agg(json_build_object(\'name\', amenities.name, \'icon\', amenities.icon)) FILTER (WHERE amenities.id IS NOT NULL), \'[]\'::json) as amenities')
           )
           .leftJoin('hotel_amenities', 'hotels.id', 'hotel_amenities.hotel_id')
           .leftJoin('amenities', 'hotel_amenities.amenity_id', 'amenities.id')
           .where('hotels.is_active', true)
           .groupBy('hotels.id');
       
       // Apply filters
       if (filters.location) {
           query = query.where(function() {
               this.whereRaw('LOWER(city) LIKE ?', [`%${filters.location}%`])
                   .orWhereRaw('LOWER(region) LIKE ?', [`%${filters.location}%`]);
           });
       }
       
       if (filters.minPrice) {
           query = query.where('price_per_night', '>=', filters.minPrice);
       }
       
       if (filters.maxPrice) {
           query = query.where('price_per_night', '<=', filters.maxPrice);
       }
       
       if (filters.minRating) {
           query = query.where('rating', '>=', filters.minRating);
       }
       
       // Apply sorting
       const [sortField, sortOrder] = filters.sortBy.split(':');
       query = query.orderBy(sortField === 'price' ? 'price_per_night' : 'rating', sortOrder);
       
       return await query;
   }
   ```

8. **Database Execution**: PostgreSQL executes query with indexes

9. **Response**: Transform and return JSON to client

---

## 7. Data Flow

### 7.1 Request → Response Pipeline

```
HTTP Request
    ↓
[Rate Limiter] → Check IP rate limit
    ↓
[Sanitization] → Clean and escape inputs
    ↓
[Validation] → Validate query parameters
    ↓ (if valid)
[Controller] → Parse request, call service
    ↓
[Service] → Apply business rules, call repository
    ↓
[Repository] → Build and execute SQL query
    ↓
[Database] → Execute query with indexes
    ↓
[Repository] → Return raw results
    ↓
[Service] → Transform to Hotel models
    ↓
[Controller] → Format as JSON response
    ↓
HTTP Response
```

### 7.2 Error Handling Flow

```
Error Occurs
    ↓
Is it a Validation Error?
    ├─ Yes → Return 400 with validation details
    └─ No ↓
Is it a Not Found Error?
    ├─ Yes → Return 404 with message
    └─ No ↓
Is it a Database Error?
    ├─ Yes → Log error, return 500 (hide details)
    └─ No ↓
Other Error
    └─ Log error, return 500 Generic Error
```

### 7.3 Filter Application Logic

**Multiple Filters** (FR-004):
- Filters are combined with **AND** logic
- All conditions must be met for a hotel to appear in results

**Example**:
```sql
SELECT * FROM hotels
WHERE is_active = TRUE
  AND (LOWER(city) LIKE '%miami%' OR LOWER(region) LIKE '%miami%')
  AND price_per_night >= 100
  AND price_per_night <= 200
  AND rating >= 4.0
ORDER BY rating DESC;
```

---

## 8. Performance Considerations

### 8.1 Database Indexing Strategy

#### 8.1.1 Single-Column Indexes

```sql
-- Location searches (FR-001)
CREATE INDEX idx_city ON hotels(city);
CREATE INDEX idx_region ON hotels(region);

-- Price filtering (FR-002)
CREATE INDEX idx_price ON hotels(price_per_night);

-- Rating filtering (FR-003)
CREATE INDEX idx_rating ON hotels(rating);

-- Active status (BR-001)
CREATE INDEX idx_active ON hotels(is_active);
```

#### 8.1.2 Composite Indexes

```sql
-- Most common query pattern: location + price + rating
CREATE INDEX idx_search_composite ON hotels(city, price_per_night, rating, is_active);

-- Location-based searches with active filter
CREATE INDEX idx_location_composite ON hotels(city, region, is_active);

-- Price range + rating filter
CREATE INDEX idx_price_rating ON hotels(price_per_night, rating, is_active);
```

#### 8.1.3 Partial Index

```sql
-- Only index active hotels (most queries filter by is_active = TRUE)
CREATE INDEX idx_active_hotels ON hotels(city, price_per_night, rating) 
WHERE is_active = TRUE;
```

**Impact**: Reduces index size by ~50% if inactive hotels are 50% of data

#### 8.1.4 Text Search Index

```sql
-- Full-text search for location names (future enhancement)
CREATE INDEX idx_location_fulltext ON hotels 
USING GIN (to_tsvector('english', city || ' ' || region));
```

### 8.2 Query Optimization

#### 8.2.1 Use of Prepared Statements

**Benefit**: Query plan caching, SQL injection prevention

```javascript
// Knex uses prepared statements by default
knex('hotels').where('city', '=', userInput); // Safe, parameterized
```

#### 8.2.2 Pagination

**Implementation** (BR-006):
```javascript
const page = parseInt(req.query.page) || 1;
const limit = Math.min(parseInt(req.query.limit) || 100, 100); // Max 100
const offset = (page - 1) * limit;

query = query.limit(limit).offset(offset);
```

**Benefit**: Prevents loading all results into memory

#### 8.2.3 Eager Loading Amenities

**Problem**: N+1 query problem (1 query for hotels + N queries for amenities)

**Solution**: Use LEFT JOIN with aggregation
```sql
SELECT 
    hotels.*,
    COALESCE(
        json_agg(
            json_build_object('name', amenities.name, 'icon', amenities.icon)
        ) FILTER (WHERE amenities.id IS NOT NULL), 
        '[]'::json
    ) as amenities
FROM hotels
LEFT JOIN hotel_amenities ON hotels.id = hotel_amenities.hotel_id
LEFT JOIN amenities ON hotel_amenities.amenity_id = amenities.id
GROUP BY hotels.id;
```

**Impact**: Reduces queries from 1 + N to just 1 query

### 8.3 Caching Strategy

#### 8.3.1 Application-Level Caching

**Cache Popular Searches** (future enhancement):
- Use Redis or in-memory cache
- Cache key: `search:${location}:${minPrice}:${maxPrice}:${minRating}:${sortBy}`
- TTL: 5 minutes (hotel data changes infrequently)

**Example**:
```javascript
const cacheKey = `search:${JSON.stringify(filters)}`;
const cached = await redis.get(cacheKey);

if (cached) {
    return JSON.parse(cached);
}

const results = await hotelRepository.findHotelsByFilters(filters);
await redis.setex(cacheKey, 300, JSON.stringify(results)); // 5 min TTL
return results;
```

#### 8.3.2 Database Query Result Caching

- PostgreSQL has built-in query cache
- Repeated identical queries benefit from cached execution plans

### 8.4 Performance Targets

| Operation | Target | Measurement |
|-----------|--------|-------------|
| Search query | < 2 seconds | 95th percentile (NFR-001) |
| Filter application | < 500ms | 95th percentile (NFR-002) |
| Sort operation | < 300ms | 95th percentile (NFR-003) |
| Concurrent users | 100+ | No degradation (NFR-008) |

### 8.5 Performance Monitoring

**Metrics to Track**:
1. **Query Execution Time**: Log slow queries (> 1 second)
2. **API Response Time**: Track p50, p95, p99
3. **Database Connection Pool**: Monitor active connections
4. **Error Rate**: Track 4xx and 5xx responses
5. **Throughput**: Requests per second

**Tools**:
- Winston logging with timestamps
- Application Performance Monitoring (APM) tool (e.g., New Relic, Datadog)
- PostgreSQL `pg_stat_statements` extension

---

## 9. Security Considerations

### 9.1 Input Validation and Sanitization

#### 9.1.1 Location Input (NFR-005)

**Validation Rules**:
```javascript
const locationSchema = Joi.string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s\-']+$/) // Only alphanumeric, spaces, hyphens, apostrophes
    .required()
    .messages({
        'string.pattern.base': 'Location can only contain letters, numbers, spaces, hyphens, and apostrophes',
        'string.min': 'Location must be at least 2 characters',
        'string.max': 'Location cannot exceed 100 characters'
    });
```

**Sanitization**:
```javascript
const validator = require('validator');

function sanitizeLocation(location) {
    // Trim whitespace
    location = location.trim();
    
    // Escape HTML to prevent XSS
    location = validator.escape(location);
    
    // Remove potential SQL injection patterns
    location = location.replace(/[;'"\\]/g, '');
    
    return location;
}
```

#### 9.1.2 Price Input (NFR-006)

**Validation Rules**:
```javascript
const priceSchema = Joi.object({
    minPrice: Joi.number().min(0).max(999999.99).optional(),
    maxPrice: Joi.number().min(0).max(999999.99).optional()
}).custom((value, helpers) => {
    if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
        return helpers.error('price.minGreaterThanMax');
    }
    return value;
}).messages({
    'price.minGreaterThanMax': 'Minimum price cannot be greater than maximum price'
});
```

#### 9.1.3 Rating Input (NFR-007)

**Validation Rules**:
```javascript
const ratingSchema = Joi.number()
    .min(1.0)
    .max(5.0)
    .optional()
    .messages({
        'number.min': 'Rating must be between 1.0 and 5.0',
        'number.max': 'Rating must be between 1.0 and 5.0'
    });
```

### 9.2 SQL Injection Prevention

**Methods**:
1. **Parameterized Queries**: Knex.js uses parameterized queries by default
2. **Input Validation**: Reject invalid input before query execution
3. **Whitelist Validation**: For `sortBy`, only allow predefined values

**Sort Parameter Validation**:
```javascript
const ALLOWED_SORT_FIELDS = ['price', 'rating'];
const ALLOWED_SORT_ORDERS = ['asc', 'desc'];

function validateSortBy(sortBy) {
    const [field, order] = sortBy.split(':');
    
    if (!ALLOWED_SORT_FIELDS.includes(field)) {
        throw new ValidationError('Invalid sort field');
    }
    
    if (!ALLOWED_SORT_ORDERS.includes(order)) {
        throw new ValidationError('Invalid sort order');
    }
    
    return { field, order };
}
```

### 9.3 Cross-Site Scripting (XSS) Prevention

**Methods**:
1. **Output Encoding**: Escape HTML in API responses (client-side rendering handles this)
2. **Input Sanitization**: Remove script tags and HTML from inputs
3. **Content Security Policy**: Set appropriate HTTP headers

**Headers**:
```javascript
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
```

### 9.4 Rate Limiting

**Configuration**:
```javascript
const rateLimit = require('express-rate-limit');

const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.'
        }
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false
});

app.use('/api/hotels', searchLimiter);
```

### 9.5 Error Message Security

**Do Not Expose**:
- Database error details
- Stack traces
- Internal file paths
- Database schema information

**Production Error Handler**:
```javascript
app.use((err, req, res, next) => {
    // Log full error details internally
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        url: req.url
    });
    
    // Send generic error to client in production
    if (process.env.NODE_ENV === 'production') {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred. Please try again later.'
            }
        });
    } else {
        // Send detailed error in development
        res.status(500).json({
            success: false,
            error: {
                message: err.message,
                stack: err.stack
            }
        });
    }
});
```

### 9.6 HTTPS Enforcement

**Production Requirement**:
- All API traffic must use HTTPS
- Redirect HTTP to HTTPS
- Set Strict-Transport-Security header

```javascript
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !req.secure) {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});

app.use((req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});
```

---

## 10. Scalability & Extensibility

### 10.1 Horizontal Scaling

**Current Architecture Supports**:
- **Stateless API**: No server-side session state (RESTful design)
- **Load Balancing**: Multiple Node.js instances behind load balancer
- **Database Connection Pooling**: Shared connection pool across instances

**Deployment Architecture**:
```
                   ┌────────────┐
                   │   Nginx    │
                   │ Load Balancer │
                   └──────┬─────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
   │ Node.js │      │ Node.js │      │ Node.js │
   │Instance1│      │Instance2│      │Instance3│
   └────┬────┘      └────┬────┘      └────┬────┘
        │                │                 │
        └────────────────┼─────────────────┘
                         │
                   ┌─────▼──────┐
                   │ PostgreSQL │
                   │  Primary   │
                   └────────────┘
```

### 10.2 Database Scaling

#### 10.2.1 Read Replicas

**For Read-Heavy Workloads**:
- Master database handles writes (future booking operations)
- Read replicas handle search queries
- Route search queries to replicas

**Implementation**:
```javascript
const masterDb = knex({ connection: process.env.DATABASE_MASTER_URL });
const replicaDb = knex({ connection: process.env.DATABASE_REPLICA_URL });

// Use replica for searches
async findHotelsByFilters(filters) {
    return replicaDb('hotels').where(...);
}

// Use master for writes (future booking operations)
async createBooking(bookingData) {
    return masterDb('bookings').insert(bookingData);
}
```

#### 10.2.2 Partitioning

**Future Optimization** (if dataset grows > 1M hotels):
- Partition hotels table by region
- Each partition contains hotels for specific geographic area

```sql
CREATE TABLE hotels_north_america PARTITION OF hotels
FOR VALUES IN ('USA', 'Canada', 'Mexico');

CREATE TABLE hotels_europe PARTITION OF hotels
FOR VALUES IN ('UK', 'France', 'Germany', 'Spain', 'Italy');
```

### 10.3 Caching Layer

**Redis Cache** (future enhancement):
- Cache popular search queries
- Cache hotel details by ID
- Reduce database load by 30-50%

**Architecture**:
```
Client → API → Redis Cache → PostgreSQL
                   ↓ (cache miss)
                Database
```

### 10.4 Extensibility for Future Features

#### 10.4.1 Amenity Filtering (Future)

**Current Design Supports**:
- Amenities stored in separate table (normalized)
- Easy to add filter: `?amenities=Pool,WiFi`

**Implementation**:
```javascript
if (filters.amenities) {
    const amenityNames = filters.amenities.split(',');
    query = query.whereExists(function() {
        this.select('*')
            .from('hotel_amenities')
            .join('amenities', 'hotel_amenities.amenity_id', 'amenities.id')
            .whereRaw('hotel_amenities.hotel_id = hotels.id')
            .whereIn('amenities.name', amenityNames);
    });
}
```

#### 10.4.2 Date-Based Availability (HB-002)

**Schema Extension**:
```sql
CREATE TABLE hotel_availability (
    hotel_id INT NOT NULL,
    date DATE NOT NULL,
    available_rooms INT NOT NULL,
    
    PRIMARY KEY (hotel_id, date),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);
```

**Query Modification**:
```javascript
// Add availability check to search query
if (filters.checkInDate && filters.checkOutDate) {
    query = query.whereExists(function() {
        this.select('*')
            .from('hotel_availability')
            .whereRaw('hotel_availability.hotel_id = hotels.id')
            .whereBetween('date', [filters.checkInDate, filters.checkOutDate])
            .where('available_rooms', '>', 0);
    });
}
```

#### 10.4.3 Location-Based Search (Future)

**Add Geographic Coordinates**:
```sql
ALTER TABLE hotels 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);

CREATE INDEX idx_location_geo ON hotels USING GIST (
    ll_to_earth(latitude, longitude)
);
```

**Radius Search**:
```javascript
// Find hotels within 50km of coordinates
query = query.whereRaw(
    'earth_distance(ll_to_earth(?, ?), ll_to_earth(latitude, longitude)) < ?',
    [userLat, userLon, 50000] // 50km in meters
);
```

#### 10.4.4 Advanced Sorting Options (Future)

**Extend Sort Options**:
- Popularity (based on booking count)
- Distance from user location
- Relevance score (full-text search)

**Implementation**:
```javascript
const SORT_OPTIONS = {
    'price:asc': { field: 'price_per_night', order: 'asc' },
    'price:desc': { field: 'price_per_night', order: 'desc' },
    'rating:asc': { field: 'rating', order: 'asc' },
    'rating:desc': { field: 'rating', order: 'desc' },
    'popularity:desc': { field: 'booking_count', order: 'desc' }, // Future
    'distance:asc': { field: 'distance', order: 'asc' } // Future with location
};
```

### 10.5 API Versioning

**Future-Proof API Changes**:
- Use URL versioning: `/api/v1/hotels/search`
- Maintain backward compatibility
- Deprecation notices in response headers

```javascript
app.use('/api/v1/hotels', hotelsRouter);
// Future: app.use('/api/v2/hotels', hotelsV2Router);
```

### 10.6 Monitoring and Observability

**Metrics Collection**:
- Request duration by endpoint
- Database query performance
- Error rates and types
- Cache hit/miss rates (future)

**Logging Structure**:
```javascript
logger.info('Hotel search completed', {
    filters: {
        location: 'Miami',
        minPrice: 100,
        maxPrice: 200,
        minRating: 4.0
    },
    results: 15,
    duration: 250, // milliseconds
    userId: req.user?.id // Future: when auth is implemented
});
```

---

## 11. Testing Strategy

### 11.1 Unit Testing

**Coverage**: Services, validators, utilities

**Example Test** (`hotelService.test.js`):
```javascript
describe('hotelService.searchHotels', () => {
    it('should apply case-insensitive location matching', async () => {
        const filters = { location: 'MIAMI' };
        const result = await hotelService.searchHotels(filters);
        
        expect(result.every(h => 
            h.location.city.toLowerCase().includes('miami') ||
            h.location.region.toLowerCase().includes('miami')
        )).toBe(true);
    });
    
    it('should filter by price range', async () => {
        const filters = { location: 'Miami', minPrice: 100, maxPrice: 200 };
        const result = await hotelService.searchHotels(filters);
        
        result.forEach(hotel => {
            expect(parseFloat(hotel.pricePerNight)).toBeGreaterThanOrEqual(100);
            expect(parseFloat(hotel.pricePerNight)).toBeLessThanOrEqual(200);
        });
    });
});
```

### 11.2 Integration Testing

**Coverage**: API endpoints, database interactions

**Example Test** (`hotelAPI.test.js`):
```javascript
describe('GET /api/hotels/search', () => {
    it('should return hotels matching location and filters', async () => {
        const response = await request(app)
            .get('/api/hotels/search')
            .query({ 
                location: 'Miami', 
                minPrice: 100, 
                maxPrice: 200, 
                minRating: 4.0 
            });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.hotels).toBeInstanceOf(Array);
        expect(response.body.data.pagination).toBeDefined();
    });
    
    it('should return 400 for invalid price range', async () => {
        const response = await request(app)
            .get('/api/hotels/search')
            .query({ location: 'Miami', minPrice: 200, maxPrice: 100 });
        
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
});
```

### 11.3 Performance Testing

**Tool**: Apache JMeter or Artillery

**Test Scenarios**:
1. 100 concurrent users performing searches
2. Complex queries with all filters
3. Large result sets (100+ hotels)

**Success Criteria**:
- 95% of requests complete within 2 seconds
- No database connection pool exhaustion
- No memory leaks over 1-hour test

---

## 12. Deployment Considerations

### 12.1 Environment Variables

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hotel_booking
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Server
NODE_ENV=production
PORT=3000

# Security
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 12.2 Database Migrations

**Initial Migration** (create tables and indexes):
```bash
npx knex migrate:make create_hotels_table
npx knex migrate:make create_amenities_tables
npx knex migrate:make create_indexes
npx knex migrate:latest # Apply migrations
```

### 12.3 Seed Data

**Load Initial Hotel Data**:
```bash
npx knex seed:make seed_amenities
npx knex seed:make seed_hotels
npx knex seed:run
```

---

## 13. Acceptance Criteria Mapping

| Acceptance Criteria | Architecture Component | Implementation |
|---------------------|------------------------|----------------|
| **AC-001**: Search by location | Repository: `findHotelsByFilters()` | ILIKE query on city/region with partial matching |
| **AC-002**: Filter by price range | Repository: WHERE clause | `price_per_night >= minPrice AND price_per_night <= maxPrice` |
| **AC-003**: Filter by minimum rating | Repository: WHERE clause | `rating >= minRating` |
| **AC-004**: Sort by price/rating | Repository: ORDER BY | Dynamic ORDER BY based on `sortBy` parameter |
| **AC-005**: View hotel details | Endpoint: `GET /api/hotels/:id` | Return full hotel object with amenities |

---

## 14. Success Metrics Alignment

| Success Metric | Architecture Support |
|---------------|---------------------|
| Search response < 2 seconds | Database indexes, query optimization, connection pooling |
| Filter application < 500ms | Efficient WHERE clauses, composite indexes |
| 100+ concurrent users | Stateless design, horizontal scaling, connection pooling |
| 80%+ test coverage | Unit tests (services, validators), integration tests (APIs) |
| WCAG 2.1 compliance | API provides structured data; frontend implements accessibility |

---

## 15. Open Questions & Risks

### 15.1 Open Questions

1. **Database Choice Confirmation**: Is PostgreSQL approved, or should we use MySQL?
   - **Recommendation**: PostgreSQL for advanced features
   
2. **Caching Strategy**: Should we implement Redis caching in Phase 1 or defer to Phase 2?
   - **Recommendation**: Defer to Phase 2; optimize database queries first

3. **API Authentication**: Will HB-001 require authentication, or is it public access?
   - **Assumption**: Public access for search; authentication for booking (HB-002)

### 15.2 Risks

| Risk | Mitigation |
|------|-----------|
| **Database Performance** | Implement comprehensive indexing strategy from Day 1 |
| **Query Complexity** | Use EXPLAIN ANALYZE to optimize queries; set query timeout |
| **Data Quality** | Validate seed data; ensure consistent amenity naming |
| **Scope Creep** | Strictly adhere to AC-001 through AC-005; defer enhancements |

---

## 16. Next Steps

1. **Review & Approval**: Stakeholder review of architecture document
2. **Setup Development Environment**: Install Node.js, PostgreSQL, dependencies
3. **Database Schema Creation**: Run migrations to create tables and indexes
4. **Seed Data**: Load initial hotel data for testing
5. **Implementation**: Begin coding based on architecture specification
6. **Unit Testing**: Write tests as code is developed (TDD approach)
7. **Integration Testing**: Test API endpoints end-to-end
8. **Performance Testing**: Validate NFRs (response time, concurrent users)
9. **Code Review**: Peer review before merging to main branch

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-11-09 | Solution Architect Agent | Initial architecture document created |

**Status**: Draft  
**Next Review Date**: TBD  
**Approved By**: Pending

---

## Appendix A: Code Examples

### A.1 Complete Route Definition

```javascript
// routes/hotels.js
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { validateSearchQuery, validateHotelId } = require('../middleware/validation');
const rateLimiter = require('../middleware/rateLimiter');

// Apply rate limiter to all hotel routes
router.use(rateLimiter);

// Search hotels
router.get('/search', validateSearchQuery, hotelController.searchHotels);

// Get hotel by ID
router.get('/:id', validateHotelId, hotelController.getHotelById);

module.exports = router;
```

### A.2 Complete Controller

```javascript
// controllers/hotelController.js
const hotelService = require('../services/hotelService');

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

module.exports = new HotelController();
```

### A.3 Validation Middleware

```javascript
// middleware/validation.js
const Joi = require('joi');

const searchQuerySchema = Joi.object({
    location: Joi.string().trim().min(2).max(100).required(),
    minPrice: Joi.number().min(0).max(999999.99).optional(),
    maxPrice: Joi.number().min(0).max(999999.99).optional(),
    minRating: Joi.number().min(1.0).max(5.0).optional(),
    sortBy: Joi.string().valid('price:asc', 'price:desc', 'rating:asc', 'rating:desc').default('rating:desc'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(100)
}).custom((value, helpers) => {
    if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
        return helpers.error('custom.minGreaterThanMax');
    }
    return value;
}).messages({
    'custom.minGreaterThanMax': 'Minimum price cannot be greater than maximum price'
});

function validateSearchQuery(req, res, next) {
    const { error, value } = searchQuerySchema.validate(req.query, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid query parameters',
                details: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            }
        });
    }

    req.query = value; // Use validated values
    next();
}

module.exports = { validateSearchQuery };
```

---

**End of Architecture Document**
