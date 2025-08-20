
const mongoose = require('mongoose');
const { getISTDate } = require('../utils/timezone');

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String, required: true },
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    notes: String,
  }],
  notes: String,
}, { timestamps: { currentTime: getISTDate } });

module.exports = mongoose.model('Prescription', prescriptionSchema); 