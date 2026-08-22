
const { validationResult } = require('express-validator');

// Runs after the express-validator checks on a route.
// If any check failed, send back a 400 with the first clear message
// so the frontend can show it to the user.
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
};

module.exports = { validate };
