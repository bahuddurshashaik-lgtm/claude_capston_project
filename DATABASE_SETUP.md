# Database Setup Guide

## Prerequisites

- PostgreSQL 14.x or higher installed
- Command line access to PostgreSQL

## Step 1: Create Database and User

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE hotel_booking;

# Create user
CREATE USER hotel_app WITH PASSWORD 'secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hotel_booking TO hotel_app;

# Create test database
CREATE DATABASE hotel_booking_test;
GRANT ALL PRIVILEGES ON DATABASE hotel_booking_test TO hotel_app;

# Exit PostgreSQL
\q
```

## Step 2: Enable pg_trgm Extension

The migration will automatically enable the pg_trgm extension, but you can verify it manually:

```bash
psql -U hotel_app -d hotel_booking

# Check if extension is available
SELECT * FROM pg_available_extensions WHERE name = 'pg_trgm';

# Extension will be created during migration
\q
```

## Step 3: Configure Environment

Copy `.env.example` to `.env` and update the database credentials if needed:

```bash
cp .env.example .env
```

Edit `.env` with your database configuration:
```
DATABASE_URL=postgresql://hotel_app:secure_password@localhost:5432/hotel_booking
TEST_DATABASE_URL=postgresql://hotel_app:secure_password@localhost:5432/hotel_booking_test
```

## Step 4: Run Migrations

```bash
# Run migrations
npm run migrate:latest

# Verify migrations
psql -U hotel_app -d hotel_booking -c "\dt"
```

## Step 5: Seed Data

```bash
# Run seed data
npm run seed:run

# Verify data
psql -U hotel_app -d hotel_booking -c "SELECT COUNT(*) FROM hotels;"
psql -U hotel_app -d hotel_booking -c "SELECT COUNT(*) FROM amenities;"
```

## Verification

### Check Tables
```sql
-- List all tables
\dt

-- Should show:
-- hotels
-- amenities
-- hotel_amenities
-- knex_migrations
-- knex_migrations_lock
```

### Check Indexes
```sql
-- Check indexes on hotels table
\d hotels

-- Should include:
-- idx_city_trgm (GIN index)
-- idx_region_trgm (GIN index)
-- idx_search_composite
-- And other indexes
```

### Check Data
```sql
-- Count hotels
SELECT COUNT(*) FROM hotels WHERE is_active = TRUE;
-- Should return 51

-- Count amenities
SELECT COUNT(*) FROM amenities;
-- Should return 10

-- Sample query with ILIKE (uses trigram index)
EXPLAIN ANALYZE
SELECT * FROM hotels 
WHERE LOWER(city) LIKE '%miami%' 
AND is_active = TRUE;
```

## Troubleshooting

### pg_trgm Extension Not Available
If you get an error about pg_trgm not being available:

```bash
# On Ubuntu/Debian
sudo apt-get install postgresql-contrib

# On macOS with Homebrew
brew install postgresql
```

### Permission Issues
If you get permission errors:

```bash
psql -U postgres -d hotel_booking

# Grant schema permissions
GRANT ALL ON SCHEMA public TO hotel_app;
GRANT ALL ON ALL TABLES IN SCHEMA public TO hotel_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO hotel_app;
```

### Connection Issues
Verify PostgreSQL is running:

```bash
# Check status
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql  # macOS
```

## Migration Commands

```bash
# Create new migration
npm run migrate:make migration_name

# Run migrations
npm run migrate:latest

# Rollback last migration
npm run migrate:rollback

# Rollback all migrations
npm run migrate:rollback --all
```

## Seed Commands

```bash
# Create new seed
npm run seed:make seed_name

# Run all seeds
npm run seed:run
```

## Database Performance

The database is optimized with:
- **pg_trgm GIN indexes** for fast ILIKE searches (H-1 fix)
- **Composite indexes** for common query patterns
- **Partial indexes** for active hotels only
- **Connection pooling** (min: 5, max: 50 connections)

Expected query performance:
- Location search: < 100ms for 1M+ hotels
- Filter + Sort: < 500ms
- Full search with all filters: < 2 seconds
