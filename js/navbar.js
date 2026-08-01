/* ==================================================
   ADVENTURE TRAVEL INDONESIA - NAVBAR & AUTH SESSION JS
   ================================================== */

// Global User Auth Helpers
function getLoggedInUser() {
  const data = localStorage.getItem('adventure_user');
  if (data) {
    try { return JSON.parse(data); } catch (e) {}
  }
  return null;
}

function setLoggedInUser(user, token) {
  localStorage.setItem('adventure_user', JSON.stringify(user));
  if (token) localStorage.setItem('adventure_token', token);
}

function logoutUser() {
  localStorage.removeItem('adventure_user');
  localStorage.removeItem('adventure_token');
  alert('Anda telah berhasil keluar (Logout).');
  window.location.href = 'index.html';
}

function updateNavbarAuthUI() {
  const authNavContainer = document.getElementById('navbarAuthContainer');
  if (!authNavContainer) return;

  const user = getLoggedInUser();
  if (user) {
    let adminLink = '';
    if (user.role === 'admin') {
      adminLink = `<li><a class="dropdown-item text-success font-weight-bold" href="admin.html"><i class="fas fa-user-shield me-2"></i> Admin Dashboard</a></li>`;
    }

    authNavContainer.innerHTML = `
      <div class="dropdown ms-lg-3 my-2 my-lg-0">
        <button class="btn btn-outline-light dropdown-toggle font-weight-bold text-warning rounded-pill px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-user-circle me-1"></i> ${user.name}
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2">
          <li><div class="dropdown-header text-muted small">Halo, <strong>${user.name}</strong> (${user.role.toUpperCase()})</div></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="booking.html"><i class="fas fa-compass me-2 text-success"></i> Pesan Trip Baru</a></li>
          ${adminLink}
          <li><hr class="dropdown-divider"></li>
          <li><button class="dropdown-item text-danger font-weight-bold" onclick="logoutUser()"><i class="fas fa-sign-out-alt me-2"></i> Keluar / Logout</button></li>
        </ul>
      </div>
    `;
  } else {
    authNavContainer.innerHTML = `
      <a href="login.html" class="btn btn-warning font-weight-bold text-dark rounded-pill px-4 ms-lg-3 my-2 my-lg-0 shadow-sm">
        <i class="fas fa-sign-in-alt me-1"></i> Login / Register
      </a>
    `;
  }
}

// Role-Based Protection for Admin Panel
function checkAdminAccess() {
  const currentPath = window.location.pathname.split('/').pop();
  if (currentPath === 'admin.html') {
    if (sessionStorage.getItem('isAdminLoggedIn') !== 'true' && sessionStorage.getItem('adminLoggedIn') !== 'true') {
      window.location.href = 'login.html';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Check admin role permission on page load
  checkAdminAccess();

  // Render auth UI in navbar
  updateNavbarAuthUI();

  const navbar = document.querySelector('.navbar-custom');
  const backToTopBtn = document.getElementById('backToTop');

  // Handle Navbar Background Change on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
      backToTopBtn?.classList.add('show');
    } else {
      navbar?.classList.remove('scrolled');
      backToTopBtn?.classList.remove('show');
    }
  });

  // Smooth Scroll for Back To Top Button
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Active Link Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-custom .nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
