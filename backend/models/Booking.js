const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destinationId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  destinationName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  travelDate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  participants: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Cancelled'),
    defaultValue: 'Pending'
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  timestamps: true,
  tableName: 'bookings'
});

module.exports = Booking;
