
const Booking = require('../models/Booking');
const Class = require('../models/Class');

// Create a booking for the logged in member.
// The important part here is the capacity check. Two members could try to
// book the last spot at the same moment, so we do the check and the count
// update in one single database operation that only succeeds if there is
// still space. This stops the class from ever going over capacity.
const createBooking = async (req, res) => {
    const { classId } = req.body;
    try {
        const cls = await Class.findById(classId);
        if (!cls) return res.status(404).json({ message: 'Class not found' });

        // A member cannot book a class that has already happened.
        if (new Date(cls.classDateTime) < new Date()) {
            return res.status(400).json({ message: 'This class has already taken place' });
        }

        // A member cannot book the same class twice.
        const already = await Booking.findOne({ member: req.user.id, class: classId, status: 'confirmed' });
        if (already) {
            return res.status(400).json({ message: 'You have already booked this class' });
        }

        // Atomic capacity check: only increases bookedCount if it is still
        // below capacity at this exact moment. Returns null if the class is full.
        const updated = await Class.findOneAndUpdate(
            { _id: classId, $expr: { $lt: ['$bookedCount', '$capacity'] } },
            { $inc: { bookedCount: 1 } },
            { new: true }
        );

        if (!updated) {
            return res.status(400).json({ message: 'Sorry, this class is now full' });
        }

        // The spot is reserved, now save the booking record.
        try {
            const booking = await Booking.create({
                member: req.user.id,
                class: classId,
                status: 'confirmed',
            });
            res.status(201).json(booking);
        } catch (innerError) {
            // If saving the booking failed after we already took the spot,
            // give the spot back so the count stays correct.
            await Class.findByIdAndUpdate(classId, { $inc: { bookedCount: -1 } });
            throw innerError;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel one of the logged in member's own bookings.
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Make sure this booking belongs to the member asking to cancel it.
        if (String(booking.member) !== req.user.id) {
            return res.status(403).json({ message: 'You can only cancel your own bookings' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'This booking is already cancelled' });
        }

        booking.status = 'cancelled';
        booking.cancelledAt = new Date();
        await booking.save();

        // Free up the spot, but never let the count go below zero.
        await Class.findOneAndUpdate(
            { _id: booking.class, bookedCount: { $gt: 0 } },
            { $inc: { bookedCount: -1 } }
        );

        res.json({ message: 'Booking cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List the logged in member's own bookings, with the class details attached.
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ member: req.user.id })
            .populate({ path: 'class', populate: { path: 'instructor', select: 'name' } })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, cancelBooking, getMyBookings };
