
const mongoose = require('mongoose');

// Booking model. Links one member to one class.
// attended is left unset until the instructor marks the register after the class.
const bookingSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed',
    },
    attended: { type: Boolean },
    bookedAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
