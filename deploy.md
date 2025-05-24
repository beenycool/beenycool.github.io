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

# Deployment Guide for Static Export

This application has been built using Next.js with static export. This means all pages are pre-rendered as HTML/CSS/JS files without the need for a Node.js server.

## Deploying to GitHub Pages

1. Build the application:
   ```
   npm run build
   ```

2. The static files will be generated in the `out` directory.

3. Push these files to the `gh-pages` branch of your repository.

## Local Testing

To test the static build locally:

1. Install serve:
   ```
   npm install -g serve
   ```

2. Run the static build:
   ```
   serve -s out
   ```

3. Visit `http://localhost:3000` in your browser.

## API Configuration

This application is configured to use a remote API backend at https://beenycool-github-io.onrender.com for dynamic functionality. The static export does not include the API routes since they require server-side execution.

In static export mode:
- API routes are disabled
- API calls are redirected to the remote backend
- Middleware is configured to handle static export conditions

## Notes for GitHub Pages Deployment

When deploying to GitHub Pages, make sure that:

1. The repository settings point to the correct branch (`gh-pages` or `main` depending on your setup)
2. Custom domain configuration (if any) is properly set up
3. The base path in `next.config.js` matches your GitHub Pages URL structure

## Troubleshooting

If you encounter issues with API calls:

1. Check that the `NEXT_PUBLIC_API_BASE_URL` is correctly set in `next.config.js`
2. Verify that CORS is properly configured on your backend
3. For local testing, you can run the development server with `npm run dev` which will enable API routes

## Deploying to Render

This application is configured for deployment on Render.com. Follow these steps for a successful deployment:

### Prerequisites

- A Render.com account
- Your code pushed to a GitHub repository

### Deployment Steps

1. **Log in to Render Dashboard**:
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Log in with your account

2. **Create a New Web Service**:
   - Click "New" and select "Web Service"
   - Connect your GitHub repository
   - Configure the service with these settings:
     - **Name**: beenycool-github-io (or your preferred name)
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Node Version**: 18.x

3. **Advanced Options**:
   - Add the following environment variables:
     - `NODE_ENV`: production
     - `NEXT_PUBLIC_API_URL`: (your Render service URL, e.g., https://beenycool-github-io.onrender.com)

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for the build and deployment to complete

### Troubleshooting

- **Build Errors**: Check the logs for any build errors. If API routes are causing issues, you can use the static export method by changing the build command to `npm run static-build`.
  
- **Runtime Errors**: Check the logs for any runtime errors. Common issues include:
  - Database connection errors: Make sure your database credentials are correctly set up
  - Missing environment variables: Check that all required env vars are set

- **Performance Issues**: If your app is slow, consider:
  - Upgrading your Render plan
  - Optimizing your code
  - Using caching

### Monitoring

- Use the Render dashboard to monitor your application
- Set up alerts for when your service goes down
- Check logs regularly for any errors or warnings

### Updates

To update your deployed application:

1. Push changes to your GitHub repository
2. Render will automatically deploy the changes if auto-deploy is enabled
3. Monitor the build and deployment progress in the Render dashboard 