const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data user', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    if (user.email.toLowerCase() === 'admin@adventuretravel.id') {
      return res.status(400).json({ message: 'Akun Admin Utama tidak dapat dihapus.' });
    }

    await user.destroy();
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus user', error: err.message });
  }
};


module.exports = { getUsers, deleteUser };
