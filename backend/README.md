# AI Marker Backend

This is the backend API for the GCSE AI Marker application. It serves as a secure proxy for OpenRouter API calls and provides endpoints for chat completions and image processing.

## Features

- Secure API key storage (not exposed to clients)
- CORS protection with configurable allowed origins
- Support for both streaming and non-streaming API requests
- Image to text processing endpoint
- Rate limiting and error handling

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   OPENROUTER_API_KEY=your_api_key_here
   ALLOWED_ORIGINS=http://localhost:3000,https://beenycool.github.io
   ```

### Running Locally

Start the development server:
```
npm run dev
```

The server will be available at http://localhost:3001

## Deployment to Render

1. Create a new Web Service on Render
2. Link your GitHub repository
3. Use the following settings:
   - **Name**: ai-marker-backend (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add the following environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (including your GitHub Pages URL)
5. Deploy the service

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns status of the server

### Chat Completions
- **POST** `/api/chat/completions`
- Process chat completion requests

### Image Text Extraction
- **POST** `/api/image/extract`
- Extract text from images

## License

ISC 