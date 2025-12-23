const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

module.exports = connectDB;