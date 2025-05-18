const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Setup logging function with timestamps
const logger = {
  info: (message, data) => {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`, data ? data : '');
  },
  error: (message, error) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
  },
  debug: (message, data) => {
    if (process.env.DEBUG) {
      console.log(`[${new Date().toISOString()}] DEBUG: ${message}`, data ? data : '');
    }
  }
};

// Create rate limiters
const minuteRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', message: 'Please try again later. Rate limit: 10 requests per minute.' },
  keyGenerator: (req) => {
    // Use IP address as the identifier
    return req.ip;
  },
  handler: (req, res, next, options) => {
    logger.info(`Rate limit exceeded: ${req.ip} - ${req.method} ${req.url}`);
    res.status(429).json(options.message);
  }
});

const dailyRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 500, // 500 requests per day
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Daily limit exceeded', message: 'You have reached the daily limit of 500 requests. Please try again tomorrow.' },
  keyGenerator: (req) => {
    // Use IP address as the identifier
    return req.ip;
  },
  handler: (req, res, next, options) => {
    logger.info(`Daily rate limit exceeded: ${req.ip} - ${req.method} ${req.url}`);
    res.status(429).json(options.message);
  }
});

// Apply rate limiters to specific endpoints
const geminiRateLimits = [dailyRateLimiter, minuteRateLimiter];

const app = express();
const PORT = process.env.PORT || 3001;

// Configure allowed origins - ENSURE GitHub Pages domain is explicitly included
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'https://beenycool.github.io'];

// Always ensure GitHub Pages domain is in the allowed origins
if (!allowedOrigins.includes('https://beenycool.github.io')) {
  allowedOrigins.push('https://beenycool.github.io');
}

// Remove any entries without protocol
const filteredOrigins = allowedOrigins.filter(origin => 
  origin.startsWith('http://') || origin.startsWith('https://')
);

// Add missing protocol to entries if needed
for (const origin of allowedOrigins) {
  if (!origin.startsWith('http://') && !origin.startsWith('https://') && origin !== '') {
    if (!filteredOrigins.includes(`https://${origin}`)) {
      filteredOrigins.push(`https://${origin}`);
    }
  }
}

logger.info(`Server starting with allowed origins:`, filteredOrigins);
logger.info(`OpenRouter API Key exists: ${!!process.env.OPENROUTER_API_KEY}`);
logger.info(`Gemini API Key exists: ${!!process.env.GEMINI_API_KEY}`);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    if (filteredOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.info(`Origin ${origin} not allowed by CORS`);
      // Still allow the request to proceed but log it
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}

// Improved CORS setup
app.use(cors(corsOptions));

// Add explicit handling for OPTIONS requests (preflight)
app.options('*', cors(corsOptions));

// Also add a simple middleware to ensure CORS headers are always set
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && filteredOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // If no origin header or unknown origin, set to the first allowed origin
    res.header('Access-Control-Allow-Origin', filteredOrigins[0]);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-stainless-timeout, x-stainless-os', 'x-stainless-arch', 'x-stainless-runtime', 'x-stainless-runtime-version', 'x-stainless-package-version', 'x-stainless-retry-count');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json({ limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  logger.info(`${req.method} ${req.url} - Request received`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Initialize OpenAI client
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'https://beenycool.github.io',
      'X-Title': 'GCSE AI Marker'
    }
  });
  logger.info('OpenAI client initialized successfully');
} catch (error) {
  logger.error('Failed to initialize OpenAI client', error);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthData = {
    status: 'ok',
    message: 'Server is running',
    environment: {
      node: process.version,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    },
    openaiClient: !!openai,
    apiKeyConfigured: !!process.env.OPENROUTER_API_KEY,
    geminiApiKeyConfigured: !!process.env.GEMINI_API_KEY,
    rateLimits: {
      minute: {
        max: minuteRateLimiter.max,
        windowMs: minuteRateLimiter.windowMs
      },
      daily: {
        max: dailyRateLimiter.max,
        windowMs: dailyRateLimiter.windowMs
      }
    },
    corsConfig: {
      allowedOrigins
    }
  };
  logger.debug('Health check response', healthData);
  res.status(200).json(healthData);
});

