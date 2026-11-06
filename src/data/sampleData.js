// Sample data for testing all user stories

const sampleHotels = [
  {
    id: 1,
    name: 'Grand Plaza Hotel',
    location: 'New York, NY',
    pricePerNight: 250,
    rating: 4.5,
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
    availability: true
  },
  {
    id: 2,
    name: 'Beach Resort Paradise',
    location: 'Miami, FL',
    pricePerNight: 350,
    rating: 4.8,
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Spa'],
    availability: true
  },
  {
    id: 3,
    name: 'City Center Inn',
    location: 'Chicago, IL',
    pricePerNight: 150,
    rating: 4.2,
    amenities: ['WiFi', 'Breakfast', 'Parking'],
    availability: true
  },
  {
    id: 4,
    name: 'Mountain View Lodge',
    location: 'Denver, CO',
    pricePerNight: 200,
    rating: 4.6,
    amenities: ['WiFi', 'Fireplace', 'Mountain View', 'Hiking'],
    availability: true
  },
  {
    id: 5,
    name: 'Luxury Suites Downtown',
    location: 'Los Angeles, CA',
    pricePerNight: 400,
    rating: 4.9,
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar'],
    availability: true
  }
];

const sampleUsers = [
  {
    email: 'john.doe@example.com',
    password: 'Password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-0101'
  },
  {
    email: 'jane.smith@example.com',
    password: 'SecurePass456',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '555-0102'
  }
];

module.exports = {
  sampleHotels,
  sampleUsers
};
