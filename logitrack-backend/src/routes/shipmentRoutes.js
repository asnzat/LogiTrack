const express = require('express');
const router = express.Router();
const {
    getAllShipments,
    createShipment,
    getShipmentById,
    updateShipmentStatus,
    trackShipment
} = require('../controllers/shipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Route
/**
 * @swagger
 * tags:
 *   name: Shipments
 *   description: Shipment management endpoints
 */

/**
 * @swagger
 * /shipments/track/{trackingNumber}:
 *   get:
 *     summary: Track a shipment by tracking number
 *     tags: [Shipments]
 *     parameters:
 *       - in: path
 *         name: trackingNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment details
 *       404:
 *         description: Shipment not found
 */
router.get('/track/:trackingNumber', trackShipment);

// Protected Routes
router.use(protect);

/**
 * @swagger
 * /shipments:
 *   get:
 *     summary: Get all shipments
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shipments
 *   post:
 *     summary: Create a new shipment
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender
 *               - receiver
 *               - origin
 *               - destination
 *             properties:
 *               sender:
 *                 type: string
 *               receiver:
 *                 type: string
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shipment created
 */
router.get('/', getAllShipments);
router.post('/', authorize('admin'), createShipment);

/**
 * @swagger
 * /shipments/{id}:
 *   get:
 *     summary: Get shipment by ID
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipment details
 *       404:
 *         description: Shipment not found
 */
router.get('/:id', getShipmentById);

/**
 * @swagger
 * /shipments/{id}/status:
 *   patch:
 *     summary: Update shipment status
 *     tags: [Shipments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, In Transit, Delivered, Delayed]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', authorize('admin', 'driver'), updateShipmentStatus);

module.exports = router;
