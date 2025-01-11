const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Route untuk registrasi
router.post('/register', registerUser);

// Route untuk login
router.post('/login', loginUser);

module.exports = router;
