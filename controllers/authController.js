const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken'); // add if not already
exports.register = async (req, res) => {
  const { username, email, phone, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    await user.save();

    // ✅ Generate token
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // ✅ Send token and user info
    res.status(201).json({
      msg: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('registration error...', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Create a JWT payload
    const payload = {
      id: user._id,
      role: user.role
    };

    // Sign the token
    const token = require('jsonwebtoken').sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h' // Token valid for 1 hour
    });

    // Send token and user data (excluding password)
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ msg: 'Server error during login' });
  }
};