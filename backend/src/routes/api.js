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

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE connection

    // Forward request to GitHub API with streaming enabled
    const githubResponse = await fetch('https://api.github.com/copilot/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_API_KEY}`,
        'Accept': 'text/event-stream' // Request SSE from GitHub
      },
      body: JSON.stringify({ messages, stream: true }) // Enable streaming
    });

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error('GitHub API error:', githubResponse.status, errorText);
      // Send an error event before closing
      res.write(`event: error\ndata: ${JSON.stringify({ error: errorText, status: githubResponse.status })}\n\n`);
      res.end();
      return;
    }

    // Pipe the stream from GitHub to the client
    const reader = githubResponse.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      
      // Process buffer line by line for SSE events
      let eolIndex;
      while ((eolIndex = buffer.indexOf('\n\n')) !== -1) {
        const eventLines = buffer.substring(0, eolIndex);
        buffer = buffer.substring(eolIndex + 2); // +2 for \n\n

        // Forward each complete SSE event from GitHub
        // Ensure it's properly formatted as an SSE message to our client
        const lines = eventLines.split('\n');
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            // Check if it's the [DONE] signal
            if (line.substring(6).trim() === '[DONE]') {
              res.write('event: done\ndata: [DONE]\n\n');
            } else {
              res.write(`${line}\n`); // Forward data line
            }
          } else if (line.startsWith('event: ')) {
            res.write(`${line}\n`); // Forward event line
          } else if (line.trim() !== '') {
             // Forward other lines if any (e.g. id, retry)
            res.write(`${line}\n`);
          }
        });
        if (eventLines.trim() !== '') {
            res.write('\n'); // Add the final newline for the event
        }
      }
    }
    // Ensure any remaining buffer is processed if it's a [DONE] message
    if (buffer.includes('data: [DONE]')) {
        res.write('data: [DONE]\n\n');
    }


    res.end(); // End the SSE stream
  } catch (error) {
    console.error('Streaming API error:', error);
    // Send an error event if an exception occurs before or during streaming
    if (!res.headersSent) {
        res.status(500).json({ error: error.message });
    } else {
        res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
  }
});

module.exports = router;