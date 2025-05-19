# Deployment Guide for Beenycool Backend

Follow these steps to deploy the updated backend to render.com:

## 1. Push Changes to GitHub

First, commit and push your changes to your GitHub repository:

```bash
git add .
git commit -m "Fixed backend OpenAI dependency issue and added port conflict handling for chess server"
git push origin main
```

## 2. Update Render.com Deployment

If your render.com service is connected to your GitHub repository, it may automatically deploy when you push changes. If not, follow these steps:

1. Log in to your [Render.com](https://dashboard.render.com) account
2. Navigate to your backend service
3. Click "Manual Deploy" and select "Deploy latest commit"

## 3. Check Environment Variables

Ensure the following environment variables are set in your Render.com service:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `PORT`: Should be set automatically by Render
- `CHESS_PORT`: Set to a different port than 10000 (e.g., 10001) to avoid conflicts

## 4. Monitor Deployment

Monitor the deployment logs in the Render dashboard to make sure there are no errors.

## 5. Test the Backend

After deployment completes, test your backend using these endpoints:

- Health check: `https://beenycool-github-io.onrender.com/api/health`
- Authentication: `https://beenycool-github-io.onrender.com/api/auth/login`

## 6. Fixed Issues

### Port Conflict Resolution
The chess server now has automatic port retry logic. If port 10000 is already in use (which is common on many hosting platforms), it will automatically try ports 10001, 10002, etc., up to 5 retries. You can override the initial port with the `CHESS_PORT` environment variable.

### Route.delete() Error
The previous deployment had an error: `Route.delete() requires a callback function but got a [object Undefined]`. This was caused by a non-existent controller function referenced in the API routes. The fix was to remove the `router.delete('/guilds/:id')` route since the controller function didn't exist.

### OpenAI Dependency
The backend has been modified to work without the OpenAI dependency if it's not available. OpenAI functions are now optional and will be gracefully disabled if the module is missing.

## 7. Optional: Add OpenAI API Key

If you need OpenAI capabilities, add the `OPENAI_API_KEY` environment variable in your Render.com settings.

## Troubleshooting

If you encounter any issues:

1. Check the deployment logs in Render.com dashboard
2. Verify MongoDB connection is working
3. Make sure all required npm packages are installed (openai and node-fetch have been made optional)
4. Check that the health endpoint returns a 200 status code
5. If you still see port conflicts, try setting a different `CHESS_PORT` environment variable 