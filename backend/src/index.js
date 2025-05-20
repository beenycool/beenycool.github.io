const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

// Try to load OpenAI, but continue if not available
let OpenAI;
try {
  OpenAI = require('openai');
  console.log('OpenAI module loaded successfully');
} catch (error) {
  console.warn('OpenAI module not available. Some AI features will be disabled.');
}

// Try to load node-fetch, but continue if not available
let fetch;
try {
  fetch = require('node-fetch');
  console.log('node-fetch module loaded successfully');
} catch (error) {
  console.warn('node-fetch module not available. Some features will be disabled.');
}

// Load environment variables
dotenv.config();

// Import routes and middleware
const apiRoutes = require('./routes/api');
const { attachRequestMetrics } = require('./middleware/auth');
const chessServer = require('./chess-server');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Setup event handling for chess server failures if using child process
process.on('message', (message) => {
  if (message.type === 'chess-server-failed') {
    console.warn('Chess server failed to start. Chess functionality may be limited.');
  }
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beenycool';

console.log(`Attempting to connect to MongoDB at ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://***:***@')}`);

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  console.log('Starting server without MongoDB connection. Some features may be limited.');
  // Continue without exiting - this allows the server to start even without MongoDB
});

// Apply middleware
app.use(cors());
app.use(express.json({ limit: '5mb' })); // Increased limit for screen captures
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Log HTTP requests
app.use(helmet()); // Security headers

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
            message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);

// Attach request metrics middleware
app.use(attachRequestMetrics);

// Use API routes
app.use('/api', apiRoutes);

// Serve static files from public directory
const publicDir = path.join(__dirname, '../../public');
if (!fs.existsSync(publicDir)) {
  console.log(`Public directory not found at ${publicDir}, creating it...`);
  try {
    fs.mkdirSync(publicDir, { recursive: true });
    // Create a basic index.html file
    const indexHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Beenycool API Server</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .endpoint { background: #f4f4f4; padding: 10px; border-radius: 4px; margin-bottom: 10px; }
            code { background: #eee; padding: 2px 4px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>Beenycool API Server</h1>
          <p>This is the backend API server for beenycool.github.io.</p>
          <h2>Available Endpoints:</h2>
          <div class="endpoint">
            <h3>GET /api/games</h3>
            <p>List all saved chess games</p>
          </div>
          <div class="endpoint">
            <h3>GET /api/games/:id</h3>
            <p>Get details of a specific chess game</p>
          </div>
          <div class="endpoint">
            <h3>GET /api/players/:id/stats</h3>
            <p>Get player statistics</p>
          </div>
          <p>For WebSocket connections, connect to <code>/socket.io</code></p>
        </body>
      </html>
    `;
    fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);
    console.log('Created basic index.html file');
  } catch (err) {
    console.error('Error creating public directory:', err);
  }
}
app.use(express.static(publicDir));

// Initialize chess server which sets up Socket.io
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins, modify for production
    methods: ['GET', 'POST']
  }
});

// Pass io instance to chess-server
if (typeof chessServer.setup === 'function') {
  chessServer.setup(io);
}

// Catch-all route to serve main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Default route
app.get('/', (req, res) => {
  res.send('Chess Server is running');
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server }; 