const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');
const User = require('./User'); // Import User model

const UserSession = sequelize.define('UserSession', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastActivity: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['token']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

// Define Association
UserSession.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user' // This alias must match the one used in controller includes
});

module.exports = UserSession; 