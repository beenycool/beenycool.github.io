# Beenycool Backend

Backend server for the beenycool.github.io project, providing chess gameplay, user accounts, and AI features.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=3000
CHESS_PORT=10000
MONGODB_URI=mongodb://localhost:27017/beenycool
JWT_SECRET=your-secret-key-here
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Deployment on Render

### Environment Variables

Set the following environment variables in the Render dashboard:

- `NODE_ENV=production`
- `MONGODB_URI=your-mongodb-uri` (required - get this from MongoDB Atlas)
- `JWT_SECRET=your-jwt-secret` (required - generate a secure random string)
- Any other secrets (e.g., OpenAI keys)

### Build Settings

- **Root Directory:** `/` (important: this should be the backend directory)
- **Build Command:** `npm install`
- **Start Command:** `node server-start.js`

### Important Render-Specific Notes

1. **PORT Environment Variable**: Render automatically assigns a port via the `PORT` environment variable. Our code is configured to use this.

2. **MongoDB Connection**: You must provide a valid MongoDB connection string in the `MONGODB_URI` environment variable. The app is now configured to continue running even if MongoDB connection fails, but functionality will be limited.

3. **Health Check**: A health check endpoint is available at `/health` to verify the service is running.

4. **Testing MongoDB Connection**: You can run `node src/utils/mongodb-test.js` to test your MongoDB connection.

## Troubleshooting

### MongoDB Connection Issues

If you're having trouble connecting to MongoDB:

1. Ensure your MongoDB URI is correct
2. Make sure your IP whitelist in MongoDB Atlas includes Render's IPs or is set to allow access from anywhere (0.0.0.0/0)
3. Check that your MongoDB user has the correct permissions

### Port Conflicts

The server is configured to use Render's assigned port. If you see port conflict errors in the logs, the app will continue running on the Render-assigned port.

### Missing Files or Directories

The app now creates necessary directories and files if they don't exist, so you shouldn't see errors about missing files.

### Socket.io Connection Issues

If clients can't connect to the Socket.io server, check that CORS is properly configured and the client is using the correct connection URL. 