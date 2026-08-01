const Gallery = require('../models/Gallery');

const getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    let whereClause = {};
    if (category && category !== 'All') whereClause.category = category;

    const items = await Gallery.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil galeri', error: err.message });
  }
};

const createGallery = async (req, res) => {
  try {
    const { title, category } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    const item = await Gallery.create({ title, category, image });
    res.status(201).json({ message: 'Foto galeri berhasil ditambahkan', item });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah foto galeri', error: err.message });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Foto tidak ditemukan' });

    await item.destroy();
    res.json({ message: 'Foto galeri berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus foto galeri', error: err.message });
  }
};

module.exports = { getGallery, createGallery, deleteGallery };
