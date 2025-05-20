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
  details: {
    type: DataTypes.JSONB,
    defaultValue: {}
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