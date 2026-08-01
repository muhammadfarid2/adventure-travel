const express = require('express');
const router = express.Router();
const { getGallery, createGallery, deleteGallery } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getGallery);
router.post('/', protect, adminOnly, upload.single('image'), createGallery);
router.delete('/:id', protect, adminOnly, deleteGallery);

module.exports = router;
