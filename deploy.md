# Deployment Guide for Beenycool Backend

Follow these steps to deploy the updated backend to render.com:

## 1. Push Changes to GitHub

First, commit and push your changes to your GitHub repository:

```bash
git add .
git commit -m "Fixed backend OpenAI dependency issue"
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

## 4. Monitor Deployment

Monitor the deployment logs in the Render dashboard to make sure there are no errors.

## 5. Test the Backend

After deployment completes, test your backend using these endpoints:

- Health check: `https://beenycool-github-io.onrender.com/api/health`
- Authentication: `https://beenycool-github-io.onrender.com/api/auth/login`

## 6. Optional: Add OpenAI API Key

If you need OpenAI capabilities, add the `OPENAI_API_KEY` environment variable in your Render.com settings.

## Troubleshooting

If you encounter any issues:

1. Check the deployment logs in Render.com dashboard
2. Verify MongoDB connection is working
3. Make sure all required npm packages are installed (openai and node-fetch have been made optional)
4. Check that the health endpoint returns a 200 status code 