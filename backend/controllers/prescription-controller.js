
const Prescription = require('../models/prescription-model');

const submitPrescription = async (req, res) => {
  try {
    const { patient, diagnosis, medicines, notes } = req.body;
    if (!patient || !diagnosis || !medicines) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const Patient = require('../models/patient-model');
    const patientDoc = await Patient.findById(patient);
    if (!patientDoc) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const prescription = await Prescription.create({
      patient,
      patientName: patientDoc.name,
      doctor: req.user._id,
      diagnosis,
      medicines,
      notes,
    });
    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().populate('patient doctor');
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('patient doctor');
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { ...req.body, doctor: req.user._id },
      { new: true }
    );
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json({ message: 'Prescription deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  submitPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
}; 