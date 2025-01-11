const User = require('../models/User'); // Import model User

// Middleware untuk mengecek role admin
module.exports = async (req, res, next) => {
    try {
        // Ambil userId dari request yang sudah dipasang oleh middleware auth
        const user = await User.findById(req.user);

        // Jika user tidak ditemukan
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Cek apakah role user adalah 'admin'
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: You do not have the required permissions' });
        }

        // Jika role adalah admin, lanjutkan ke middleware berikutnya
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
