const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.TEXT,
    defaultValue: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  destinationName: {
    type: DataTypes.STRING,
    defaultValue: 'Wisata Alam'
  }
}, {
  timestamps: true,
  tableName: 'reviews'
});

module.exports = Review;
