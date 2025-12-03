const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        required: true,
        unique: true,
    },
    senderName: { type: String, required: true },
    senderPhone: { type: String },
    senderAddress: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverPhone: { type: String },
    receiverAddress: { type: String, required: true },
    packageDescription: { type: String },
    weight: { type: Number },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'delayed'],
        default: 'pending',
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    vehiclePlate: { type: String },
    eta: { type: Date },
    timeline: [{
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        location: { type: String },
    }],
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);
