const mongoose = require('mongoose');

const PresensiSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Menghubungkan dengan model User
        required: true,
    },
    checkInTime: {
        type: Date,
        required: true,
    },
    checkOutTime: {
        type: Date,
    },
    location: {
        type: String,
    },
    status: {
        type: String,
        enum: ['hadir', 'terlambat', 'tidak hadir'],
        default: 'hadir',
    },
}, { timestamps: true });

module.exports = mongoose.model('Presensi', PresensiSchema);
