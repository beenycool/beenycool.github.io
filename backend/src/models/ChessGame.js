const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/config');
const { v4: uuidv4 } = require('uuid');

const ChessGame = sequelize.define('ChessGame', {
  gameId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: () => uuidv4()
  },
  whitePlayerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  blackPlayerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pgn: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  result: {
    type: DataTypes.STRING,
    allowNull: true
  },
  timeControl: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  moves: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  chat: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  termination: {
    type: DataTypes.ENUM(
      'checkmate', 
      'resignation', 
      'timeout', 
      'stalemate', 
      'insufficient_material',
      'threefold_repetition', 
      'fifty_move_rule', 
      'agreement',
      'abandoned',
      'unterminated'
    ),
    defaultValue: 'unterminated'
  },
  startPosition: {
    type: DataTypes.STRING,
    defaultValue: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' // Standard start position
  },
  finalPosition: {
    type: DataTypes.STRING
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endTime: {
    type: DataTypes.DATE
  },
  isRated: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  preMoves: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['gameId']
    },
    {
      fields: ['result', 'startTime']
    },
    {
      fields: ['isRated', 'startTime']
    }
  ]
});

// Association will be set up in a separate function to avoid circular dependencies
ChessGame.associate = function(models) {
  ChessGame.belongsTo(models.User, {
    foreignKey: 'whitePlayerId',
    as: 'whitePlayer'
  });
  
  ChessGame.belongsTo(models.User, {
    foreignKey: 'blackPlayerId',
    as: 'blackPlayer'
  });
};

// Instance methods
ChessGame.prototype.addMove = function(moveData) {
  const moves = this.moves || [];
  moves.push(moveData);
  this.moves = moves;
  return this.save();
};

ChessGame.prototype.addPreMove = function(userId, from, to, promotion = null) {
  const preMoves = this.preMoves || [];
  preMoves.push({
    userId,
    from,
    to,
    promotion,
    timestamp: new Date()
  });
  this.preMoves = preMoves;
  return this.save();
};

ChessGame.prototype.clearPreMoves = function(userId) {
  if (!this.preMoves) return this.save();
  this.preMoves = this.preMoves.filter(move => move.userId !== userId);
  return this.save();
};

ChessGame.prototype.addChatMessage = function(user, username, message, isSystem = false) {
  const chat = this.chat || [];
  chat.push({
    userId: user,
    username,
    message,
    timestamp: new Date(),
    isSystem
  });
  this.chat = chat;
  return this.save();
};

ChessGame.prototype.endGame = function(result, termination, finalPosition) {
  this.result = result;
  this.termination = termination;
  this.finalPosition = finalPosition;
  this.endTime = new Date();
  return this.save();
};

module.exports = ChessGame; 