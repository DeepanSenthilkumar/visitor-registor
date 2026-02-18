const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  loggedOutAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('UserSession', userSessionSchema);
