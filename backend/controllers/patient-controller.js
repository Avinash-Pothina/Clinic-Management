
const Patient = require('../models/patient-model');

const registerPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, tokenNumber } = req.body;
    if (!name || !age || !gender || !tokenNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await Patient.findOne({ tokenNumber });
    if (existing) {
      return res.status(409).json({ message: 'Token number already exists' });
    }
    const patient = await Patient.create({ name, age, gender, contact, tokenNumber });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    
    const Prescription = require('../models/prescription-model');
    const prescription = await Prescription.findOne({ patient: req.params.id });
    if (prescription) {
      return res.status(400).json({ 
        message: 'Token cannot be deleted. Already prescription provided by doctor.' 
      });
    }
    
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  registerPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
}; 