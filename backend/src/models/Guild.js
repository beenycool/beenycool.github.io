const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');

const Guild = sequelize.define('Guild', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  admins: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: []
  },
  members: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  stats: {
    type: DataTypes.JSONB,
    defaultValue: {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      averageRating: 1200
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  settings: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['ownerId']
    }
  ]
});

// Association will be set up in a separate function to avoid circular dependencies
Guild.associate = function(models) {
  Guild.belongsTo(models.User, {
    foreignKey: 'ownerId',
    as: 'owner'
  });
};

// Instance method to recalculate stats
Guild.prototype.recalculateStats = async function() {
  const User = sequelize.models.User;
  
  try {
    // Get all guild members
    const memberIds = this.members;
    
    if (!memberIds || memberIds.length === 0) {
      return this.save();
    }
    
    // Get user data for all members
    const members = await User.findAll({
      where: {
        id: memberIds
      }
    });
    
    // Calculate average rating
    let totalRating = 0;
    members.forEach(member => {
      totalRating += member.chessRating || 1200;
    });
    
    const averageRating = members.length > 0 ? Math.round(totalRating / members.length) : 1200;
    
    // Update stats
    const stats = this.stats || {};
    stats.averageRating = averageRating;
    stats.memberCount = members.length;
    
    this.stats = stats;
    return this.save();
  } catch (error) {
    console.error('Error recalculating guild stats:', error);
    return this;
  }
};

module.exports = Guild; 