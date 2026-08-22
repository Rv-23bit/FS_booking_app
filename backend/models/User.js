
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User model for the booking app.
// A user can be a member, an instructor or an admin.
// Members and admins are active straight away.
// A new instructor starts as pending until an admin approves them.
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['member', 'instructor', 'admin'],
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'rejected'],
        default: 'active',
    },
});

// Hash the password before saving, only when it has been changed.
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
