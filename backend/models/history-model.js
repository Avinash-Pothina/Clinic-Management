

const mongoose = require('mongoose');
const { getISTDate } = require('../utils/timezone');

const historySchema = new mongoose.Schema({
  patient: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contact: {
      phone: String,
      email: String,
      address: String
    },
    tokenNumber: { type: Number, required: true }
  },
  bill: {
    billId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    status: { type: String, required: true }
  },
  prescription: {
    prescriptionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    diagnosis: { type: String, required: true },
    medicines: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      notes: String
    }],
    notes: String,
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  archivedAt: {
    type: Date,
    default: getISTDate
  }
}, { timestamps: { currentTime: getISTDate } });

module.exports = mongoose.model('History', historySchema);