// Main API endpoint for chat completions
app.post('/api/chat/completions', async (req, res) => {
  try {
    const { model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, stream } = req.body;
    
    // Validate required fields
    if (!model || !messages || !Array.isArray(messages)) {
      logger.error('Invalid request - missing required fields', { model: !!model, messages: !!messages });
      return res.status(400).json({ error: 'Invalid request. Model and messages array are required.' });
    }

    logger.info(`Processing chat completion request for model: ${model}`, {
      messageCount: messages.length,
      streaming: !!stream
    });

    // Check if OpenAI client is properly initialized
    if (!openai) {
      logger.error('OpenAI client not initialized');
      return res.status(500).json({ error: 'OpenAI client not initialized' });
    }

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      logger.error('OpenRouter API key not configured');
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    // Add timeout for OpenAI requests
    const timeoutMs = 60000; // 60 seconds
    const timeout = setTimeout(() => {
      logger.error(`Request timed out after ${timeoutMs}ms`);
      if (!res.headersSent) {
        return res.status(504).json({ 
          error: 'Request timed out',
          message: 'The OpenRouter API took too long to respond'
        });
      }
    }, timeoutMs);

    // Check if stream is requested
    if (stream) {
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      logger.debug('Starting streaming completion');
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 4000,
        top_p: top_p || 1,
        frequency_penalty: frequency_penalty || 0,
        presence_penalty: presence_penalty || 0,
        stream: true
      });

      // Stream the response
      let chunkCount = 0;
      for await (const chunk of completion) {
        chunkCount++;
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        // Flush the data
        if (res.flush) res.flush();
      }
      
      logger.info(`Streaming completion finished - sent ${chunkCount} chunks`);
      res.write('data: [DONE]\n\n');
      clearTimeout(timeout);
      return res.end();
    } 
    else {
      // Regular non-streaming request
      logger.debug('Starting non-streaming completion');
      const completion = await openai.chat.completions.create({
        model,
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 4000,
        top_p: top_p || 1,
        frequency_penalty: frequency_penalty || 0,
        presence_penalty: presence_penalty || 0,
        stream: false
      });
      
      logger.info('Non-streaming completion finished successfully');
      logger.debug('Response data:', completion);
      clearTimeout(timeout);
      
      // Format the response to match what the frontend expects
      // The frontend checks for choices[0].message.content first
      if (completion.choices && completion.choices[0] && completion.choices[0].message) {
        return res.json(completion);
      } else {
        // If we don't have the expected format, create a compatible structure
        return res.json({
          choices: [{
            message: {
              content: completion.content || (completion.choices && completion.choices[0] ? completion.choices[0].text : "No content available")
            }
          }]
        });
      }
    }
  } catch (error) {
    logger.error('Chat completion error', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      status: error.status,
      code: error.code
    });

    // Handle different types of errors
    if (error.name === 'AuthenticationError') {
      return res.status(401).json({
        error: 'API key authentication failed',
        message: 'Please check your OpenRouter API key'
      });
    } else if (error.name === 'RateLimitError') {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'The API rate limit has been exceeded. Please try again later.'
      });
    } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: 'Connection error',
        message: 'Connection to OpenRouter API timed out or was reset'
      });
    } else {
      return res.status(500).json({ 
        error: 'An error occurred while processing your request',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
});

// Image processing endpoint
app.post('/api/image/extract', async (req, res) => {
  try {
    const { image_base64 } = req.body;
    
    if (!image_base64) {
      logger.error('Image extraction request missing image data');
      return res.status(400).json({ error: 'Image data is required' });
    }

    logger.info('Processing image extraction request');

    const timeoutMs = 60000; // 60 seconds to match frontend timeout
    const timeout = setTimeout(() => {
      logger.error(`Image extraction request timed out after ${timeoutMs}ms`);
      if (!res.headersSent) {
        return res.status(504).json({ 
          error: 'Request timed out',
          message: 'The image processing request took too long to complete'
        });
      }
    }, timeoutMs);

    const imageCompletion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Convert this image to text with autocorrection for spelling and grammar. Return only the corrected text." },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image_base64}` } },
          ],
        },
      ],
      max_tokens: 2000
    });

    const extractedText = imageCompletion.choices[0].message.content;
    logger.info('Image extraction completed successfully');
    clearTimeout(timeout);
    return res.json({ text: extractedText });
  } catch (error) {
    logger.error('Image extraction error', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing the image',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Add a test endpoint to verify API key
app.get('/api/test-key', (req, res) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'The OpenRouter API key is not configured on the server'
    });
  }
  
  // Only show first and last few characters of the key for security
  const key = process.env.OPENROUTER_API_KEY;
  const maskedKey = key.length > 8 
    ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
    : '****';
  
  return res.json({
    status: 'ok',
    message: 'API key is configured',
    keyInfo: {
      configured: true,
      masked: maskedKey,
      length: key.length
    }
  });
});

