const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { sequelize, connectDB } = require('../config/db');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Gallery = require('../models/Gallery');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

const seedPostgreSQLDatabase = async (options = { force: false }) => {
  try {
    try {
      await sequelize.authenticate();
    } catch (authErr) {
      await connectDB();
    }
    
    if (options.force) {
      await sequelize.sync({ force: true });
      console.log('[PostgreSQL Seed] Tables recreated successfully!');
    } else {
      await sequelize.sync();
    }



    // 1. Always Ensure Default Admin User Exists
    const adminEmail = 'admin@adventuretravel.id';
    let adminUser = await User.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'Administrator Adventure',
        email: adminEmail,
        password: adminPassword,
        phone: '089517846680',
        role: 'admin'
      });
      console.log(`[PostgreSQL Seed] Created Default Admin User (${adminEmail}).`);
    } else {
      const salt = await bcrypt.genSalt(10);
      adminUser.password = await bcrypt.hash('admin123', salt);
      adminUser.role = 'admin';
      await adminUser.save();
      console.log(`[PostgreSQL Seed] Reset/Verified Admin User (${adminEmail}).`);
    }

    // Check existing data for destinations
    const existingDestinations = await Destination.count();

    if (existingDestinations > 0 && !options.force) {
      console.log('[PostgreSQL Seed] Database already contains destination data. Auto-seed verified.');
      return;
    }

    console.log('[PostgreSQL Seed] Seeding initial database records...');


    // 2. Destinations (20 Total)
    const destinationsData = [
      // Gunung (5)
      { name: 'Gunung Bromo', category: 'Gunung', location: 'Probolinggo, Jawa Timur', price: 850000, rating: 4.9, duration: '2 Hari 1 Malam', image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=800', description: 'Pendakian kawah Bromo dan menyaksikan matahari terbit tercantik di Penanjakan dengan lautan pasir megah.', featured: true },
      { name: 'Gunung Rinjani', category: 'Gunung', location: 'Lombok, Nusa Tenggara Barat', price: 2450000, rating: 5.0, duration: '4 Hari 3 Malam', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800', description: 'Jelajahi keindahan Danau Segara Anak dan Puncak Rinjani 3.726 MDPL yang spektakuler.', featured: true },
      { name: 'Gunung Prau', category: 'Gunung', location: 'Dieng, Jawa Tengah', price: 650000, rating: 4.8, duration: '2 Hari 1 Malam', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800', description: 'Sunrise terbaik di Asia Tenggara dengan hamparan bukit teletubbies dan pemandangan Sindoro Sumbing.', featured: true },
      { name: 'Gunung Semeru', category: 'Gunung', location: 'Lumajang, Jawa Timur', price: 1850000, rating: 4.9, duration: '3 Hari 2 Malam', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800', description: 'Atap pulau Jawa Mahameru 3.676 MDPL dengan Danau Ranu Kumbolo yang legendaris.', featured: false },
      { name: 'Gunung Merbabu', category: 'Gunung', location: 'Magelang, Jawa Tengah', price: 750000, rating: 4.8, duration: '2 Hari 1 Malam', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800', description: 'Jelajah padang sabana luas yang hijau menakjubkan dari jalur Suwanting atau Selo.', featured: false },

      // Curug (5)
      { name: 'Curug Cibaliung', category: 'Curug', location: 'Bogor, Jawa Barat', price: 350000, rating: 4.7, duration: '1 Hari (Day Trip)', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=800', description: 'Air terjun tersembunyi dengan kolam alami berwarna biru toska nan jernih segar.', featured: true },
      { name: 'Curug Leuwi Hejo', category: 'Curug', location: 'Sentul, Bogor', price: 280000, rating: 4.6, duration: '1 Hari (Day Trip)', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=800', description: 'Grand Canyon mini Sentul dengan sungai jernih dan tebing batu eksotis.', featured: false },
      { name: 'Curug Cilember', category: 'Curug', location: 'Puncak, Bogor', price: 320000, rating: 4.7, duration: '1 Hari (Day Trip)', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800', description: 'Pesona 7 tingkatan air terjun di tengah keasrian hutan pinus yang menyejukkan.', featured: false },
      { name: 'Curug Nangka', category: 'Curug', location: 'Ciapus, Bogor', price: 300000, rating: 4.5, duration: '1 Hari (Day Trip)', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800', description: 'Air terjun alami di kaki Gunung Salak dengan sungai alami bertingkat.', featured: false },
      { name: 'Curug Cikaso', category: 'Curug', location: 'Sukabumi, Jawa Barat', price: 450000, rating: 4.9, duration: '1 Hari (Day Trip)', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800', description: 'Kemegahan 3 tumpahan air terjun raksasa bertetangga di tengah ngarai hijau.', featured: true },

      // Pulau (5)
      { name: 'Pulau Komodo', category: 'Pulau', location: 'Labuan Bajo, NTT', price: 3850000, rating: 5.0, duration: '3 Hari 2 Malam', image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800', description: 'Petualangan Sailing Komodo, Padar Island, Pink Beach, dan bertemu Komodo.', featured: true },
      { name: 'Pulau Pari', category: 'Pulau', location: 'Kepulauan Seribu, Jakarta', price: 550000, rating: 4.7, duration: '2 Hari 1 Malam', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800', description: 'Pantai Pasir Perawan yang menawan, sepeda santai keliling pulau dan snorkeling.', featured: false },
      { name: 'Pulau Tidung', category: 'Pulau', location: 'Kepulauan Seribu, Jakarta', price: 580000, rating: 4.6, duration: '2 Hari 1 Malam', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800', description: 'Ikon Jembatan Cinta yang legendaris, watersport, dan keindahan terumbu karang.', featured: false },
      { name: 'Pulau Weh', category: 'Pulau', location: 'Sabang, Aceh', price: 2100000, rating: 4.9, duration: '3 Hari 2 Malam', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800', description: 'Titik Kilometer Nol Indonesia dengan spot diving dan snorkeling kelas dunia.', featured: true },
      { name: 'Pulau Derawan', category: 'Pulau', location: 'Berau, Kalimantan Timur', price: 3400000, rating: 4.9, duration: '4 Hari 3 Malam', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800', description: 'Berenang bersama ubur-ubur tanpa sengat di Kakaban dan bertemu penyu raksasa.', featured: true },

      // Bukit (5)
      { name: 'Bukit Pergasingan', category: 'Bukit', location: 'Sembalun, Lombok', price: 750000, rating: 4.8, duration: '2 Hari 1 Malam', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800', description: 'Landscape petak petak sawah Sembalun berlatar belakang puncak Rinjani.', featured: true },
      { name: 'Bukit Teletubbies', category: 'Bukit', location: 'Nusa Penida, Bali', price: 950000, rating: 4.7, duration: '1 Hari (Day Trip)', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800', description: 'Hamparan bukit hijau bergelombang unik nan fotogenik seperti dalam dongeng.', featured: false },
      { name: 'Bukit Sikunir', category: 'Bukit', location: 'Dieng, Jawa Tengah', price: 450000, rating: 4.8, duration: '1 Hari (Sunrise Trip)', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800', description: 'Golden Sunrise terindah di atas awan Dieng Negeri di Atas Awan.', featured: true },
      { name: 'Bukit Holbung', category: 'Bukit', location: 'Samosir, Sumatera Utara', price: 1100000, rating: 4.9, duration: '2 Hari 1 Malam', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800', description: 'Savana hijau Bukit Teletubbies Danau Toba dengan pemandangan danau super megah.', featured: false },
      { name: 'Bukit Moko', category: 'Bukit', location: 'Bandung, Jawa Barat', price: 250000, rating: 4.6, duration: '1 Hari (Evening Trip)', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800', description: 'Pemandangan gemerlap citylight Kota Bandung malam hari dari Puncak Bintang.', featured: false }
    ];

    const seededDests = await Destination.bulkCreate(destinationsData);
    console.log(`[PostgreSQL Seed] Seeded ${seededDests.length} Destinations.`);

    // 3. Gallery (24 Photos)
    const galleryItems = [
      { title: 'Sunrise Penanjakan Bromo', category: 'Gunung', image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=800' },
      { title: 'Danau Segara Anak Rinjani', category: 'Gunung', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800' },
      { title: 'Sabana Hijau Gunung Prau', category: 'Gunung', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800' },
      { title: 'Danau Ranu Kumbolo Semeru', category: 'Gunung', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
      { title: 'Puncak Merbabu Sabana', category: 'Gunung', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
      { title: 'Hutan Dan Awan Pegunungan', category: 'Gunung', image: 'https://images.unsplash.com/photo-1434394354979-a235cd36269d?q=80&w=800' },
      { title: 'Curug Cibaliung Jernih', category: 'Curug', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=800' },
      { title: 'Curug Leuwi Hejo Sentul', category: 'Curug', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=800' },
      { title: 'Air Terjun Cilember', category: 'Curug', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800' },
      { title: 'Curug Nangka Bogor', category: 'Curug', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800' },
      { title: 'Tiga Tumpah Curug Cikaso', category: 'Curug', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800' },
      { title: 'Gemercik Air Terjun Hutan', category: 'Curug', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800' },
      { title: 'Pulau Padar Komodo', category: 'Pulau', image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800' },
      { title: 'Pantai Perawan Pulau Pari', category: 'Pulau', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800' },
      { title: 'Jembatan Cinta Pulau Tidung', category: 'Pulau', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800' },
      { title: 'Diving Spot Pulau Weh', category: 'Pulau', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800' },
      { title: 'Danau Ubur Ubur Derawan', category: 'Pulau', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800' },
      { title: 'Pantai Eksotis Tropis', category: 'Pulau', image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=800' },
      { title: 'Sawah Sembalun Pergasingan', category: 'Bukit', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800' },
      { title: 'Bukit Teletubbies Nusa Penida', category: 'Bukit', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800' },
      { title: 'Golden Sunrise Sikunir', category: 'Bukit', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
      { title: 'Bukit Holbung Danau Toba', category: 'Bukit', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
      { title: 'Puncak Bintang Bukit Moko', category: 'Bukit', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800' },
      { title: 'Senja Di Atas Bukit', category: 'Bukit', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800' }
    ];

    const seededGallery = await Gallery.bulkCreate(galleryItems);
    console.log(`[PostgreSQL Seed] Seeded ${seededGallery.length} Gallery items.`);

    // 4. Initial Bookings (2 Initial Bookings)
    const bromoDest = seededDests.find(d => d.name === 'Gunung Bromo') || seededDests[0];
    const komodoDest = seededDests.find(d => d.name === 'Pulau Komodo') || seededDests[1];

    const initialBookings = [
      { customerName: "Budi Santoso", email: "budi@gmail.com", phone: "081298765432", destinationId: bromoDest ? String(bromoDest.id) : "dest_1", destinationName: "Gunung Bromo", travelDate: "2026-08-15", participants: 2, totalPrice: 1700000, status: "Approved", notes: "Minta guide ramah" },
      { customerName: "Siti Rahma", email: "siti@gmail.com", phone: "081311223344", destinationId: komodoDest ? String(komodoDest.id) : "dest_2", destinationName: "Pulau Komodo", travelDate: "2026-08-20", participants: 1, totalPrice: 3850000, status: "Pending", notes: "Kabin atas" }
    ];

    const seededBookings = await Booking.bulkCreate(initialBookings);
    console.log(`[PostgreSQL Seed] Seeded ${seededBookings.length} Initial Bookings.`);

    // 5. Initial Reviews
    const initialReviews = [
      { name: 'Budi Santoso', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200', rating: 5, comment: 'Pengalaman mendaki Gunung Bromo luar biasa! Guide sangat profesional dan ramah.', destinationName: 'Gunung Bromo' },
      { name: 'Siti Rahma', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', rating: 5, comment: 'Sailing Pulau Komodo sangat berkesan. Pemandangan Pulau Padar luar biasa indah.', destinationName: 'Pulau Komodo' },
      { name: 'Andi Wijaya', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200', rating: 5, comment: 'Curug Cibaliung airnya jernih sekali dan sangat segar. Recommended!', destinationName: 'Curug Cibaliung' }
    ];

    const seededReviews = await Review.bulkCreate(initialReviews);
    console.log(`[PostgreSQL Seed] Seeded ${seededReviews.length} Initial Reviews.`);

    console.log('\n==================================================');
    console.log(' POSTGRESQL DATABASE SEEDING COMPLETED SUCCESS! ');
    console.log(' Admin Email   : admin@adventuretravel.id');
    console.log(' Admin Password: admin123');
    console.log(' User Password : user123');
    console.log('==================================================\n');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('[PostgreSQL Seed Error]:', err);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedPostgreSQLDatabase({ force: true });
}

module.exports = seedPostgreSQLDatabase;

