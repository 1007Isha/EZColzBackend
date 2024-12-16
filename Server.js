// const express = require('express');
// const mongoose = require("mongoose");
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const { generatePassword } = require('./Utils/password');
// const sendEmail = require('./Utils/email');

// require('dotenv').config();

// const app = express();
// const server = http.createServer(app);

// // Socket.IO configuration with CORS support
// const io = socketIo(server, {
//     cors: {
//         origin: ['http://localhost:5501', 'https://napixbackend-2.onrender.com'],
//         methods: ['GET', 'POST'],
//         allowedHeaders: ['Content-Type', 'Authorization']
//     }
// });

// // Middleware
// app.use(cors({
//     origin: ['http://localhost:5501', 'https://napixbackend-2.onrender.com'],
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Body parsing middleware (Express 4.16+ handles this natively)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Test API
// app.get('/', (req, res) => {
//     res.send('Hello, Pandeyjii!');
// });

// // Password generation and email sending route
// app.post('/send-password', async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ error: 'Email is required' });
//     }

//     try {
//         // Generate a password
//         const password = generatePassword();

//         // Send the password via email
//         await sendEmail(email, 'Your New Password', `Your new password is: ${password}`);
//         console.log('Email sent successfully');

//         // Respond with success
//          res.status(200).json({ message: 'Password sent successfully' });
//         //res.status(200).json({ message: 'OTP sent successfully', otp: otp });

//     } catch (emailError) {
//         console.error('Failed to send email:', emailError.message);
//         res.status(500).json({ error: 'Failed to send email' });
//     }
// });

// // Connect to MongoDB (if required)
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log('MongoDB connection error:', err));

// // Socket.IO configuration
// io.on('connection', (socket) => {
//     console.log('New client connected');
//     // Handle socket events here
// });

// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// const express = require('express');
// const mongoose = require("mongoose");
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const sendPasswordRoutes = require('./controllers/router'); // Corrected import path to router inside controller
// require('dotenv').config();

// const app = express();
// const server = http.createServer(app);

// // Socket.IO configuration with CORS support
// const io = socketIo(server, {
//     cors: {
//         origin: ['http://localhost:5501', 'https://napixbackend-2.onrender.com'],
//         methods: ['GET', 'POST'],
//         allowedHeaders: ['Content-Type', 'Authorization']
//     }
// });

// // Middleware
// app.use(cors({
//     origin: ['http://localhost:5501', 'https://napixbackend-2.onrender.com'],
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json()); // For parsing JSON
// app.use(express.urlencoded({ extended: true })); // For parsing form-urlencoded data

// // Mount routes
// app.use('/api', sendPasswordRoutes); // Use the router for OTP routes

// // Test API
// app.get('/', (req, res) => {
//     res.send('Hello, Pandeyjii!');
// });

// // Connect to MongoDB (if required)
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log('MongoDB connection error:', err));

// // Socket.IO configuration
// io.on('connection', (socket) => {
//     console.log('New client connected');
//     // Handle socket events here
// });

// // Start the server
// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const { generatePassword } = require('../Utils/password');
const sendEmail = require('../Utils/email');
const router = express.Router();

// Temporary store for OTPs (use a more persistent solution like a database for production)
const otpStore = {}; // { email: otp }

// Allowed email domains
const allowedDomains = ['chitkara.edu.in', 'chitkarauniversity.edu.in'];

router.post('/send-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Extract the email domain
    const emailDomain = email.split('@')[1];

    // Check if the email domain is in the allowed list
    if (!allowedDomains.includes(emailDomain)) {
        return res.status(400).json({ error: `Email domain should be one of: ${allowedDomains.join(', ')}` });
    }

    try {
        // Generate a 6-digit OTP
        const otp = generatePassword();

        // Store the OTP temporarily (for demo purposes, this should be handled by a database in production)
        otpStore[email] = otp;

        // Send the OTP via email
        await sendEmail(email, 'Your OTP', `Your OTP is: ${otp}`);
        console.log(`OTP sent successfully to ${email}`);

        // Respond with the OTP for frontend verification
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (emailError) {
        console.error('Failed to send email:', emailError.message);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Endpoint to verify the OTP entered by the user
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedOtp = otpStore[email];

    if (storedOtp === otp) {
        // OTP matches, success
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        // OTP does not match
        res.status(400).json({ error: 'Invalid OTP' });
    }
});

module.exports = router;

