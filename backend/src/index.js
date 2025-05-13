const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

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

const app = express();
const PORT = process.env.PORT || 3001;

// Configure allowed origins from env
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

logger.info(`Server starting with allowed origins:`, allowedOrigins);
logger.info(`OpenRouter API Key exists: ${!!process.env.OPENROUTER_API_KEY}`);

// CORS setup with specific origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      logger.error(`CORS blocked request from origin: ${origin}`);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    logger.debug(`CORS allowed request from origin: ${origin}`);
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

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
    apiKeyConfigured: !!process.env.OPENROUTER_API_KEY
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
      clearTimeout(timeout);
      return res.json(completion);
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

    const timeoutMs = 30000; // 30 seconds
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

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
}); 