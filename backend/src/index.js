const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load database connection and models
const { sequelize } = require('./models');
const { testConnection } = require('./db/config');

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

// Database connection
console.log('Attempting to connect to PostgreSQL database...');
testConnection()
  .then(success => {
    if (success) {
      console.log('PostgreSQL connection successful');
      // Sync models with database (don't force in production)
      const shouldForce = process.env.NODE_ENV !== 'production' && process.env.DB_FORCE_SYNC === 'true';
      return sequelize.sync({ force: shouldForce });
    } else {
      console.warn('PostgreSQL connection failed. Starting with limited functionality.');
      return Promise.resolve();
    }
  })
  .then(() => {
    console.log('Database sync complete');
  })
  .catch(err => {
    console.error('Database initialization error:', err);
    console.log('Starting server without database connection. Some features may be limited.');
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
let publicDir = path.join(__dirname, '../../public');
// Check if we're on Render
if (process.env.RENDER) {
  // Try different paths that might work on Render
  const possiblePaths = [
    path.join(__dirname, '../../public'),
    path.join(__dirname, '../public'),
    path.join(process.cwd(), 'public'),
    '/opt/render/project/src/public'
  ];
  
  // Use the first path that exists
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      publicDir = testPath;
      console.log(`Found public directory at: ${publicDir}`);
      break;
    }
  }
}

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
          <div class="endpoint">
            <h3>GET /health</h3>
            <p>Health check endpoint</p>
          </div>
          <p>For WebSocket connections, connect to <code>/socket.io</code></p>
        </body>
      </html>
    `;
    fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);
    console.log('Created basic index.html file at:', path.join(publicDir, 'index.html'));
  } catch (err) {
    console.error('Error creating public directory:', err);
  }
}

console.log('Using public directory:', publicDir);
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
    port: process.env.PORT || 3000,
    database: sequelize.authenticate().then(() => 'connected').catch(() => 'disconnected')
  });
});

// Catch-all route to serve main HTML file
app.get('*', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <html>
        <head><title>Beenycool API Server</title></head>
        <body>
          <h1>Beenycool API Server</h1>
          <p>Server is running. API endpoints available under /api/</p>
        </body>
      </html>
    `);
  }
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

// Log the port we're trying to use
console.log(`Attempting to start server on port ${PORT}`);

// Start the server and handle any errors
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running and listening on port ${PORT}`);
  console.log(`Server is accessible at http://localhost:${PORT}`);
  
  // If we're on Render, log additional information
  if (process.env.RENDER) {
    console.log(`Running on Render with NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`DATABASE_URL present: ${!!process.env.DATABASE_URL}`);
  }
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please choose a different port.`);
  } else {
    console.error(`Server error: ${error.message}`);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Server closed');
    sequelize.close().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server }; 