const express = require('express');
const http = require('http');
const next = require('next');
const path = require('path');
const dotenv = require('dotenv');
const { sequelize } = require('./backend/src/models');
const apiRoutes = require('./backend/src/routes/api');
const chessServer = require('./backend/src/chess-server');
const { createServer } = require('http');
const { parse } = require('url');

// Load environment variables
dotenv.config();

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    // Parse the URL
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

async function startServer(dbConnected = true) {
  try {
    // Wait for Next.js to be ready
    await app.prepare();

    // Create Express app
    const expressApp = express();
    const server = createServer((req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    // Trust proxy for production
    expressApp.set('trust proxy', 1);

    // Initialize chess server with Socket.io only if DB is connected
    if (dbConnected) {
      const io = require('socket.io')(server, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });

      // Set up chess server
      if (typeof chessServer.setup === 'function') {
        chessServer.setup(io);
      }

      // API routes
      expressApp.use('/api', apiRoutes);
    } else {
      // Fallback API routes for frontend-only mode
      expressApp.use('/api', (req, res) => {
        res.status(503).json({
          error: 'Database connection failed. API endpoints are not available in frontend-only mode.'
        });
      });
    }

    // Health check endpoint
    expressApp.get('/health', (req, res) => {
      res.status(200).json({
        status: dbConnected ? 'ok' : 'frontend-only',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        port: port,
        env: process.env.NODE_ENV || 'development',
        dbConnected
      });
    });

    // Start the server
    server.listen(port, '0.0.0.0', () => {
      console.log(`
=================================================
🚀 Unified server running on port ${port}
📱 Next.js frontend: http://localhost:${port}
${dbConnected ? '🎮 Chess server: Integrated on same port' : '⚠️ Running in FRONTEND-ONLY mode (no database)'}
${dbConnected ? '🔌 API endpoints: http://localhost:${port}/api' : '❌ API endpoints: Disabled (no database)'}
=================================================
      `);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Initialize database and start server
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    startServer(true);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    console.log('Starting in FRONTEND-ONLY mode (no database connection)');
    startServer(false);
  }); 