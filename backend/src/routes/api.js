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

// Route for OpenRouter models
router.post('/chat/completions', globalRateLimiter, async (req, res) => {
  try {
    const { model, messages, stream } = req.body;
    if (!model || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: model and messages are required.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // OpenRouter might infer HTTP-Referer from the request for identification
        'HTTP-Referer': req.headers.origin || 'https://beenycool.github.io', 
        'X-Title': 'GCSE AI Marker' // Optional: For OpenRouter to identify your app
      },
      body: JSON.stringify({ model, messages, stream: stream !== undefined ? stream : true })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', openRouterResponse.status, errorText);
      res.write(`event: error\ndata: ${JSON.stringify({ error: `OpenRouter API Error (${openRouterResponse.status}): ${errorText}`, status: openRouterResponse.status })}\n\n`);
      res.end();
      return;
    }

    // Pipe the stream from OpenRouter to the client
    if (openRouterResponse.body) {
        const reader = openRouterResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            res.write(chunk); // Directly forward the chunk as OpenRouter SSE format is usually compatible
        }
    } else {
        // Fallback if no body or not streamable (should not happen with stream:true)
        const jsonData = await openRouterResponse.json();
        res.write(`data: ${JSON.stringify(jsonData)}\n\n`);
    }
    
    // OpenRouter streams usually end themselves, but ensure client knows.
    // Sending [DONE] might be redundant if OpenRouter already sends it.
    // Consider if client handles multiple [DONE] gracefully.
    // res.write(`data: [DONE]\n\n`); 
    res.end();

  } catch (error) {
    console.error('OpenRouter API error in /chat/completions:', error);
    if (!res.headersSent) {
        res.status(500).json({ error: error.message });
    } else {
        const errorMessage = (typeof error.message === 'string') ? error.message : JSON.stringify(error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
    }
  }
});

// Route for Direct Gemini API (e.g., gemini-2.5-flash-preview-05-20)
router.post('/gemini/generate', globalRateLimiter, async (req, res) => {
  try {
    const { contents, generationConfig, model } = req.body; // model might be passed from frontend to specify e.g. gemini-2.5-flash-preview-05-20 or a specific version
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Invalid request: contents array is required.' });
    }

    // Determine the model to use. Frontend might send it, or we default to gemini-2.5-flash-preview-05-20 or a configured one.
    // For gemini-2.5-flash-preview-05-20, the model name is often part of the URL or needs to be correctly specified.
    // Let's assume the frontend sends the correct model identifier in `req.body.model` if it's not gemini-2.5-flash-preview-05-20.
    const geminiModel = model || 'gemini-2.5-flash-preview-05-20'; // Default, adjust if needed
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY is not set.');
      return res.status(500).json({ error: 'Server configuration error: Missing Gemini API Key.' });
    }

    // Set headers for SSE to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
    
    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents, generationConfig })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      let errorJson = { message: errorText };
      try { errorJson = JSON.parse(errorText); } catch (e) { /* ignore */ }
      console.error('Gemini API error:', geminiResponse.status, errorJson);
      res.write(`event: error\ndata: ${JSON.stringify({ error: `Gemini API Error (${geminiResponse.status}): ${errorJson.error?.message || errorText}`, status: geminiResponse.status })}\n\n`);
      res.end();
      return;
    }

    const geminiData = await geminiResponse.json();
    let completionText = '';

    // Extract content from Gemini's response structure
    if (geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content && geminiData.candidates[0].content.parts && geminiData.candidates[0].content.parts[0]) {
      completionText = geminiData.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected Gemini API response structure or empty content:', geminiData);
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'Unexpected Gemini API response structure or empty content' })}\n\n`);
      res.end();
      return;
    }

    // Send the completion text to the client, simulating the OpenAI SSE stream format
    if (completionText) {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: completionText } }] })}\n\n`);
    }
    
    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (error) {
    console.error('Gemini API error in /gemini/generate:', error);
    if (!res.headersSent) {
        res.status(500).json({ error: error.message });
    } else {
        const errorMessage = (typeof error.message === 'string') ? error.message : JSON.stringify(error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: errorMessage })}\n\n`);
        res.end();
    }
  }
});

module.exports = router;