// Add a test endpoint to verify Gemini API key
app.get('/api/test-gemini-key', (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'Gemini API key not configured',
      message: 'The Gemini API key is not configured on the server'
    });
  }
  
  // Only show first and last few characters of the key for security
  const key = process.env.GEMINI_API_KEY;
  const maskedKey = key.length > 8 
    ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
    : '****';
  
  return res.json({
    status: 'ok',
    message: 'Gemini API key is configured',
    keyInfo: {
      configured: true,
      masked: maskedKey,
      length: key.length
    }
  });
});

// Add a CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  // Get the origin that made the request
  const origin = req.headers.origin || 'No origin header';
  
  // Return info that can help diagnose CORS issues
  res.status(200).json({
    message: 'CORS test successful',
    receivedOrigin: origin,
    corsAllowed: filteredOrigins.includes(origin),
    allowedOrigins: filteredOrigins,
    headers: {
      sent: {
        'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': res.getHeader('Access-Control-Allow-Headers'),
        'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials')
      },
      received: req.headers
    }
  });
});

// New direct Gemini API endpoint
app.post('/api/gemini/generate', geminiRateLimits, async (req, res) => {
  try {
    const { contents } = req.body;
    
    if (!contents || !Array.isArray(contents)) {
      logger.error('Gemini generation request missing or invalid contents');
      return res.status(400).json({ error: 'Valid contents array is required' });
    }

    logger.info('Processing direct Gemini API request');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error('Gemini API key not configured');
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const timeoutMs = 60000; // 60 seconds to match frontend timeout
    const timeout = setTimeout(() => {
      logger.error(`Gemini request timed out after ${timeoutMs}ms`);
      if (!res.headersSent) {
        return res.status(504).json({ 
          error: 'Request timed out',
          message: 'The Gemini API took too long to respond'
        });
      }
    }, timeoutMs);

    const model = "gemini-2.5-flash-preview-04-17";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    logger.info(`Making request to Gemini API with model: ${model}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      const errorText = await response.text();
      clearTimeout(timeout);
      logger.error(`Gemini API error: ${response.status} ${errorText}`);
      return res.status(response.status).json({ 
        error: 'Gemini API error',
        message: errorText,
        status: response.status
      });
    }

    const data = await response.json();
    logger.info('Gemini request completed successfully');
    clearTimeout(timeout);
    
    // Format the response to match the expected format by the frontend
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return res.json({
        choices: [{
          message: {
            content: data.candidates[0].content.parts[0].text
          }
        }]
      });
    } else {
      return res.json(data); // Return original format if unexpected structure
    }
  } catch (error) {
    logger.error('Gemini API error', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing your Gemini request',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Add a rate limit status endpoint
app.get('/api/rate-limit-status', (req, res) => {
  // Get the client's IP
  const clientIP = req.ip;
  
  // This is a simplified version since we don't have direct access to the hit counters
  // In a real implementation with Redis or a database, we could show actual counts
  res.status(200).json({
    status: 'ok',
    message: 'Rate limit information',
    limits: {
      minute: {
        max: minuteRateLimiter.max,
        windowMs: minuteRateLimiter.windowMs,
        resetTime: new Date(Date.now() + minuteRateLimiter.windowMs)
      },
      daily: {
        max: dailyRateLimiter.max,
        windowMs: dailyRateLimiter.windowMs,
        resetTime: new Date(Date.now() + dailyRateLimiter.windowMs)
      }
    },
    clientIP: clientIP
  });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
}); 