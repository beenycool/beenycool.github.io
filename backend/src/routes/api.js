const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const authController = require('../controllers/authController');
const guildController = require('../controllers/guildController');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Health check route
router.get('/health', (req, res) => {
  try {
    res.status(200).json({
      status: 'ok',
      version: '1.0.0',
      openaiClient: true,
      apiKeyConfigured: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authenticateToken, authController.logout);
router.get('/auth/user', authenticateToken, authController.getCurrentUser);
router.post('/auth/events', authController.recordUserEvent);

// Guild routes
router.post('/guilds', authenticateToken, guildController.createGuild);
router.get('/guilds', guildController.getAllGuilds);
router.get('/guilds/:id', guildController.getGuildById);
router.put('/guilds/:id', authenticateToken, guildController.updateGuild);
router.post('/guilds/:id/join', authenticateToken, guildController.joinGuild);
router.post('/guilds/:id/leave', authenticateToken, guildController.leaveGuild);

// Admin routes (protected by isAdmin middleware)
router.get('/admin/users', authenticateToken, isAdmin, adminController.getAllUsers);
router.get('/admin/users/:id', authenticateToken, isAdmin, adminController.getUserById);
router.get('/admin/dashboard', authenticateToken, isAdmin, adminController.getSiteActivityDashboard);
router.get('/admin/sessions', authenticateToken, isAdmin, adminController.getActiveSessions);
router.post('/admin/sessions/end', authenticateToken, isAdmin, adminController.endUserSession);
router.get('/admin/leaderboard/chess', authenticateToken, adminController.getChessLeaderboard);
router.get('/admin/leaderboard/guilds', authenticateToken, adminController.getGuildLeaderboard);

// GitHub model API routes
router.post('/github/completions', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // Forward request to GitHub API
    const response = await fetch('https://api.github.com/copilot/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_API_KEY}`
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('GitHub API error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;