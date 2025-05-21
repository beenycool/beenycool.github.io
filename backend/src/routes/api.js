const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const authController = require('../controllers/authController');
const guildController = require('../controllers/guildController');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { globalRateLimiter } = require('../middleware/rateLimit');

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
router.post('/github/completions', globalRateLimiter, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // Set headers for SSE to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE connection

    // Request data from GitHub API (expects JSON)
    const githubResponse = await fetch('https://api.github.com/copilot/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_API_KEY}`,
        'Accept': 'application/json' // GitHub Copilot API expects JSON
      },
      body: JSON.stringify({ messages }) // stream: true removed, as we expect full JSON
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error('GitHub API error:', githubResponse.status, errorText);
      // Send an error event to the client before closing
      res.write(`event: error\ndata: ${JSON.stringify({ error: `GitHub API Error (${githubResponse.status}): ${errorText}`, status: githubResponse.status })}\n\n`);
      res.end();
      return;
    }

    const githubData = await githubResponse.json();

    let completionText = '';
    // Try to extract content based on common structures; adjust if GitHub's actual structure differs
    if (githubData.choices && githubData.choices[0] && githubData.choices[0].message && githubData.choices[0].message.content) {
      completionText = githubData.choices[0].message.content;
    } else if (githubData.completion) { // Fallback for a simpler structure
        completionText = githubData.completion;
    } else if (typeof githubData.content === 'string') { // Another possible simple structure
        completionText = githubData.content;
    } else {
      console.error('Unexpected GitHub API response structure or empty content:', githubData);
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'Unexpected GitHub API response structure or empty content' })}\n\n`);
      res.end();
      return;
    }

    // Send the completion text to the client, simulating the OpenAI SSE stream format
    if (completionText) {
        // Send the entire completion as one data event, as the frontend accumulates deltas.
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: completionText } }] })}\n\n`);
    }
    
    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (error) {
    console.error('Streaming API error in /github/completions:', error);
    if (!res.headersSent) {
        res.status(500).json({ error: error.message });
    } else {
        // Ensure error is stringified if it's an object
        const errorMessage = (typeof error.message === 'string') ? error.message : JSON.stringify(error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
    }
  }
});

module.exports = router;