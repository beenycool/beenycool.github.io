const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    
    // Verify token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
      
      // Check if user exists in database
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Attach user to request object
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      };
      
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Middleware to check admin permissions
const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      // Log unauthorized access attempt
      await ActivityLog.create({
        userId: req.user.id,
        username: req.user.username,
        actionType: 'admin_action',
        actionDetails: {
          action: 'unauthorized_access',
          endpoint: req.originalUrl
        },
        performedAt: new Date()
      });
      
      return res.status(403).json({ success: false, message: 'Access denied. Admin permissions required.' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Middleware to attach request metrics
const attachRequestMetrics = (req, res, next) => {
  req.metrics = {
    startTime: Date.now(),
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  };
  
  // Log metrics after response
  res.on('finish', async () => {
    if (req.user) {
      const duration = Date.now() - req.metrics.startTime;
      
      // Log API calls that take longer than 500ms
      if (duration > 500) {
        console.warn(`Slow API call: ${req.method} ${req.path} took ${duration}ms`);
        
        // Log to database if user is authenticated
        try {
          await ActivityLog.create({
            userId: req.user.id,
            username: req.user.username,
            actionType: 'other',
            actionDetails: {
              action: 'slow_api_call',
              method: req.method,
              path: req.path,
              duration,
              statusCode: res.statusCode
            },
            performedAt: new Date()
          });
        } catch (error) {
          console.error('Error logging slow API call:', error);
        }
      }
    }
  });
  
  next();
};

module.exports = {
  authenticateToken,
  isAdmin,
  attachRequestMetrics
}; 