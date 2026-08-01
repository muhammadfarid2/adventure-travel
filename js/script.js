/* ==================================================
   ADVENTURE TRAVEL INDONESIA - MAIN SCRIPT JS
   ================================================== */

const API_BASE_URL = window.API_BASE_URL || '';

// Global Currency Formatter
function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

// Global Dummy Data Backup
window.dummyDestinations = [
  // Gunung (5)
  {
    id: "g1",
    name: "Gunung Bromo",
    category: "Gunung",
    location: "Probolinggo, Jawa Timur",
    price: 850000,
    rating: 4.9,
    duration: "2 Hari 1 Malam",
    image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=800",
    description: "Pendakian kawah Bromo dan menyaksikan matahari terbit tercantik di Penanjakan dengan lautan pasir megah."
  },
  {
    id: "g2",
    name: "Gunung Rinjani",
    category: "Gunung",
    location: "Lombok, Nusa Tenggara Barat",
    price: 2450000,
    rating: 5.0,
    duration: "4 Hari 3 Malam",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
    description: "Jelajahi keindahan Danau Segara Anak dan Puncak Rinjani 3.726 MDPL yang spektakuler."
  },
  {
    id: "g3",
    name: "Gunung Prau",
    category: "Gunung",
    location: "Dieng, Jawa Tengah",
    price: 650000,
    rating: 4.8,
    duration: "2 Hari 1 Malam",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    description: "Sunrise terbaik di Asia Tenggara dengan hamparan bukit teletubbies dan pemandangan Sindoro Sumbing."
  },
  {
    id: "g4",
    name: "Gunung Semeru",
    category: "Gunung",
    location: "Lumajang, Jawa Timur",
    price: 1850000,
    rating: 4.9,
    duration: "3 Hari 2 Malam",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800",
    description: "Atap pulau Jawa Mahameru 3.676 MDPL dengan Danau Ranu Kumbolo yang legendaris."
  },
  {
    id: "g5",
    name: "Gunung Merbabu",
    category: "Gunung",
    location: "Magelang, Jawa Tengah",
    price: 750000,
    rating: 4.8,
    duration: "2 Hari 1 Malam",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    description: "Jelajah padang sabana luas yang hijau menakjubkan dari jalur Suwanting atau Selo."
  },

  // Curug (5)
  {
    id: "c1",
    name: "Curug Cibaliung",
    category: "Curug",
    location: "Bogor, Jawa Barat",
    price: 350000,
    rating: 4.7,
    duration: "1 Hari (Day Trip)",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=800",
    description: "Air terjun tersembunyi dengan kolam alami berwarna biru toska nan jernih segar."
  },
  {
    id: "c2",
    name: "Curug Leuwi Hejo",
    category: "Curug",
    location: "Sentul, Bogor",
    price: 280000,
    rating: 4.6,
    duration: "1 Hari (Day Trip)",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=800",
    description: "Grand Canyon mini Sentul dengan sungai jernih dan tebing batu eksotis."
  },
  {
    id: "c3",
    name: "Curug Cilember",
    category: "Curug",
    location: "Puncak, Bogor",
    price: 320000,
    rating: 4.7,
    duration: "1 Hari (Day Trip)",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
    description: "Pesona 7 tingkatan air terjun di tengah keasrian hutan pinus yang menyejukkan."
  },
  {
    id: "c4",
    name: "Curug Nangka",
    category: "Curug",
    location: "Ciapus, Bogor",
    price: 300000,
    rating: 4.5,
    duration: "1 Hari (Day Trip)",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    description: "Air terjun alami di kaki Gunung Salak dengan sungai alami bertingkat."
  },
  {
    id: "c5",
    name: "Curug Cikaso",
    category: "Curug",
    location: "Sukabumi, Jawa Barat",
    price: 450000,
    rating: 4.9,
    duration: "1 Hari (Day Trip)",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800",
    description: "Kemegahan 3 tumpahan air terjun raksasa bertetangga di tengah ngarai hijau."
  },

  // Pulau (5)
  {
    id: "p1",
    name: "Pulau Komodo",
    category: "Pulau",
    location: "Labuan Bajo, NTT",
    price: 3850000,
    rating: 5.0,
    duration: "3 Hari 2 Malam",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800",
    description: "Petualangan Sailing Komodo, Padar Island, Pink Beach, dan bertemu Komodo."
  },
  {
    id: "p2",
    name: "Pulau Pari",
    category: "Pulau",
    location: "Kepulauan Seribu, Jakarta",
    price: 550000,
    rating: 4.7,
    duration: "2 Hari 1 Malam",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    description: "Pantai Pasir Perawan yang menawan, sepeda santai keliling pulau dan snorkeling."
  },
  {
    id: "p3",
    name: "Pulau Tidung",
    category: "Pulau",
    location: "Kepulauan Seribu, Jakarta",
    price: 580000,
    rating: 4.6,
    duration: "2 Hari 1 Malam",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800",
    description: "Ikon Jembatan Cinta yang legendaris, watersport, dan keindahan terumbu karang."
  },
  {
    id: "p4",
    name: "Pulau Weh",
    category: "Pulau",
    location: "Sabang, Aceh",
    price: 2100000,
    rating: 4.9,
    duration: "3 Hari 2 Malam",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800",
    description: "Titik Kilometer Nol Indonesia dengan spot diving dan snorkeling kelas dunia."
  },
  {
    id: "p5",
    name: "Pulau Derawan",
    category: "Pulau",
    location: "Berau, Kalimantan Timur",
    price: 3400000,
    rating: 4.9,
    duration: "4 Hari 3 Malam",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800",
    description: "Berenang bersama ubur-ubur tanpa sengat di Kakaban dan bertemu penyu raksasa."
  },

  // Bukit (5)
  {
    id: "b1",
    name: "Bukit Pergasingan",
    category: "Bukit",
    location: "Sembalun, Lombok",
    price: 750000,
    rating: 4.8,
    duration: "2 Hari 1 Malam",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    description: "Landscape petak petak sawah Sembalun berlatar belakang puncak Rinjani."
  },
  {
    id: "b2",
    name: "Bukit Teletubbies",
    category: "Bukit",
    location: "Nusa Penida, Bali",
    price: 950000,
    rating: 4.7,
    duration: "1 Hari (Day Trip)",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800",
    description: "Hamparan bukit hijau bergelombang unik nan fotogenik seperti dalam dongeng."
  },
  {
    id: "b3",
    name: "Bukit Sikunir",
    category: "Bukit",
    location: "Dieng, Jawa Tengah",
    price: 450000,
    rating: 4.8,
    duration: "1 Hari (Sunrise Trip)",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    description: "Golden Sunrise terindah di atas awan Dieng Negeri di Atas Awan."
  },
  {
    id: "b4",
    name: "Bukit Holbung",
    category: "Bukit",
    location: "Samosir, Sumatera Utara",
    price: 1100000,
    rating: 4.9,
    duration: "2 Hari 1 Malam",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800",
    description: "Savana hijau Bukit Teletubbies Danau Toba dengan pemandangan danau super megah."
  },
  {
    id: "b5",
    name: "Bukit Moko",
    category: "Bukit",
    location: "Bandung, Jawa Barat",
    price: 250000,
    rating: 4.6,
    duration: "1 Hari (Evening Trip)",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
    description: "Pemandangan gemerlap citylight Kota Bandung malam hari dari Puncak Bintang."
  }
];

