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
- `MONGODB_URI=your-mongodb-uri`
- `JWT_SECRET=your-jwt-secret`
- Any other secrets (e.g., OpenAI keys)

### Build Settings

- **Root Directory:** `/`
- **Build Command:** `npm install`
- **Start Command:** `node server-start.js`

## Troubleshooting

### Port Already in Use

The server will automatically try to find an available port if the default port (10000) is already in use.

### MongoDB Connection Issues

Make sure your MongoDB URI is correct and the database server is accessible from your deployment environment.

### Socket.io Connection Issues

If clients can't connect to the Socket.io server, check that CORS is properly configured and the client is using the correct connection URL. 