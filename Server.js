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
//         res.status(200).json({ message: 'Password sent successfully' });
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


const express = require('express');
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { generatePassword } = require('./Utils/password');
const sendEmail = require('./Utils/email');
const router = require('./routes/router');  // Assuming you have a router.js

require('dotenv').config();

const app = express();
const server = http.createServer(app);

const otpStorage = {};  // In-memory storage for OTPs

// Socket.IO configuration with CORS support
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:5501', 'https://napixbackend-2.onrender.com'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});

// Middleware
app.use(cors({
    origin: ['http://localhost:5501', 'https://napixbackend-2.onrender.com'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Password generation and email sending route
app.post('/send-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const otp = generatePassword();  // Generate OTP

        // Store OTP temporarily for comparison (for simplicity, use an object in memory)
        otpStorage[email] = otp;

        // Send OTP to the user
        await sendEmail(email, 'Your OTP', `Your OTP is: ${otp}`);
        console.log('OTP sent successfully');

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (emailError) {
        console.error('Failed to send OTP:', emailError.message);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Route to verify OTP
app.post('/verify-otp', async (req, res) => {
    const { email, otpEntered } = req.body;

    if (!email || !otpEntered) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedOtp = otpStorage[email];

    if (storedOtp && storedOtp === otpEntered) {
        return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ error: 'Invalid OTP' });
    }
});

// Socket.IO configuration
io.on('connection', (socket) => {
    console.log('New client connected');
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const PORT = process.env.PORT || 5001;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
