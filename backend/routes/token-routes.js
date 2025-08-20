const express = require('express');
const router = express.Router();
const { generateToken, getAllTokens } = require('../controllers/token-controller');
const { authMiddleware, requireRole } = require('../middleware/auth-middleware');

router.use(authMiddleware);

router.post('/generate', requireRole('receptionist'), generateToken);
router.get('/', getAllTokens);

module.exports = router; 