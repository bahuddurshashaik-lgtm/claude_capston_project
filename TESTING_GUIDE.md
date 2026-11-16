# Testing Guide - HB-001: Hotel Search and Browse

## Overview

This guide covers testing for HB-001. The project uses Jest for unit and integration testing with a target coverage of 80%+ overall and 90%+ for critical modules (services, repositories, middleware).

## Test Structure

```
tests/
├── unit/
│   ├── utils/
│   │   └── validators.test.js
│   ├── repositories/
│   │   └── hotelRepository.test.js
│   ├── services/
│   │   └── hotelService.test.js
│   ├── controllers/
│   │   └── hotelController.test.js
│   └── middleware/
│       ├── validation.test.js
│       └── errorHandler.test.js
├── integration/
│   ├── hotelSearch.test.js
│   └── hotelDetail.test.js
├── fixtures/
│   └── hotels.js
└── setup.js
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### Integration Tests Only
```bash
npm run test:integration
```

### With Coverage
```bash
npm test -- --coverage
```

### Specific Test File
```bash
npm test -- hotelService.test.js
```

### Verbose Output
```bash
npm test -- --verbose
```

## Coverage Targets

| Module | Target | Rationale |
|--------|--------|-----------|
| Services | 90%+ | Critical business logic |
| Repositories | 85%+ | Database queries |
| Middleware | 90%+ | Request pipeline |
| Controllers | 80%+ | HTTP handling |
| Utilities | 100% | Reusable functions |
| **Overall** | **80%+** | Project requirement |

## Unit Tests

### Testing Approach
- **Mock dependencies**: Use Jest mocks for database, external services
- **Test in isolation**: Each unit test should test only one function/method
- **Cover edge cases**: Test boundary conditions, null values, errors

### Example: Testing Service Layer

```javascript
// tests/unit/services/hotelService.test.js
const hotelService = require('../../../src/services/hotelService');
const hotelRepository = require('../../../src/repositories/hotelRepository');

jest.mock('../../../src/repositories/hotelRepository');

describe('HotelService', () => {
  describe('searchHotels', () => {
    it('should apply case-insensitive location matching', async () => {
      const mockHotels = [
        { id: 1, city: 'Miami', rating: 4.5, price_per_night: 150 }
      ];
      
      hotelRepository.findHotelsByFilters.mockResolvedValue(mockHotels);
      hotelRepository.countHotelsByFilters.mockResolvedValue(1);
      
      const filters = { location: 'MIAMI' };
      const result = await hotelService.searchHotels(filters);
      
      expect(result.hotels).toHaveLength(1);
      expect(hotelRepository.findHotelsByFilters).toHaveBeenCalledWith(
        expect.objectContaining({ location: 'miami' })
      );
    });
    
    it('should filter by price range', async () => {
      // Test implementation
    });
    
    it('should handle errors gracefully', async () => {
      hotelRepository.findHotelsByFilters.mockRejectedValue(
        new Error('Database error')
      );
      
      await expect(
        hotelService.searchHotels({ location: 'Miami' })
      ).rejects.toThrow('Database error');
    });
  });
});
```

## Integration Tests

### Testing Approach
- **Test full request/response cycle**: From HTTP request to database to response
- **Use test database**: Separate database for integration tests
- **Setup/teardown**: Clean database state between tests
- **Test real scenarios**: Simulate actual user interactions

### Example: Testing API Endpoints

```javascript
// tests/integration/hotelSearch.test.js
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

