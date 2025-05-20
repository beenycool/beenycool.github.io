/**
 * Utility to manage port conflicts - Render-optimized version
 */

// Simple version that works on Render
function freePort(port) {
  console.log(`Checking port ${port} (simplified for Render)`);
  // On Render, we should use their assigned port
  if (process.env.PORT) {
    console.log(`Render has assigned port ${process.env.PORT}`);
  }
  // Always resolve - we don't need to free ports on Render
  return Promise.resolve(true);
}

// Find an available port - on Render, use their assigned port
function findAvailablePort(startPort, maxAttempts = 10) {
  // On Render, we use the provided PORT environment variable
  if (process.env.PORT) {
    const renderPort = parseInt(process.env.PORT, 10);
    console.log(`Using Render-assigned port: ${renderPort}`);
    return Promise.resolve(renderPort);
  }
  
  // For local development, just use the provided port
  console.log(`Using provided port: ${startPort}`);
  return Promise.resolve(startPort);
}

module.exports = {
  freePort,
  findAvailablePort
}; 