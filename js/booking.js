/* ==================================================
   ADVENTURE TRAVEL INDONESIA - BOOKING LOGIC
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('bookingForm');
  const destinationSelect = document.getElementById('destinationSelect');
  const participantsInput = document.getElementById('participantsInput');
  const summaryDestName = document.getElementById('summaryDestName');
  const summaryPricePerPerson = document.getElementById('summaryPricePerPerson');
  const summaryParticipants = document.getElementById('summaryParticipants');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');

  let currentPrice = 0;

  // Format currency helper
  function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Pre-select destination from URL query string if present
  const urlParams = new URLSearchParams(window.location.search);
  const selectedDestId = urlParams.get('destination') || urlParams.get('id');

  // Load destinations into select menu
  async function loadDestinationsSelect() {
    if (!destinationSelect) return;

    try {
      let data = [];
      const res = await fetch('/api/destinations');
      if (res.ok) {
        data = await res.json();
      } else {
        data = window.dummyDestinations || [];
      }

      destinationSelect.innerHTML = '<option value="">-- Pilih Destinasi Impianmu --</option>';
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item._id || item.id;
        option.textContent = `${item.name} (${item.category}) - ${formatIDR(item.price)}`;
        option.dataset.price = item.price;
        option.dataset.name = item.name;

        if (selectedDestId && (item._id === selectedDestId || item.id === selectedDestId || item.name.toLowerCase().includes(selectedDestId.toLowerCase()))) {
          option.selected = true;
          currentPrice = item.price;
          updateSummary(item.name, item.price);
        }

        destinationSelect.appendChild(option);
      });
    } catch (err) {
      console.warn('API error, using client fallback dataset for select dropdown', err);
      if (window.dummyDestinations) {
        destinationSelect.innerHTML = '<option value="">-- Pilih Destinasi Impianmu --</option>';
        window.dummyDestinations.forEach(item => {
          const option = document.createElement('option');
          option.value = item.id;
          option.textContent = `${item.name} (${item.category}) - ${formatIDR(item.price)}`;
          option.dataset.price = item.price;
          option.dataset.name = item.name;

          if (selectedDestId && (item.id === selectedDestId || item.name.toLowerCase().includes(selectedDestId.toLowerCase()))) {
            option.selected = true;
            currentPrice = item.price;
            updateSummary(item.name, item.price);
          }

          destinationSelect.appendChild(option);
        });
      }
    }
  }

  function updateSummary(name = '-', price = 0) {
    const qty = parseInt(participantsInput?.value || 1, 10);
    const total = price * qty;

    if (summaryDestName) summaryDestName.textContent = name;
    if (summaryPricePerPerson) summaryPricePerPerson.textContent = formatIDR(price);
    if (summaryParticipants) summaryParticipants.textContent = `${qty} Orang`;
    if (summaryTotalPrice) summaryTotalPrice.textContent = formatIDR(total);
  }

  // Auto-fill booking form disabled to keep input fields clean for all users
  function autofillUserData() {
    // Left empty per user request so fields start blank
  }

  // autofillUserData();


  destinationSelect?.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (selectedOption && selectedOption.dataset.price) {
      currentPrice = parseFloat(selectedOption.dataset.price);
      updateSummary(selectedOption.dataset.name, currentPrice);
    } else {
      currentPrice = 0;
      updateSummary('-', 0);
    }
  });

  participantsInput?.addEventListener('input', () => {
    const selectedOption = destinationSelect.options[destinationSelect.selectedIndex];
    const name = selectedOption ? selectedOption.dataset.name : '-';
    updateSummary(name, currentPrice);
  });

  loadDestinationsSelect();

  // Helper to save booking to LocalStorage for offline/local persistence
  function saveBookingToLocalStorage(booking) {
    let bookings = JSON.parse(localStorage.getItem('adventure_bookings') || '[]');
    const newBookingItem = {
      id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      _id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
      customerName: booking.customerName,
      email: booking.email,
      phone: booking.phone,
      destinationId: booking.destinationId,
      destinationName: booking.destinationName,
      travelDate: booking.travelDate,
      participants: booking.participants,
      totalPrice: booking.totalPrice,
      notes: booking.notes,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBookingItem);
    localStorage.setItem('adventure_bookings', JSON.stringify(bookings));
    return newBookingItem;
  }

  // Booking Form Submission
  bookingForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedOption = destinationSelect.options[destinationSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) {
      alert('Silakan pilih destinasi wisata terlebih dahulu!');
      return;
    }

    const bookingData = {
      customerName: document.getElementById('nameInput').value,
      email: document.getElementById('emailInput').value,
      phone: document.getElementById('phoneInput').value,
      destinationId: selectedOption.value,
      destinationName: selectedOption.dataset.name,
      travelDate: document.getElementById('dateInput').value,
      participants: parseInt(participantsInput.value, 10),
      totalPrice: currentPrice * parseInt(participantsInput.value, 10),
      notes: document.getElementById('notesInput')?.value || ''
    };

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses Pemesanan...';
    submitBtn.disabled = true;

    // Always save to LocalStorage for offline consistency
    const savedLocal = saveBookingToLocalStorage(bookingData);
    let finalBooking = { ...savedLocal, ...bookingData };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData && resData.booking) {
          finalBooking = resData.booking;
        }
      }
    } catch (err) {
      console.log('Backend sync offline, saved to LocalStorage.', err);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showSuccessModal(finalBooking);
      bookingForm.reset();
      updateSummary('-', 0);
    }
  });

  function showSuccessModal(data) {
    const bookingId = data.id || data._id || ('BK-' + Math.floor(100000 + Math.random() * 900000));
    const emojiHi = '\uD83D\uDC4B';        // 👋 (Waving Hand)

    const emojiMap = '\uD83D\uDDFA';       // 🗺️ (World Map)
    const emojiPalm = '\uD83C\uDF31';      // 🌱 (Seedling)
    const emojiBackpack = '\uD83C\uDF92';  // 🎒 (Backpack)
    const emojiDollar = '\uD83D\uDCB5';    // 💵 (Banknote)
    const emojiCheck = '\u2705';           // ✅ (Check Mark)
    const emojiSparkles = '\u2728';       // ✨ (Sparkles)

    const waText = `${emojiPalm} Halo Admin Adventure Travel Indonesia!\n\n` +
      `Saya ingin mengonfirmasi pesanan tiket/trip saya yang baru saja dibuat melalui website. Berikut adalah detail pemesanannya:\n\n` +
      `${emojiMap} *DETAIL PEMESANAN*\n` +
      `• ID Booking: ${bookingId}\n` +
      `• Nama Pemesan: ${data.customerName}\n` +
      `• Email: ${data.email || '-'}\n` +
      `• No. WhatsApp: ${data.phone || '-'}\n\n` +
      `${emojiBackpack} *DETAIL DESTINASI TRIP*\n` +
      `• Paket Wisata: ${data.destinationName}\n` +
      `• Tgl Berangkat: ${data.travelDate}\n` +
      `• Jumlah Peserta: ${data.participants} Orang\n` +
      `${emojiDollar} Total Biaya: ${formatIDR(data.totalPrice)}\n` +
      `• Catatan Khusus: ${data.notes || '-'}\n\n` +
      `Mohon bantuan untuk proses verifikasi dan petunjuk pembayaran/pemberangkatan selanjutnya ya, Min. Terima kasih! ${emojiSparkles}`;

    const waLink = `https://api.whatsapp.com/send?phone=6289517846680&text=${encodeURIComponent(waText)}`;





    const modalHtml = `
      <div class="modal fade" id="bookingSuccessModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content rounded-4 border-0 overflow-hidden shadow-lg">
            <div class="modal-header bg-success text-white p-4">
              <h5 class="modal-title font-weight-bold"><i class="fas fa-check-circle me-2"></i> Pemesanan Berhasil Disimpan!</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4 text-center">
              <i class="fas fa-paper-plane fa-4x text-success mb-3 animate__animated animate__bounceIn"></i>
              <h3 class="font-weight-bold text-dark mb-1">Terima Kasih, ${data.customerName}!</h3>
              <p class="text-muted mb-3">Pesanan paket trip Anda telah berhasil masuk ke sistem kami.</p>
              
              <div class="d-inline-block mb-3">
                <span class="badge bg-dark text-warning font-monospace fs-6 px-4 py-2 rounded-pill shadow-sm">
                  <i class="fas fa-ticket-alt me-2"></i>ID BOOKING: ${bookingId}
                </span>
              </div>

              <div class="p-4 bg-light rounded-4 text-start fs-6 border border-light mb-4 shadow-sm">
                <div class="row g-2">
                  <div class="col-md-6"><strong><i class="fas fa-user text-success me-2"></i>Nama Pemesan:</strong> ${data.customerName}</div>
                  <div class="col-md-6"><strong><i class="fas fa-envelope text-success me-2"></i>Email:</strong> ${data.email}</div>
                  <div class="col-md-6"><strong><i class="fab fa-whatsapp text-success me-2"></i>No. WhatsApp:</strong> ${data.phone}</div>
                  <div class="col-md-6"><strong><i class="fas fa-map-marker-alt text-success me-2"></i>Destinasi:</strong> ${data.destinationName}</div>
                  <div class="col-md-6"><strong><i class="fas fa-calendar-alt text-success me-2"></i>Tanggal Berangkat:</strong> ${data.travelDate}</div>
                  <div class="col-md-6"><strong><i class="fas fa-users text-success me-2"></i>Jumlah Peserta:</strong> ${data.participants} Orang</div>
                  <div class="col-md-6"><strong><i class="fas fa-wallet text-success me-2"></i>Total Biaya:</strong> <span class="text-success font-weight-bold">${formatIDR(data.totalPrice)}</span></div>
                  <div class="col-md-6"><strong><i class="fas fa-info-circle text-success me-2"></i>Status Pemesanan:</strong> <span class="badge bg-warning text-dark px-2 py-1">${data.status || 'Pending'}</span></div>
                  ${data.notes ? `<div class="col-12 mt-2 pt-2 border-top"><strong><i class="fas fa-sticky-note text-success me-2"></i>Catatan Khusus:</strong> <em>"${data.notes}"</em></div>` : ''}
                </div>
              </div>

              <div class="alert alert-info py-2 fs-6 mb-0">
                <i class="fas fa-info-circle me-1"></i> Klik tombol hijau di bawah untuk konfirmasi pesanan langsung ke Admin via WhatsApp.
              </div>
            </div>

            <div class="modal-footer p-4 bg-light justify-content-between">
              <button type="button" class="btn btn-secondary px-4 font-weight-bold rounded-pill" data-bs-dismiss="modal">Tutup & Eksplor Lainnya</button>
              <a href="${waLink}" target="_blank" class="btn btn-success px-4 py-2 font-weight-bold rounded-pill shadow-lg" style="background-color: #25D366; border: none;">
                <i class="fab fa-whatsapp fa-lg me-2"></i> Konfirmasi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('bookingSuccessModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    modalEl.addEventListener('hidden.bs.modal', () => modalEl.remove());
  }
});

