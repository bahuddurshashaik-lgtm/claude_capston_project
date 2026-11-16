# Hotel Booking API Documentation - HB-001

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
HB-001 does not require authentication. Hotel search is publicly accessible.

## Rate Limiting
- **Limit**: 100 requests per minute per IP address
- **Headers**:
  - `X-RateLimit-Remaining`: Number of requests remaining
  - `X-Request-ID`: Unique request identifier

## Endpoints

### 1. Search Hotels

Search for hotels by location with optional filters and sorting.

**Endpoint**: `GET /api/v1/hotels/search`

**Query Parameters**:

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `location` | String | Yes | City or region name (min 2, max 100 chars) | `Miami` |
| `minPrice` | Number | No | Minimum price per night (>= 0) | `100` |
| `maxPrice` | Number | No | Maximum price per night (>= 0) | `200` |
| `minRating` | Number | No | Minimum rating (1.0 - 5.0) | `4.0` |
| `sortBy` | String | No | Sort option (default: `rating:desc`) | `price:asc` |
| `page` | Number | No | Page number (default: 1) | `1` |
| `limit` | Number | No | Results per page (default: 100, max: 100) | `50` |

**Valid `sortBy` Values**:
- `price:asc` - Price: Low to High
- `price:desc` - Price: High to Low
- `rating:asc` - Rating: Low to High
- `rating:desc` - Rating: High to Low (default)

**Example Request**:
```bash
curl "http://localhost:3000/api/v1/hotels/search?location=Miami&minPrice=100&maxPrice=200&minRating=4.0&sortBy=rating:desc"
```

**Success Response (200 OK)**:
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
        "pricePerNight": "249.99",
        "rating": "4.8"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "totalResults": 1,
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

**No Results Response (200 OK)**:
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

**Validation Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": [
      {
        "field": "location",
        "message": "\"location\" is required"
      },
      {
        "field": "maxPrice",
        "message": "Minimum price cannot be greater than maximum price"
      }
    ]
  }
}
```

---

### 2. Get Hotel by ID

Retrieve detailed information about a specific hotel, including amenities.

**Endpoint**: `GET /api/v1/hotels/:id`

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | Number | Yes | Hotel ID |

**Example Request**:
```bash
curl "http://localhost:3000/api/v1/hotels/1"
```

**Success Response (200 OK)**:
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
    "pricePerNight": "249.99",
    "rating": "4.8",
    "amenities": [
      { "name": "WiFi", "icon": "wifi" },
      { "name": "Pool", "icon": "pool" },
      { "name": "Parking", "icon": "parking" },
      { "name": "Gym", "icon": "gym" },
      { "name": "Spa", "icon": "spa" },
      { "name": "Restaurant", "icon": "restaurant" }
    ]
  }
}
```

**Not Found Response (404 Not Found)**:
```json
{
  "success": false,
  "error": {
    "code": "HOTEL_NOT_FOUND",
    "message": "Hotel with ID 999 not found"
  }
}
```

**Invalid ID Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid hotel ID",
    "details": [
      {
        "field": "id",
        "message": "\"id\" must be a number"
      }
    ]
  }
}
```

---

### 3. Health Check

Check API health status.

**Endpoint**: `GET /health`

**Example Request**:
```bash
curl "http://localhost:3000/health"
```

**Success Response (200 OK)**:
```json
{
  "status": "ok",
  "timestamp": "2026-11-09T10:00:00.000Z"
}
```

---

## Error Responses

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success (including empty results) |
| 400 | Bad Request (validation errors) |
| 404 | Not Found (hotel ID not found) |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |

### Rate Limit Exceeded (429)

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

**Response Headers**:
- `X-RateLimit-Remaining: 0`
- `Retry-After: 60`

### Internal Server Error (500)

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred. Please try again later."
  }
}
```

---

## Common Use Cases

### 1. Search hotels in Miami
```bash
curl "http://localhost:3000/api/v1/hotels/search?location=Miami"
```

### 2. Find budget hotels ($50-$150) in New York with good ratings
```bash
curl "http://localhost:3000/api/v1/hotels/search?location=New%20York&minPrice=50&maxPrice=150&minRating=4.0"
```

### 3. Find luxury hotels sorted by price (high to low)
```bash
curl "http://localhost:3000/api/v1/hotels/search?location=San%20Francisco&minPrice=300&sortBy=price:desc"
```

### 4. Get detailed information about a specific hotel
```bash
curl "http://localhost:3000/api/v1/hotels/1"
```

### 5. Search with pagination
```bash
curl "http://localhost:3000/api/v1/hotels/search?location=Los%20Angeles&page=2&limit=20"
```

---

## Response Headers

All responses include the following headers:

| Header | Description |
|--------|-------------|
| `X-Request-ID` | Unique identifier for request tracing |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `Content-Type` | `application/json` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |

---

## Validation Rules

### Location
- **Required**: Yes
- **Type**: String
- **Min Length**: 2 characters
- **Max Length**: 100 characters
- **Pattern**: Alphanumeric, spaces, hyphens, apostrophes only

### Price
- **Type**: Number
- **Min**: 0
- **Max**: 999999.99
- **Constraint**: minPrice ≤ maxPrice

### Rating
- **Type**: Number
- **Min**: 1.0
- **Max**: 5.0

### Sort By
- **Type**: String
- **Allowed Values**: `price:asc`, `price:desc`, `rating:asc`, `rating:desc`

### Pagination
- **page**: Integer >= 1
- **limit**: Integer 1-100

---

## Performance

Expected response times under normal load:

| Operation | Target | Measurement |
|-----------|--------|-------------|
| Search query | < 2 seconds | 95th percentile |
| Filter application | < 500ms | 95th percentile |
| Sort operation | < 300ms | 95th percentile |
| Get hotel by ID | < 200ms | 95th percentile |

---

## CORS Configuration

Allowed origins (configurable via environment variable):
- `http://localhost:3000`
- `http://localhost:3001`

Allowed methods:
- `GET`
- `HEAD`
- `OPTIONS`

Allowed headers:
- `Content-Type`
- `X-Request-ID`

---

## Testing the API

### Using cURL

```bash
# Search hotels
curl -X GET "http://localhost:3000/api/v1/hotels/search?location=Miami" \
  -H "Accept: application/json"

# Get hotel details
curl -X GET "http://localhost:3000/api/v1/hotels/1" \
  -H "Accept: application/json"
```

### Using Postman

1. Import the API collection (if available)
2. Set base URL: `http://localhost:3000/api/v1`
3. Add query parameters as needed
4. Send request

### Using JavaScript (Fetch API)

```javascript
// Search hotels
fetch('http://localhost:3000/api/v1/hotels/search?location=Miami&minPrice=100&maxPrice=200')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Get hotel by ID
fetch('http://localhost:3000/api/v1/hotels/1')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-11-09 | Initial API release for HB-001 |
