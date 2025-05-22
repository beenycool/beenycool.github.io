const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const ActivityLog = sequelize.define('ActivityLog', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  actionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: { // Added username field
    type: DataTypes.STRING,
    allowNull: true // Allow null if the action is not user-specific or user is deleted
  },
  actionDetails: { // Renamed from details
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  performedAt: { // Added performedAt field
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Association will be set up in a separate function to avoid circular dependencies
ActivityLog.associate = function(models) {
  ActivityLog.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = ActivityLog; 