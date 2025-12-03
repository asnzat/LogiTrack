const Shipment = require('../models/Shipment');

// Generate unique tracking number
const generateTrackingNumber = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const count = await Shipment.countDocuments();
    const number = (count + 1).toString().padStart(5, '0');
    return `LOGI-${year}-${number}`;
};

exports.getAllShipments = async (req, res) => {
    try {
        let query = {};
        // If driver, only show assigned shipments
        if (req.user.role === 'driver') {
            query.driver = req.user.id;
        }

        const shipments = await Shipment.find(query).populate('driver', 'name email');
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createShipment = async (req, res) => {
    try {
        const trackingNumber = await generateTrackingNumber();
        const shipment = await Shipment.create({
            ...req.body,
            trackingNumber,
            timeline: [{ status: 'pending', location: req.body.origin || 'Warehouse' }]
        });
        res.status(201).json(shipment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id).populate('driver', 'name email');
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Drivers can only view their own shipments
        if (req.user.role === 'driver' && shipment.driver?.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this shipment' });
        }

        res.json(shipment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateShipmentStatus = async (req, res) => {
    try {
        const { status, location } = req.body;
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Drivers can only update their own shipments
        if (req.user.role === 'driver' && shipment.driver?.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this shipment' });
        }

        shipment.status = status;
        shipment.timeline.push({ status, location: location || 'Unknown Location' });
        await shipment.save();

        res.json(shipment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.trackShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber })
            .select('-driver -senderPhone -receiverPhone'); // Hide sensitive info for public

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        res.json(shipment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
