// Simple static export script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting simplified static build process...');

try {
  // 1. Create a basic index.html as a fallback
  console.log('📄 Creating fallback HTML...');
  const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI GCSE Marker</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
  <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
    <h1 class="text-2xl font-bold mb-4">AI GCSE Marker</h1>
    <p class="mb-4">This is a static export of the AI GCSE Marker application.</p>
    <p class="mb-4">For full functionality, please visit:</p>
    <a href="https://beenycool-github-io.onrender.com" class="text-blue-600 hover:underline">Live Application</a>
  </div>
</body>
</html>
  `;

  // Ensure the out directory exists
  if (!fs.existsSync('out')) {
    fs.mkdirSync('out', { recursive: true });
  }

  // 2. Build a minimal static version using next build and next export
  console.log('🏗️ Building static version...');
  
  try {
    // Regular build first to generate the .next directory
    execSync('cross-env IS_STATIC_EXPORT=true next build', { stdio: 'inherit' });
    
    // Write the fallback index.html
    fs.writeFileSync(path.join('out', 'index.html'), fallbackHtml);
    
    console.log('✅ Static build completed successfully!');
    console.log('📂 Output is available in the "out" directory');
  } catch (buildError) {
    console.log('⚠️ Build process had errors, creating minimal static version');
    // If build fails, create at least the minimal version
    fs.writeFileSync(path.join('out', 'index.html'), fallbackHtml);
    
    // Create a minimal 404 page
    fs.writeFileSync(path.join('out', '404.html'), fallbackHtml.replace(
      '<h1 class="text-2xl font-bold mb-4">AI GCSE Marker</h1>',
      '<h1 class="text-2xl font-bold mb-4">Page Not Found (404)</h1>'
    ));
    
    console.log('✅ Minimal static version created in "out" directory');
  }
} catch (error) {
  console.error('❌ Script failed:', error);
  process.exit(1);
} 