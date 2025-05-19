const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const UserSession = require('../models/UserSession');
const { v4: uuidv4 } = require('uuid');
const useragent = require('express-useragent');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Helper to log activity
const logActivity = async (req, user, actionType, actionDetails = {}) => {
  try {
    const userAgent = useragent.parse(req.headers['user-agent']);
    
    await ActivityLog.create({
      user: user._id,
      username: user.username,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      actionType,
      actionDetails,
      pageUrl: req.headers.referer || null,
      performedAt: new Date()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Create a new user session
const createUserSession = async (req, user) => {
  try {
    const userAgent = useragent.parse(req.headers['user-agent']);
    
    // Check if user already has an active session
    const existingSession = await UserSession.findActiveSessionByUser(user._id);
    
    if (existingSession) {
      // Update the existing session
      return existingSession;
    }
    
    // Create a new session
    const session = await UserSession.create({
      user: user._id,
      username: user.username,
      sessionId: uuidv4(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      browser: userAgent.browser,
      operatingSystem: userAgent.os,
      startTime: new Date(),
      isActive: true
    });
    
    return session;
  } catch (error) {
    console.error('Error creating user session:', error);
    return null;
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    // Create new user
    const user = await User.create({
      username,
      password, // Will be hashed by pre-save hook
      email: email || undefined,
      role: 'user',
      lastLogin: new Date()
    });
    
    // Generate token
    const token = generateToken(user);
    
    // Log the registration activity
    await logActivity(req, user, 'register');
    
    // Create a new session
    const session = await createUserSession(req, user);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        sessionId: session ? session.sessionId : null
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    
    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken(user);
    
    // Log the login activity
    await logActivity(req, user, 'login');
    
    // Create or update user session
    const session = await createUserSession(req, user);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        sessionId: session ? session.sessionId : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        guild: user.guild,
        stats: user.stats,
        chessRating: user.chessRating,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    // Find and end active user session
    const session = await UserSession.findActiveSessionByUser(req.user.id);
    
    if (session) {
      session.isActive = false;
      session.endTime = new Date();
      await session.save();
    }
    
    // Log the logout activity
    await logActivity(req, req.user, 'logout');
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update user password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Log the password change activity
    await logActivity(req, user, 'password_change');
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Record screen capture for monitoring
exports.recordScreenCapture = async (req, res) => {
  try {
    const { sessionId, imageData, pageUrl, eventTriggered, elementInfo } = req.body;
    
    // Find the user session
    const session = await UserSession.findOne({ sessionId, isActive: true });
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Active session not found' });
    }
    
    // Add screen capture to session
    await session.addScreenCapture({
      timestamp: new Date(),
      imageData,
      pageUrl,
      eventTriggered,
      elementInfo
    });
    
    res.status(200).json({
      success: true,
      message: 'Screen capture recorded'
    });
  } catch (error) {
    console.error('Record screen capture error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Record user event for monitoring
exports.recordUserEvent = async (req, res) => {
  try {
    const { sessionId, eventType, details } = req.body;
    
    // Find the user session
    const session = await UserSession.findOne({ sessionId, isActive: true });
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Active session not found' });
    }
    
    // Add event to session
    await session.addEvent(eventType, details);
    
    // Update stats based on event type
    if (eventType === 'click') {
      session.totalClicks += 1;
    } else if (eventType === 'keypress') {
      session.totalKeyPresses += 1;
    }
    
    await session.save();
    
    res.status(200).json({
      success: true,
      message: 'Event recorded'
    });
  } catch (error) {
    console.error('Record user event error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}; 