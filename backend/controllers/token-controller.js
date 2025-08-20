
const Patient = require('../models/patient-model');

const generateToken = async (req, res) => {
  try {
    const lastPatient = await Patient.findOne().sort({ tokenNumber: -1 });
    const nextToken = lastPatient ? lastPatient.tokenNumber + 1 : 1;
    res.json({ token: nextToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllTokens = async (req, res) => {
  try {
    const patients = await Patient.find({}, 'name tokenNumber createdAt').sort({ tokenNumber: 1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { generateToken, getAllTokens }; 