# Deploying GCSE AI Marker to Render

This guide will help you deploy both the frontend and backend of the GCSE AI Marker to Render's free tier.

## Prerequisites

1. Create a [Render](https://render.com/) account
2. Get an API key from [OpenRouter](https://openrouter.ai/)
3. Push your code to a GitHub repository (or be prepared to use manual deploy)

## Step 1: Deploy the Backend

1. In Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repo or use "Deploy from existing repo"
3. Configure the service:
   - **Name**: gcse-ai-marker-backend (or your preferred name)
   - **Root Directory**: `backend` (select the backend directory)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Plan**: Free

4. Add the following environment variables:
   - `ALLOWED_ORIGINS`: Your frontend URL(s), comma separated (e.g., `https://your-frontend.onrender.com,http://localhost:3000`)
   - `OPENROUTER_API_KEY`: Your API key from OpenRouter
   - `NODE_ENV`: `production`
   
   Note: Render will automatically provide a PORT variable, so you don't need to set it.

5. Click "Create Web Service" and wait for the deployment to complete

## Step 2: Deploy the Frontend

1. In Render dashboard, click "New" and select "Static Site"
2. Connect your GitHub repo
3. Configure the service:
   - **Name**: gcse-ai-marker (or your preferred name)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`
   - **Plan**: Free

4. Add the following environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your backend URL (e.g., `https://gcse-ai-marker-backend.onrender.com`)

5. Click "Create Static Site" and wait for the deployment to complete

## Step 3: Test Your Deployment

1. Visit your frontend URL
2. Try submitting a sample question and answer
3. Verify that the backend is correctly processing the requests

## Troubleshooting

- **CORS Issues**: Make sure your backend's `ALLOWED_ORIGINS` includes your frontend's URL
- **API Connection Problems**: Verify the `NEXT_PUBLIC_API_BASE_URL` is correctly set
- **OpenRouter Issues**: Check your API key is valid and has proper permissions

## Updating Your Deployment

Render automatically redeploys your application when you push changes to your connected GitHub repository.

## Note About Free Tier Limitations

- Render's free tier has limited compute resources
- The backend will "spin down" after periods of inactivity
- The first request after inactivity may take 30+ seconds to respond
- There are also monthly limits on compute hours 