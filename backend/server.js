// Import package yang diperlukan
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');


// Konfigurasi dotenv
dotenv.config();

// Inisialisasi express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Gunakan routes
app.use('/api/users', userRoutes);
// Route test sederhana
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API Aplikasi Presensi berjalan dengan baik'
    });
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});