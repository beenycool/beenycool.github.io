# Debugging the GCSE AI Marker Application

This guide provides troubleshooting steps for common issues with the GCSE AI Marker application.

## Common Issues and Solutions

### 1. "Analyzing..." Never Completes

If the application gets stuck in the "Analyzing..." state:

#### Potential Causes:

1. **Backend Server Sleeping**: Render's free tier puts services to sleep after periods of inactivity. The first request after inactivity can take 30+ seconds to wake up the server.

2. **API Key Issues**: Your OpenRouter API key might be invalid, expired, or rate limited.

3. **Network Connectivity**: There could be connectivity issues between your GitHub Pages frontend and the Render backend.

#### Solutions:

1. **Check Backend Status**:
   - Visit your Render dashboard at https://dashboard.render.com/
   - Check if your backend service is active
   - Look for any error messages in the logs
   - Manually restart the service if needed

2. **Verify API Key**:
   - Log into OpenRouter.ai
   - Check if your API key is active and has available quota
   - Create a new key if necessary

3. **Test API Connection**:
   - Visit `{your-backend-url}/api/health` in your browser
   - Visit `{your-backend-url}/api/test-key` to verify your API key is configured

### 2. Rate Limiting Issues

#### Solutions:

1. **Wait Between Requests**: The app has built-in rate limiting (1 request per minute for Gemini 2.5 Pro)
2. **Try a Different Model**: Select a different model from the dropdown

### 3. Error Messages

For specific error messages:

- **"Failed to get feedback: Request timed out"**: The server took too long to respond. Try again later when server load may be lower.
- **"Backend connection error"**: The backend server may be sleeping or unavailable. Wait 30 seconds and try again.
- **"API key authentication failed"**: Check and update your OpenRouter API key in Render environment variables.

## Advanced Debugging

### Enabling Detailed Logging

1. Add the `DEBUG=true` environment variable to your Render service:
   - Go to your Render dashboard
   - Select your backend service
   - Go to Environment
   - Add a new environment variable: `DEBUG` with value `true`
   - Redeploy the service

2. Check the logs in Render dashboard for detailed request/response information

### Testing the Backend Directly

You can use tools like curl or Postman to test the backend API directly:

```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# Test the OpenRouter API key configuration
curl https://your-backend-url.onrender.com/api/test-key
```

### Common Error Codes

- **401**: Authentication error with OpenRouter API
- **429**: Rate limit exceeded
- **500**: Server error 
- **504**: Gateway timeout

## Deployment Checklist

If you're redeploying the application, ensure:

1. The OpenRouter API key is correctly set in Render environment variables
2. ALLOWED_ORIGINS includes your GitHub Pages domain
3. The frontend's API_BASE_URL environment variable points to your Render backend

## Need More Help?

For additional support, please check:

1. The OpenRouter documentation: https://openrouter.ai/docs
2. The Render free tier limitations: https://render.com/docs/free
3. Create an issue in the GitHub repository with detailed information about your problem 