
const express = require('express');
const router = express.Router();
const { createBill, getAllBills, getBillById, updateBill, payBill, deleteBill } = require('../controllers/bill-controller');
const { authMiddleware, requireRole } = require('../middleware/auth-middleware');

router.use(authMiddleware);

router.post('/', requireRole('receptionist'), createBill);
router.get('/', getAllBills);
router.get('/:id', getBillById);
router.patch('/:id', requireRole('receptionist'), updateBill);
router.post('/pay', requireRole('receptionist'), payBill);
router.delete('/:id', requireRole('receptionist'), deleteBill);

module.exports = router; 