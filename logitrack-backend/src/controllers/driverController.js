const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver' }).select('-password');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createDriver = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const driver = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'driver'
        });

        res.status(201).json({
            id: driver._id,
            name: driver.name,
            email: driver.email,
            role: driver.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDriverProfile = async (req, res) => {
    try {
        const driver = await User.findById(req.user.id).select('-password');
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
