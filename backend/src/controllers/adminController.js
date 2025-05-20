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
    const offset = (page - 1) * limit; // Sequelize uses offset
    
    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ['password'] }, // Exclude password
      offset: offset,
      limit: limit,
      order: [['createdAt', 'DESC']],
      distinct: true, // Necessary for correct count with includes
    });
    
    res.status(200).json({
      success: true,
      count: users.length, // Number of users in current page
      total: count, // Total number of users
      totalPages: Math.ceil(count / limit),
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
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Guild, as: 'guild' }] // Assuming 'guild' is the alias for User -> Guild association
    });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get user's recent activity
    const recentActivity = await ActivityLog.findAll({ 
      where: { userId: userId }, // Assuming ActivityLog has a userId foreign key
      order: [['performedAt', 'DESC']],
      limit: 20 
    });
    
    // Get user's active session if any
    const activeSession = await UserSession.findOne({ 
      where: { userId: userId, isActive: true } // Assuming UserSession has a userId
    });
    
    // Get user's most recent chess games
    // This requires knowing how players are stored in ChessGame and if userId refers to your User model's PK
    // Assuming ChessGame stores user PKs in players.white.userId and players.black.userId
    const { Sequelize } = require('sequelize'); // For Op.or
    const chessGames = await ChessGame.findAll({
      where: {
        [Sequelize.Op.or]: [
          { 'players.white.userId': userId },
          { 'players.black.userId': userId }
        ]
      },
      order: [['startTime', 'DESC']],
      limit: 10
    });
    
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
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    // Log the admin action
    await ActivityLog.create({
      userId: req.user.id, 
      username: req.user.username,
      actionType: 'admin_action',
      actionDetails: {
        action: 'update_user_role',
        targetUserId: userId, // Changed from targetUser for clarity
        newRole: role
      },
      performedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user.id,
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
    startDate.setDate(endDate.getDate() - days);

    const { sequelize, Sequelize } = require('../db/config'); // Assuming db/config exports sequelize instance and Sequelize static

    // Get active users count
    const activeSessions = await UserSession.count({ where: { isActive: true } });

    // Get new user registrations by day
    const newUsersByDay = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'], // Truncate to date
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: {
          [Sequelize.Op.gte]: startDate,
          [Sequelize.Op.lte]: endDate
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true // Get plain JSON objects
    });

    // Get login activity by day
    const loginsByDay = await ActivityLog.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('performedAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        actionType: 'login',
        performedAt: {
          [Sequelize.Op.gte]: startDate,
          [Sequelize.Op.lte]: endDate
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('performedAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('performedAt')), 'ASC']],
      raw: true
    });

    // Get chess game activity by day
    const chessGamesByDay = await ActivityLog.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('performedAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        actionType: 'chess_game_start',
        performedAt: {
          [Sequelize.Op.gte]: startDate,
          [Sequelize.Op.lte]: endDate
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('performedAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('performedAt')), 'ASC']],
      raw: true
    });
    
    // Get todo activity by day
    // This one is grouped by date and actionType
    const todoActivityByDay = await ActivityLog.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('performedAt')), 'activity_date'], // Alias to avoid conflict
        'actionType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        actionType: { [Sequelize.Op.in]: ['todo_create', 'todo_complete', 'todo_delete'] },
        performedAt: {
          [Sequelize.Op.gte]: startDate,
          [Sequelize.Op.lte]: endDate
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('performedAt')), 'actionType'],
      order: [[sequelize.fn('DATE', sequelize.col('performedAt')), 'ASC']],
      raw: true
    }).then(results => results.map(r => ({ _id: { date: r.activity_date, action: r.actionType }, count: r.count }))); // Remap to expected structure


    // Get a list of most active users
    const mostActiveUsers = await ActivityLog.findAll({
      attributes: [
        'userId', // Assuming ActivityLog has userId
        // Need to include username. This requires a join or a subquery/second query.
        // For simplicity here, let's assume username is on ActivityLog or we fetch it later.
        // If username is on User model, a join is needed:
        // [sequelize.literal('`User`.`username`'), 'username'], // Adjust User.username based on actual table/col name
        [sequelize.fn('COUNT', sequelize.col('ActivityLog.id')), 'count'] // Qualify id if joining
      ],
      where: {
        performedAt: {
          [Sequelize.Op.gte]: startDate,
          [Sequelize.Op.lte]: endDate
        }
      },
      // include: [{ model: User, attributes: ['username'] }], // If joining to get username
      group: ['userId'], // Add 'User.username' if joining and selecting it
      order: [[sequelize.fn('COUNT', sequelize.col('ActivityLog.id')), 'DESC']],
      limit: 10,
      raw: true // May need to be false if using include and wanting nested objects
    });
    
    // If username needs to be fetched separately for mostActiveUsers (if not joining):
    const userIds = mostActiveUsers.map(u => u.userId);
    const activeUserDetails = await User.findAll({
        where: { id: { [Sequelize.Op.in]: userIds } },
        attributes: ['id', 'username'],
        raw: true
    });
    const usersMap = activeUserDetails.reduce((map, user) => {
        map[user.id] = user.username;
        return map;
    }, {});

    const formattedMostActiveUsers = mostActiveUsers.map(u => ({
        _id: u.userId,
        username: usersMap[u.userId] || 'Unknown',
        count: u.count
    }));


    res.status(200).json({
      success: true,
      data: {
        activeSessions,
        newUsersByDay: newUsersByDay.map(r => ({ _id: r.date, count: r.count })), // Map to expected {_id, count}
        loginsByDay: loginsByDay.map(r => ({ _id: r.date, count: r.count })),
        chessGamesByDay: chessGamesByDay.map(r => ({ _id: r.date, count: r.count })),
        todoActivityByDay, // Already mapped
        mostActiveUsers: formattedMostActiveUsers
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
    const offset = (page - 1) * limit;

    const { sequelize, Sequelize } = require('../db/config');

    const { count, rows: sessions } = await UserSession.findAndCountAll({
      where: { isActive: true },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'role'] }], // Assuming UserSession belongsTo User as 'user'
      offset: offset,
      limit: limit,
      order: [['startTime', 'DESC']],
      distinct: true
    });

    res.status(200).json({
      success: true,
      count: sessions.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      sessions
    });
  } catch (error) {
    console.error('Get active sessions error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get session details by ID (assuming UserSession primary key is 'id' or 'sessionId' if that's the PK)
exports.getSessionDetails = async (req, res) => {
  try {
    const sessionId = req.params.id; // This should be the primary key of UserSession
    const { sequelize, Sequelize } = require('../db/config');

    // If sessionId in UserSession is not the PK, but a field named 'sessionId'
    // const session = await UserSession.findOne({ 
    //   where: { sessionId: sessionId }, 
    //   include: [{ model: User, as: 'user', attributes: ['id', 'username', 'role'] }]
    // });
    // If req.params.id refers to the primary key of UserSession model:
    const session = await UserSession.findByPk(sessionId, { 
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'role'] }]
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Get recent activity for this user during this session
    const activities = await ActivityLog.findAll({
      where: {
        userId: session.userId, // Assuming UserSession has userId or session.user.id if populated
        performedAt: {
          [Sequelize.Op.gte]: session.startTime,
          [Sequelize.Op.lte]: session.endTime || new Date() // Use current time if endTime is null
        }
      },
      order: [['performedAt', 'DESC']]
    });

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
    const { sessionId } = req.body; // This should be the value of the 'sessionId' field, not necessarily PK
    const { sequelize, Sequelize } = require('../db/config');

    const session = await UserSession.findOne({ where: { sessionId: sessionId, isActive: true } });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Active session not found' });
    }

    session.isActive = false;
    session.endTime = new Date();
    await session.save();

    // Log the admin action
    await ActivityLog.create({
      userId: req.user.id, // Admin's ID
      username: req.user.username,
      actionType: 'admin_action',
      actionDetails: {
        action: 'end_user_session',
        targetUserId: session.userId, // Assuming UserSession has userId
        targetSessionId: session.sessionId // Log the actual session identifier
      },
      performedAt: new Date()
    });

    res.status(200).json({ success: true, message: 'Session ended successfully' });
  } catch (error) {
    console.error('End user session error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Chess Leaderboard (Example Conversion)
exports.getChessLeaderboard = async (req, res) => {
  try {
    const { sequelize, Sequelize } = require('../db/config');
    const users = await User.findAll({
      attributes: ['id', 'username', 'chessRating', 'chessWins', 'chessLosses', 'chessDraws'],
      order: [['chessRating', 'DESC']],
      limit: parseInt(req.query.limit) || 20
    });
    res.status(200).json({ success: true, leaderboard: users });
  } catch (error) {
    console.error('Get Chess Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get Guild Leaderboard (Example Conversion)
exports.getGuildLeaderboard = async (req, res) => {
  try {
    const { sequelize, Sequelize } = require('../db/config');
    // This is more complex; requires aggregation or careful query if ratings are per guild member
    // Simplistic example: list guilds ordered by some criteria (e.g., member count or a summary stat)
    const guilds = await Guild.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'memberCount', // Assuming Guild model has memberCount
        'totalRating'  // Assuming Guild model has some totalRating
        // Or use sequelize.fn('COUNT', sequelize.col('Members.id')) if you have a GuildMembers association
      ],
      // include: [{ model: User, as: 'members', attributes: [] }], // if counting members via association
      order: [['totalRating', 'DESC']], // or memberCount
      limit: parseInt(req.query.limit) || 20
    });
    res.status(200).json({ success: true, leaderboard: guilds });
  } catch (error) {
    console.error('Get Guild Leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}; 