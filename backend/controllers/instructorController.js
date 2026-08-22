
const Class = require('../models/Class');
const Booking = require('../models/Booking');

// List the classes assigned to the logged in instructor only.
const getMyClasses = async (req, res) => {
    try {
        const classes = await Class.find({ instructor: req.user.id }).sort({ classDateTime: 1 });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get the list of members booked into one class.
// Only works if the class actually belongs to the logged in instructor.
const getRoster = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id);
        if (!cls) return res.status(404).json({ message: 'Class not found' });

        // Ownership check: an instructor can only see their own class roster.
        if (String(cls.instructor) !== req.user.id) {
            return res.status(403).json({ message: 'You can only view your own classes' });
        }

        const bookings = await Booking.find({ class: cls._id, status: 'confirmed' })
            .populate('member', 'name email');

        res.json({
            classInfo: { id: cls._id, title: cls.title, classDateTime: cls.classDateTime },
            bookings,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Save attendance for a class.
// The body has two lists of booking ids: attended and notAttended.
// We only update bookings that belong to this class, and only if the class
// belongs to the logged in instructor, so one instructor cannot change
// another instructor's records.
const saveAttendance = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id);
        if (!cls) return res.status(404).json({ message: 'Class not found' });

        if (String(cls.instructor) !== req.user.id) {
            return res.status(403).json({ message: 'You can only mark your own classes' });
        }

        const { attended = [], notAttended = [] } = req.body;

        // The class filter makes sure we never touch bookings from another class.
        await Booking.updateMany({ _id: { $in: attended }, class: cls._id }, { attended: true });
        await Booking.updateMany({ _id: { $in: notAttended }, class: cls._id }, { attended: false });

        res.json({ message: 'Attendance saved' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyClasses, getRoster, saveAttendance };
