---
description: Coding standards for application code and tests
applyTo: "backend/src/**,frontend/src/**,backend/tests/**,frontend/tests/**"
---
- Functions are small, single-purpose and named for intent; avoid explanatory comments by naming well.
- Validate every external input (location, dates, guests, price range, ratings).
- Return explicit, user-friendly errors; handle 'Hotel not found', empty results and external API failures without crashing.
- Never log or hard-code secrets (DATABASE_URL, REDIS_URL, HOTEL_API_KEY, JWT_SECRET).
- Extract duplicated logic into shared utilities/services.
- Every feature has unit tests for happy path, validation failures, and edge cases; API endpoints have integration tests.
- Use TypeScript strict mode, no `any` types, explicit return types on all functions.
- Follow REST conventions for API endpoints.
- Use Prisma for database queries (parameterized, no raw SQL).
- Cache search results in Redis with appropriate TTL.
- Implement rate limiting and security headers.
