const rateLimit = require('express-rate-limit');
const { LRUCache } = require('lru-cache');

// Configure LRU cache for storing request counts
const options = {
  max: 500, // Maximum number of items in cache
  ttl: 1000 * 60 * 60 * 24, // Cache items for 24 hours
};
const cache = new LRUCache(options);

const RPM = 60 * 1000; // 1 minute in milliseconds
const RPD = 24 * 60 * 60 * 1000; // 1 day in milliseconds

const modelLimits = {
  'azure-openai-o1': { rpm: 1, concurrent: 1, daily: 8 },
  'azure-openai-o3': { rpm: 1, concurrent: 1, daily: 8 },
  'xAI Grok-3': { rpm: 1, concurrent: 1, daily: 8 }, // Matched prompt casing
  'azure-openai-o1-mini': { rpm: 1, concurrent: 1, daily: 12 },
  'azure-openai-o3-mini': { rpm: 1, concurrent: 1, daily: 12 },
  'azure-openai-o4-mini': { rpm: 1, concurrent: 1, daily: 12 },
};

// Store active requests globally
const activeRequests = new Map(); // modelName -> count

const getModelFromRequest = (req) => {
  // Assuming the model name is part of the request body or a header
  // This needs to be adjusted based on how the model is identified in the actual request
  if (req.body && req.body.model) {
    return req.body.model;
  }
  if (req.headers && req.headers['x-model-name']) {
    return req.headers['x-model-name'];
  }
  // Fallback or error if model cannot be determined
  // For now, let's assume a default or throw an error if not found
  // This part is crucial and needs to match how frontend sends model info
  // console.warn('Model name not found in request for rate limiting.');
  return null; 
};

const globalRateLimiter = (req, res, next) => {
  const modelName = getModelFromRequest(req);

  if (!modelName || modelName === 'mai-ds-r1') {
    return next(); // No limits for MAI-DS-R1 or if model is not identified
  }

  const limits = modelLimits[modelName];
  if (!limits) {
    // console.warn(`No rate limits defined for model: ${modelName}`);
    return next(); // Or handle as an error: res.status(400).json({ error: `Rate limits not defined for model: ${modelName}` });
  }

  const now = Date.now();
  const ip = req.ip; // Using IP for global tracking, can be refined

  // Key for daily limit
  const dailyCacheKey = `global_daily_${modelName}`;
  // Key for RPM limit (tracks timestamps of requests)
  const rpmCacheKey = `global_rpm_${modelName}`;

  // --- Concurrent Request Limit ---
  const currentConcurrent = activeRequests.get(modelName) || 0;
  if (currentConcurrent >= limits.concurrent) {
    return res.status(429).json({ error: `Too many concurrent requests for model ${modelName}. Limit: ${limits.concurrent}` });
  }

  // --- Daily Limit Check ---
  const dailyRecord = cache.get(dailyCacheKey) || { count: 0, resetTime: now + RPD };
  if (now > dailyRecord.resetTime) {
    dailyRecord.count = 0;
    dailyRecord.resetTime = now + RPD;
  }
  if (dailyRecord.count >= limits.daily) {
    return res.status(429).json({ error: `Daily request limit reached for model ${modelName}. Limit: ${limits.daily}` });
  }

  // --- RPM Limit Check ---
  const rpmRecord = cache.get(rpmCacheKey) || []; // Stores timestamps of requests in the last minute
  // Filter out requests older than 1 minute
  const recentRpmRequests = rpmRecord.filter(timestamp => now - timestamp < RPM);
  if (recentRpmRequests.length >= limits.rpm) {
    return res.status(429).json({ error: `Requests per minute limit reached for model ${modelName}. Limit: ${limits.rpm}` });
  }

  // Increment active requests
  activeRequests.set(modelName, currentConcurrent + 1);

  // Store updated daily count
  const newDailyRecord = { count: dailyRecord.count + 1, resetTime: dailyRecord.resetTime };
  cache.set(dailyCacheKey, newDailyRecord);

  // Store updated RPM record
  const newRpmRecord = [...recentRpmRequests, now];
  cache.set(rpmCacheKey, newRpmRecord);

  // Decrement active requests when response finishes
  res.on('finish', () => {
    activeRequests.set(modelName, (activeRequests.get(modelName) || 1) - 1);
  });

  res.on('close', () => {
      // Handle cases where the connection closes prematurely
      if (!res.writableFinished) {
          activeRequests.set(modelName, (activeRequests.get(modelName) || 1) - 1);
      }
  });
  
  next();
};

module.exports = { globalRateLimiter, getModelFromRequest };