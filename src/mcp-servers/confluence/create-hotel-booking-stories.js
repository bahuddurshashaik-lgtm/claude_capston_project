#!/usr/bin/env node

/**
 * Script to create 5 hotel booking user stories in Confluence
 * Run this after configuring your Confluence credentials
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CONFLUENCE_BASE_URL = process.env.CONFLUENCE_BASE_URL || 'https://bahuddurshashaik.atlassian.net/wiki';
const CONFLUENCE_EMAIL = process.env.CONFLUENCE_EMAIL;
const CONFLUENCE_API_TOKEN = process.env.CONFLUENCE_API_TOKEN;
const CONFLUENCE_SPACE_KEY = process.env.CONFLUENCE_SPACE_KEY || 'ClaudeCpas';

if (!CONFLUENCE_EMAIL || !CONFLUENCE_API_TOKEN) {
  console.error('Error: CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN must be set in .env file');
  process.exit(1);
}

const confluenceApi = axios.create({
  baseURL: `${CONFLUENCE_BASE_URL}/rest/api`,
  auth: {
    username: CONFLUENCE_EMAIL,
    password: CONFLUENCE_API_TOKEN,
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const hotelBookingStories = [
  {
    title: 'HB-001: Hotel Search and Browse',
    content: `<ac:structured-macro ac:name="info">
  <ac:rich-text-body>
    <p><strong>Epic:</strong> Hotel Booking Application MVP</p>
    <p><strong>Story Points:</strong> 8 | <strong>Priority:</strong> High</p>
  </ac:rich-text-body>
</ac:structured-macro>

<h2>User Story</h2>
<table>
  <tr>
    <td><strong>As a</strong></td>
    <td>traveler planning a trip</td>
  </tr>
  <tr>
    <td><strong>I want to</strong></td>
    <td>search for hotels by location and dates</td>
  </tr>
  <tr>
    <td><strong>So that</strong></td>
    <td>I can find available accommodations that meet my requirements</td>
  </tr>
</table>

<h2>Description</h2>
<p>As a traveler planning a trip, I need to search for hotels based on my destination, check-in/check-out dates, and number of guests so that I can view available options that meet my requirements. This is the core entry point for the hotel booking application.</p>

<h2>Acceptance Criteria</h2>
<ac:task-list>
  <ac:task>
    <ac:task-id>1</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can enter destination (city, address, or landmark)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>2</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can select check-in and check-out dates using a date picker</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>3</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can specify number of guests (adults and children)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>4</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Search results display available hotels with basic info (name, price, rating, image)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>5</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Results can be filtered by price range, star rating, amenities</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>6</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Results can be sorted by price, rating, or distance</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>7</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Search parameters are validated (check-out after check-in, future dates only)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>8</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>No results message displayed when no hotels match criteria</ac:task-body>
  </ac:task>
</ac:task-list>

<h2>Technical Details</h2>
<ul>
  <li><strong>Search API</strong>: RESTful endpoint with query parameters</li>
  <li><strong>Database Query</strong>: Optimized with indexes on location and dates</li>
  <li><strong>Caching</strong>: Redis for popular search results</li>
  <li><strong>Autocomplete</strong>: Location suggestions using geolocation API</li>
</ul>

<h2>UI/UX Considerations</h2>
<ul>
  <li>Prominent search bar on homepage</li>
  <li>Mobile-responsive search form</li>
  <li>Loading indicators during search</li>
  <li>Clear filter and sort controls</li>
</ul>

<h2>Dependencies</h2>
<p><strong>None</strong> - This is a core foundational feature</p>

<h2>Testing Checklist</h2>
<ul>
  <li>Search with valid location and dates returns results</li>
  <li>Search with no available hotels shows appropriate message</li>
  <li>Date validation prevents invalid date ranges</li>
  <li>Filters and sorting work correctly</li>
  <li>Performance test with large result sets</li>
</ul>`,
  },
  {
    title: 'HB-002: Hotel Details and Room Selection',
    content: `<ac:structured-macro ac:name="info">
  <ac:rich-text-body>
    <p><strong>Epic:</strong> Hotel Booking Application MVP</p>
    <p><strong>Story Points:</strong> 13 | <strong>Priority:</strong> High</p>
  </ac:rich-text-body>
</ac:structured-macro>

<h2>User Story</h2>
<table>
  <tr>
    <td><strong>As a</strong></td>
    <td>potential guest</td>
  </tr>
  <tr>
    <td><strong>I want to</strong></td>
    <td>view detailed hotel information and select rooms</td>
  </tr>
  <tr>
    <td><strong>So that</strong></td>
    <td>I can make an informed booking decision</td>
  </tr>
</table>

<h2>Description</h2>
<p>As a potential guest, I need to see comprehensive hotel details including amenities, photos, location on map, guest reviews, and available room types so that I can choose the best option for my stay.</p>

<h2>Acceptance Criteria</h2>
<ac:task-list>
  <ac:task>
    <ac:task-id>1</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Hotel details page shows name, address, star rating, and description</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>2</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Photo gallery displays hotel and room images with lightbox view</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>3</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Interactive map shows hotel location and nearby attractions</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>4</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Amenities list includes WiFi, parking, pool, gym, etc. with icons</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>5</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Guest reviews and ratings are displayed with sort/filter options</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>6</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Available room types are listed with photos, capacity, price, and amenities</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>7</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Room availability is shown for selected dates</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>8</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can select room type and add to booking</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>9</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Clear pricing breakdown shows nightly rate, taxes, and total</ac:task-body>
  </ac:task>
</ac:task-list>

<h2>Technical Details</h2>
<ul>
  <li><strong>Image Gallery</strong>: Lazy loading with CDN delivery</li>
  <li><strong>Maps Integration</strong>: Google Maps API or Mapbox</li>
  <li><strong>Reviews</strong>: Paginated with real-time ratings calculation</li>
  <li><strong>Availability Check</strong>: Real-time inventory management system</li>
</ul>

<h2>UI Components</h2>
<ul>
  <li>Image carousel with thumbnail navigation</li>
  <li>Tabbed interface for different sections</li>
  <li>Sticky booking widget for easy access</li>
  <li>Review cards with rating stars</li>
</ul>

<h2>Dependencies</h2>
<p><strong>HB-001</strong>: Search must work first to navigate to hotel details</p>

<h2>Testing Checklist</h2>
<ul>
  <li>All hotel information displays correctly</li>
  <li>Images load properly with fallbacks</li>
  <li>Map displays correct location</li>
  <li>Reviews load and can be filtered/sorted</li>
  <li>Room selection updates pricing correctly</li>
  <li>Availability check works for selected dates</li>
</ul>`,
  },
  {
    title: 'HB-003: User Registration and Authentication',
    content: `<ac:structured-macro ac:name="info">
  <ac:rich-text-body>
    <p><strong>Epic:</strong> Hotel Booking Application MVP</p>
    <p><strong>Story Points:</strong> 8 | <strong>Priority:</strong> High</p>
  </ac:rich-text-body>
</ac:structured-macro>

<h2>User Story</h2>
<table>
  <tr>
    <td><strong>As a</strong></td>
    <td>guest</td>
  </tr>
  <tr>
    <td><strong>I want to</strong></td>
    <td>create an account and log in</td>
  </tr>
  <tr>
    <td><strong>So that</strong></td>
    <td>I can manage my bookings and save my preferences</td>
  </tr>
</table>

<h2>Description</h2>
<p>As a returning user, I need to create an account with my email and password, log in securely, and manage my profile so that my booking history and personal information are saved for future reservations.</p>

<h2>Acceptance Criteria</h2>
<ac:task-list>
  <ac:task>
    <ac:task-id>1</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can register with email, password, name, and phone number</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>2</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Email verification is required for new accounts</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>3</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Password requirements enforced (min 8 chars, uppercase, number, special char)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>4</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can log in with email and password</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>5</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>"Forgot password" flow allows password reset via email</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>6</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can update profile information</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>7</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can view booking history</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>8</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Session management keeps users logged in securely</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>9</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Social login options available (Google, Facebook)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>10</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Guest checkout option available without registration</ac:task-body>
  </ac:task>
</ac:task-list>

<h2>Security Requirements</h2>
<ac:structured-macro ac:name="warning">
  <ac:rich-text-body>
    <p><strong>Critical Security Measures:</strong></p>
    <ul>
      <li>Passwords hashed using bcrypt (cost factor 12+)</li>
      <li>JWT tokens with short expiry (15 minutes access, 7 days refresh)</li>
      <li>Rate limiting on login attempts (max 5 per 15 minutes)</li>
      <li>HTTPS only for all authentication endpoints</li>
      <li>Email verification required before account activation</li>
      <li>Two-factor authentication option (future enhancement)</li>
    </ul>
  </ac:rich-text-body>
</ac:structured-macro>

<h2>Technical Details</h2>
<ul>
  <li><strong>Authentication</strong>: JWT (JSON Web Tokens)</li>
  <li><strong>Password Hashing</strong>: bcrypt with salt</li>
  <li><strong>OAuth</strong>: Passport.js for social login</li>
  <li><strong>Email Service</strong>: SendGrid or AWS SES</li>
  <li><strong>Session Storage</strong>: Redis for token management</li>
</ul>

<h2>Dependencies</h2>
<p><strong>None</strong> - Independent feature that enhances other features</p>

<h2>Testing Checklist</h2>
<ul>
  <li>Registration with valid data creates account</li>
  <li>Duplicate email registration is prevented</li>
  <li>Email verification link works and expires correctly</li>
  <li>Login with correct credentials succeeds</li>
  <li>Login with incorrect credentials fails</li>
  <li>Password reset flow works end-to-end</li>
  <li>Session persists across page refreshes</li>
  <li>Logout clears session properly</li>
  <li>Social login works for Google and Facebook</li>
</ul>`,
  },
  {
    title: 'HB-004: Booking and Payment',
    content: `<ac:structured-macro ac:name="info">
  <ac:rich-text-body>
    <p><strong>Epic:</strong> Hotel Booking Application MVP</p>
    <p><strong>Story Points:</strong> 13 | <strong>Priority:</strong> High</p>
  </ac:rich-text-body>
</ac:structured-macro>

<h2>User Story</h2>
<table>
  <tr>
    <td><strong>As a</strong></td>
    <td>guest ready to book</td>
  </tr>
  <tr>
    <td><strong>I want to</strong></td>
    <td>complete my hotel reservation with secure payment</td>
  </tr>
  <tr>
    <td><strong>So that</strong></td>
    <td>I can confirm my stay and receive booking confirmation</td>
  </tr>
</table>

<h2>Description</h2>
<p>As a guest ready to book, I need to enter my personal details, choose a payment method, and complete a secure payment transaction so that my hotel reservation is confirmed and I receive a booking confirmation.</p>

<h2>Acceptance Criteria</h2>
<ac:task-list>
  <ac:task>
    <ac:task-id>1</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Booking form collects guest details (name, email, phone, special requests)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>2</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Multiple payment methods supported (credit card, debit card, PayPal)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>3</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Payment form is PCI DSS compliant with secure fields</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>4</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Credit card information is validated (number, CVV, expiry date)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>5</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Booking summary shows dates, room type, guest count, total price</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>6</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can apply promo codes or loyalty points</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>7</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Cancellation policy is clearly displayed before payment</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>8</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Payment confirmation page shows booking reference number</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>9</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Confirmation email sent with booking details and hotel info</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>10</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Booking is saved to user's account (if logged in)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>11</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Failed payment handling with clear error messages</ac:task-body>
  </ac:task>
</ac:task-list>

<h2>Payment Security</h2>
<ac:structured-macro ac:name="warning">
  <ac:rich-text-body>
    <p><strong>PCI DSS Compliance Required:</strong></p>
    <ul>
      <li>Use Stripe Elements or PayPal SDK for payment forms</li>
      <li>Never store credit card numbers in database</li>
      <li>Store only payment tokens from payment provider</li>
      <li>SSL/TLS encryption for all payment transactions</li>
      <li>3D Secure authentication for card payments</li>
      <li>Log all payment attempts for audit trail</li>
    </ul>
  </ac:rich-text-body>
</ac:structured-macro>

<h2>Technical Details</h2>
<ul>
  <li><strong>Payment Gateway</strong>: Stripe API or PayPal REST API</li>
  <li><strong>Payment Flow</strong>: Two-step (authorization then capture)</li>
  <li><strong>Booking ID</strong>: UUID v4 format for unique reference</li>
  <li><strong>Inventory Lock</strong>: Reserve room during payment (10-minute hold)</li>
  <li><strong>Transaction State</strong>: State machine for payment status tracking</li>
  <li><strong>Email Template</strong>: HTML email with booking details and PDF attachment</li>
</ul>

<h2>Pricing Breakdown</h2>
<table>
  <tr>
    <th>Component</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Base Rate</td>
    <td>Nightly room rate × number of nights</td>
  </tr>
  <tr>
    <td>Taxes</td>
    <td>VAT/GST and local hotel taxes</td>
  </tr>
  <tr>
    <td>Service Fee</td>
    <td>Platform service charge (if applicable)</td>
  </tr>
  <tr>
    <td>Discount</td>
    <td>Promo code or loyalty points discount</td>
  </tr>
  <tr>
    <td>Total</td>
    <td>Final amount to be charged</td>
  </tr>
</table>

<h2>Dependencies</h2>
<ul>
  <li><strong>HB-002</strong>: Room selection must work first</li>
  <li><strong>HB-003</strong>: User authentication (optional - guest checkout available)</li>
</ul>

<h2>Testing Checklist</h2>
<ul>
  <li>Successful payment creates booking record</li>
  <li>Failed payment shows appropriate error message</li>
  <li>Duplicate payment prevention works</li>
  <li>Promo code validation and application works</li>
  <li>Confirmation email is sent successfully</li>
  <li>Booking appears in user's account</li>
  <li>Room inventory is updated correctly</li>
  <li>Payment refund process works (for testing environment)</li>
</ul>`,
  },
  {
    title: 'HB-005: Booking Management and Cancellation',
    content: `<ac:structured-macro ac:name="info">
  <ac:rich-text-body>
    <p><strong>Epic:</strong> Hotel Booking Application MVP</p>
    <p><strong>Story Points:</strong> 8 | <strong>Priority:</strong> Medium</p>
  </ac:rich-text-body>
</ac:structured-macro>

<h2>User Story</h2>
<table>
  <tr>
    <td><strong>As a</strong></td>
    <td>guest with an existing booking</td>
  </tr>
  <tr>
    <td><strong>I want to</strong></td>
    <td>view, modify, and cancel my bookings</td>
  </tr>
  <tr>
    <td><strong>So that</strong></td>
    <td>I can manage changes to my travel plans</td>
  </tr>
</table>

<h2>Description</h2>
<p>As a guest with an existing booking, I need to view my reservation details, modify my booking if needed, or cancel according to the cancellation policy so that I have flexibility in managing my travel arrangements.</p>

<h2>Acceptance Criteria</h2>
<ac:task-list>
  <ac:task>
    <ac:task-id>1</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can view all bookings (upcoming, past, cancelled) in their account</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>2</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Booking details page shows full reservation information</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>3</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Booking reference number can be used to retrieve reservation (with email)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>4</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can modify booking dates (subject to availability and hotel policy)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>5</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Users can upgrade or change room type (if available)</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>6</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Cancellation option available with policy and refund info displayed</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>7</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Cancellation requires confirmation before processing</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>8</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Cancellation confirmation sent via email</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>9</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Refund processed according to cancellation policy</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>10</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Booking modifications send updated confirmation emails</ac:task-body>
  </ac:task>
  <ac:task>
    <ac:task-id>11</ac:task-id>
    <ac:task-status>incomplete</ac:task-status>
    <ac:task-body>Calendar integration option to add booking to personal calendar</ac:task-body>
  </ac:task>
</ac:task-list>

<h2>Cancellation Policy Types</h2>
<table>
  <tr>
    <th>Policy Type</th>
    <th>Refund Amount</th>
    <th>Timeframe</th>
  </tr>
  <tr>
    <td>Free Cancellation</td>
    <td>100% refund</td>
    <td>Up to 24-48 hours before check-in</td>
  </tr>
  <tr>
    <td>Partial Refund</td>
    <td>50-75% refund</td>
    <td>Within 7 days of check-in</td>
  </tr>
  <tr>
    <td>Non-Refundable</td>
    <td>0% refund</td>
    <td>No cancellation allowed</td>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Varies by date</td>
    <td>Sliding scale based on cancellation date</td>
  </tr>
</table>

<h2>Technical Details</h2>
<ul>
  <li><strong>Booking Lookup</strong>: By booking ID + email for guest checkout users</li>
  <li><strong>Modification Flow</strong>: Check availability, calculate price difference, process payment adjustment</li>
  <li><strong>Cancellation Flow</strong>: State transition, refund initiation, inventory release</li>
  <li><strong>Refund Processing</strong>: Stripe refund API (5-10 business days)</li>
  <li><strong>Calendar Export</strong>: ICS file format for calendar apps</li>
  <li><strong>Notification</strong>: Real-time updates via email and SMS (optional)</li>
</ul>

<h2>Business Rules</h2>
<ac:structured-macro ac:name="note">
  <ac:rich-text-body>
    <p><strong>Modification and Cancellation Rules:</strong></p>
    <ul>
      <li>Modifications allowed up to 24 hours before check-in</li>
      <li>Date changes must meet minimum stay requirements</li>
      <li>Room upgrades incur price difference charge</li>
      <li>Room downgrades may not be refundable</li>
      <li>Multiple modifications may incur change fee</li>
      <li>No-show results in full charge (no refund)</li>
      <li>Early checkout may not result in refund for unused nights</li>
    </ul>
  </ac:rich-text-body>
</ac:structured-macro>

<h2>Booking States</h2>
<ul>
  <li><strong>Confirmed</strong>: Payment successful, booking active</li>
  <li><strong>Pending</strong>: Payment processing or pending confirmation</li>
  <li><strong>Modified</strong>: Changes made to original booking</li>
  <li><strong>Cancelled</strong>: Booking cancelled by guest</li>
  <li><strong>Completed</strong>: Guest checked out successfully</li>
  <li><strong>No-Show</strong>: Guest did not check in</li>
</ul>

<h2>Dependencies</h2>
<ul>
  <li><strong>HB-004</strong>: Booking must exist before it can be managed</li>
</ul>

<h2>Testing Checklist</h2>
<ul>
  <li>Users can view all their bookings</li>
  <li>Booking details display correctly</li>
  <li>Booking lookup by reference number works</li>
  <li>Date modification checks availability and calculates price</li>
  <li>Room type change works correctly</li>
  <li>Cancellation with full refund processes correctly</li>
  <li>Cancellation with partial refund calculates correctly</li>
  <li>Non-refundable booking cancellation prevents refund</li>
  <li>Cancellation email is sent</li>
  <li>Calendar export generates valid ICS file</li>
  <li>Refund appears in payment source within expected timeframe</li>
</ul>

<h2>Future Enhancements</h2>
<ul>
  <li>Rescheduling suggestions if original dates unavailable</li>
  <li>Upgrade offers at discounted rates</li>
  <li>Travel insurance integration</li>
  <li>Multi-room booking management</li>
  <li>Group booking coordination</li>
</ul>`,
  },
];

async function createHotelBookingStories() {
  console.log('Creating Hotel Booking user stories in Confluence...\n');
  console.log(`Target Space: ${CONFLUENCE_SPACE_KEY}`);
  console.log(`Confluence URL: ${CONFLUENCE_BASE_URL}\n`);

  const createdPages = [];

  for (let i = 0; i < hotelBookingStories.length; i++) {
    const story = hotelBookingStories[i];
    try {
      console.log(`[${i + 1}/${hotelBookingStories.length}] Creating: ${story.title}`);

      const pageData = {
        type: 'page',
        title: story.title,
        space: { key: CONFLUENCE_SPACE_KEY },
        body: {
          storage: {
            value: story.content,
            representation: 'storage',
          },
        },
      };

      const response = await confluenceApi.post('/content', pageData);
      const pageUrl = `${CONFLUENCE_BASE_URL}${response.data._links.webui}`;

      console.log(`✓ Created successfully`);
      console.log(`  Page ID: ${response.data.id}`);
      console.log(`  URL: ${pageUrl}\n`);

      createdPages.push({
        id: response.data.id,
        title: story.title,
        url: pageUrl,
      });
    } catch (error) {
      console.error(`✗ Failed to create ${story.title}`);
      if (error.response) {
        console.error(`  Status: ${error.response.status}`);
        console.error(`  Error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
      } else {
        console.error(`  Error: ${error.message}`);
      }
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('Hotel Booking User Story Creation Complete!');
  console.log('═══════════════════════════════════════════════════════\n');

  if (createdPages.length > 0) {
    console.log(`Successfully created ${createdPages.length} out of ${hotelBookingStories.length} stories:\n`);
    createdPages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.title}`);
      console.log(`   ${page.url}\n`);
    });
    console.log(`\nView all stories at: ${CONFLUENCE_BASE_URL}/spaces/${CONFLUENCE_SPACE_KEY}/overview`);
  } else {
    console.log('No stories were created. Please check the errors above.');
  }
}

createHotelBookingStories().catch(console.error);
