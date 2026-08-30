
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

dotenv.config();


const app = express();

// Helmet sets sensible security headers on every response.
app.use(helmet());

// Only allow requests from our own frontend if a URL is set,
// otherwise allow all origins (handy during local development).
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : {}));

app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/instructor', require('./routes/instructorRoutes'));

// Central error handler. If something unexpected throws, send a plain,
// safe message instead of a full stack trace to the user.
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: 'Something went wrong, please try again later' });
});

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app
