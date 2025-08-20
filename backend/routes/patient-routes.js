
const express = require('express');
const router = express.Router();
const { registerPatient, getAllPatients, getPatientById, updatePatient, deletePatient } = require('../controllers/patient-controller');
const { authMiddleware, requireRole } = require('../middleware/auth-middleware');

router.use(authMiddleware);

router.post('/', requireRole('receptionist'), registerPatient);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.patch('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router; 