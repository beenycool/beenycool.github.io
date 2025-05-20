const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const ActivityLog = sequelize.define('ActivityLog', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  actionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  actionDetails: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  performedAt: {
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
      fields: ['actionType']
    },
    {
      fields: ['performedAt']
    }
  ]
});

module.exports = ActivityLog; 