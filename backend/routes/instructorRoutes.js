
const express = require('express');
const { getMyClasses, getRoster, saveAttendance } = require('../controllers/instructorController');
const { protect, restrictTo, requireApprovedInstructor } = require('../middleware/authMiddleware');
const router = express.Router();

// Every instructor route needs a logged in, approved instructor.
router.use(protect, restrictTo('instructor'), requireApprovedInstructor);

router.get('/classes', getMyClasses);
router.get('/classes/:id/roster', getRoster);
router.put('/classes/:id/attendance', saveAttendance);

module.exports = router;