// Dummy Gallery Items (24 Photos)
window.dummyGallery = [
  { id: 1, title: "Sunrise Penanjakan Bromo", category: "Gunung", image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=800" },
  { id: 2, title: "Danau Segara Anak Rinjani", category: "Gunung", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800" },
  { id: 3, title: "Sabana Hijau Gunung Prau", category: "Gunung", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800" },
  { id: 4, title: "Danau Ranu Kumbolo Semeru", category: "Gunung", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800" },
  { id: 5, title: "Puncak Merbabu Sabana", category: "Gunung", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800" },
  { id: 6, title: "Hutan Dan Awan Pegunungan", category: "Gunung", image: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?q=80&w=800" },
  
  { id: 7, title: "Curug Cibaliung Jernih", category: "Curug", image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=800" },
  { id: 8, title: "Curug Leuwi Hejo Sentul", category: "Curug", image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=800" },
  { id: 9, title: "Air Terjun Cilember", category: "Curug", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800" },
  { id: 10, title: "Curug Nangka Bogor", category: "Curug", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800" },
  { id: 11, title: "Tiga Tumpah Curug Cikaso", category: "Curug", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800" },
  { id: 12, title: "Gemercik Air Terjun Hutan", category: "Curug", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800" },

  { id: 13, title: "Pulau Padar Komodo", category: "Pulau", image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800" },
  { id: 14, title: "Pantai Perawan Pulau Pari", category: "Pulau", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800" },
  { id: 15, title: "Jembatan Cinta Pulau Tidung", category: "Pulau", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800" },
  { id: 16, title: "Diving Spot Pulau Weh", category: "Pulau", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800" },
  { id: 17, title: "Danau Ubur Ubur Derawan", category: "Pulau", image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800" },
  { id: 18, title: "Pantai Eksotis Tropis", category: "Pulau", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=800" },

  { id: 19, title: "Sawah Sembalun Pergasingan", category: "Bukit", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800" },
  { id: 20, title: "Bukit Teletubbies Nusa Penida", category: "Bukit", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800" },
  { id: 21, title: "Golden Sunrise Sikunir", category: "Bukit", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800" },
  { id: 22, title: "Bukit Holbung Danau Toba", category: "Bukit", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800" },
  { id: 23, title: "Puncak Bintang Bukit Moko", category: "Bukit", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800" },
  { id: 24, title: "Senja Di Atas Bukit", category: "Bukit", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800" }
];

document.addEventListener('DOMContentLoaded', () => {
  // Preloader Removal
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 400);
  }

  // Initialize AOS Animation
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }

  // Typing Effect for Hero Title
  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const words = ["Explore The Beauty of Indonesia", "Jelajahi Surga Alam Nusantara", "Petualangan Tak Terlupakan"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500;
      }

      setTimeout(type, speed);
    }
    type();
  }

  // Counter Animation
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = +counter.getAttribute('data-target');
          let count = 0;
          const speed = target / 60;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              setTimeout(updateCount, 25);
            } else {
              counter.innerText = target + "+";
            }
          };
          updateCount();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  // Parse URL Parameters for Category & Search
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('search');

  let activeCategory = 'All';
  let activeSearch = searchParam ? searchParam.trim().toLowerCase() : '';

  const filterButtons = document.querySelectorAll('.dest-filter-btn');

  // Check URL category parameter with case-insensitive matching
  if (categoryParam && filterButtons.length > 0) {
    const targetCatLower = categoryParam.trim().toLowerCase();
    let matchedBtn = null;

    filterButtons.forEach(btn => {
      const btnCat = (btn.getAttribute('data-category') || '').trim();
      if (btnCat.toLowerCase() === targetCatLower) {
        matchedBtn = btn;
      }
    });

    if (matchedBtn) {
      filterButtons.forEach(b => b.classList.remove('active'));
      matchedBtn.classList.add('active');
      activeCategory = matchedBtn.getAttribute('data-category');
    }
  }

  // Pre-fill search input if search parameter exists
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchParam) {
    searchInput.value = searchParam.trim();
  }

  // Render Destination Grid (Home / Destination Page)
  const destContainer = document.getElementById('destinationsGrid');
  if (destContainer) {
    renderDestinations(activeCategory, activeSearch);
  }

  // Category Filter Buttons Event Listener
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      const targetBtn = e.target.closest('.dest-filter-btn') || e.target;
      targetBtn.classList.add('active');
      const category = targetBtn.getAttribute('data-category');
      const currentSearch = searchInput ? searchInput.value.trim().toLowerCase() : '';
      renderDestinations(category, currentSearch);
    });
  });

  // Search Input Filter Event Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      const activeBtn = document.querySelector('.dest-filter-btn.active');
      const currentCategory = activeBtn ? activeBtn.getAttribute('data-category') : 'All';
      renderDestinations(currentCategory, query);
    });
  }
});


// Helper for Destination Persistence (localStorage + API)
function getDestinationsData() {
  const stored = localStorage.getItem('adventure_destinations');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  return window.dummyDestinations || [];
}

function saveDestinationsData(data) {
  window.dummyDestinations = data;
  localStorage.setItem('adventure_destinations', JSON.stringify(data));
}

// Render Destination Cards
async function renderDestinations(category = 'All', searchQuery = '') {
  const container = document.getElementById('destinationsGrid');
  if (!container) return;

  container.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-success" role="status"></div></div>';

  let list = [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/destinations`);
    if (res.ok) {
      list = await res.json();
    } else {
      list = getDestinationsData();
    }
  } catch (err) {
    list = getDestinationsData();
  }

  // Save to local for fallback consistency
  if (list && list.length > 0) {
    window.dummyDestinations = list;
  }

  // Apply Filter
  let filtered = list.filter(item => {
    const matchCat = (category === 'All' || item.category.toLowerCase() === category.toLowerCase());
    const matchSearch = item.name.toLowerCase().includes(searchQuery) || 
                        item.location.toLowerCase().includes(searchQuery) ||
                        item.category.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-compass fa-3x text-muted mb-3"></i>
        <h4 class="text-muted">Destinasi tidak ditemukan</h4>
        <p>Coba kata kunci pencarian atau kategori lain.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  filtered.forEach(item => {
    const cardHtml = `
      <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
        <div class="destination-card">
          <div class="destination-img-wrap">
            <img src="${item.image}" alt="${item.name}">
            <span class="badge-category">${item.category}</span>
            <span class="badge-price">${formatIDR(item.price)}</span>
          </div>
          <div class="destination-body">
            <h3 class="destination-title">${item.name}</h3>
            <p class="destination-location"><i class="fas fa-map-marker-alt text-danger me-1"></i> ${item.location}</p>
            <p class="small text-muted mb-3">${item.description ? item.description.substring(0, 85) + '...' : ''}</p>
            <div class="destination-meta">
              <span><i class="fas fa-clock me-1"></i> ${item.duration}</span>
              <span class="rating-stars"><i class="fas fa-star me-1"></i> ${item.rating}</span>
            </div>
            <div class="destination-actions">
              <button class="btn btn-card-detail" onclick="openDestinationModal('${item.id || item._id}')">Detail</button>
              <a href="booking.html?destination=${encodeURIComponent(item.name)}" class="btn btn-card-book">Book Trip</a>
            </div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHtml);
  });
}

// Open Detail Modal
function openDestinationModal(id) {
  const item = (window.dummyDestinations || []).find(d => d.id === id || d._id === id);
  if (!item) return;

  const modalHtml = `
    <div class="modal fade" id="destDetailModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content" style="border-radius: 20px; overflow: hidden; border: none;">
          <div class="position-relative">
            <img src="${item.image}" style="width:100%; height: 320px; object-fit: cover;" alt="${item.name}">
            <button type="button" class="lightbox-close-btn" data-bs-dismiss="modal" aria-label="Close" title="Tutup">
              <i class="fas fa-times"></i>
            </button>
            <div class="position-absolute bottom-0 start-0 p-4 text-white" style="background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); width: 100%;">
              <span class="badge bg-warning text-dark font-weight-bold mb-2">${item.category}</span>
              <h2 class="mb-0 text-white font-weight-bold">${item.name}</h2>
              <div><i class="fas fa-map-marker-alt me-2 text-danger"></i>${item.location}</div>
            </div>
          </div>
          <div class="modal-body p-4">
            <div class="row mb-3">
              <div class="col-6"><strong>Harga Paket:</strong> <span class="text-success font-weight-bold fs-5">${formatIDR(item.price)}</span> / org</div>
              <div class="col-6 text-end"><strong>Rating:</strong> <span class="text-warning"><i class="fas fa-star"></i> ${item.rating}</span></div>
            </div>
            <p class="text-muted fs-6 mb-4">${item.description}</p>
            <div class="p-3 bg-light rounded mb-4">
              <div class="row text-center fs-6">
                <div class="col-4">
                  <i class="fas fa-clock fa-2x text-success mb-2"></i>
                  <div><strong>Durasi:</strong> ${item.duration}</div>
                </div>
                <div class="col-4">
                  <i class="fas fa-shield-alt fa-2x text-success mb-2"></i>
                  <div><strong>Asuransi:</strong> Tercover</div>
                </div>
                <div class="col-4">
                  <i class="fas fa-user-shield fa-2x text-success mb-2"></i>
                  <div><strong>Guide:</strong> Profesional</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer p-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Tutup</button>
            <a href="booking.html?destination=${encodeURIComponent(item.name)}" class="btn btn-success px-4 font-weight-bold">Pesan Sekarang</a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const modalEl = document.getElementById('destDetailModal');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
  modalEl.addEventListener('hidden.bs.modal', () => modalEl.remove());
}
