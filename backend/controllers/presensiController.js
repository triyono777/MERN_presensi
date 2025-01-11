const Presensi = require('../models/Presensi');
const User = require('../models/User');
const moment = require('moment');

// Check-in pengguna
exports.checkIn = async (req, res) => {
    const { location } = req.body;
    const userId = req.user; // Mendapatkan userId dari token JWT

    try {
        // Cek apakah sudah ada presensi yang terdaftar untuk hari ini
        let presensi = await Presensi.findOne({ userId, checkOutTime: { $exists: false } });

        if (presensi) {
            return res.status(400).json({ msg: 'Anda sudah melakukan check-in hari ini.' });
        }

        // Buat data presensi check-in
        presensi = new Presensi({
            userId,
            checkInTime: moment().toISOString(),
            location,
            status: 'hadir',
        });

        await presensi.save();
        res.status(200).json({ msg: 'Check-in berhasil.', presensi });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Check-out pengguna
exports.checkOut = async (req, res) => {
    const userId = req.user; // Mendapatkan userId dari token JWT

    try {
        // Cek apakah ada presensi yang belum ditandai check-out
        let presensi = await Presensi.findOne({ userId, checkOutTime: { $exists: false } });

        if (!presensi) {
            return res.status(400).json({ msg: 'Anda belum melakukan check-in hari ini.' });
        }

        // Tandai waktu check-out
        presensi.checkOutTime = moment().toISOString();

        // Hitung status kehadiran
        const checkInHour = moment(presensi.checkInTime).hour();
        const currentHour = moment().hour();
        if (currentHour > checkInHour + 1) { // Anggap terlambat jika lebih dari 1 jam
            presensi.status = 'terlambat';
        }

        await presensi.save();
        res.status(200).json({ msg: 'Check-out berhasil.', presensi });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
