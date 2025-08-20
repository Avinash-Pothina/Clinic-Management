
const express = require('express');
const { getHistory } = require('../controllers/history-controller');
const { authMiddleware } = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/', authMiddleware, getHistory);

module.exports = router;