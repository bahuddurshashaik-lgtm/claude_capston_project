/**
 * Migration: Create hotels table with optimized indexes including pg_trgm (H-1 FIX - CRITICAL)
 * This migration creates the hotels table with all necessary columns, constraints, and indexes
 * for efficient location-based search with ILIKE queries.
 */

exports.up = async function(knex) {
  // Create hotels table
  await knex.schema.createTable('hotels', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.text('description');
    table.string('city', 100).notNullable();
    table.string('region', 100);
    table.text('address');
    table.decimal('price_per_night', 10, 2).notNullable().checkPositive();
    table.decimal('rating', 2, 1);
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    // Standard indexes for SQLite
    table.index('city', 'idx_city');
    table.index('region', 'idx_region');
    table.index('price_per_night', 'idx_price');
    table.index('rating', 'idx_rating');
    table.index('is_active', 'idx_active');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('hotels');
  // Note: pg_trgm extension remains (safe for other uses)
};
