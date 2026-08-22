// Sample data script to make the app easy to review.
// Run it by hand with:  node backend/seed/seedData.js
// It adds a few members, a few approved instructors and some classes.
// It skips anything that already exists, so it is safe to run more than once.

require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
const User = require('../models/User');
const Class = require('../models/Class');

// A small helper to make a date a few days from now at a set hour.
const daysFromNow = (days, hour) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, 0, 0, 0);
    return d;
};

// Create a user only if one with that email does not already exist.
const upsertUser = async (details) => {
    let user = await User.findOne({ email: details.email });
    if (!user) {
        user = await User.create(details);
        console.log('Created ' + details.role + ' ' + details.email);
    }
    return user;
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Sample members. They all use the password below.
        await upsertUser({ name: 'Alice Member', email: 'alice@fitbook.com', password: 'password123', role: 'member', status: 'active' });
        await upsertUser({ name: 'Bob Member', email: 'bob@fitbook.com', password: 'password123', role: 'member', status: 'active' });

        // Sample instructors, already approved so they can be assigned to classes.
        const sara = await upsertUser({ name: 'Sara Coach', email: 'sara@fitbook.com', password: 'password123', role: 'instructor', status: 'active' });
        const mike = await upsertUser({ name: 'Mike Coach', email: 'mike@fitbook.com', password: 'password123', role: 'instructor', status: 'active' });

        // Only add sample classes if there are none yet.
        const classCount = await Class.countDocuments();
        if (classCount === 0) {
            await Class.insertMany([
                { title: 'Morning Yoga Flow', category: 'Yoga', description: 'A gentle start to the day.', classDateTime: daysFromNow(1, 7), durationMinutes: 60, capacity: 12, instructor: sara._id },
                { title: 'Power Spin', category: 'Spin', description: 'High energy cycling session.', classDateTime: daysFromNow(1, 18), durationMinutes: 45, capacity: 15, instructor: mike._id },
                { title: 'HIIT Blast', category: 'HIIT', description: 'Quick intense circuits.', classDateTime: daysFromNow(2, 12), durationMinutes: 30, capacity: 10, instructor: mike._id },
                { title: 'Core Pilates', category: 'Pilates', description: 'Build core strength and control.', classDateTime: daysFromNow(3, 9), durationMinutes: 50, capacity: 12, instructor: sara._id },
                { title: 'Strength Basics', category: 'Strength', description: 'Learn the main lifts safely.', classDateTime: daysFromNow(4, 17), durationMinutes: 60, capacity: 8, instructor: mike._id },
            ]);
            console.log('Created 5 sample classes');
        } else {
            console.log('Classes already exist, skipping class seed');
        }

        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seed();
