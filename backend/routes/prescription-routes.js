
const express = require('express');
const router = express.Router();
const { submitPrescription, getAllPrescriptions, getPrescriptionById, updatePrescription, deletePrescription } = require('../controllers/prescription-controller');
const { authMiddleware, requireRole } = require('../middleware/auth-middleware');

router.use(authMiddleware);

router.post('/', requireRole('doctor'), submitPrescription);
router.get('/', getAllPrescriptions);
router.get('/:id', getPrescriptionById);
router.patch('/:id', requireRole('doctor'), updatePrescription);
router.delete('/:id', requireRole('doctor'), deletePrescription);

module.exports = router; 