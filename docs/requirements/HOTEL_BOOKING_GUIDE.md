# Hotel Booking Application - Implementation Guide

This guide provides a complete roadmap for implementing the Hotel Booking Application using the Agentic SDLC workflow with Claude Code.

## Overview

The Hotel Booking Application is a full-featured online hotel reservation system with 5 core user stories covering the complete guest journey from search to booking management.

## User Stories Summary

| Story | Title | Priority | Points | Dependencies |
|-------|-------|----------|--------|--------------|
| HB-001 | Hotel Search and Browse | High | 8 | None |
| HB-002 | Hotel Details and Room Selection | High | 13 | HB-001 |
| HB-003 | User Registration and Authentication | High | 8 | None |
| HB-004 | Booking and Payment | High | 13 | HB-002, HB-003 |
| HB-005 | Booking Management and Cancellation | Medium | 8 | HB-004 |

**Total Story Points**: 50

## Architecture Recommendations

### Frontend Stack
```
Framework: React.js 18+ with TypeScript
State Management: Redux Toolkit or Zustand
Routing: React Router v6
UI Components: Material-UI or Tailwind CSS + shadcn/ui
Forms: React Hook Form + Zod validation
Date Picker: react-dates or date-fns
Maps: Google Maps API / Mapbox GL JS
Image Handling: React Image Gallery
HTTP Client: Axios with interceptors
Build Tool: Vite
```

### Backend Stack
```
Runtime: Node.js 18+ LTS
Framework: Express.js or Fastify
Language: TypeScript
API: RESTful with OpenAPI/Swagger docs
Authentication: JWT with Passport.js
Payment: Stripe SDK or PayPal REST API
Email: SendGrid or AWS SES
File Storage: AWS S3 or Cloudinary
```

### Database
```
Primary: PostgreSQL 15+ (relational data)
Schema: hotels, rooms, bookings, users, reviews
Indexes: location, dates, user_id, booking_ref
Full-text search: PostgreSQL full-text search or Elasticsearch
Cache: Redis for sessions and search results
```

### Infrastructure
```
Hosting: AWS (EC2/ECS) or Azure (App Service)
CDN: CloudFront or Azure CDN
Monitoring: DataDog or New Relic
Logging: Winston + CloudWatch
CI/CD: GitHub Actions or GitLab CI
```

## Database Schema

### Core Tables

#### hotels
```sql
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),
  average_rating DECIMAL(3, 2) DEFAULT 0,
  amenities JSONB,
  images JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hotels_location ON hotels (city, country);
CREATE INDEX idx_hotels_rating ON hotels (star_rating, average_rating);
```

#### rooms
```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  room_type VARCHAR(100) NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  total_rooms INTEGER NOT NULL,
  amenities JSONB,
  images JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rooms_hotel ON rooms (hotel_id);
CREATE INDEX idx_rooms_price ON rooms (price_per_night);
```

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email_verified BOOLEAN DEFAULT FALSE,
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_oauth ON users (oauth_provider, oauth_id);
```

#### bookings
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  hotel_id UUID REFERENCES hotels(id),
  room_id UUID REFERENCES rooms(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guest_count INTEGER NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20) NOT NULL,
  special_requests TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  payment_id VARCHAR(255),
  booking_status VARCHAR(50) NOT NULL,
  cancellation_date TIMESTAMP,
  refund_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bookings_user ON bookings (user_id);
CREATE INDEX idx_bookings_dates ON bookings (check_in_date, check_out_date);
CREATE INDEX idx_bookings_reference ON bookings (booking_reference);
CREATE INDEX idx_bookings_status ON bookings (booking_status);
```

#### reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_hotel ON reviews (hotel_id);
CREATE INDEX idx_reviews_user ON reviews (user_id);
CREATE INDEX idx_reviews_rating ON reviews (rating);
```

## API Endpoints

### Search & Browse (HB-001)
```
GET    /api/hotels/search
Query: ?city={city}&checkIn={date}&checkOut={date}&guests={number}
       &minPrice={number}&maxPrice={number}&rating={number}
       &amenities={array}&sortBy={price|rating|distance}
Response: { hotels: [], pagination: {}, filters: {} }

GET    /api/hotels/autocomplete
Query: ?query={string}
Response: { suggestions: [] }
```

### Hotel Details (HB-002)
```
GET    /api/hotels/{hotelId}
Response: { hotel: {}, rooms: [], reviews: [], nearby: [] }

GET    /api/hotels/{hotelId}/rooms
Query: ?checkIn={date}&checkOut={date}
Response: { rooms: [], availability: {} }

GET    /api/hotels/{hotelId}/reviews
Query: ?page={number}&sort={recent|rating}
Response: { reviews: [], pagination: {} }
```

### Authentication (HB-003)
```
POST   /api/auth/register
Body: { email, password, firstName, lastName, phone }
Response: { user: {}, token: {} }

POST   /api/auth/login
Body: { email, password }
Response: { user: {}, accessToken, refreshToken }

POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
GET    /api/auth/oauth/{provider}
GET    /api/auth/oauth/{provider}/callback

GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/bookings
```

### Booking & Payment (HB-004)
```
POST   /api/bookings/create
Body: { hotelId, roomId, checkIn, checkOut, guests, guestDetails }
Response: { booking: {}, paymentIntent: {} }

