const Destination = require('../models/Destination');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

const getDestinations = async (req, res) => {
  try {
    const { category, search } = req.query;
    let whereClause = {};

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (search) {
      const likeOp = sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;
      whereClause[Op.or] = [
        { name: { [likeOp]: `%${search}%` } },
        { location: { [likeOp]: `%${search}%` } }
      ];
    }


    const destinations = await Destination.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data destinasi', error: err.message });
  }
};

const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destinasi tidak ditemukan' });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: 'Error mengambil destinasi', error: err.message });
  }
};

const createDestination = async (req, res) => {
  try {
    const { name, category, location, price, rating, duration, description, featured } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const newDest = await Destination.create({
      name,
      category,
      location,
      price: Number(price),
      rating: rating ? parseFloat(rating) : 4.8,
      duration: duration || '1 Hari',
      image: image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
      description: description || '',
      featured: featured === 'true' || featured === true
    });

    res.status(201).json({ message: 'Destinasi berhasil ditambahkan', destination: newDest });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambahkan destinasi', error: err.message });
  }
};

const updateDestination = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const destination = await Destination.findByPk(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destinasi tidak ditemukan' });

    await destination.update(updateData);
    res.json({ message: 'Destinasi berhasil diperbarui', destination });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update destinasi', error: err.message });
  }
};

const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destinasi tidak ditemukan' });

    await destination.destroy();
    res.json({ message: 'Destinasi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus destinasi', error: err.message });
  }
};

module.exports = {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};
