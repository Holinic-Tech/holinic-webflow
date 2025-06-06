#!/bin/bash

echo "🚀 Starting Translation Dashboard..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with:"
    echo "  WEBFLOW_TOKEN=your_token"
    echo "  OPENAI_API_KEY=your_key"
    echo "  WEBFLOW_SITE_ID=your_site_id"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Make sure express is installed
if [ ! -d "node_modules/express" ]; then
    echo "📦 Installing express..."
    npm install express
fi

echo ""
echo "✅ Starting server..."
echo ""

# Start the server
node translation-server.js