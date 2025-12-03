const express = require('express');
const router = express.Router();
const { getAllDrivers, createDriver, getDriverProfile } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver management endpoints
 */

router.use(protect);

/**
 * @swagger
 * /drivers:
 *   get:
 *     summary: Get all drivers
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drivers
 *   post:
 *     summary: Create a new driver
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Driver created
 */
router.get('/', authorize('admin'), getAllDrivers);
router.post('/', authorize('admin'), createDriver);

/**
 * @swagger
 * /drivers/me:
 *   get:
 *     summary: Get current driver profile
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Driver profile
 */
router.get('/me', authorize('driver'), getDriverProfile);

module.exports = router;
