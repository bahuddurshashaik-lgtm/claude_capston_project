/**
 * Migration: Create amenities and hotel_amenities junction table
 * This migration creates the amenities table and the many-to-many relationship
 * between hotels and amenities.
 */

exports.up = async function(knex) {
  // Create amenities table
  await knex.schema.createTable('amenities', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable().unique();
    table.string('icon', 50);
    table.integer('display_order').defaultTo(0);
  });

  // Create index on name for lookups
  await knex.raw('CREATE INDEX idx_amenities_name ON amenities(name);');

  // Create hotel_amenities junction table
  await knex.schema.createTable('hotel_amenities', (table) => {
    table.integer('hotel_id').unsigned().notNullable();
    table.integer('amenity_id').unsigned().notNullable();

    // Composite primary key
    table.primary(['hotel_id', 'amenity_id']);

    // Foreign key constraints with CASCADE delete
    table.foreign('hotel_id')
      .references('id')
      .inTable('hotels')
      .onDelete('CASCADE');

    table.foreign('amenity_id')
      .references('id')
      .inTable('amenities')
      .onDelete('CASCADE');
  });

  // Create indexes on foreign keys for performance
  await knex.raw('CREATE INDEX idx_hotel_amenities_hotel ON hotel_amenities(hotel_id);');
  await knex.raw('CREATE INDEX idx_hotel_amenities_amenity ON hotel_amenities(amenity_id);');
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('hotel_amenities');
  await knex.schema.dropTableIfExists('amenities');
};
