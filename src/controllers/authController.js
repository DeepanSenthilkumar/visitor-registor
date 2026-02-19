const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserSession = require('../models/UserSession');

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        isAdded: false,
        message: 'userId and password required'
      });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({
        isAdded: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        isAdded: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await UserSession.create({ userId, token });

    return res.json({
      isAdded: true,
      message: 'logged in success',
      jwtToken: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }

    const session = await UserSession.findOne({ token, isActive: true });
    if (!session) {
      return res.status(401).json({ message: 'Session already expired' });
    }

    session.isActive = false;
    session.loggedOutAt = new Date();
    await session.save();

    return res.json({
      loggedOut: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
