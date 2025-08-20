
const History = require('../models/history-model');
const Patient = require('../models/patient-model');
const Prescription = require('../models/prescription-model');
const { getISTDate } = require('../utils/timezone');

const archivePatientData = async (billData) => {
  try {
    const patient = await Patient.findById(billData.patient);
    if (!patient) throw new Error('Patient not found');

    const prescription = await Prescription.findOne({ patient: billData.patient }).populate('doctor');
    if (!prescription) throw new Error('Prescription not found');

    const historyRecord = new History({
      patient: {
        _id: patient._id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        contact: patient.contact,
        tokenNumber: patient.tokenNumber
      },
      bill: {
        billId: billData.billId,
        amount: billData.amount,
        paymentDate: getISTDate(),
        status: billData.status
      },
      prescription: {
        prescriptionId: prescription._id,
        diagnosis: prescription.diagnosis,
        medicines: prescription.medicines,
        notes: prescription.notes,
        doctor: prescription.doctor
      }
    });

    await historyRecord.save();
    return historyRecord;
  } catch (error) {
    console.error('Error archiving patient data:', error);
    throw error;
  }
};

module.exports = { archivePatientData };