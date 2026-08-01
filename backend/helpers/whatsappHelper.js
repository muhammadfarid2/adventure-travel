/**
 * Helper WhatsApp Message Generator & Link Formatter
 * Full UTF-8 Encoding for iOS, Android, and Laptop Compatibility
 */

function formatIDR(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

function cleanPhoneNumber(phone) {
  let clean = String(phone || '').replace(/\D/g, '');
  if (clean.startsWith('0')) clean = '62' + clean.substring(1);
  if (!clean.startsWith('62')) clean = '62' + clean;
  return clean;
}

/**
 * Generate WhatsApp Detail Confirmation Message
 * Exactly matches user requirements with full UTF-8 emojis
 */
function generateWhatsAppDetailMessage(booking) {
  const customerName = booking.customerName || 'Pelanggan';
  const email = booking.email || '-';
  const phone = booking.phone || '-';
  const bookingId = booking.id || booking._id || '-';
  const destinationName = booking.destinationName || booking.destination || '-';
  const travelDate = booking.travelDate || '-';
  const participants = booking.participants || 1;
  const totalPriceFormatted = formatIDR(booking.totalPrice || 0);
  const status = booking.status || 'Pending';
  const notes = booking.notes ? booking.notes : 'Tidak ada catatan khusus.';

  const approveText = encodeURIComponent(`Halo Admin, saya menyetujui pemesanan ID ${bookingId}`);
  const approveUrl = `https://wa.me/6289517846680?text=${approveText}`;

  return `👋 *Halo Kak ${customerName}!*

Kami dari Admin *Adventure Travel Indonesia* ingin mengonfirmasi pesanan tiket/trip Anda:

📋 *DETAIL PEMESANAN*
• ID Booking: ${bookingId}
• Nama Pemesan: ${customerName}
• Email: ${email}
• No. WhatsApp: ${phone}

🏝️ *DETAIL DESTINASI TRIP*
• Paket Wisata: ${destinationName}
• Tgl Berangkat: ${travelDate}
• Jumlah Peserta: ${participants} Orang
💰 *Total Biaya: ${totalPriceFormatted}*
• Status: ${status}
• Catatan Khusus: ${notes}

💬 *Halo Kak, pesanan Anda telah kami verifikasi.*
Silakan klik link di bawah ini untuk menyetujui & menerima instruksi pembayaran:

[Setujui & Lanjut Pembayaran] -> ${approveUrl}`;
}

/**
 * Generate WhatsApp Approved (ACC) Notification Message
 */
function generateWhatsAppApprovedMessage(booking) {
  const customerName = booking.customerName || 'Pelanggan';
  const bookingId = booking.id || booking._id || '-';
  const destinationName = booking.destinationName || booking.destination || '-';
  const travelDate = booking.travelDate || '-';
  const participants = booking.participants || 1;
  const totalPriceFormatted = formatIDR(booking.totalPrice || 0);

  return `🎉 *KABAR GEMBIRA! PEMESANAN ANDA DISETUJUI (ACC)* 🎉

Halo Kak *${customerName}*, pemesanan trip Anda di *Adventure Travel Indonesia* telah diverifikasi dan disetujui oleh Admin!

🗺️ *DETAIL PEMESANAN APPROVED*
• ID Booking: ${bookingId}
• Paket Wisata: ${destinationName}
• Tgl Berangkat: ${travelDate}
• Jumlah Peserta: ${participants} Orang
• Total Biaya: ${totalPriceFormatted}
• Status: ✅ APPROVED / DISETUJUI

💳 *INSTRUKSI SELANJUTNYA:*
Silakan lakukan pembayaran DP/Pelunasan ke rekening resmi kami:
• *SeaBank:* 901151723579 a/n PT Adventure Travel
• *Bank BCA:* 123-456-7890 a/n PT Adventure Travel
• *Bank Mandiri:* 098-765-4321 a/n PT Adventure Travel

Setelah melakukan transfer, mohon kirimkan foto bukti transfer ke chat ini ya Kak. Terima kasih! ✨`;
}

/**
 * Helper to generate full WhatsApp Deep-Link URL
 */
function getWhatsAppDeepLink(phone, messageText) {
  const cleanPhone = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

module.exports = {
  formatIDR,
  cleanPhoneNumber,
  generateWhatsAppDetailMessage,
  generateWhatsAppApprovedMessage,
  getWhatsAppDeepLink
};
