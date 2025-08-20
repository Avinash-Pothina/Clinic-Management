
const mongoose = require('mongoose');
const { getISTDate } = require('../utils/timezone');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'receptionist'], required: true },
}, { timestamps: { currentTime: getISTDate } });

module.exports = mongoose.model('User', userSchema); 