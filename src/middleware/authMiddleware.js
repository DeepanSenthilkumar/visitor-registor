const jwt = require('jsonwebtoken');
const UserSession = require('../models/UserSession');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'jwt token invalid' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const session = await UserSession.findOne({
      token,
      isActive: true
    });

    if (!session) {
      return res.status(401).json({ message: 'jwt token invalid' });
    }

    req.user = decoded; // userId available
    next();

  } catch (error) {
    return res.status(401).json({ message: 'jwt token invalid' });
  }
};
