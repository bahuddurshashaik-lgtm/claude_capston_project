/**
 * Seed: Test hotels with varied data
 * Seeds hotels table with diverse test data across multiple cities
 */

exports.seed = async function(knex) {
  // Delete existing entries (cascade will handle hotel_amenities)
  await knex('hotel_amenities').del();
  await knex('hotels').del();

  // Hotel data with variety in prices, ratings, and locations
  const hotels = [
    // Miami, Florida
    { id: 1, name: 'Oceanview Resort', description: 'Luxury beachfront hotel with stunning ocean views', city: 'Miami', region: 'Florida', address: '123 Ocean Drive, Miami, FL 33139', price_per_night: 249.99, rating: 4.8, is_active: true },
    { id: 2, name: 'Downtown Suites', description: 'Modern hotel in the heart of Miami', city: 'Miami', region: 'Florida', address: '456 Biscayne Blvd, Miami, FL 33132', price_per_night: 189.99, rating: 4.5, is_active: true },
    { id: 3, name: 'Budget Inn Miami', description: 'Affordable and clean accommodation', city: 'Miami', region: 'Florida', address: '789 NW 7th St, Miami, FL 33125', price_per_night: 79.99, rating: 3.5, is_active: true },
    { id: 4, name: 'Miami Beach Hotel', description: 'Family-friendly beachside hotel', city: 'Miami', region: 'Florida', address: '321 Collins Ave, Miami Beach, FL 33139', price_per_night: 199.99, rating: 4.2, is_active: true },
    { id: 5, name: 'Art Deco Boutique', description: 'Historic boutique hotel with Art Deco charm', city: 'Miami', region: 'Florida', address: '654 Washington Ave, Miami Beach, FL 33139', price_per_night: 299.99, rating: 4.7, is_active: true },

    // New York
    { id: 6, name: 'Manhattan Grand Hotel', description: 'Luxury hotel in Midtown Manhattan', city: 'New York', region: 'New York', address: '100 W 57th St, New York, NY 10019', price_per_night: 399.99, rating: 4.9, is_active: true },
    { id: 7, name: 'Brooklyn Heights Inn', description: 'Charming hotel with skyline views', city: 'New York', region: 'New York', address: '22 Clark St, Brooklyn, NY 11201', price_per_night: 249.99, rating: 4.4, is_active: true },
    { id: 8, name: 'Queens Budget Lodge', description: 'Economical choice near JFK', city: 'New York', region: 'New York', address: '150-10 Hillside Ave, Jamaica, NY 11432', price_per_night: 129.99, rating: 3.8, is_active: true },
    { id: 9, name: 'Times Square Suites', description: 'Modern suites in the heart of Times Square', city: 'New York', region: 'New York', address: '234 W 42nd St, New York, NY 10036', price_per_night: 449.99, rating: 4.6, is_active: true },
    { id: 10, name: 'Central Park View', description: 'Elegant hotel overlooking Central Park', city: 'New York', region: 'New York', address: '768 5th Ave, New York, NY 10019', price_per_night: 599.99, rating: 4.9, is_active: true },

    // Los Angeles
    { id: 11, name: 'Hollywood Luxury Hotel', description: 'Star-studded luxury in Hollywood', city: 'Los Angeles', region: 'California', address: '6801 Hollywood Blvd, Los Angeles, CA 90028', price_per_night: 349.99, rating: 4.7, is_active: true },
    { id: 12, name: 'Santa Monica Beach Resort', description: 'Beachfront resort with ocean views', city: 'Los Angeles', region: 'California', address: '1910 Ocean Way, Santa Monica, CA 90405', price_per_night: 279.99, rating: 4.5, is_active: true },
    { id: 13, name: 'Downtown LA Inn', description: 'Convenient downtown location', city: 'Los Angeles', region: 'California', address: '555 S Flower St, Los Angeles, CA 90071', price_per_night: 189.99, rating: 4.1, is_active: true },
    { id: 14, name: 'Beverly Hills Grand', description: 'Opulent hotel in Beverly Hills', city: 'Los Angeles', region: 'California', address: '9876 Wilshire Blvd, Beverly Hills, CA 90210', price_per_night: 499.99, rating: 4.8, is_active: true },
    { id: 15, name: 'LAX Budget Stay', description: 'Budget option near airport', city: 'Los Angeles', region: 'California', address: '8620 Airport Blvd, Los Angeles, CA 90045', price_per_night: 99.99, rating: 3.6, is_active: true },

    // Chicago
    { id: 16, name: 'Magnificent Mile Hotel', description: 'Premier shopping district hotel', city: 'Chicago', region: 'Illinois', address: '645 N Michigan Ave, Chicago, IL 60611', price_per_night: 289.99, rating: 4.6, is_active: true },
    { id: 17, name: 'Lakeshore Suites', description: 'Stunning Lake Michigan views', city: 'Chicago', region: 'Illinois', address: '505 N Lake Shore Dr, Chicago, IL 60611', price_per_night: 239.99, rating: 4.4, is_active: true },
    { id: 18, name: 'Chicago Budget Inn', description: 'Affordable downtown option', city: 'Chicago', region: 'Illinois', address: '234 W Madison St, Chicago, IL 60606', price_per_night: 119.99, rating: 3.7, is_active: true },
    { id: 19, name: 'River North Boutique', description: 'Stylish hotel in River North', city: 'Chicago', region: 'Illinois', address: '350 N State St, Chicago, IL 60654', price_per_night: 259.99, rating: 4.5, is_active: true },
    { id: 20, name: 'O\'Hare Airport Hotel', description: 'Convenient for travelers', city: 'Chicago', region: 'Illinois', address: '10000 W O\'Hare Ave, Rosemont, IL 60018', price_per_night: 149.99, rating: 4.0, is_active: true },

    // Boston
    { id: 21, name: 'Boston Harbor Hotel', description: 'Historic waterfront hotel', city: 'Boston', region: 'Massachusetts', address: '70 Rowes Wharf, Boston, MA 02110', price_per_night: 329.99, rating: 4.7, is_active: true },
    { id: 22, name: 'Beacon Hill Inn', description: 'Charming hotel on historic Beacon Hill', city: 'Boston', region: 'Massachusetts', address: '23 Charles St, Boston, MA 02114', price_per_night: 269.99, rating: 4.6, is_active: true },
    { id: 23, name: 'Fenway Budget Lodge', description: 'Near Fenway Park', city: 'Boston', region: 'Massachusetts', address: '1271 Boylston St, Boston, MA 02215', price_per_night: 139.99, rating: 3.9, is_active: true },
    { id: 24, name: 'Seaport District Hotel', description: 'Modern hotel in revitalized Seaport', city: 'Boston', region: 'Massachusetts', address: '2 Seaport Ln, Boston, MA 02210', price_per_night: 299.99, rating: 4.5, is_active: true },
    { id: 25, name: 'Cambridge University Inn', description: 'Close to Harvard and MIT', city: 'Boston', region: 'Massachusetts', address: '110 Mt Auburn St, Cambridge, MA 02138', price_per_night: 219.99, rating: 4.3, is_active: true },

    // San Francisco
    { id: 26, name: 'Golden Gate View Hotel', description: 'Iconic views of the Golden Gate Bridge', city: 'San Francisco', region: 'California', address: '2601 Mason St, San Francisco, CA 94133', price_per_night: 359.99, rating: 4.8, is_active: true },
    { id: 27, name: 'Fisherman\'s Wharf Inn', description: 'Waterfront location with seafood nearby', city: 'San Francisco', region: 'California', address: '2655 Hyde St, San Francisco, CA 94109', price_per_night: 279.99, rating: 4.4, is_active: true },
    { id: 28, name: 'Union Square Boutique', description: 'Central location near shopping', city: 'San Francisco', region: 'California', address: '450 Powell St, San Francisco, CA 94102', price_per_night: 299.99, rating: 4.5, is_active: true },
    { id: 29, name: 'Nob Hill Grand', description: 'Historic luxury on Nob Hill', city: 'San Francisco', region: 'California', address: '1075 California St, San Francisco, CA 94108', price_per_night: 429.99, rating: 4.9, is_active: true },
    { id: 30, name: 'SFO Airport Budget', description: 'Convenient airport hotel', city: 'San Francisco', region: 'California', address: '401 E Millbrae Ave, Millbrae, CA 94030', price_per_night: 159.99, rating: 3.8, is_active: true },

    // Seattle
    { id: 31, name: 'Pike Place Market Hotel', description: 'Steps from Pike Place Market', city: 'Seattle', region: 'Washington', address: '85 Pike St, Seattle, WA 98101', price_per_night: 269.99, rating: 4.6, is_active: true },
    { id: 32, name: 'Space Needle View Suites', description: 'Modern suites with Space Needle views', city: 'Seattle', region: 'Washington', address: '200 6th Ave N, Seattle, WA 98109', price_per_night: 309.99, rating: 4.7, is_active: true },
    { id: 33, name: 'Capitol Hill Boutique', description: 'Hip hotel in trendy neighborhood', city: 'Seattle', region: 'Washington', address: '1000 E Pike St, Seattle, WA 98122', price_per_night: 229.99, rating: 4.4, is_active: true },
    { id: 34, name: 'Waterfront Inn Seattle', description: 'Scenic waterfront location', city: 'Seattle', region: 'Washington', address: '2411 Alaskan Way, Seattle, WA 98121', price_per_night: 249.99, rating: 4.5, is_active: true },
    { id: 35, name: 'SeaTac Budget Lodge', description: 'Near Seattle-Tacoma Airport', city: 'Seattle', region: 'Washington', address: '18845 International Blvd, SeaTac, WA 98188', price_per_night: 119.99, rating: 3.7, is_active: true },

    // Austin
    { id: 36, name: 'Downtown Austin Hotel', description: 'Heart of live music capital', city: 'Austin', region: 'Texas', address: '701 E 6th St, Austin, TX 78701', price_per_night: 199.99, rating: 4.5, is_active: true },
    { id: 37, name: 'South Congress Boutique', description: 'Trendy SoCo location', city: 'Austin', region: 'Texas', address: '1603 S Congress Ave, Austin, TX 78704', price_per_night: 219.99, rating: 4.4, is_active: true },
    { id: 38, name: 'Lady Bird Lake Resort', description: 'Lakeside resort with city views', city: 'Austin', region: 'Texas', address: '1900 Barton Springs Rd, Austin, TX 78704', price_per_night: 259.99, rating: 4.6, is_active: true },
    { id: 39, name: 'University Inn Austin', description: 'Near UT campus and stadiums', city: 'Austin', region: 'Texas', address: '2500 Guadalupe St, Austin, TX 78705', price_per_night: 169.99, rating: 4.2, is_active: true },
    { id: 40, name: 'Budget Stay Austin', description: 'Affordable central location', city: 'Austin', region: 'Texas', address: '1212 Congress Ave, Austin, TX 78701', price_per_night: 109.99, rating: 3.8, is_active: true },

    // Denver
    { id: 41, name: 'Denver Downtown Hotel', description: 'Modern downtown hotel', city: 'Denver', region: 'Colorado', address: '1776 Grant St, Denver, CO 80203', price_per_night: 219.99, rating: 4.5, is_active: true },
    { id: 42, name: 'Cherry Creek Luxury', description: 'Upscale shopping district hotel', city: 'Denver', region: 'Colorado', address: '155 Steele St, Denver, CO 80206', price_per_night: 289.99, rating: 4.7, is_active: true },
    { id: 43, name: 'LoDo Boutique Inn', description: 'Hip Lower Downtown location', city: 'Denver', region: 'Colorado', address: '1620 17th St, Denver, CO 80202', price_per_night: 239.99, rating: 4.6, is_active: true },
    { id: 44, name: 'Rocky Mountain Lodge', description: 'Mountain views from the city', city: 'Denver', region: 'Colorado', address: '3333 Quebec St, Denver, CO 80207', price_per_night: 179.99, rating: 4.3, is_active: true },
    { id: 45, name: 'DIA Budget Hotel', description: 'Near Denver International Airport', city: 'Denver', region: 'Colorado', address: '6800 Tower Rd, Denver, CO 80249', price_per_night: 129.99, rating: 3.9, is_active: true },

    // Portland
    { id: 46, name: 'Pearl District Hotel', description: 'Trendy Pearl District location', city: 'Portland', region: 'Oregon', address: '813 NW 13th Ave, Portland, OR 97209', price_per_night: 229.99, rating: 4.6, is_active: true },
    { id: 47, name: 'Downtown Portland Inn', description: 'Central downtown location', city: 'Portland', region: 'Oregon', address: '310 SW Lincoln St, Portland, OR 97201', price_per_night: 189.99, rating: 4.4, is_active: true },
    { id: 48, name: 'Hawthorne District Lodge', description: 'Quirky boutique hotel', city: 'Portland', region: 'Oregon', address: '3377 SE Hawthorne Blvd, Portland, OR 97214', price_per_night: 169.99, rating: 4.3, is_active: true },
    { id: 49, name: 'Waterfront Suites Portland', description: 'Willamette River views', city: 'Portland', region: 'Oregon', address: '0309 SW Montgomery St, Portland, OR 97201', price_per_night: 249.99, rating: 4.5, is_active: true },
    { id: 50, name: 'PDX Airport Hotel', description: 'Convenient for air travelers', city: 'Portland', region: 'Oregon', address: '11438 NE Airport Way, Portland, OR 97220', price_per_night: 139.99, rating: 4.0, is_active: true },

    // Special cases for testing
    { id: 51, name: 'Hôtel Montréal', description: 'French-inspired boutique hotel', city: 'Montréal', region: 'Quebec', address: '1234 Rue Sainte-Catherine, Montréal, QC H3G 1P5', price_per_night: 199.99, rating: 4.6, is_active: true },
    { id: 52, name: 'Inactive Hotel', description: 'This hotel is inactive', city: 'Miami', region: 'Florida', address: '999 Closed St, Miami, FL', price_per_night: 100.00, rating: 3.0, is_active: false }
  ];

  await knex('hotels').insert(hotels);

  // Assign random amenities to hotels (2-6 amenities per hotel)
  const hotelAmenities = [];
  for (let hotelId = 1; hotelId <= 51; hotelId++) {
    const numAmenities = Math.floor(Math.random() * 5) + 2; // 2-6 amenities
    const amenityIds = [];

    while (amenityIds.length < numAmenities) {
      const amenityId = Math.floor(Math.random() * 10) + 1; // 1-10
      if (!amenityIds.includes(amenityId)) {
        amenityIds.push(amenityId);
        hotelAmenities.push({ hotel_id: hotelId, amenity_id: amenityId });
      }
    }
  }

  await knex('hotel_amenities').insert(hotelAmenities);

  // Reset sequences
  await knex.raw("SELECT setval('hotels_id_seq', (SELECT MAX(id) FROM hotels));");
};
