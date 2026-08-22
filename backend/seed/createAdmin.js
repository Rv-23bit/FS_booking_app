// One time script to create the admin account.
// Run it by hand once with:  node backend/seed/createAdmin.js
// The admin email and password come from the .env file so they are never hard coded here.

// Load the backend .env no matter which folder we run this from.
require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        // Read the admin details from the environment.
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.log('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.');
            process.exit(1);
        }

        // Connect to the database.
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Do not create a second admin if one already exists.
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('An account with this email already exists, nothing to do.');
            process.exit(0);
        }

        // Create the admin. The password is hashed by the User model before saving.
        await User.create({
            name: 'Admin',
            email,
            password,
            role: 'admin',
            status: 'active',
        });

        console.log('Admin account created for ' + email);
        process.exit(0);
    } catch (error) {
        console.error('Could not create admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
