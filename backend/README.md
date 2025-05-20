# Beenycool Backend

Backend server for the beenycool.github.io project, providing chess gameplay, user accounts, and AI features.

## Database

This project uses PostgreSQL for data storage. The following models are defined:

- **User**: User accounts and authentication
- **ChessGame**: Chess game data and history
- **ActivityLog**: User activity tracking
- **Guild**: User groups/teams

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up a PostgreSQL database:
   - Install PostgreSQL if you don't have it already
   - Create a database for the project: `createdb beenycool`

3. Create a `.env` file with the following variables:
```
PORT=3000
CHESS_PORT=10000
DATABASE_URL=postgresql://username:password@localhost:5432/beenycool
# Or use individual connection parameters:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=beenycool
# DB_USER=postgres
# DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-here
```

4. Run database migrations:
```bash
npm run migrate
```

5. Start the server:
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
- `DATABASE_URL` - Render will automatically provide this if you create a PostgreSQL database in your Render account
- `JWT_SECRET=your-jwt-secret` (required - generate a secure random string)
- Any other secrets (e.g., OpenAI keys)

### Database Setup

1. Create a PostgreSQL database in your Render account
2. Render will automatically set the `DATABASE_URL` environment variable
3. Connect your web service to the database

### Build Settings

- **Root Directory:** `/backend` (important: this should be the backend directory)
- **Build Command:** `npm install`
- **Start Command:** `npm run render-start` (recommended) or `node render-start.js`

### Important Render-Specific Notes

1. **PORT Environment Variable**: Render automatically assigns a port via the `PORT` environment variable. Our code is configured to use this.

2. **PostgreSQL Connection**: The app will automatically use the `DATABASE_URL` environment variable provided by Render.

3. **Health Check**: A health check endpoint is available at `/health` to verify the service is running.

4. **Database Migration**: The database schema will be automatically created on first startup.

5. **Port Binding**: Make sure the app binds to `0.0.0.0` (all interfaces) and the port specified by Render's `PORT` environment variable.

6. **Fallback Database**: If PostgreSQL is not available, the app will use an in-memory SQLite database to allow the service to start.

7. **Simplified Deployment**: For the most reliable deployment on Render, use the `render-start.js` script which provides a simplified server that's guaranteed to bind to the correct port.

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the PostgreSQL database:

1. Ensure your DATABASE_URL is correct
2. Check that your database service is running
3. Verify that your IP is allowed to connect to the database

### Port Conflicts

The server is configured to use Render's assigned port. If you see port conflict errors in the logs, the app will continue running on the Render-assigned port.

### Missing Files or Directories

The app now creates necessary directories and files if they don't exist, so you shouldn't see errors about missing files.

### Socket.io Connection Issues

If clients can't connect to the Socket.io server, check that CORS is properly configured and the client is using the correct connection URL. 

### Render Deployment Errors

If you see "Port scan timeout reached, no open ports detected" on Render:
1. Make sure the app is binding to `0.0.0.0` (all interfaces)
2. Ensure the app is using the port from `process.env.PORT`
3. Check the logs for any errors during startup
4. Verify the Root Directory is set correctly in the Render dashboard
5. Try using the simplified `render-start.js` script instead of the full server 