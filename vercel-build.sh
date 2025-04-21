#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting Vercel build process..."

# Install dependencies
echo "Installing root dependencies..."
npm install

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Create root dist directory if it doesn't exist
if [ ! -d "dist" ]; then
  echo "Creating dist directory..."
  mkdir -p dist
fi

# Copy frontend build to root dist
echo "Copying frontend build to root dist directory..."
cp -r frontend/dist/* dist/

echo "Build completed successfully!"
ls -la dist 