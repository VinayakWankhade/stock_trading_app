const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in environment variables!');
            console.error('Server will run but database features will not work.');
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        console.error('Server will continue running without database connection.');
        // Do NOT call process.exit(1) — let the server stay alive for CORS/health checks
    }
};

module.exports = connectDB;
