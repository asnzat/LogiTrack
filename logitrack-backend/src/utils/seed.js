const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedData = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@logitrack.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                name: 'Admin User',
                email: 'admin@logitrack.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin user created');
        }

        const driverExists = await User.findOne({ email: 'abebe@logitrack.com' });
        if (!driverExists) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                name: 'Abebe Kebede',
                email: 'abebe@logitrack.com',
                password: hashedPassword,
                role: 'driver'
            });
            console.log('✅ Abebe Kebede created');
        }

        const driver2Exists = await User.findOne({ email: 'bekele@logitrack.com' });
        if (!driver2Exists) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await User.create({
                name: 'Bekele Tadesse',
                email: 'bekele@logitrack.com',
                password: hashedPassword,
                role: 'driver'
            });
            console.log('✅ Bekele Tadesse created');
        }
    } catch (error) {
        console.error('❌ Seeding error:', error);
    }
};

module.exports = seedData;
