/**
 * Seed: Standard amenities
 * Seeds the amenities table with standard hotel amenities
 */

exports.seed = async function(knex) {
  // Delete existing entries
  await knex('amenities').del();

  // Insert standard amenities
  await knex('amenities').insert([
    { id: 1, name: 'WiFi', icon: 'wifi', display_order: 1 },
    { id: 2, name: 'Pool', icon: 'pool', display_order: 2 },
    { id: 3, name: 'Parking', icon: 'parking', display_order: 3 },
    { id: 4, name: 'Gym', icon: 'gym', display_order: 4 },
    { id: 5, name: 'Spa', icon: 'spa', display_order: 5 },
    { id: 6, name: 'Restaurant', icon: 'restaurant', display_order: 6 },
    { id: 7, name: 'Room Service', icon: 'room-service', display_order: 7 },
    { id: 8, name: 'Pet Friendly', icon: 'pet', display_order: 8 },
    { id: 9, name: 'Business Center', icon: 'business', display_order: 9 },
    { id: 10, name: 'Air Conditioning', icon: 'ac', display_order: 10 }
  ]);

  // Reset sequence
  await knex.raw("SELECT setval('amenities_id_seq', (SELECT MAX(id) FROM amenities));");
};
