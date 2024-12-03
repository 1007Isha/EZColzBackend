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




const express = require('express');
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const sendPasswordRoutes = require('./router'); // Import the router file for OTP routes
require('dotenv').config();

const app = express();
const server = http.createServer(app);

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
app.use(express.json()); // For parsing JSON
app.use(express.urlencoded({ extended: true })); // For parsing form-urlencoded data

// Mount routes
app.use('/api', sendPasswordRoutes); // Use the router for OTP routes

// Test API
app.get('/', (req, res) => {
    res.send('Hello, Pandeyjii!');
});

// Connect to MongoDB (if required)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Socket.IO configuration
io.on('connection', (socket) => {
    console.log('New client connected');
    // Handle socket events here
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
