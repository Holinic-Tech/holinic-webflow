# Web Translation Dashboard Guide 🌐

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Dashboard
```bash
./start-web-dashboard.sh
```

Or manually:
```bash
npm run dashboard
```

The dashboard will automatically open in your browser at `http://localhost:3000/translation-dashboard-web.html`

## Features

### 🎯 Easy Page Selection
- Visual grid of all your Webflow pages
- Click to select any page for translation
- Shows page title and slug for easy identification

### 🌍 Language Selection
- Visual language selection with flags
- Currently supports:
  - 🇩🇪 German
  - 🇫🇷 French
  - 🇪🇸 Spanish (configuration needed)
  - 🇮🇹 Italian (configuration needed)

### 📊 Real-time Progress Tracking
- Live progress bar showing translation percentage
- Real-time logs from the translation process
- Status updates (running, completed, failed)

### 💾 Resume Capability
- Automatically detects saved progress
- Shows how many nodes were already translated
- Option to clear progress and start fresh

### 🚀 One-Click Translation
- Just select a page and language
- Click "Start Translation"
- Watch the progress in real-time

## How It Works

1. **Backend Server** (`dashboard-server.js`)
   - Runs on port 3000
   - Manages translation processes
   - Provides REST API endpoints
   - Streams real-time updates

2. **Web Interface** (`translation-dashboard-web.html`)
   - Modern, responsive design
   - Real-time status updates
   - No page refreshes needed

3. **Translation Scripts**
   - Automatically selects the right script for each language
   - Runs in the background
   - Saves progress automatically

## API Endpoints

The dashboard server provides these endpoints:

- `GET /api/pages` - List all Webflow pages
- `POST /api/translate` - Start a translation
- `GET /api/status/:id` - Check translation status
- `GET /api/progress/:lang` - Check saved progress
- `DELETE /api/progress/:lang` - Clear saved progress

## Troubleshooting

### Server won't start
- Check that `.env` file exists with proper credentials
- Make sure port 3000 is not in use
- Run `npm install` to ensure all dependencies are installed

### Translation not starting
- Check server status indicator (should be green)
- Verify your API credentials in `.env`
- Check the logs in the dashboard

### Progress not updating
- Translations can take several minutes
- Check the log output for detailed status
- If stuck, try refreshing the page

## Advanced Usage

### Running on Different Port
```bash
PORT=8080 node dashboard-server.js
```

### Manual Translation Control
You can still use CLI scripts directly:
```bash
node translate-french-progressive.js
node translate-page-multilingual.js --lang de --page about
```

## Security Notes
- The dashboard runs locally on your machine
- API keys are never exposed to the browser
- All translation happens server-side

Enjoy your new translation dashboard! 🎉