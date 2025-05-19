const mongoose = require('mongoose');

const ScreenCaptureSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  imageData: {
    type: String, // Base64 encoded image data
    required: true
  },
  pageUrl: {
    type: String
  },
  eventTriggered: {
    type: String,
    enum: ['periodic', 'click', 'input', 'navigation', 'other'],
    default: 'periodic'
  },
  elementInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  _id: true
});

const UserSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  browser: {
    type: String
  },
  operatingSystem: {
    type: String
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  pagesVisited: [{
    url: String,
    title: String,
    visitTime: Date,
    duration: Number // in seconds
  }],
  events: [{
    type: String,
    timestamp: Date,
    details: mongoose.Schema.Types.Mixed
  }],
  screenCaptures: [ScreenCaptureSchema],
  // Stats
  totalClicks: {
    type: Number,
    default: 0
  },
  totalKeyPresses: {
    type: Number,
    default: 0
  },
  mouseMovementHeatmap: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient querying
UserSessionSchema.index({ user: 1, startTime: -1 });
UserSessionSchema.index({ isActive: 1 });
UserSessionSchema.index({ ipAddress: 1 });

// Methods to add events and screen captures
UserSessionSchema.methods.addEvent = function(eventType, details = {}) {
  this.events.push({
    type: eventType,
    timestamp: new Date(),
    details
  });
  return this.save();
};

UserSessionSchema.methods.addScreenCapture = function(captureData) {
  // Limit the number of screen captures to prevent large documents
  const MAX_CAPTURES = 50; // Adjust based on your needs
  
  if (this.screenCaptures.length >= MAX_CAPTURES) {
    // Remove the oldest capture if limit reached
    this.screenCaptures.shift();
  }
  
  this.screenCaptures.push(captureData);
  return this.save();
};

UserSessionSchema.methods.endSession = function() {
  this.isActive = false;
  this.endTime = new Date();
  return this.save();
};

// Static method to find active session by user
UserSessionSchema.statics.findActiveSessionByUser = function(userId) {
  return this.findOne({ user: userId, isActive: true });
};

module.exports = mongoose.model('UserSession', UserSessionSchema); 