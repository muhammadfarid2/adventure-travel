const express = require('express');
const router = express.Router();
const {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.post('/', protect, adminOnly, upload.single('image'), createDestination);
router.put('/:id', protect, adminOnly, upload.single('image'), updateDestination);
router.delete('/:id', protect, adminOnly, deleteDestination);

module.exports = router;
