const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure allowed origins from env
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

// CORS setup with specific origins
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://beenycool.github.io',
    'X-Title': 'GCSE AI Marker'
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Main API endpoint for chat completions
app.post('/api/chat/completions', async (req, res) => {
  try {
    const { model, messages, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, stream } = req.body;
    
    // Validate required fields
    if (!model || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request. Model and messages array are required.' });
    }

    // Check if stream is requested
    if (stream) {
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
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
      for await (const chunk of completion) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        // Flush the data
        if (res.flush) res.flush();
      }
      
      res.write('data: [DONE]\n\n');
      return res.end();
    } 
    else {
      // Regular non-streaming request
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
      
      return res.json(completion);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing your request',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Image processing endpoint
app.post('/api/image/extract', async (req, res) => {
  try {
    const { image_base64 } = req.body;
    
    if (!image_base64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

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
    return res.json({ text: extractedText });
  } catch (error) {
    console.error('Image Processing Error:', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing the image',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 