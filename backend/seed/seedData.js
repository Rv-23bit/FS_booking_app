// Sample data script to make the app easy to review.
// Run it by hand with:  node backend/seed/seedData.js
// It adds members, approved instructors and a diverse set of classes.
// Some classes are in the past (finished) and many are upcoming over the next
// few weeks, plus a few bookings so the dashboard and rosters have real data.
//
// Note: this resets the classes and bookings each time it runs, so the sample
// data is always predictable. It keeps the user accounts.

require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
const User = require('../models/User');
const Class = require('../models/Class');
const Booking = require('../models/Booking');

// A small helper to make a date a number of days from now at a set hour.
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
        const alice = await upsertUser({ name: 'Alice Member', email: 'alice@fsclub.com', password: 'password123', role: 'member', status: 'active' });
        const bob = await upsertUser({ name: 'Bob Member', email: 'bob@fsclub.com', password: 'password123', role: 'member', status: 'active' });
        const cara = await upsertUser({ name: 'Cara Member', email: 'cara@fsclub.com', password: 'password123', role: 'member', status: 'active' });
        const dan = await upsertUser({ name: 'Dan Member', email: 'dan@fsclub.com', password: 'password123', role: 'member', status: 'active' });

        // Sample instructors, already approved so they can be assigned to classes.
        const sara = await upsertUser({ name: 'Sara Coach', email: 'sara@fsclub.com', password: 'password123', role: 'instructor', status: 'active' });
        const mike = await upsertUser({ name: 'Mike Coach', email: 'mike@fsclub.com', password: 'password123', role: 'instructor', status: 'active' });
        const liam = await upsertUser({ name: 'Liam Coach', email: 'liam@fsclub.com', password: 'password123', role: 'instructor', status: 'active' });

        // One instructor left pending so the admin has a request to review.
        await upsertUser({ name: 'Nina Coach', email: 'nina@fsclub.com', password: 'password123', role: 'instructor', status: 'pending' });

        // Reset the classes and bookings so the sample data is predictable.
        await Booking.deleteMany({});
        await Class.deleteMany({});
        console.log('Cleared old classes and bookings');

        // The classes. A mix of finished ones in the past and many upcoming
        // ones spread over the next few weeks, across all categories.
        const classData = [
            // Finished classes (in the past)
            { title: 'Sunrise Yoga', category: 'Yoga', description: 'Gentle stretches to start the day.', classDateTime: daysFromNow(-6, 7), durationMinutes: 60, capacity: 12, instructor: sara._id },
            { title: 'Spin Sprint', category: 'Spin', description: 'Short and fast cycling session.', classDateTime: daysFromNow(-4, 18), durationMinutes: 45, capacity: 15, instructor: mike._id },
            { title: 'HIIT Express', category: 'HIIT', description: 'Quick lunchtime circuits.', classDateTime: daysFromNow(-2, 12), durationMinutes: 30, capacity: 10, instructor: liam._id },

            // Upcoming classes over the next few weeks
            { title: 'Morning Yoga Flow', category: 'Yoga', description: 'A calming flow for all levels.', classDateTime: daysFromNow(1, 7), durationMinutes: 60, capacity: 12, instructor: sara._id },
            { title: 'Power Spin', category: 'Spin', description: 'High energy cycling with music.', classDateTime: daysFromNow(1, 18), durationMinutes: 45, capacity: 15, instructor: mike._id },
            { title: 'HIIT Blast', category: 'HIIT', description: 'Intense intervals to build fitness.', classDateTime: daysFromNow(2, 12), durationMinutes: 30, capacity: 10, instructor: mike._id },
            { title: 'Core Pilates', category: 'Pilates', description: 'Build core strength and control.', classDateTime: daysFromNow(3, 9), durationMinutes: 50, capacity: 12, instructor: sara._id },
            { title: 'Strength Basics', category: 'Strength', description: 'Learn the main lifts safely.', classDateTime: daysFromNow(4, 17), durationMinutes: 60, capacity: 8, instructor: liam._id },
            { title: 'Evening Yoga', category: 'Yoga', description: 'Wind down with a slow flow.', classDateTime: daysFromNow(7, 19), durationMinutes: 60, capacity: 12, instructor: sara._id },
            { title: 'Spin Challenge', category: 'Spin', description: 'Push your limits on the bike.', classDateTime: daysFromNow(9, 18), durationMinutes: 45, capacity: 15, instructor: mike._id },
            { title: 'Full House HIIT', category: 'HIIT', description: 'Small group, big effort.', classDateTime: daysFromNow(11, 12), durationMinutes: 30, capacity: 4, instructor: liam._id },
            { title: 'Pilates Stretch', category: 'Pilates', description: 'Improve flexibility and posture.', classDateTime: daysFromNow(14, 9), durationMinutes: 50, capacity: 12, instructor: sara._id },
            { title: 'Strength Circuit', category: 'Strength', description: 'Full body circuit training.', classDateTime: daysFromNow(18, 17), durationMinutes: 60, capacity: 10, instructor: mike._id },
            { title: 'Weekend Warrior', category: 'HIIT', description: 'A tough weekend workout.', classDateTime: daysFromNow(21, 10), durationMinutes: 45, capacity: 12, instructor: liam._id },
        ];

        const classes = await Class.insertMany(classData);
        console.log('Created ' + classes.length + ' classes');

        // Find a class by its title so we can add bookings to it.
        const byTitle = (title) => classes.find((c) => c.title === title);

        // A helper that books a member into a class and keeps the count in step.
        // attended can be true, false or left out (not marked yet).
        const book = async (member, cls, attended) => {
            const booking = { member: member._id, class: cls._id, status: 'confirmed' };
            if (attended !== undefined) booking.attended = attended;
            await Booking.create(booking);
            await Class.updateOne({ _id: cls._id }, { $inc: { bookedCount: 1 } });
        };

        // Past class with attendance already marked, so the roster has history.
        await book(alice, byTitle('Sunrise Yoga'), true);
        await book(bob, byTitle('Sunrise Yoga'), false);

        // Upcoming bookings for the sample members.
        await book(alice, byTitle('Morning Yoga Flow'));
        await book(cara, byTitle('Morning Yoga Flow'));
        await book(alice, byTitle('Core Pilates'));
        await book(bob, byTitle('Power Spin'));

        // Fill the small class right up so it shows as full.
        const fullClass = byTitle('Full House HIIT');
        await book(alice, fullClass);
        await book(bob, fullClass);
        await book(cara, fullClass);
        await book(dan, fullClass);

        console.log('Created sample bookings');
        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seed();
