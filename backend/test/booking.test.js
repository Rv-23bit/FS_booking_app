// Integration test for the booking capacity check.
// It creates a class with only one spot, then fires two booking requests at
// the same time and checks that exactly one succeeds and one is turned away.
// This proves the capacity check is safe even when two people book at once.

require('dotenv').config({ path: __dirname + '/../.env' });

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../server');
const User = require('../models/User');
const Class = require('../models/Class');
const Booking = require('../models/Booking');

chai.use(chaiHttp);
const { expect } = chai;

// Make a login token for a user id, the same way the app does.
const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Booking capacity check', function () {
    // Give the database operations enough time.
    this.timeout(20000);

    let instructor, member1, member2, fullClass;

    // Set up temporary data before the test.
    before(async () => {
        await mongoose.connect(process.env.MONGO_URI);

        instructor = await User.create({ name: 'Test Instructor', email: `t_ins_${Date.now()}@test.com`, password: 'password123', role: 'instructor', status: 'active' });
        member1 = await User.create({ name: 'Test Member 1', email: `t_m1_${Date.now()}@test.com`, password: 'password123', role: 'member', status: 'active' });
        member2 = await User.create({ name: 'Test Member 2', email: `t_m2_${Date.now()}@test.com`, password: 'password123', role: 'member', status: 'active' });

        // A class in the future with room for only one person.
        const future = new Date();
        future.setDate(future.getDate() + 5);
        fullClass = await Class.create({ title: 'Only One Spot', category: 'Yoga', classDateTime: future, durationMinutes: 60, capacity: 1, instructor: instructor._id });
    });

    // Remove the temporary data after the test.
    after(async () => {
        await Booking.deleteMany({ class: fullClass._id });
        await Class.deleteOne({ _id: fullClass._id });
        await User.deleteMany({ _id: { $in: [instructor._id, member1._id, member2._id] } });
        await mongoose.disconnect();
    });

    it('only lets one of two people book the last spot', async () => {
        // Fire both booking requests at the same time.
        const [res1, res2] = await Promise.all([
            chai.request(app).post('/api/bookings').set('Authorization', `Bearer ${tokenFor(member1._id)}`).send({ classId: fullClass._id }),
            chai.request(app).post('/api/bookings').set('Authorization', `Bearer ${tokenFor(member2._id)}`).send({ classId: fullClass._id }),
        ]);

        // Exactly one should be 201 (booked) and one should be 400 (full).
        const codes = [res1.status, res2.status].sort();
        expect(codes).to.deep.equal([201, 400]);

        // The class should have exactly one confirmed booking and bookedCount of 1.
        const confirmed = await Booking.countDocuments({ class: fullClass._id, status: 'confirmed' });
        expect(confirmed).to.equal(1);

        const updatedClass = await Class.findById(fullClass._id);
        expect(updatedClass.bookedCount).to.equal(1);
    });
});
