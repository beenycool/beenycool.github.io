// Server startup script that handles startup issues gracefully
const { spawn } = require('child_process');
const { freePort } = require('./src/utils/port-manager');

// Define the ports we want to use
const MAIN_PORT = process.env.PORT || 3000;
const CHESS_PORT = process.env.CHESS_PORT || 10000;

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
      env: { ...process.env },
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
        process.exit(code);
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