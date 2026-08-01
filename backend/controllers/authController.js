const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, Email, dan Password wajib diisi.' });
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'user'
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'adventure_travel_secret_key_2026_id',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone || '', role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error pendaftaran user', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Guaranteed Admin Login Fallback
    if (cleanEmail === 'admin@adventuretravel.id' && password === 'admin123') {
      let adminUser = null;
      try {
        adminUser = await User.findOne({ where: { email: cleanEmail } });
      } catch (dbErr) {
        console.warn('DB query notice during admin auth, utilizing default admin profile.');
      }

      const adminProfile = {
        id: adminUser ? adminUser.id : 'admin_default',
        name: adminUser ? adminUser.name : 'Administrator Adventure',
        email: cleanEmail,
        phone: adminUser ? adminUser.phone : '089517846680',
        role: 'admin'
      };

      const token = jwt.sign(
        { id: adminProfile.id, role: adminProfile.role, email: adminProfile.email, name: adminProfile.name },
        process.env.JWT_SECRET || 'adventure_travel_secret_key_2026_id',
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login Admin Berhasil',
        token,
        user: adminProfile
      });
    }

    // 2. Normal User Login with DB Exception Guard
    let user;
    try {
      user = await User.findOne({ where: { email: cleanEmail } });
    } catch (dbErr) {
      console.error('User DB query error:', dbErr.message);
      return res.status(500).json({ message: 'Database sedang menyinkronkan data. Silakan coba login lagi sebentar!' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau kata sandi yang Anda masukkan salah. Silakan periksa kembali!' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'adventure_travel_secret_key_2026_id',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone || '', role: user.role }
    });
  } catch (err) {
    console.error('Unhandled login error:', err);
    res.status(500).json({ message: 'Gagal memproses login. Silakan coba lagi.' });
  }
};


const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error mengambil profil user', error: err.message });
  }
};

module.exports = { register, login, getMe };