describe('GET /api/v1/hotels/search', () => {
  beforeAll(async () => {
    // Run migrations
    await db.migrate.latest();
    // Seed test data
    await db.seed.run();
  });
  
  afterAll(async () => {
    // Rollback migrations
    await db.migrate.rollback();
    // Close database connection
    await db.destroy();
  });
  
  it('should return hotels matching location', async () => {
    const response = await request(app)
      .get('/api/v1/hotels/search')
      .query({ location: 'Miami' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.hotels).toBeInstanceOf(Array);
    expect(response.body.data.hotels.length).toBeGreaterThan(0);
  });
  
  it('should filter by price range', async () => {
    const response = await request(app)
      .get('/api/v1/hotels/search')
      .query({ 
        location: 'Miami',
        minPrice: 100,
        maxPrice: 200
      });
    
    expect(response.status).toBe(200);
    response.body.data.hotels.forEach(hotel => {
      const price = parseFloat(hotel.pricePerNight);
      expect(price).toBeGreaterThanOrEqual(100);
      expect(price).toBeLessThanOrEqual(200);
    });
  });
  
  it('should return 400 for invalid price range', async () => {
    const response = await request(app)
      .get('/api/v1/hotels/search')
      .query({ 
        location: 'Miami',
        minPrice: 200,
        maxPrice: 100
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
  
  it('should respect rate limiting', async () => {
    // Make 101 requests
    const requests = [];
    for (let i = 0; i < 101; i++) {
      requests.push(
        request(app)
          .get('/api/v1/hotels/search')
          .query({ location: 'Miami' })
      );
    }
    
    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);
    
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

## Test Fixtures

Create reusable test data:

```javascript
// tests/fixtures/hotels.js
module.exports = {
  validHotel: {
    name: 'Test Hotel',
    city: 'Miami',
    region: 'Florida',
    address: '123 Test St',
    price_per_night: 150.00,
    rating: 4.5,
    is_active: true
  },
  
  inactiveHotel: {
    name: 'Inactive Hotel',
    city: 'Miami',
    region: 'Florida',
    price_per_night: 100.00,
    rating: 3.0,
    is_active: false
  },
  
  expensiveHotel: {
    name: 'Luxury Hotel',
    city: 'New York',
    region: 'New York',
    price_per_night: 450.00,
    rating: 5.0,
    is_active: true
  }
};
```

## Security Tests

### SQL Injection Tests

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

## Performance Tests

While Jest is not ideal for load testing, you can measure response times:

```javascript
describe('Performance Tests', () => {
  it('should respond within 2 seconds', async () => {
    const start = Date.now();
    
    const response = await request(app)
      .get('/api/v1/hotels/search')
      .query({ location: 'Miami' });
    
    const duration = Date.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });
});
```

For comprehensive load testing, use Artillery or K6 (see performance testing section).

## Mocking Best Practices

### Mock Database Queries

```javascript
jest.mock('../../../src/config/database');
const db = require('../../../src/config/database');

// Mock query builder
const mockSelect = jest.fn().mockReturnThis();
const mockWhere = jest.fn().mockReturnThis();
const mockOrderBy = jest.fn().mockReturnThis();

db.mockReturnValue({
  select: mockSelect,
  where: mockWhere,
  orderBy: mockOrderBy
});
```

### Mock External Dependencies

```javascript
// Mock logger to avoid log spam in tests
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }))
}));
```

## Test Assertions

### Common Assertions

```javascript
// Value assertions
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Number assertions
expect(value).toBeGreaterThan(5);
expect(value).toBeLessThanOrEqual(10);
expect(value).toBeCloseTo(10.5, 1);

// Array assertions
expect(array).toHaveLength(3);
expect(array).toContain(item);
expect(array).toContainEqual({ id: 1 });

// Object assertions
expect(object).toHaveProperty('name');
expect(object).toMatchObject({ id: 1, name: 'Test' });

// Error assertions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow('Error message');
await expect(asyncFn()).rejects.toThrow();
```

## Debugging Tests

### Run single test
```bash
npm test -- --testNamePattern="should filter by price"
```

### Enable verbose logging
```bash
npm test -- --verbose
```

### Run with Node debugger
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### View coverage report
```bash
npm test -- --coverage
# Open coverage/lcov-report/index.html
```

## Continuous Integration

### Pre-commit Hook

Add to `.husky/pre-commit`:
```bash
#!/bin/sh
npm test
```

### GitHub Actions

Example workflow:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run test:integration
```

## Troubleshooting

### Tests Hang
- Check for unclosed database connections
- Ensure all async operations have `await`
- Use `--detectOpenHandles` flag

### Flaky Tests
- Avoid timing-dependent tests
- Use proper async/await
- Mock external dependencies
- Ensure test isolation

### Low Coverage
- Check coverage report: `coverage/lcov-report/index.html`
- Add tests for uncovered lines
- Remove dead code
- Test error paths

## Best Practices

1. **Write tests before code** (TDD approach)
2. **Test behavior, not implementation**
3. **Keep tests simple and focused**
4. **Use descriptive test names**
5. **Arrange-Act-Assert pattern**
6. **Mock external dependencies**
7. **Test edge cases and errors**
8. **Keep tests fast** (< 5 seconds total)
9. **Use fixtures for test data**
10. **Clean up after tests** (database, files)

## Test Coverage Report

After running tests, view the coverage report:

```bash
# Generate coverage
npm test -- --coverage

# Open HTML report
# Windows
start coverage/lcov-report/index.html

# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html
```

The report shows:
- **Lines**: Percentage of code lines executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of if/else branches taken
- **Statements**: Percentage of statements executed

## Acceptance Testing

Manual acceptance tests for HB-001:

1. **AC-001**: Search hotels by location
   - Search for "Miami" - should return Miami hotels
   - Search for "New York" - should return New York hotels

2. **AC-002**: Filter by price range
   - Set min=$100, max=$200 - all results in range
   - Set min=$200, max=$100 - should return validation error

3. **AC-003**: Filter by rating
   - Set minRating=4.0 - all results >= 4.0 rating
   - Set minRating=6.0 - should return validation error

4. **AC-004**: Sort results
   - Sort by price:asc - lowest price first
   - Sort by rating:desc - highest rating first

5. **AC-005**: View hotel details
   - Click hotel ID 1 - should show full details with amenities
   - Click hotel ID 999 - should return 404

## Summary

This testing strategy ensures:
- ✅ 80%+ overall code coverage
- ✅ 90%+ coverage for critical modules
- ✅ All acceptance criteria verified
- ✅ Security vulnerabilities tested
- ✅ Performance targets validated
- ✅ Integration with real database tested
- ✅ Error handling verified
