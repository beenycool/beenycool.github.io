const User = require('../models/User');
const Guild = require('../models/Guild');
const ActivityLog = require('../models/ActivityLog');
const UserSession = require('../models/UserSession');
const ChessGame = require('../models/ChessGame');

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const totalUsers = await User.countDocuments();
    
    res.status(200).json({
      success: true,
      count: users.length,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get user details by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findById(userId)
      .select('-password')
      .populate('guild');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get user's recent activity
    const recentActivity = await ActivityLog.find({ user: userId })
      .sort({ performedAt: -1 })
      .limit(20);
    
    // Get user's active session if any
    const activeSession = await UserSession.findOne({ user: userId, isActive: true });
    
    // Get user's most recent chess games
    const chessGames = await ChessGame.find({
      $or: [
        { 'players.white.user': userId },
        { 'players.black.user': userId }
      ]
    })
    .sort({ startTime: -1 })
    .limit(10);
    
    res.status(200).json({
      success: true,
      user,
      recentActivity,
      activeSession,
      chessGames
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({ success: false, message: 'User ID and role are required' });
    }
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be "user" or "admin"' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    // Log the admin action
    await ActivityLog.create({
      user: req.user.id,
      username: req.user.username,
      actionType: 'admin_action',
      actionDetails: {
        action: 'update_user_role',
        targetUser: userId,
        oldRole: user.role,
        newRole: role
      },
      performedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get site activity dashboard data
exports.getSiteActivityDashboard = async (req, res) => {
  try {
    // Get time range from query or default to last 7 days
    const days = parseInt(req.query.days) || 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get active users count
    const activeSessions = await UserSession.countDocuments({ isActive: true });
    
    // Get new user registrations by day
    const newUsersByDay = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get login activity by day
    const loginsByDay = await ActivityLog.aggregate([
      {
        $match: {
          actionType: 'login',
          performedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$performedAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get chess game activity by day
    const chessGamesByDay = await ActivityLog.aggregate([
      {
        $match: {
          actionType: 'chess_game_start',
          performedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$performedAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get todo activity by day
    const todoActivityByDay = await ActivityLog.aggregate([
      {
        $match: {
          actionType: { $in: ['todo_create', 'todo_complete', 'todo_delete'] },
          performedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { 
            date: { $dateToString: { format: '%Y-%m-%d', date: '$performedAt' } },
            action: '$actionType'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.date': 1 }
      }
    ]);
    
    // Get a list of most active users
    const mostActiveUsers = await ActivityLog.aggregate([
      {
        $match: {
          performedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$user',
          username: { $first: '$username' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        activeSessions,
        newUsersByDay,
        loginsByDay,
        chessGamesByDay,
        todoActivityByDay,
        mostActiveUsers
      }
    });
  } catch (error) {
    console.error('Get site activity dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get active user sessions
exports.getActiveSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const sessions = await UserSession.find({ isActive: true })
      .populate('user', 'username role')
      .skip(skip)
      .limit(limit)
      .sort({ startTime: -1 });
    
    const totalSessions = await UserSession.countDocuments({ isActive: true });
    
    res.status(200).json({
      success: true,
      count: sessions.length,
      total: totalSessions,
      totalPages: Math.ceil(totalSessions / limit),
      currentPage: page,
      sessions
    });
  } catch (error) {
    console.error('Get active sessions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get session details with screen captures
exports.getSessionDetails = async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    const session = await UserSession.findOne({ sessionId })
      .populate('user', 'username role');
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    
    // Get recent activity for this user during this session
    const activities = await ActivityLog.find({
      user: session.user._id,
      performedAt: { $gte: session.startTime, $lte: session.endTime || new Date() }
    }).sort({ performedAt: -1 });
    
    res.status(200).json({
      success: true,
      session,
      activities
    });
  } catch (error) {
    console.error('Get session details error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Force end a user session
exports.endUserSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const session = await UserSession.findOne({ sessionId, isActive: true });
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Active session not found' });
    }
    
    session.isActive = false;
    session.endTime = new Date();
    await session.save();
    
    // Log the admin action
    await ActivityLog.create({
      user: req.user.id,
      username: req.user.username,
      actionType: 'admin_action',
      actionDetails: {
        action: 'end_user_session',
        targetUser: session.user,
        targetSession: sessionId
      },
      performedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Session ended successfully'
    });
  } catch (error) {
    console.error('End user session error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get chess leaderboard
exports.getChessLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ 'stats.chess.gamesPlayed': { $gt: 0 } })
      .select('username chessRating stats.chess guild')
      .populate('guild', 'name')
      .sort({ chessRating: -1 })
      .limit(100);
    
    res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Get chess leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get guild leaderboard
exports.getGuildLeaderboard = async (req, res) => {
  try {
    const guildLeaderboard = await Guild.find()
      .select('name description stats members')
      .sort({ 'stats.averageRating': -1 })
      .limit(50);
    
    res.status(200).json({
      success: true,
      guildLeaderboard
    });
  } catch (error) {
    console.error('Get guild leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}; 