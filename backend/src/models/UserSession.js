const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const UserSession = sequelize.define('UserSession', {
  sessionId: { // Added sessionId field
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  token: { // This is likely the JWT token itself, sessionId is a separate identifier
    type: DataTypes.STRING(512), // Increased length for potentially longer tokens
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
  startTime: { // Added startTime field
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endTime: { // Added endTime field
    type: DataTypes.DATE,
    allowNull: true
  },
  lastActivity: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true, // Keeps createdAt and updatedAt
  indexes: [
    {
      fields: ['sessionId'] // Added index for sessionId
    },
    {
      fields: ['userId']
    },
    {
      fields: ['token']
    },
    {
      fields: ['expiresAt']
    },
    {
      fields: ['isActive'] // Index for isActive queries
    }
  ]
});

// Association will be set up in a separate function to avoid circular dependencies
UserSession.associate = function(models) {
  UserSession.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = UserSession; 