// Server startup script that handles startup issues gracefully
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the ports we want to use
const MAIN_PORT = process.env.PORT || 3000;
const CHESS_PORT = process.env.CHESS_PORT || 10000;

// Try to load port manager, but provide fallbacks if it fails
let freePort, findAvailablePort;
try {
  const portManager = require('./src/utils/port-manager');
  freePort = portManager.freePort;
  findAvailablePort = portManager.findAvailablePort;
} catch (error) {
  console.warn('Could not load port-manager.js, using fallbacks:', error.message);
  // Simple fallbacks that just resolve
  freePort = () => Promise.resolve(true);
  findAvailablePort = (port) => Promise.resolve(port);
}

// Create public directories in multiple locations to ensure one works
const publicDirs = [
  path.join(__dirname, 'public'),
  path.join(__dirname, '../public'),
  '/opt/render/project/src/public'
];

for (const publicDir of publicDirs) {
  if (!fs.existsSync(publicDir)) {
    console.log(`Creating public directory at ${publicDir}`);
    try {
      fs.mkdirSync(publicDir, { recursive: true });
      // Create a basic index.html file
      const indexHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Beenycool API Server</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>Beenycool API Server</h1>
            <p>Server is running. This is a placeholder page.</p>
          </body>
        </html>
      `;
      fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);
      console.log(`Created index.html in ${publicDir}`);
    } catch (err) {
      console.error(`Error creating public directory at ${publicDir}:`, err);
    }
  }
}

async function startServers() {
  console.log('Starting backend services...');
  
  try {
    // Try to free the chess port if it's in use
    console.log(`Attempting to free chess port ${CHESS_PORT}...`);
    await freePort(CHESS_PORT);
    
    // Try to free the main port if it's in use
    console.log(`Attempting to free main port ${MAIN_PORT}...`);
    await freePort(MAIN_PORT);
    
    // Start the main server
    console.log('Starting main server...');
    const server = spawn('node', ['src/index.js'], {
      env: { 
        ...process.env,
        // If we're on Render, make sure we use their assigned PORT
        PORT: process.env.PORT || MAIN_PORT,
        CHESS_PORT: process.env.PORT || CHESS_PORT,
        // Set a flag to indicate we're on Render
        RENDER: process.env.RENDER || 'true'
      },
      stdio: 'inherit'
    });
    
    server.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
    
    // Listen for server exit
    server.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Server exited with code ${code}`);
        // Don't exit immediately, wait a bit and restart
        setTimeout(() => {
          console.log('Restarting server...');
          startServers();
        }, 5000);
      }
    });
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
}

// Start the servers
startServers().catch(err => {
  console.error('Unhandled error during startup:', err);
  process.exit(1);
}); 