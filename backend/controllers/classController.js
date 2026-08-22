
const Class = require('../models/Class');
const User = require('../models/User');

// Check that the given id belongs to an approved instructor.
// Returns true or false so the create and edit actions can reuse it.
const isApprovedInstructor = async (instructorId) => {
    const instructor = await User.findById(instructorId);
    return instructor && instructor.role === 'instructor' && instructor.status === 'active';
};

// Turn a class document into a plain object with a spacesLeft value added,
// so the frontend does not have to work it out.
const withSpacesLeft = (cls) => {
    const obj = cls.toObject();
    obj.spacesLeft = obj.capacity - obj.bookedCount;
    return obj;
};

// Create a new class (admin only).
const createClass = async (req, res) => {
    try {
        const { title, category, description, classDateTime, durationMinutes, capacity, instructor } = req.body;

        // The chosen instructor must be an approved instructor.
        if (!(await isApprovedInstructor(instructor))) {
            return res.status(400).json({ message: 'Please choose an approved instructor' });
        }

        const newClass = await Class.create({
            title,
            category,
            description,
            classDateTime,
            durationMinutes,
            capacity,
            instructor,
            createdBy: req.user.id,
        });

        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List every class, soonest first. Any logged in user can see the schedule.
const getClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .populate('instructor', 'name')
            .sort({ classDateTime: 1 });
        res.json(classes.map(withSpacesLeft));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one class by its id.
const getClassById = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id).populate('instructor', 'name');
        if (!cls) return res.status(404).json({ message: 'Class not found' });
        res.json(withSpacesLeft(cls));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit a class (admin only).
const updateClass = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id);
        if (!cls) return res.status(404).json({ message: 'Class not found' });

        const { title, category, description, classDateTime, durationMinutes, capacity, instructor } = req.body;

        // If the instructor is being changed, make sure the new one is approved.
        if (instructor && instructor !== String(cls.instructor)) {
            if (!(await isApprovedInstructor(instructor))) {
                return res.status(400).json({ message: 'Please choose an approved instructor' });
            }
            cls.instructor = instructor;
        }

        // Do not let the capacity drop below how many people are already booked.
        if (capacity !== undefined && Number(capacity) < cls.bookedCount) {
            return res.status(400).json({ message: 'Capacity cannot be less than the number already booked' });
        }

        // Update the other fields when they are provided.
        if (title !== undefined) cls.title = title;
        if (category !== undefined) cls.category = category;
        if (description !== undefined) cls.description = description;
        if (classDateTime !== undefined) cls.classDateTime = classDateTime;
        if (durationMinutes !== undefined) cls.durationMinutes = durationMinutes;
        if (capacity !== undefined) cls.capacity = capacity;

        const updated = await cls.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a class (admin only).
const deleteClass = async (req, res) => {
    try {
        const cls = await Class.findById(req.params.id);
        if (!cls) return res.status(404).json({ message: 'Class not found' });
        await cls.deleteOne();
        res.json({ message: 'Class deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createClass, getClasses, getClassById, updateClass, deleteClass };
