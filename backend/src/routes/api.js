const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const guildController = require('../controllers/guildController');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/user', authenticateToken, authController.getCurrentUser);
router.post('/auth/logout', authenticateToken, authController.logout);
router.post('/auth/update-password', authenticateToken, authController.updatePassword);
router.post('/auth/record-screen', authenticateToken, authController.recordScreenCapture);
router.post('/auth/record-event', authenticateToken, authController.recordUserEvent);

// Guild routes
router.post('/guilds', authenticateToken, guildController.createGuild);
router.get('/guilds', guildController.getAllGuilds);
router.get('/guilds/:id', guildController.getGuildById);
router.put('/guilds/:id', authenticateToken, guildController.updateGuild);
router.post('/guilds/:id/join', authenticateToken, guildController.joinGuild);
router.post('/guilds/leave', authenticateToken, guildController.leaveGuild);
router.post('/guilds/promote', authenticateToken, guildController.promoteMember);
router.post('/guilds/demote', authenticateToken, guildController.demoteOfficer);
router.post('/guilds/transfer', authenticateToken, guildController.transferOwnership);
router.post('/guilds/kick', authenticateToken, guildController.kickMember);

// Admin routes (protected by isAdmin middleware)
router.get('/admin/users', authenticateToken, isAdmin, adminController.getAllUsers);
router.get('/admin/users/:id', authenticateToken, isAdmin, adminController.getUserById);
router.post('/admin/users/role', authenticateToken, isAdmin, adminController.updateUserRole);
router.get('/admin/dashboard', authenticateToken, isAdmin, adminController.getSiteActivityDashboard);
router.get('/admin/sessions', authenticateToken, isAdmin, adminController.getActiveSessions);
router.get('/admin/sessions/:id', authenticateToken, isAdmin, adminController.getSessionDetails);
router.post('/admin/sessions/end', authenticateToken, isAdmin, adminController.endUserSession);
router.get('/admin/leaderboard/chess', authenticateToken, adminController.getChessLeaderboard);
router.get('/admin/leaderboard/guilds', authenticateToken, adminController.getGuildLeaderboard);

module.exports = router; 