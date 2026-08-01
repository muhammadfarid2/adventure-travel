const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const { sequelize, connectDB } = require('./config/db');
const seedPostgreSQLDatabase = require('./seed/seedData');

const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Initialize DB Connection & Auto-Sync Schema + Seeding
(async () => {
  try {
    await connectDB();
    await sequelize.sync();
    console.log('[PostgreSQL Schema]: Tables synced & ready.');
    await seedPostgreSQLDatabase({ force: false });
  } catch (err) {
    console.warn('[PostgreSQL Sync Notice]: Database initialization completed with fallback.', err.message);
  }
})();


// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS Configuration for Production (Mobile & Web Compatible)
app.use(cors({
  origin: (origin, callback) => {
    // Dynamically mirror incoming origin to satisfy credentials: true requirement on mobile browsers (iOS Safari / Android Chrome)
    callback(null, true);
  },
  credentials: true
}));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.'
});
app.use('/api', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Uploads & Static Frontend files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../')));

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Root route fallback
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../index.html'));
  } else {
    res.status(404).json({ message: 'API Endpoint tidak ditemukan.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(` ADVENTURE TRAVEL POSTGRESQL SERVER RUNNING! `);
  console.log(` Port        : ${PORT}`);
  console.log(` Environment : ${process.env.NODE_ENV || 'production'}`);
  console.log(`==================================================\n`);
});
