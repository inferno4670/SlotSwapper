const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user - properly hash the password
    const user = await User.create({
      name,
      email,
      passwordHash: password // This will be hashed by the pre-save middleware
    });

    // Don't automatically log in user - they should login separately
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
      // Note: No token returned
    });
  } catch (error) {
    console.error('Signup error:', error); // Add logging for debugging
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Login error:', error); // Add logging for debugging
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login
};