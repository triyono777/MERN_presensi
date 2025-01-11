const express = require('express');
const router = express.Router();
const { checkIn, checkOut } = require('../controllers/presensiController');
const authMiddleware = require('../middleware/auth');

// Route untuk check-in
router.post('/check-in', authMiddleware, checkIn);

// Route untuk check-out
router.post('/check-out', authMiddleware, checkOut);

module.exports = router;
