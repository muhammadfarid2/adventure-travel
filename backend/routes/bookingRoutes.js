const express = require('express');
const router = express.Router();
const { getBookings, createBooking, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');

router.get('/', getBookings);
router.post('/', createBooking);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

module.exports = router;
