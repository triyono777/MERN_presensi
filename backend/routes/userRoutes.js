const express = require('express');
const router = express.Router();

// GET: Mengambil data users
router.get('/', (req, res) => {
    res.json({
        users: [
            { id: 1, name: 'User 1' },
            { id: 2, name: 'User 2' }
        ]
    });
});

// POST: Membuat user baru
router.post('/', (req, res) => {
    const { name, email } = req.body;
    res.status(201).json({
        message: 'User berhasil dibuat',
        user: { name, email }
    });
});

// PUT: Update user
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    res.json({
        message: `User dengan id ${id} berhasil diupdate`,
        user: { id, name }
    });
});

// DELETE: Hapus user
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.json({
        message: `User dengan id ${id} berhasil dihapus`
    });
});

module.exports = router;