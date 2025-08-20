
const mongoose = require('mongoose');

const { getISTDate } = require('../utils/timezone');

const billSchema = new mongoose.Schema({
  billId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  issueDate: {
    type: Date,
    required: true,
    default: getISTDate
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientName: {
    type: String,
    required: true
  }
}, { timestamps: { currentTime: getISTDate } });

module.exports = mongoose.model('Bill', billSchema); 