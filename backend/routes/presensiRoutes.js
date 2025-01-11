const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getPresensiReport, getAllPresensi } = require('../controllers/presensiController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Route untuk check-in
router.post('/check-in', authMiddleware, checkIn);

// Route untuk check-out
router.post('/check-out', authMiddleware, checkOut);
// Route untuk mendapatkan laporan presensi
router.get('/report', authMiddleware, adminMiddleware, getPresensiReport);
router.get('/all', authMiddleware, adminMiddleware, getAllPresensi);
module.exports = router;
