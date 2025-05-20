/**
 * Utility to manage port conflicts
 */

// Simple version that works on all platforms
function freePort(port) {
  console.log(`Checking port ${port} (simplified for Render)`);
  // On Render, we don't need to free ports as they're managed by the platform
  return Promise.resolve(true);
}

// Find an available port
function findAvailablePort(startPort, maxAttempts = 10) {
  console.log(`Finding available port from ${startPort}`);
  // On Render, we use the provided PORT environment variable
  if (process.env.PORT) {
    return Promise.resolve(parseInt(process.env.PORT, 10));
  }
  return Promise.resolve(startPort);
}

module.exports = {
  freePort,
  findAvailablePort
}; 