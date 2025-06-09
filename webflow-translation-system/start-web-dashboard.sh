#!/bin/bash

echo "🌐 Starting Webflow Translation Dashboard..."
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

# Install required packages if not present
REQUIRED_PACKAGES="express cors"
for package in $REQUIRED_PACKAGES; do
    if [ ! -d "node_modules/$package" ]; then
        echo "📦 Installing $package..."
        npm install $package
    fi
done

echo ""
echo "✅ Starting dashboard server..."
echo ""

# Start the server and open browser
node dashboard-server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Open the dashboard in default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000/translation-dashboard-web.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000/translation-dashboard-web.html
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    start http://localhost:3000/translation-dashboard-web.html
fi

# Keep the script running
wait $SERVER_PID