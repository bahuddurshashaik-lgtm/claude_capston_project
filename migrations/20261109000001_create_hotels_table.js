/**
 * Migration: Create hotels table with optimized indexes including pg_trgm (H-1 FIX - CRITICAL)
 * This migration creates the hotels table with all necessary columns, constraints, and indexes
 * for efficient location-based search with ILIKE queries.
 */

exports.up = async function(knex) {
  // Enable pg_trgm extension for fuzzy text search (H-1 FIX - CRITICAL)
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
  });

  // Add CHECK constraints (M-4 fix)
  await knex.raw(`
    ALTER TABLE hotels
    ADD CONSTRAINT chk_price_positive CHECK (price_per_night > 0)
  `);

  await knex.raw(`
    ALTER TABLE hotels
    ADD CONSTRAINT chk_rating_range CHECK (rating IS NULL OR (rating >= 1.0 AND rating <= 5.0))
  `);

  // Standard B-tree indexes
  await knex.raw('CREATE INDEX idx_city ON hotels(city);');
  await knex.raw('CREATE INDEX idx_region ON hotels(region);');
  await knex.raw('CREATE INDEX idx_price ON hotels(price_per_night);');
  await knex.raw('CREATE INDEX idx_rating ON hotels(rating);');
  await knex.raw('CREATE INDEX idx_active ON hotels(is_active);');

  // Trigram indexes for ILIKE queries (H-1 FIX - CRITICAL)
  // These indexes enable fast fuzzy text search with leading wildcards
  await knex.raw('CREATE INDEX idx_city_trgm ON hotels USING GIN (LOWER(city) gin_trgm_ops);');
  await knex.raw('CREATE INDEX idx_region_trgm ON hotels USING GIN (LOWER(region) gin_trgm_ops);');

  // Composite indexes for common query patterns
  await knex.raw('CREATE INDEX idx_search_composite ON hotels(city, price_per_night, rating, is_active);');
  await knex.raw('CREATE INDEX idx_location_composite ON hotels(city, region, is_active);');

  // Partial index for active hotels only (reduces index size)
  await knex.raw('CREATE INDEX idx_active_hotels ON hotels(city, price_per_night, rating) WHERE is_active = TRUE;');
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('hotels');
  // Note: pg_trgm extension remains (safe for other uses)
};
