const Presensi = require('../models/Presensi');
const User = require('../models/User');
const moment = require('moment');

// Check-in pengguna
const checkIn = async (req, res) => {
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
const checkOut = async (req, res) => {
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

// Fungsi untuk mendapatkan laporan presensi berdasarkan ID user dan rentang waktu
const getPresensiReport = async (req, res) => {
    const { userId, startDate, endDate } = req.query;

    // Validasi tanggal
    if (startDate && !moment(startDate, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ msg: 'Tanggal mulai tidak valid' });
    }

    if (endDate && !moment(endDate, 'YYYY-MM-DD', true).isValid()) {
        return res.status(400).json({ msg: 'Tanggal akhir tidak valid' });
    }

    try {
        // Membangun query untuk mengambil data presensi berdasarkan userId dan rentang tanggal
        const query = {};

        if (userId) {
            query.userId = userId;
        }

        if (startDate && endDate) {
            query.checkInTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        } else if (startDate) {
            query.checkInTime = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.checkInTime = { $lte: new Date(endDate) };
        }

        const presensiData = await Presensi.find(query).sort({ checkInTime: -1 });

        if (!presensiData || presensiData.length === 0) {
            return res.status(404).json({ msg: 'Tidak ada data presensi untuk rentang waktu ini' });
        }

        // Kembalikan data laporan
        res.status(200).json(presensiData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Fungsi untuk mendapatkan seluruh data presensi
const getAllPresensi = async (req, res) => {
    try {
        // Ambil semua data presensi dari database
        const presensiList = await Presensi.find();

        // Jika tidak ada data presensi
        if (presensiList.length === 0) {
            return res.status(404).json({ msg: 'No presensi data found' });
        }

        // Kirim data presensi ke client
        return res.json(presensiList);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
};

const deletePresensi = async (req, res) => {
    const { id } = req.params; // Mengambil ID dari parameter URL

    try {
        // Cari dan hapus data presensi berdasarkan ID
        const presensi = await Presensi.findById(id);

        if (!presensi) {
            return res.status(404).json({ msg: 'Presensi tidak ditemukan' });
        }

        await presensi.remove(); // Menghapus data presensi dari database
        res.status(200).json({ msg: 'Presensi berhasil dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    checkIn,
    checkOut,
    getPresensiReport,
    getAllPresensi,
    deletePresensi,
};