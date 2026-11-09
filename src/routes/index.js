/**
 * Main Routes Index
 * Aggregates all API routes with /api/v1/ prefix (M-3 FIX)
 * HB-001: Hotel Search and Browse
 */

const express = require('express');
const hotelRoutes = require('./hotels');
const hotelController = require('../controllers/hotelController');

const router = express.Router();

/**
 * Health check endpoint (no versioning)
 * GET /health
 */
router.get('/health', hotelController.healthCheck);

/**
 * API v1 routes
 * All application routes under /api/v1/ prefix
 */
router.use('/api/v1/hotels', hotelRoutes);

/**
 * API v1 health check
 * GET /api/v1/health
 */
router.get('/api/v1/health', hotelController.healthCheck);

module.exports = router;
