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
  players: {
    type: DataTypes.JSONB,
    defaultValue: {
      white: {
        userId: null,
        username: null,
        rating: 1200,
        ratingChange: 0
      },
      black: {
        userId: null,
        username: null,
        rating: 1200,
        ratingChange: 0
      }
    }
  },
  spectators: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  timeControl: {
    type: DataTypes.JSONB,
    defaultValue: {
      initial: 600, // seconds
      increment: 5, // seconds
      timeLeft: {
        white: 600,
        black: 600
      }
    }
  },
  moves: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  chat: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  result: {
    type: DataTypes.ENUM('1-0', '0-1', '1/2-1/2', '*'),
    defaultValue: '*' // white win, black win, draw, ongoing
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