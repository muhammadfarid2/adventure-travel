const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak terautentikasi.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'adventure_travel_secret_key_2026_id');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau telah kadaluarsa.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Akses ditolak. Peran Admin diperlukan.' });
  }
};

module.exports = { protect, adminOnly };
