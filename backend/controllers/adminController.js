
const User = require('../models/User');

// List all instructor accounts that are still waiting for approval.
const getPendingInstructors = async (req, res) => {
    try {
        const pending = await User.find({ role: 'instructor', status: 'pending' }).select('-password');
        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve one instructor, which sets their status to active so they can log in fully.
const approveInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'instructor') {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        user.status = 'active';
        await user.save();
        res.json({ message: 'Instructor approved', id: user.id, status: user.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject one instructor, which sets their status to rejected so they cannot log in.
const rejectInstructor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'instructor') {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        user.status = 'rejected';
        await user.save();
        res.json({ message: 'Instructor rejected', id: user.id, status: user.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List all approved instructors, used to fill the instructor dropdown
// when an admin creates or edits a class.
const getApprovedInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor', status: 'active' }).select('name email');
        res.json(instructors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPendingInstructors, approveInstructor, rejectInstructor, getApprovedInstructors };
