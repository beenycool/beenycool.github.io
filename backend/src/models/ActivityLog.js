const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  actionType: {
    type: String,
    enum: [
      'login', 
      'logout', 
      'register', 
      'chess_game_start', 
      'chess_game_end', 
      'chess_move',
      'todo_create', 
      'todo_complete', 
      'todo_delete',
      'gcse_submission',
      'guild_create',
      'guild_join',
      'guild_leave',
      'password_change',
      'admin_action',
      'other'
    ],
    required: true
  },
  actionDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  pageUrl: {
    type: String
  },
  referrerUrl: {
    type: String
  },
  performedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying by date and user
ActivityLogSchema.index({ performedAt: -1 });
ActivityLogSchema.index({ user: 1, performedAt: -1 });
ActivityLogSchema.index({ actionType: 1, performedAt: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema); 