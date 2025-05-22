#!/bin/bash

# Exit on error
set -e

echo "Starting deployment script..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build Next.js frontend
echo "Building Next.js frontend..."
npm run build

# Run database migrations (if you have any)
echo "Running database migrations..."
# Add your migration command here if you have one

# Create admin user
echo "Creating admin user..."
node backend/src/scripts/create-admin.js

# Start the unified server
echo "Starting the unified server..."
npm start 