
const express = require('express');
const { getPendingInstructors, approveInstructor, rejectInstructor, getApprovedInstructors } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

// Every admin route needs a logged in admin.
router.use(protect, restrictTo('admin'));

router.get('/instructors/pending', getPendingInstructors);
router.get('/instructors/approved', getApprovedInstructors);
router.put('/instructors/:id/approve', approveInstructor);
router.put('/instructors/:id/reject', rejectInstructor);

module.exports = router;
