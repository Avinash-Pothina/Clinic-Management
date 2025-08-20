
const mongoose = require('mongoose');
const { getISTDate } = require('../utils/timezone');

const visitSchema = new mongoose.Schema({
  date: { type: Date, default: getISTDate },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  contact: {
    phone: String,
    email: String,
    address: String,
  },
  tokenNumber: { type: Number, required: true, unique: true },
  visitHistory: [visitSchema],
}, { timestamps: { currentTime: getISTDate } });

module.exports = mongoose.model('Patient', patientSchema); 