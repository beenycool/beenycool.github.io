#!/bin/bash

echo "Building for GitHub Pages deployment..."

# Clean previous builds
rm -rf out/
rm -rf .next/

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build for static export
echo "Building static export..."
npm run static-build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "✅ Static files are in the 'out/' directory"
    echo "✅ Backend URL set to: https://beenycool-github-io.onrender.com"
    echo ""
    echo "📦 Deploy the 'out/' directory contents to GitHub Pages"
    echo "🔧 Make sure your backend is running at: https://beenycool-github-io.onrender.com"
else
    echo "❌ Build failed!"
    exit 1
fi