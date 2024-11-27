const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
};

module.exports = connectDB;

//https://napixbackend-2.onrender.com/api/users/signup


