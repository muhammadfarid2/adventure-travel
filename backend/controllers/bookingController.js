const Booking = require('../models/Booking');
const {
  generateWhatsAppDetailMessage,
  generateWhatsAppApprovedMessage,
  getWhatsAppDeepLink
} = require('../helpers/whatsappHelper');

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data booking', error: err.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const { customerName, email, phone, destinationId, destinationName, travelDate, participants, totalPrice, notes } = req.body;

    if (!customerName || !email || !phone || !destinationName || !travelDate) {
      return res.status(400).json({ message: 'Lengkapi seluruh data booking yang diperlukan.' });
    }

    const booking = await Booking.create({
      customerName,
      email,
      phone,
      destinationId: destinationId || 'custom',
      destinationName,
      travelDate,
      participants: Number(participants) || 1,
      totalPrice: Number(totalPrice) || 0,
      notes: notes || '',
      status: 'Pending'
    });

    const waMessage = generateWhatsAppDetailMessage(booking);
    const whatsappUrl = getWhatsAppDeepLink('6289517846680', waMessage);

    res.status(201).json({
      message: 'Booking berhasil dibuat',
      booking,
      whatsappMessage: waMessage,
      whatsappUrl
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat booking', error: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });

    await booking.update({ status });

    let waMessage = '';
    let whatsappUrl = '';
    if (status === 'Approved') {
      waMessage = generateWhatsAppApprovedMessage(booking);
      whatsappUrl = getWhatsAppDeepLink(booking.phone, waMessage);
    } else {
      waMessage = generateWhatsAppDetailMessage(booking);
      whatsappUrl = getWhatsAppDeepLink(booking.phone, waMessage);
    }

    res.json({
      message: 'Status booking diperbarui',
      booking,
      whatsappMessage: waMessage,
      whatsappUrl
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update status booking', error: err.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' });

    await booking.destroy();
    res.json({ message: 'Booking berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus booking', error: err.message });
  }
};

module.exports = { getBookings, createBooking, updateBookingStatus, deleteBooking };
