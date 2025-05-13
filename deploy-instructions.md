# Deployment Instructions for GCSE AI Marker

This guide will help you properly deploy the GCSE AI Marker application, ensuring both the backend and frontend work correctly.

## 1. Backend Deployment (Render)

### Prerequisites
- A [Render](https://render.com/) account (free tier works)
- An [OpenRouter](https://openrouter.ai/) account and API key

### Steps

1. **Create a new Web Service on Render**
   - Log in to your Render dashboard
   - Click "New" > "Web Service"
   - Connect your GitHub repository

2. **Configure the service**
   - **Name**: `gcse-ai-marker-backend` (or your preferred name)
   - **Root Directory**: `/backend` (important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Plan**: Free

3. **Add Environment Variables**
   - Click on "Environment" tab
   - Add the following variables:
     - `OPENROUTER_API_KEY`: Your API key from OpenRouter
     - `ALLOWED_ORIGINS`: `https://beenycool.github.io,http://localhost:3000`
     - `DEBUG`: `true` (optional, for detailed logging)
   
4. **Deploy the Service**
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Note the URL assigned to your service (e.g., `https://your-backend.onrender.com`)

5. **Test the Backend**
   - Visit `https://your-backend.onrender.com/api/health` in your browser
   - You should see a JSON response with `"status": "ok"`
   - Also test `https://your-backend.onrender.com/api/test-key` to ensure your API key is working

## 2. Frontend Deployment (GitHub Pages)

### Updates to Make in Your Code

1. **Update API URL**
   - Edit `next.config.js` to update the default API URL to your Render backend URL
   - Or set the environment variable in GitHub secrets

2. **Update GitHub Actions Workflow**
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add a new repository secret:
     - Name: `NEXT_PUBLIC_API_BASE_URL`
     - Value: Your Render backend URL (e.g., `https://your-backend.onrender.com`)

3. **Trigger a New Deployment**
   - Make a small change to your code and push it to the main branch
   - Or manually trigger the GitHub Action from the Actions tab
   - Wait for the workflow to complete

## 3. Troubleshooting

If you encounter issues after deployment:

### Common Backend Issues

1. **Backend is sleeping**
   - Render free tier puts services to sleep after inactivity
   - The first request after sleep can take 30+ seconds
   - In your frontend code, we've added logic to handle this gracefully

2. **OpenRouter API key issues**
   - Check if your key is valid on OpenRouter.ai
   - Verify it's correctly set in the environment variables
   - Look for 401 errors in the Render logs

### Common Frontend Issues

1. **API URL mismatch**
   - Make sure the `NEXT_PUBLIC_API_BASE_URL` points to your Render service
   - Check browser console for CORS errors

2. **Deployment failed**
   - Check the GitHub Actions logs for any build errors
   - Ensure all dependencies are correctly installed

## 4. Maintaining Your Deployment

Render's free tier has limitations:

- Services sleep after inactivity
- Limited compute hours per month
- The first request after sleep can be slow

Consider upgrading to a paid plan if:
- You need more reliable performance
- You're experiencing frequent timeouts
- You need more compute hours per month

## 5. Monitoring and Logs

- **Backend logs**: Available in your Render dashboard
- **Frontend issues**: Check browser console for errors
- **API issues**: Added `/api/health` and `/api/test-key` endpoints for easier debugging

## Need More Help?

Refer to the `DEBUG.md` file for detailed troubleshooting steps and common issues. 