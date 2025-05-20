/**
 * Simplified start script for Render deployment
 * This script focuses on binding to the correct port and interfaces
 */

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const socketIo = require('socket.io');

// Create the Express app
const app = express();
const server = http.createServer(app);

// Get the port from Render's environment variable
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());

// Create a public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  console.log(`Creating public directory at ${publicDir}`);
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
            pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>Beenycool API Server</h1>
          <p>Server is running on Render. This is a placeholder page.</p>
          <p>Server started at: ${new Date().toISOString()}</p>
          <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
          <h2>Available Endpoints:</h2>
          <ul>
            <li><a href="/health">/health</a> - Health check endpoint</li>
            <li><a href="/api">/api</a> - API endpoints</li>
          </ul>
        </body>
      </html>
    `;
    fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);
  } catch (err) {
    console.error(`Error creating public directory: ${err.message}`);
  }
}

// Serve static files
app.use(express.static(publicDir));

// Set up Socket.io
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Basic Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  
  // Basic ping/pong for testing
  socket.on('ping', (data) => {
    socket.emit('pong', { 
      message: 'pong', 
      timestamp: new Date().toISOString(),
      received: data
    });
  });
});

// Basic API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'API is running',
    endpoints: [
      '/health',
      '/api/status'
    ]
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    version: require('./package.json').version,
    uptime: process.uptime()
  });
});

// Basic routes
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development',
    socketio: 'enabled'
  });
});

// Start the server on all interfaces (0.0.0.0)
console.log(`Starting server on port ${PORT}...`);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running and listening on port ${PORT}`);
  console.log(`Server is accessible at http://localhost:${PORT}`);
  console.log(`Environment variables:`);
  console.log(`- PORT: ${process.env.PORT}`);
  console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`- RENDER: ${process.env.RENDER}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 