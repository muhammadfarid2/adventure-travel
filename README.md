# Adventure Travel Indonesia 🏔️🌊🏝️ (PostgreSQL & Production Ready)

Website profesional bertema **"Adventure Travel Indonesia"** - platform pemesanan wisata alam Indonesia (Pendakian Gunung, Wisata Curug, Wisata Pulau, dan Wisata Bukit).

Platform ini siap untuk di-deploy ke internet (**Full Production Ready**) menggunakan **PostgreSQL Database** dan ORM **Sequelize**.

---

## 🗄️ Arsitektur PostgreSQL Database

Aplikasi telah sepenuhnya dimigrasikan dari MongoDB ke **PostgreSQL**.

### Skema Tabel Database:
- `users`: `id` (UUID), `name`, `email` (Unique), `password` (bcrypt hash), `phone`, `role` (`user` | `admin`).
- `destinations`: `id` (UUID), `name`, `category` (`Gunung` | `Curug` | `Pulau` | `Bukit`), `location`, `price`, `rating`, `duration`, `image`, `description`, `featured`.
- `bookings`: `id` (UUID), `customerName`, `email`, `phone`, `destinationId`, `destinationName`, `travelDate`, `participants`, `totalPrice`, `status` (`Pending` | `Approved` | `Cancelled`), `notes`.
- `gallery`: `id` (UUID), `title`, `category`, `image`.
- `reviews`: `id` (UUID), `name`, `photo`, `rating`, `comment`, `destinationName`.

---

## 🚀 Petunjuk Menjalankan di Komputer Lokal

### 1. Masuk ke Folder Project
```bash
cd AdventureTravel
```

### 2. Install Dependency Node.js & Driver PostgreSQL
```bash
npm install
```

### 3. Konfigurasi Environment (`.env`)
Pastikan file `.env` berisi variabel koneksi PostgreSQL Anda:
```env
PORT=5000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/adventure_travel
JWT_SECRET=adventure_travel_secret_key_2026_id
NODE_ENV=production
FRONTEND_URL=*
```

### 4. Eksekusi Script Migrasi & Seeding Database
Script ini akan secara otomatis membuat tabel-tabel PostgreSQL (`sequelize.sync({ force: true })`) dan menginput 20 Destinasi Wisata, 24 Foto Galeri, 10 Testimoni, 5 User, dan 1 Admin:
```bash
npm run seed
```

### 5. Jalankan Server Production
```bash
npm run start
```
Buka browser dan buka:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🌐 Panduan Deployment Online Gratis (Free Tier Production)

### Langkah 1: Deploy Database PostgreSQL Cloud (Supabase / Neon.tech)
1. Buat akun gratis di **[Supabase.com](https://supabase.com)** atau **[Neon.tech](https://neon.tech)**.
2. Buat project database PostgreSQL baru (pilih region terdekat misal Singapore).
3. Salin **Database Connection String (`DATABASE_URL`)** yang diberikan. Formatnya:
   `postgres://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require`

### Langkah 2: Deploy Backend Node.js Express (Render.com)
1. Push folder `AdventureTravel` ini ke repository **GitHub** Anda.
2. Buka **[Render.com](https://render.com)** dan pilih **New Web Service**.
3. Hubungkan repository GitHub Anda.
4. Masukkan konfigurasi berikut:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Pada bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL`: *(String koneksi PostgreSQL dari Langkah 1)*
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `adventure_travel_secret_key_2026_id`
6. Klik **Create Web Service**. Setelah build selesai, Anda akan mendapatkan URL backend seperti `https://adventure-travel-backend.onrender.com`.

### Langkah 3: Eksekusi Seeding PostgreSQL Cloud
Untuk mengisikan data awal (20 destinasi & akun admin) ke PostgreSQL cloud, jalankan perintah ini dari komputer lokal atau via Terminal Render:
```bash
DATABASE_URL="postgres://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require" npm run seed
```

### Langkah 4: Deploy Frontend (Vercel / Netlify)
1. Buka **[Vercel.com](https://vercel.com)** dan klik **Add New Project**.
2. Pilih repository GitHub project ini.
3. Vercel akan otomatis mengenali file `vercel.json` dan mempublikasikan frontend Anda secara online dengan URL HTTPS gratis!

---

## 🔐 Kredensial Pengguna & Admin

- **Default Main Admin**: `admin@adventuretravel.id` / Password: `admin123`
- **Pelanggan / User**: Lakukan Pendaftaran Akun Baru secara mandiri dari tombol **Login / Register** di website.

