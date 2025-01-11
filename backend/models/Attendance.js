const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    checkIn: {
        time: Date,
        location: {
            type: { type: String },
            coordinates: [Number]
        }
    },
    checkOut: {
        time: Date,
        location: {
            type: { type: String },
            coordinates: [Number]
        }
    },
    status: {
        type: String,
        enum: ['hadir', 'terlambat', 'izin', 'sakit', 'alpha'],
        required: true
    },
    note: String
}, {
    timestamps: true
});

// Index untuk query berdasarkan tanggal
attendanceSchema.index({ date: 1, user: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;