POST   /api/bookings/{bookingId}/payment
Body: { paymentMethodId, paymentDetails }
Response: { booking: {}, paymentStatus: {} }

POST   /api/bookings/validate-promo
Body: { promoCode, bookingDetails }
Response: { valid: boolean, discount: {} }
```

### Booking Management (HB-005)
```
GET    /api/bookings/{bookingId}
GET    /api/bookings/lookup
Query: ?reference={bookingRef}&email={email}
Response: { booking: {} }

PUT    /api/bookings/{bookingId}/modify
Body: { checkIn, checkOut, roomId }
Response: { booking: {}, priceDifference: {} }

POST   /api/bookings/{bookingId}/cancel
Body: { reason }
Response: { booking: {}, refundAmount: {} }

GET    /api/bookings/{bookingId}/calendar
Response: ICS file download
```

## Implementation Order

### Phase 1: Foundation (Week 1-2)
1. Set up project structure and dependencies
2. Configure database and run migrations
3. Implement authentication system (HB-003)
4. Set up CI/CD pipeline
5. Configure monitoring and logging

### Phase 2: Core Features (Week 3-4)
1. Implement hotel search (HB-001)
2. Build hotel details page (HB-002)
3. Implement room selection
4. Add filtering and sorting

### Phase 3: Booking Flow (Week 5-6)
1. Implement booking creation
2. Integrate payment gateway (HB-004)
3. Set up email notifications
4. Add booking confirmation

### Phase 4: Management (Week 7)
1. Implement booking management (HB-005)
2. Add modification flow
3. Implement cancellation and refunds
4. Add calendar export

### Phase 5: Polish (Week 8)
1. Add comprehensive testing
2. Performance optimization
3. Security audit
4. Documentation
5. Deploy to production

## Testing Strategy

### Unit Tests
```
Coverage Target: 80%+
Tools: Jest + React Testing Library
Focus: Business logic, utilities, hooks
```

### Integration Tests
```
Tools: Supertest for API, Cypress for E2E
Focus: API endpoints, database operations
```

### E2E Tests
```
Tools: Playwright or Cypress
Scenarios:
- Complete booking flow (search → details → payment → confirmation)
- User registration and login
- Booking modification and cancellation
- Error scenarios (payment failure, no availability)
```

### Performance Tests
```
Tools: k6 or Artillery
Scenarios:
- Search with 1000 concurrent users
- Booking creation load test
- Database query performance
```

## Security Checklist

- [ ] HTTPS enforced for all connections
- [ ] Passwords hashed with bcrypt (cost 12+)
- [ ] JWT tokens with short expiry
- [ ] Rate limiting on all endpoints
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (Content Security Policy)
- [ ] CSRF protection
- [ ] PCI DSS compliance for payments
- [ ] Sensitive data encryption at rest
- [ ] Security headers (helmet.js)
- [ ] Dependency vulnerability scanning
- [ ] API authentication on all protected routes

## Monitoring & Observability

### Metrics to Track
```
Performance:
- API response time (p50, p95, p99)
- Database query time
- Page load time
- Time to first byte (TTFB)

Business:
- Search conversion rate
- Booking completion rate
- Average booking value
- Cancellation rate

Errors:
- 4xx/5xx error rates
- Payment failures
- Failed login attempts
```

### Alerts
```
Critical:
- Payment processing failures > 5%
- API error rate > 1%
- Database connection failures

Warning:
- Response time > 3 seconds
- Memory usage > 80%
- Disk usage > 85%
```

## Running the Hotel Booking Stories Creation

1. **Ensure dependencies are installed**:
   ```bash
   cd src/mcp-servers/confluence
   npm install
   ```

2. **Configure credentials in `.env`**:
   ```env
   CONFLUENCE_EMAIL=your-email@example.com
   CONFLUENCE_API_TOKEN=your-api-token
   ```

3. **Run the creation script**:
   ```bash
   node create-hotel-booking-stories.js
   ```

4. **Verify in Confluence**:
   Visit: https://bahuddurshashaik.atlassian.net/wiki/spaces/ClaudeCpas/overview

## Using Claude Code with Hotel Booking Stories

### Start Requirements Phase
```
Read HB-001 from Confluence and let's gather requirements for hotel search
```

### Design Architecture
```
Based on the 5 hotel booking user stories, design a system architecture
```

### Implement a Feature
```
Implement HB-001: Hotel Search and Browse according to the requirements
```

### Review Code
```
Review the hotel search implementation using the code review checklist
```

## Next Steps

1. ✅ User stories created in Confluence
2. Read HB-001 to start requirements gathering
3. Design database schema
4. Design API contracts
5. Set up project structure
6. Begin implementation following the phase plan
7. Test thoroughly
8. Deploy and monitor

## Resources

- **Confluence**: https://bahuddurshashaik.atlassian.net/wiki/spaces/ClaudeCpas/overview
- **User Stories**: HB-001 through HB-005
- **SDLC Workflow**: See [AGENTIC_SDLC_WORKFLOW.md](../AGENTIC_SDLC_WORKFLOW.md)

---

**Ready to build an amazing hotel booking platform! 🏨✨**
