
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Checks the bearer token and loads the logged in user onto req.user.
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Only lets the request through if the user's role is in the allowed list.
// Use it after protect, for example restrictTo('admin').
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to do this' });
        }
        next();
    };
};

// Blocks an instructor whose account has not been approved yet.
// Use it together with restrictTo('instructor') on instructor only routes.
const requireApprovedInstructor = (req, res, next) => {
    if (req.user.role === 'instructor' && req.user.status !== 'active') {
        return res.status(403).json({ message: 'Your instructor account is still waiting for admin approval' });
    }
    next();
};

module.exports = { protect, restrictTo, requireApprovedInstructor };
