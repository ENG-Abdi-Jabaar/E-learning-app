const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
    const { username, email, password, role} = req.body

    try {
        //check if email already exists
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({msg: 'User Already Exists'})
        }

        // hashing the password before saving
        const salt = await bcrypt.genSalt(10) // higher = safer but slower
        const hashedPassword = await bcrypt.hash(password, salt)

        // create And save user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role //optional, default is 'user'
        })

        await user.save()

        // send success response
        res.status(201).json({msg: 'user registered successfuly'})

    } catch (error) {
        console.error('registration error...', error.message)
        res.status(500).json({msg: 'server error during registration'})
    }
}


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