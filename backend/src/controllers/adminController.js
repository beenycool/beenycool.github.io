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
      include: [{ model: Guild, as: 'guilds' }] // Corrected alias for User.belongsToMany(Guild)
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
          { whitePlayerId: userId }, // Corrected: Use whitePlayerId
          { blackPlayerId: userId }  // Corrected: Use blackPlayerId
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
      actionDetails: { // This was already correct
        action: 'update_user_role',
        targetUserId: userId,
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
    const sessionIdFromParam = req.params.id; // This is the UUID sessionId
    const { sequelize, Sequelize } = require('../db/config');

    const session = await UserSession.findOne({
        where: { sessionId: sessionIdFromParam }, // Query by the UUID sessionId field
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'role'] }]
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Get recent activity for this user during this session
    // UserSession model now has startTime and endTime
    const activities = await ActivityLog.findAll({
      where: {
        userId: session.userId,
        performedAt: {
          [Sequelize.Op.gte]: session.startTime, // Use UserSession.startTime
          [Sequelize.Op.lte]: session.endTime || new Date() // Use UserSession.endTime or current time if session still active
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
      actionDetails: { // This was already correct
        action: 'end_user_session',
        targetUserId: session.userId,
        targetSessionId: session.sessionId
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

// Get Combined Leaderboards for Admin Dashboard
exports.getCombinedLeaderboards = async (req, res) => {
  try {
    const { sequelize, Sequelize } = require('../db/config');
    const limit = parseInt(req.query.limit) || 10;

    // Chess Leaderboard
    const chessLeaderboard = await User.findAll({
      attributes: ['id', 'username', 'avatar', 'chessRating',
        [Sequelize.literal('(SELECT COUNT(*) FROM "ChessGames" WHERE "ChessGames"."whitePlayerId" = "User"."id" OR "ChessGames"."blackPlayerId" = "User"."id")'), 'gamesPlayed'],
        [Sequelize.literal('(SELECT COUNT(*) FROM "ChessGames" WHERE ("ChessGames"."whitePlayerId" = "User"."id" AND "ChessGames"."result" = \'white\') OR ("ChessGames"."blackPlayerId" = "User"."id" AND "ChessGames"."result" = \'black\'))'), 'wins'],
        [Sequelize.literal('(SELECT COUNT(*) FROM "ChessGames" WHERE ("ChessGames"."whitePlayerId" = "User"."id" AND "ChessGames"."result" = \'black\') OR ("ChessGames"."blackPlayerId" = "User"."id" AND "ChessGames"."result" = \'white\'))'), 'losses'],
        [Sequelize.literal('(SELECT COUNT(*) FROM "ChessGames" WHERE (("ChessGames"."whitePlayerId" = "User"."id" OR "ChessGames"."blackPlayerId" = "User"."id") AND "ChessGames"."result" = \'draw\'))'), 'draws']
      ],
      order: [['chessRating', 'DESC']],
      limit: limit,
      raw: true, // Get plain JSON objects
    }).then(users => users.map(u => ({
        id: u.id,
        username: u.username,
        avatar: u.avatar,
        chessRating: u.chessRating,
        stats: { chess: { gamesPlayed: parseInt(u.gamesPlayed) || 0, wins: parseInt(u.wins) || 0, losses: parseInt(u.losses) || 0, draws: parseInt(u.draws) || 0 } }
    })));


    // Guild Leaderboard
    // This requires a more complex query to calculate average rating and win rates if not stored directly.
    // For simplicity, using existing fields or placeholders.
    const guildLeaderboard = await Guild.findAll({
      attributes: [
        'id', 'name', 'logo', 'description', 'ownerId',
        [Sequelize.literal('(SELECT COUNT(*) FROM "UserGuilds" WHERE "UserGuilds"."guildId" = "Guild"."id")'), 'memberCount'],
        // Placeholder for averageRating and winRate, ideally calculated or stored
        [Sequelize.literal('1200'), 'averageRating'], // Placeholder
        [Sequelize.literal('0'), 'totalGames'], // Placeholder
        [Sequelize.literal('0'), 'totalWins'] // Placeholder
      ],
      include: [{ model: User, as: 'owner', attributes: ['username'] }],
      order: [[Sequelize.literal('"memberCount"'), 'DESC']], // Example order
      limit: limit,
      raw: true,
      nest: true,
    }).then(guilds => guilds.map(g => ({
        id: g.id,
        name: g.name,
        logo: g.logo,
        ownerName: g.owner?.username || 'N/A',
        stats: {
            memberCount: parseInt(g.memberCount) || 0,
            averageRating: parseInt(g.averageRating) || 1200,
            totalGames: parseInt(g.totalGames) || 0,
            totalWins: parseInt(g.totalWins) || 0,
        }
    })));

    // Most Active Users (from getSiteActivityDashboard logic)
    const days = 7; // Default to 7 days for activity leaderboard
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const mostActiveRaw = await ActivityLog.findAll({
      attributes: [
        'userId',
        [sequelize.fn('COUNT', sequelize.col('ActivityLog.id')), 'actionCount'],
        [sequelize.fn('MAX', sequelize.col('ActivityLog.performedAt')), 'lastActive']
      ],
      where: {
        performedAt: { [Sequelize.Op.gte]: startDate, [Sequelize.Op.lte]: endDate }
      },
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'profilePicture'] }],
      group: ['userId', 'user.id', 'user.username', 'user.email', 'user.profilePicture'],
      order: [[sequelize.fn('COUNT', sequelize.col('ActivityLog.id')), 'DESC']],
      limit: limit,
      raw: true,
      nest: true,
    });
    
    const activityLeaderboard = mostActiveRaw.map(u => ({
        id: u.user.id,
        username: u.user.username,
        email: u.user.email,
        profilePicture: u.user.profilePicture,
        actionCount: parseInt(u.actionCount) || 0,
        // sessionCount needs to be fetched or calculated differently if required
        sessionCount: 0, // Placeholder
        lastActive: u.lastActive
    }));

    res.status(200).json({
      success: true,
      data: {
        chess: chessLeaderboard,
        guilds: guildLeaderboard,
        activity: activityLeaderboard,
      },
    });
  } catch (error) {
    console.error('Get Combined Leaderboards error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: Get all guilds
exports.adminGetAllGuilds = async (req, res) => {
  try {
    const guilds = await Guild.findAll({
      include: [
        { model: User, as: 'owner', attributes: ['id', 'username'] },
        // Optionally include member count if not a direct field
        // { model: User, as: 'members', attributes: ['id'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    // If you need to manually count members for each guild:
    // const guildsWithMemberCount = await Promise.all(guilds.map(async (guild) => {
    //   const memberCount = await guild.countMembers(); // Assuming a method on Guild model
    //   return { ...guild.toJSON(), memberCount };
    // }));
    res.status(200).json({ success: true, guilds });
  } catch (error) {
    console.error('Admin get all guilds error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: Create a new guild
exports.adminCreateGuild = async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    const ownerId = req.user.id; // Admin creating the guild is the owner

    if (!name) {
      return res.status(400).json({ success: false, message: 'Guild name is required' });
    }

    const newGuild = await Guild.create({
      name,
      description,
      logo,
      ownerId,
      // memberCount: 1 // Initial member count if admin is auto-added
    });
    
    // Log admin action
    await ActivityLog.create({
      userId: req.user.id,
      username: req.user.username,
      actionType: 'admin_action',
      actionDetails: { action: 'create_guild', guildId: newGuild.id, guildName: newGuild.name },
      performedAt: new Date()
    });

    res.status(201).json({ success: true, message: 'Guild created successfully', guild: newGuild });
  } catch (error) {
    console.error('Admin create guild error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'Guild name already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: Update a guild
exports.adminUpdateGuild = async (req, res) => {
  try {
    const guildId = req.params.id;
    const { name, description, logo } = req.body;

    const guild = await Guild.findByPk(guildId);
    if (!guild) {
      return res.status(404).json({ success: false, message: 'Guild not found' });
    }

    guild.name = name || guild.name;
    guild.description = description !== undefined ? description : guild.description;
    guild.logo = logo !== undefined ? logo : guild.logo;
    
    await guild.save();

    // Log admin action
    await ActivityLog.create({
      userId: req.user.id,
      username: req.user.username,
      actionType: 'admin_action',
      actionDetails: { action: 'update_guild', guildId: guild.id, updatedFields: Object.keys(req.body) },
      performedAt: new Date()
    });

    res.status(200).json({ success: true, message: 'Guild updated successfully', guild });
  } catch (error) {
    console.error('Admin update guild error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'Guild name already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: Delete a guild
exports.adminDeleteGuild = async (req, res) => {
  try {
    const guildId = req.params.id;

    const guild = await Guild.findByPk(guildId);
    if (!guild) {
      return res.status(404).json({ success: false, message: 'Guild not found' });
    }

    const guildName = guild.name; // For logging
    await guild.destroy();
    
    // Log admin action
    await ActivityLog.create({
      userId: req.user.id,
      username: req.user.username,
      actionType: 'admin_action',
      actionDetails: { action: 'delete_guild', guildId: guildId, guildName: guildName },
      performedAt: new Date()
    });

    res.status(200).json({ success: true, message: 'Guild deleted successfully' });
  } catch (error) {
    console.error('Admin delete guild error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};