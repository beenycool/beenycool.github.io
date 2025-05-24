// Script to ensure frontend is built during Render deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking if frontend is built...');

// Check if .next directory exists and contains build files
const nextDir = path.join(__dirname, '.next');
const hasBuild = fs.existsSync(nextDir) && 
                 fs.existsSync(path.join(nextDir, 'server')) &&
                 fs.existsSync(path.join(nextDir, 'static'));

if (!hasBuild) {
  console.log('🏗️ Frontend not built, building now...');
  try {
    // Run the Next.js build
    execSync('next build', { stdio: 'inherit' });
    console.log('✅ Frontend built successfully!');
  } catch (error) {
    console.error('❌ Failed to build frontend:', error);
    process.exit(1);
  }
} else {
  console.log('✅ Frontend already built!');
}

// Create an index.html for the root path if it doesn't exist
const publicDir = path.join(__dirname, 'public');
const indexHtml = path.join(publicDir, 'index.html');

if (!fs.existsSync(indexHtml)) {
  console.log('📝 Creating welcome page...');
  
  const welcomeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI GCSE Marker - Backend Server</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
  <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
    <h1 class="text-2xl font-bold mb-4">AI GCSE Marker</h1>
    <p class="mb-4">Backend server is running!</p>
    <p class="mb-4">To access the application:</p>
    <a href="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Go to Application</a>
    
    <div class="mt-8 pt-6 border-t border-gray-200">
      <h2 class="text-lg font-semibold mb-2">API Status</h2>
      <p class="mb-4 text-sm text-gray-700">
        The API endpoints are available at <code class="bg-gray-200 px-2 py-1 rounded">/api/*</code>
      </p>
      <p class="text-sm text-gray-500">
        Health check: <a href="/health" class="text-blue-600 hover:underline">/health</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(indexHtml, welcomeHtml);
  console.log('✅ Welcome page created!');
} 