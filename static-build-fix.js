// Script to help with static export by removing problematic API routes
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting enhanced static build process...');

// Get all API route directories
const apiDir = path.join(__dirname, 'app', 'api');
const backupDir = path.join(__dirname, '.api-backup');

// Check if the API directory exists
if (!fs.existsSync(apiDir)) {
  console.log('No API directory found, proceeding with normal build');
  execSync('cross-env IS_STATIC_EXPORT=true next build', { stdio: 'inherit' });
  process.exit(0);
}

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Backup and remove API routes
console.log('📦 Backing up API routes...');
try {
  // Copy API directory to backup
  execSync(`xcopy "${apiDir}" "${backupDir}" /E /I /H /Y`, { stdio: 'inherit' });
  
  // Remove the API directory
  execSync(`rmdir "${apiDir}" /S /Q`, { stdio: 'inherit' });
  
  // Create a stub API directory with a static export helper
  fs.mkdirSync(apiDir, { recursive: true });
  fs.writeFileSync(
    path.join(apiDir, 'static-export-note.txt'), 
    'API routes are not available in static exports. This file is a placeholder.'
  );
  
  // Run the static build
  console.log('🏗️ Running static build without API routes...');
  execSync('cross-env IS_STATIC_EXPORT=true next build', { stdio: 'inherit' });
  
  // Restore API routes
  console.log('🔄 Restoring API routes...');
  execSync(`rmdir "${apiDir}" /S /Q`, { stdio: 'inherit' });
  execSync(`xcopy "${backupDir}" "${apiDir}" /E /I /H /Y`, { stdio: 'inherit' });
  
  // Clean up backup
  execSync(`rmdir "${backupDir}" /S /Q`, { stdio: 'inherit' });
  
  console.log('✅ Static build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  
  // Always restore API routes, even if build fails
  if (fs.existsSync(backupDir)) {
    console.log('🔄 Restoring API routes after failure...');
    if (fs.existsSync(apiDir)) {
      execSync(`rmdir "${apiDir}" /S /Q`, { stdio: 'inherit' });
    }
    execSync(`xcopy "${backupDir}" "${apiDir}" /E /I /H /Y`, { stdio: 'inherit' });
    execSync(`rmdir "${backupDir}" /S /Q`, { stdio: 'inherit' });
  }
  
  process.exit(1);
} 