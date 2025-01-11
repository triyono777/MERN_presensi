const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

// Inisialisasi express
const app = express();

// Load variabel lingkungan
dotenv.config();

// Connect ke database MongoDB
connectDB();

// Middleware
app.use(express.json()); // Untuk parsing JSON
app.use(cors()); // Untuk menangani CORS

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/presensi', require('./routes/presensiRoutes')); // Tambahkan route presensi

// Mulai server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
