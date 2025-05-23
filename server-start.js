const express = require('express');
const http = require('http');
const next = require('next');
const path = require('path');
const dotenv = require('dotenv');
const { sequelize } = require('./backend/src/models');
const apiRoutes = require('./backend/src/routes/api');
const chessServer = require('./backend/src/chess-server');

// Load environment variables
dotenv.config();

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// Get port from environment variable
const PORT = process.env.PORT || 3000;

async function startServer(dbConnected = true) {
  try {
    // Wait for Next.js to be ready
    await nextApp.prepare();

    // Create Express app
    const app = express();
    const server = http.createServer(app);

    // Trust proxy for production
    app.set('trust proxy', 1);

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
      app.use('/api', apiRoutes);
    } else {
      // Fallback API routes for frontend-only mode
      app.use('/api', (req, res) => {
        res.status(503).json({
          error: 'Database connection failed. API endpoints are not available in frontend-only mode.'
        });
      });
    }

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: dbConnected ? 'ok' : 'frontend-only',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        dbConnected
      });
    });

    // Handle all other routes with Next.js
    app.all('*', (req, res) => {
      return nextHandler(req, res);
    });

    // Start the server
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`
=================================================
🚀 Unified server running on port ${PORT}
📱 Next.js frontend: http://localhost:${PORT}
${dbConnected ? '🎮 Chess server: Integrated on same port' : '⚠️ Running in FRONTEND-ONLY mode (no database)'}
${dbConnected ? '🔌 API endpoints: http://localhost:${PORT}/api' : '❌ API endpoints: Disabled (no database)'}
=================================================
      `);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
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