# GCSE AI Marker Maintenance Guide

This document provides instructions for maintaining and troubleshooting the GCSE AI Marker application.

## System Architecture

The application consists of two main components:

1. **Frontend**: A Next.js application hosted on GitHub Pages
2. **Backend**: A Node.js/Express API server hosted on Render.com

## Backend Setup

### Local Development

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with:
   ```
   PORT=3001
   ALLOWED_ORIGINS=http://localhost:3000,https://beenycool.github.io
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   NODE_ENV=development
   ```

4. Get an API key from [OpenRouter](https://openrouter.ai/)

5. Start the server:
   ```bash
   npm run dev
   ```

### Production Deployment

The backend is deployed on Render.com:

1. Push your code to GitHub
2. Connect your repository to Render.com
3. Create a new Web Service using the `backend` directory
4. Set the following environment variables:
   - `PORT`: `3001`
   - `ALLOWED_ORIGINS`: `https://beenycool.github.io`
   - `OPENROUTER_API_KEY`: Your API key
   - `NODE_ENV`: `production`
5. Select "Auto Deploy" to automatically update the backend when you push to GitHub

## Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. For local development:
   ```bash
   npm run dev
   ```

3. To build for production:
   ```bash
   npm run build
   ```

4. To deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Troubleshooting

### Common Issues

#### 1. "Failed to get feedback" Error

This usually indicates one of the following issues:

- **Backend is unreachable**: Check if the backend service is running on Render.com
- **API key is invalid or expired**: Verify the OpenRouter API key in the backend environment variables
- **Model not available**: Ensure the selected model is supported by OpenRouter

#### 2. Backend Waking Up Delay

Render's free tier puts services to sleep after inactivity. The first request may take up to 50 seconds. Solutions:

- Inform users with a message about the potential delay
- Use a paid Render tier to keep the service always active
- Implement a backend health check to "wake up" the service periodically

#### 3. Rate Limiting Issues

Some models (like Gemini 2.5 Pro) have specific rate limits:

- The application already implements retry logic and proper error handling
- Consider adding a queue system for high-traffic periods
- Monitor usage patterns and adjust model selection accordingly

## Maintenance Tasks

### Regular Updates

1. **Update Dependencies**: Run `npm update` in both frontend and backend directories monthly
2. **Check AI Models**: Periodically verify that the AI models in `app/aimarker.jsx` are still available on OpenRouter
3. **Monitor Backend Logs**: Check Render.com logs for errors or performance issues

### Performance Optimization

1. **Caching**: Consider implementing caching for frequently used responses
2. **Content Delivery Network**: Use a CDN for static assets
3. **Image Optimization**: Ensure images are properly optimized

## Contact Support

For issues with:

- **OpenRouter API**: Contact OpenRouter support at support@openrouter.ai
- **Render.com Hosting**: Visit Render's support portal at https://render.com/support
- **Application Code**: Open an issue on the GitHub repository

## Emergency Procedures

If the application is completely down:

1. Check backend status on Render.com dashboard
2. Verify OpenRouter API status on their status page
3. Deploy a fallback version if needed from a stable branch 