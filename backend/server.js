const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const swapRoutes = require('./routes/swapRoutes');
const { protect } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

// Set Mongoose strictQuery option to suppress deprecation warning
mongoose.set('strictQuery', true);

// Connect to database
connectDB();

// Initialize app
const app = express();

// Make sure we're using the PORT environment variable from Render
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-frontend-url.vercel.app'] // Add your actual frontend URL here
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// Add a logging middleware to see all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', protect, eventRoutes);
app.use('/api', protect, swapRoutes);

// Add a test endpoint to verify the API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working correctly' });
});

app.get('/', (req, res) => {
  res.send('SlotSwapper Backend API');
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
  });
}

// Add a 404 handler for debugging
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: `Route not found: ${req.originalUrl}`,
    method: req.method,
    url: req.originalUrl
  });
});

// Start server and log the actual port it's listening on
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`PORT environment variable: ${process.env.PORT || 'not set, using default 5000'}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});