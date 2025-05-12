# GCSE AI Marker

A web application that uses AI to provide feedback and grades for GCSE answers.

## Architecture

This project consists of two parts:
1. **Frontend** - A Next.js application deployed to GitHub Pages
2. **Backend** - An Express API deployed to Render (free tier)

This architecture allows us to securely store API keys on the backend while serving the frontend as a static site on GitHub Pages.

## Local Development

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   PORT=3001
   OPENROUTER_API_KEY=your_api_key_here
   ALLOWED_ORIGINS=http://localhost:3000,https://beenycool.github.io
   ```

4. Start the backend:
   ```
   npm run dev
   ```

### Frontend Setup

1. Install dependencies in the root directory:
   ```
   npm install
   ```

2. Make sure `.env.local` has:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```

3. Start the frontend:
   ```
   npm run dev
   ```

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set these configuration values:
   - **Name**: `ai-marker-backend` (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Add environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `ALLOWED_ORIGINS`: `https://beenycool.github.io`
   - `PORT`: `10000` (or whichever port Render uses)

5. Once deployed, copy the service URL (e.g., https://ai-marker-backend.onrender.com)

### Frontend Deployment (GitHub Pages)

1. Add the backend URL to your GitHub repository's Secrets:
   - Go to Settings > Secrets > Actions
   - Add `NEXT_PUBLIC_API_BASE_URL` with the value of your Render service URL

2. Update your next.config.js if needed:
   - If your site is not at username.github.io (but at username.github.io/repo-name), uncomment and update the `basePath` and `assetPrefix`

3. Build and deploy:
   ```
   npm run build && npm run deploy
   ```

## Features

- Subject detection for GCSE answers
- Image processing to extract text from handwritten answers
- Detailed feedback with strengths and areas for improvement
- Grade estimation
- Multiple AI model options

## License

ISC
