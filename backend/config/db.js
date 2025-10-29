const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Log the URI (without password) for debugging
    console.log('Attempting to connect to MongoDB...');
    
    // Remove any quotes from the URI if they exist
    const mongoUri = process.env.MONGO_URI.replace(/['"]+/g, '');
    
    // Hide password in logs for security
    const uriWithoutPassword = mongoUri.replace(/\/\/(.*?):(.*?)@/, '//****:****@');
    console.log('MongoDB URI:', uriWithoutPassword);
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Make sure your MONGO_URI environment variable is correctly set in Render');
    console.error('Common issues:');
    console.error('1. Incorrect username or password');
    console.error('2. IP not whitelisted in MongoDB Atlas');
    console.error('3. Incorrect cluster URL');
    process.exit(1);
  }
};

module.exports = connectDB;