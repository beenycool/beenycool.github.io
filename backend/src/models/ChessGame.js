const mongoose = require('mongoose');

const MoveSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  piece: {
    type: String,
    required: true
  },
  promotion: {
    type: String,
    default: null
  },
  wasPreMove: {
    type: Boolean,
    default: false
  },
  capturedPiece: {
    type: String,
    default: null
  },
  san: { // Standard Algebraic Notation
    type: String
  },
  isCheck: {
    type: Boolean,
    default: false
  },
  isCheckmate: {
    type: Boolean,
    default: false
  },
  timeSpent: { // Time spent thinking about the move in seconds
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  fen: { // Position after move
    type: String
  }
});

const ChessGameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  players: {
    white: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String,
      rating: { type: Number, default: 1200 },
      ratingChange: { type: Number, default: 0 }
    },
    black: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
      },
      username: String,
      rating: { type: Number, default: 1200 },
      ratingChange: { type: Number, default: 0 }
    }
  },
  spectators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    joinedAt: Date,
    leftAt: Date
  }],
  timeControl: {
    initial: { type: Number, default: 600 }, // seconds
    increment: { type: Number, default: 5 }, // seconds
    timeLeft: {
      white: { type: Number, default: 600 },
      black: { type: Number, default: 600 }
    }
  },
  moves: [MoveSchema],
  chat: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isSystem: {
      type: Boolean,
      default: false
    }
  }],
  result: {
    type: String,
    enum: ['1-0', '0-1', '1/2-1/2', '*'], // white win, black win, draw, ongoing
    default: '*'
  },
  termination: {
    type: String,
    enum: [
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
    ],
    default: 'unterminated'
  },
  startPosition: {
    type: String,
    default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' // Standard start position
  },
  finalPosition: {
    type: String
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  isRated: {
    type: Boolean,
    default: true
  },
  preMoves: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    from: String,
    to: String,
    promotion: String,
    timestamp: Date
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
// Removing duplicate gameId index since it's already defined as unique in the schema
ChessGameSchema.index({ 'players.white.user': 1, startTime: -1 });
ChessGameSchema.index({ 'players.black.user': 1, startTime: -1 });
ChessGameSchema.index({ result: 1, startTime: -1 });
ChessGameSchema.index({ isRated: 1, startTime: -1 });

// Method to add a move
ChessGameSchema.methods.addMove = function(moveData) {
  this.moves.push(moveData);
  return this.save();
};

// Method to add a pre-move
ChessGameSchema.methods.addPreMove = function(userId, from, to, promotion = null) {
  this.preMoves.push({
    user: userId,
    from,
    to,
    promotion,
    timestamp: new Date()
  });
  return this.save();
};

// Method to clear pre-moves for a user
ChessGameSchema.methods.clearPreMoves = function(userId) {
  this.preMoves = this.preMoves.filter(move => move.user.toString() !== userId.toString());
  return this.save();
};

// Method to add chat message
ChessGameSchema.methods.addChatMessage = function(user, username, message, isSystem = false) {
  this.chat.push({
    user,
    username,
    message,
    timestamp: new Date(),
    isSystem
  });
  return this.save();
};

// Method to end the game
ChessGameSchema.methods.endGame = function(result, termination, finalPosition) {
  this.result = result;
  this.termination = termination;
  this.finalPosition = finalPosition;
  this.endTime = new Date();
  return this.save();
};

module.exports = mongoose.model('ChessGame', ChessGameSchema); 