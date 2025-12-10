#!/bin/bash
# Quick deployment script for Vision2Eye

echo "🚀 Building Vision2Eye for mobile deployment..."

# Build the app
npm run build

# Start simple HTTP server on network
echo "📱 Starting server accessible on your phone..."
echo "🌐 Access from your phone at: http://$(hostname -I | awk '{print $1}'):8080"
echo "📱 Or use your computer's IP address on port 8080"
echo "⭐ Add to home screen for app-like experience!"

# Serve the build folder
npx serve -s build -p 8080 --host 0.0.0.0