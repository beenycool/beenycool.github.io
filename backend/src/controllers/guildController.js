const Guild = require('../models/Guild');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Create a new guild
exports.createGuild = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    
    // Check if guild name already exists
    const existingGuild = await Guild.findOne({ name });
    if (existingGuild) {
      return res.status(400).json({ success: false, message: 'Guild name already exists' });
    }
    
    // Check if user is already in a guild
    const user = await User.findById(userId);
    if (user.guild) {
      return res.status(400).json({ success: false, message: 'You are already a member of a guild' });
    }
    
    // Create the guild
    const guild = await Guild.create({
      name,
      description,
      founder: userId
    });
    
    // Update user's guild association
    user.guild = guild._id;
    await user.save();
    
    // Log activity
    await ActivityLog.create({
      user: userId,
      username: req.user.username,
      actionType: 'guild_create',
      actionDetails: {
        guildId: guild._id,
        guildName: name
      },
      performedAt: new Date()
    });
    
    res.status(201).json({
      success: true,
      message: 'Guild created successfully',
      guild
    });
  } catch (error) {
    console.error('Create guild error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all guilds with pagination
exports.getAllGuilds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const guilds = await Guild.find()
      .populate('founder', 'username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const totalGuilds = await Guild.countDocuments();
    
    res.status(200).json({
      success: true,
      count: guilds.length,
      total: totalGuilds,
      totalPages: Math.ceil(totalGuilds / limit),
      currentPage: page,
      guilds
    });
  } catch (error) {
    console.error('Get all guilds error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get guild by ID
exports.getGuildById = async (req, res) => {
  try {
    const guildId = req.params.id;
    
    const guild = await Guild.findById(guildId)
      .populate('founder', 'username')
      .populate('members', 'username chessRating')
      .populate('officers', 'username');
    
    if (!guild) {
      return res.status(404).json({ success: false, message: 'Guild not found' });
    }
    
    res.status(200).json({
      success: true,
      guild
    });
  } catch (error) {
    console.error('Get guild by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update guild
exports.updateGuild = async (req, res) => {
  try {
    const guildId = req.params.id;
    const { description, icon } = req.body;
    
    // Find guild
    const guild = await Guild.findById(guildId);
    
    if (!guild) {
      return res.status(404).json({ success: false, message: 'Guild not found' });
    }
    
    // Check if user is founder or officer
    const isFounder = guild.founder.toString() === req.user.id;
    const isOfficer = guild.officers.some(officer => officer.toString() === req.user.id);
    
    if (!isFounder && !isOfficer) {
      return res.status(403).json({ success: false, message: 'Not authorized to update guild' });
    }
    
    // Update fields
    if (description) guild.description = description;
    if (icon) guild.icon = icon;
    
    await guild.save();
    
    res.status(200).json({
      success: true,
      message: 'Guild updated successfully',
      guild
    });
  } catch (error) {
    console.error('Update guild error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Join a guild
exports.joinGuild = async (req, res) => {
  try {
    const guildId = req.params.id;
    const userId = req.user.id;
    
    // Find guild
    const guild = await Guild.findById(guildId);
    
    if (!guild) {
      return res.status(404).json({ success: false, message: 'Guild not found' });
    }
    
    // Check if user is already in a guild
    const user = await User.findById(userId);
    if (user.guild) {
      return res.status(400).json({ success: false, message: 'You are already a member of a guild' });
    }
    
    // Add user to guild members
    if (!guild.members.includes(userId)) {
      guild.members.push(userId);
    }
    
    await guild.save();
    
    // Update user's guild association
    user.guild = guild._id;
    await user.save();
    
    // Recalculate guild stats
    await guild.recalculateStats();
    
    // Log activity
    await ActivityLog.create({
      user: userId,
      username: req.user.username,
      actionType: 'guild_join',
      actionDetails: {
        guildId: guild._id,
        guildName: guild.name
      },
      performedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Joined guild successfully',
      guild
    });
  } catch (error) {
    console.error('Join guild error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Leave a guild
exports.leaveGuild = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user.guild) {
      return res.status(400).json({ success: false, message: 'You are not a member of any guild' });
    }
    
    // Find guild
    const guild = await Guild.findById(user.guild);
    
    if (!guild) {
      // If guild doesn't exist, just remove association from user
      user.guild = null;
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: 'Left guild successfully'
      });
    }
    
    // Check if user is the founder
    if (guild.founder.toString() === userId) {
      return res.status(400).json({ success: false, message: 'Founders cannot leave their guild. Transfer ownership first.' });
    }
    
    // Remove user from guild
    guild.members = guild.members.filter(member => member.toString() !== userId);
    guild.officers = guild.officers.filter(officer => officer.toString() !== userId);
    
    await guild.save();
    
    // Remove guild association from user
    user.guild = null;
    await user.save();
    
    // Recalculate guild stats
    await guild.recalculateStats();
    
    // Log activity
    await ActivityLog.create({
      user: userId,
      username: req.user.username,
      actionType: 'guild_leave',
      actionDetails: {
        guildId: guild._id,
        guildName: guild.name
      },
      performedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Left guild successfully'
    });
  } catch (error) {
    console.error('Leave guild error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Promote member to officer
exports.promoteMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const userId = req.user.id;
    
    // Find user's guild
    const user = await User.findById(userId);
    
    if (!user.guild) {
      return res.status(400).json({ success: false, message: 'You are not a member of any guild' });
    }
    
    // Find guild
    const guild = await Guild.findById(user.guild);
    
    // Check if user is founder
    if (guild.founder.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Only the founder can promote members' });
    }
    
    // Check if member exists and is a member of the guild
    if (!guild.members.some(member => member.toString() === memberId)) {
      return res.status(400).json({ success: false, message: 'User is not a member of this guild' });
    }
    
    // Check if already an officer
    if (guild.officers.some(officer => officer.toString() === memberId)) {
      return res.status(400).json({ success: false, message: 'User is already an officer' });
    }
    
    // Add member to officers
    guild.officers.push(memberId);
    await guild.save();
    
    res.status(200).json({
      success: true,
      message: 'Member promoted to officer successfully',
      guild
    });
  } catch (error) {
    console.error('Promote member error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Demote officer to regular member
exports.demoteOfficer = async (req, res) => {
  try {
    const { officerId } = req.body;
    const userId = req.user.id;
    
    // Find user's guild
    const user = await User.findById(userId);
    
    if (!user.guild) {
      return res.status(400).json({ success: false, message: 'You are not a member of any guild' });
    }
    
    // Find guild
    const guild = await Guild.findById(user.guild);
    
    // Check if user is founder
    if (guild.founder.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Only the founder can demote officers' });
    }
    
    // Check if user is actually an officer
    if (!guild.officers.some(officer => officer.toString() === officerId)) {
      return res.status(400).json({ success: false, message: 'User is not an officer of this guild' });
    }
    
    // Remove from officers
    guild.officers = guild.officers.filter(officer => officer.toString() !== officerId);
    await guild.save();
    
    res.status(200).json({
      success: true,
      message: 'Officer demoted successfully',
      guild
    });
  } catch (error) {
    console.error('Demote officer error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Transfer guild ownership
exports.transferOwnership = async (req, res) => {
  try {
    const { newFounderId } = req.body;
    const userId = req.user.id;
    
    // Find user's guild
    const user = await User.findById(userId);
    
    if (!user.guild) {
      return res.status(400).json({ success: false, message: 'You are not a member of any guild' });
    }
    
    // Find guild
    const guild = await Guild.findById(user.guild);
    
    // Check if user is founder
    if (guild.founder.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Only the founder can transfer ownership' });
    }
    
    // Check if new founder is a member
    if (!guild.members.some(member => member.toString() === newFounderId)) {
      return res.status(400).json({ success: false, message: 'User is not a member of this guild' });
    }
    
    // Transfer ownership
    guild.founder = newFounderId;
    
    // Make sure new founder is an officer
    if (!guild.officers.some(officer => officer.toString() === newFounderId)) {
      guild.officers.push(newFounderId);
    }
    
    await guild.save();
    
    res.status(200).json({
      success: true,
      message: 'Guild ownership transferred successfully',
      guild
    });
  } catch (error) {
    console.error('Transfer ownership error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Kick member from guild
exports.kickMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const userId = req.user.id;
    
    // Find user's guild
    const user = await User.findById(userId);
    
    if (!user.guild) {
      return res.status(400).json({ success: false, message: 'You are not a member of any guild' });
    }
    
    // Find guild
    const guild = await Guild.findById(user.guild);
    
    // Check if user is founder or officer
    const isFounder = guild.founder.toString() === userId;
    const isOfficer = guild.officers.some(officer => officer.toString() === userId);
    
    if (!isFounder && !isOfficer) {
      return res.status(403).json({ success: false, message: 'Not authorized to kick members' });
    }
    
    // Cannot kick the founder
    if (guild.founder.toString() === memberId) {
      return res.status(400).json({ success: false, message: 'Cannot kick the founder' });
    }
    
    // Officers can only kick regular members, not other officers
    if (isOfficer && !isFounder && guild.officers.some(officer => officer.toString() === memberId)) {
      return res.status(403).json({ success: false, message: 'Officers cannot kick other officers' });
    }
    
    // Check if member exists in guild
    if (!guild.members.some(member => member.toString() === memberId)) {
      return res.status(400).json({ success: false, message: 'User is not a member of this guild' });
    }
    
    // Remove member from guild
    guild.members = guild.members.filter(member => member.toString() !== memberId);
    guild.officers = guild.officers.filter(officer => officer.toString() !== memberId);
    
    await guild.save();
    
    // Remove guild association from kicked user
    const kickedUser = await User.findById(memberId);
    if (kickedUser) {
      kickedUser.guild = null;
      await kickedUser.save();
    }
    
    // Recalculate guild stats
    await guild.recalculateStats();
    
    res.status(200).json({
      success: true,
      message: 'Member kicked from guild successfully',
      guild
    });
  } catch (error) {
    console.error('Kick member error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}; 