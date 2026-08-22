
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new member or instructor.
// Admin accounts are never made here, they are added by the seed script.
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // A member is active straight away. A new instructor waits for admin approval.
        const status = role === 'instructor' ? 'pending' : 'active';

        const user = await User.create({ name, email, password, role, status });

        // Give a clear message depending on the role.
        const message = status === 'pending'
            ? 'Your instructor account has been created and is waiting for admin approval.'
            : 'Registration successful. Please log in.';

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            message,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Log in and return the token plus the role and status so the frontend
// knows which page to send the user to.
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            // A rejected instructor is not allowed in.
            if (user.status === 'rejected') {
                return res.status(403).json({ message: 'Your account request was rejected' });
            }
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Return the logged in user's own details.
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update the user's own name or email only.
// Role and status can never be changed here, so a user cannot make
// themselves an admin or approve their own instructor account.
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;

        const updatedUser = await user.save();
        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
            token: generateToken(updatedUser.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
