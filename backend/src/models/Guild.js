const mongoose = require('mongoose');

const GuildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  founder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  officers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  icon: {
    type: String,
    default: 'default_guild.png'
  },
  stats: {
    totalWins: { type: Number, default: 0 },
    totalGames: { type: Number, default: 0 },
    averageRating: { type: Number, default: 1200 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to set the founder as the first member and officer
GuildSchema.pre('save', function(next) {
  if (this.isNew) {
    // Add founder as member if not already added
    if (!this.members.includes(this.founder)) {
      this.members.push(this.founder);
    }
    
    // Add founder as officer if not already added
    if (!this.officers.includes(this.founder)) {
      this.officers.push(this.founder);
    }
  }
  next();
});

// Method to recalculate average rating
GuildSchema.methods.recalculateStats = async function() {
  const User = mongoose.model('User');
  
  // Find all members and their ratings
  const members = await User.find({ _id: { $in: this.members } });
  
  // Calculate average rating
  if (members.length > 0) {
    const totalRating = members.reduce((sum, member) => sum + member.chessRating, 0);
    this.stats.averageRating = Math.round(totalRating / members.length);
  }
  
  return this.save();
};

module.exports = mongoose.model('Guild', GuildSchema); 