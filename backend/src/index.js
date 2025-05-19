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

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
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
app.use(express.static(path.join(__dirname, '../../public')));

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