const express = require('express');
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const sendPasswordRoutes = require('./controllers/router'); // Corrected import path to router inside controller
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

