
const express = require('express');
const { body } = require('express-validator');
const { createBooking, cancelBooking, getMyBookings } = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validate');
const router = express.Router();

// Only members can book classes.
router.use(protect, restrictTo('member'));

router.get('/my', getMyBookings);
router.post('/', [body('classId').notEmpty().withMessage('A class is required')], validate, createBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
