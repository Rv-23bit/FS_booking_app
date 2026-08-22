
const express = require('express');
const { body } = require('express-validator');
const {
    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass,
} = require('../controllers/classController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const Class = require('../models/Class');
const router = express.Router();

// Reusable rule: a class date and time must not be in the past.
const notInPast = (value) => {
    if (new Date(value) < new Date()) {
        throw new Error('Class date and time cannot be in the past');
    }
    return true;
};

// Rules for creating a class. Everything is required here.
const createRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').isIn(Class.categories).withMessage('Please choose a valid category'),
    body('classDateTime').isISO8601().withMessage('Please choose a date and time').bail().custom(notInPast),
    body('durationMinutes').isInt({ min: 1 }).withMessage('Duration must be a positive whole number'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive whole number'),
    body('instructor').notEmpty().withMessage('Please choose an instructor'),
];

// Rules for editing. Fields are optional but still checked when provided.
const updateRules = [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('category').optional().isIn(Class.categories).withMessage('Please choose a valid category'),
    body('classDateTime').optional().isISO8601().withMessage('Please choose a date and time').bail().custom(notInPast),
    body('durationMinutes').optional().isInt({ min: 1 }).withMessage('Duration must be a positive whole number'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive whole number'),
];

// Any logged in user can see the schedule.
router.get('/', protect, getClasses);
router.get('/:id', protect, getClassById);

// Only an admin can create, edit or delete a class.
router.post('/', protect, restrictTo('admin'), createRules, validate, createClass);
router.put('/:id', protect, restrictTo('admin'), updateRules, validate, updateClass);
router.delete('/:id', protect, restrictTo('admin'), deleteClass);

module.exports = router;
