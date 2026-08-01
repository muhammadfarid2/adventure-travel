const Review = require('../models/Review');

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [['createdAt', 'DESC']] });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil ulasan', error: err.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { name, photo, rating, comment, destinationName } = req.body;
    const review = await Review.create({
      name,
      photo: photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
      rating: Number(rating) || 5,
      comment,
      destinationName: destinationName || 'Wisata Alam'
    });
    res.status(201).json({ message: 'Ulasan berhasil dikirim', review });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah ulasan', error: err.message });
  }
};

module.exports = { getReviews, createReview };
