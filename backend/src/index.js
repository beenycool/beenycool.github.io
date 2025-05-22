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

// Trust proxy for Render deployment (important for rate limiting)
app.set('trust proxy', 1);

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

// PostHog Integration
let posthog;
if (process.env.POSTHOG_API_KEY) {
  try {
    const { PostHog } = require('posthog-node');
    posthog = new PostHog(
      process.env.POSTHOG_API_KEY,
      { host: process.env.POSTHOG_HOST || 'https://app.posthog.com' }
    );
    console.log('PostHog analytics initialized successfully');
    
    // Add PostHog middleware
    app.use((req, res, next) => {
      // Skip tracking for static assets
      if (!req.path.startsWith('/api') && 
          (req.path.includes('.') || req.path.includes('_next'))) {
        return next();
      }
      
      const distinctId = req.headers['x-forwarded-for'] || 
                         req.connection.remoteAddress || 
                         'anonymous';
      
      posthog.capture({
        distinctId,
        event: 'page_view',
        properties: {
          path: req.path,
          referrer: req.headers.referer || '',
          userAgent: req.headers['user-agent'] || '',
          ip: req.ip
        }
      });
      
      // Attach posthog to req for use in routes
      req.posthog = posthog;
      next();
    });
  } catch (error) {
    console.error('Failed to initialize PostHog:', error);
    console.warn('Analytics will be disabled');
  }
} else {
  console.warn('POSTHOG_API_KEY not set. Analytics will be disabled.');
}

// Apply middleware
app.use(cors());
app.use(express.json({ limit: '5mb' })); // Increased limit for screen captures
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Log HTTP requests
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://app.posthog.com"],
      connectSrc: ["'self'", "https://app.posthog.com"],
      imgSrc: ["'self'", "data:", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "data:"],
    },
  },
}));

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

// Determine the Next.js build directory
let nextBuildDir = path.join(__dirname, '../../../.next');

// Check if we're on Render
if (process.env.RENDER) {
  // Try different paths that might work on Render
  const possiblePaths = [
    path.join(__dirname, '../../../.next'),
    path.join(__dirname, '../../.next'),
    path.join(process.cwd(), '.next'),
    '/opt/render/project/src/.next'
  ];
  
  // Use the first path that exists
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      nextBuildDir = testPath;
      console.log(`Found Next.js build directory at: ${nextBuildDir}`);
      break;
    }
  }
}

// Serve Next.js static files
if (fs.existsSync(nextBuildDir)) {
  console.log('Serving Next.js static files from:', nextBuildDir);
  app.use('/_next', express.static(path.join(nextBuildDir, '_next')));
} else {
  console.warn(`Next.js build directory not found at ${nextBuildDir}`);
}

// Serve static files from public directory
let publicDir = path.join(__dirname, '../../../public');
// Check if we're on Render
if (process.env.RENDER) {
  // Try different paths that might work on Render
  const possiblePaths = [
    path.join(__dirname, '../../../public'),
    path.join(__dirname, '../../public'),
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

// Serve static files
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

// Catch-all route to serve Next.js pages
app.get('*', (req, res) => {
  // Check if this is an API request that wasn't handled
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      success: false, 
      message: 'API endpoint not found' 
    });
  }

  // For all other requests, serve the Next.js app
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <html>
        <head>
          <title>Beenycool Server</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .card { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <h1>Beenycool Server</h1>
          <div class="card">
            <p>Server is running. The frontend application is not yet built.</p>
            <p>To build the frontend, run: <code>npm run build</code></p>
          </div>
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