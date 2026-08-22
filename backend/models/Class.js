
const mongoose = require('mongoose');

// The class categories we offer at the studio.
const categories = ['Yoga', 'Spin', 'HIIT', 'Pilates', 'Strength'];

// Class model. Each class is a single session on one date and time.
// We store bookedCount so we can check capacity without counting bookings every time.
const classSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: categories, required: true },
    description: { type: String },
    classDateTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    capacity: { type: Number, required: true },
    bookedCount: { type: Number, default: 0 },
    // The instructor who runs this class (must be an approved instructor).
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The admin who created the class.
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

// Export the list of categories too so other files can reuse it.
module.exports = mongoose.model('Class', classSchema);
module.exports.categories = categories;
