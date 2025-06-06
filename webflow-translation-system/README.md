# Webflow Translation System

A simplified translation system for Webflow pages using the Data API v2. This system translates existing pages that you've manually created in language-specific folders.

## Features

- 🌍 Translate Webflow pages to 6 languages (German, French, Spanish, Italian, Portuguese, Dutch)
- ✅ Preserves page layout and design
- 🔄 Uses Webflow Data API for reliable content updates
- 📝 Three access methods: CLI, Web UI, API
- 🚀 Automatic page publishing after translation
- 🧪 Mock mode for testing without API keys

## How It Works

1. **You manually create** pages in language folders (/de, /es, /fr, etc.)
2. **The system fetches** page content using Webflow's Data API
3. **Text is translated** using OpenAI GPT-4
4. **Content is updated** back to Webflow via Data API
5. **Page is published** automatically

## Quick Start

### Prerequisites

1. Webflow API token (with page edit permissions)
2. OpenAI API key
3. Node.js v14 or higher

### Setup Instructions

1. **Install dependencies**
   ```bash
   cd webflow-translation-system
   npm install
   ```

2. **Set up your API keys**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

3. **Test the setup**
   ```bash
   node test-setup.js
   ```

4. **Try a mock translation** (no API keys needed)
   ```bash
   node translate-mock.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"
   ```

5. **Run a real translation**
   ```bash
   node translate-existing-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"
   ```

## Usage

### Method 1: Command Line

```bash
node translate-existing-page.js --url="hairqare.co/de/page-name" --lang="de"
```

### Method 2: Web Interface

1. Open `translate-page.html` in your browser
2. Enter the page URL
3. Select target language
4. Click "Translate Page Content"

### Method 3: API (after Cloudflare deployment)

```bash
curl -X POST https://your-worker.workers.dev/translate-page \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "url": "hairqare.co/de/page-name",
    "targetLanguage": "de"
  }'
```

## Workflow Example

1. **In Webflow**: Duplicate `/the-haircare-challenge` to `/de/the-haircare-challenge`
2. **Run translation**: `node translate-existing-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"`
3. **Result**: All text on the German page is now translated

## What Gets Translated

- ✅ All text content (headings, paragraphs, buttons)
- ✅ SEO metadata (if accessible)
- ✅ Alt text for images
- ✅ Link text

## What Stays the Same

- ✅ Page structure and layout
- ✅ Styles and design
- ✅ Images and media
- ✅ Components and interactions

## Troubleshooting

### "Page not found" error
- Ensure the page is published in Webflow
- Check the URL includes the language folder
- Try using just the slug without domain

### "Translation failed" error
- Check your OpenAI API quota
- Verify API keys are correct
- Try translating a smaller page first

### Text not updating
- Make sure the page was published after duplication
- Check that the page isn't using dynamic CMS content
- Verify the API has write permissions

## Files

- `translate-existing-page.js` - Command-line translation script
- `translate-page.html` - Web interface for translations
- `src/worker-simple.js` - Cloudflare Worker API endpoint
- `translate-mock.js` - Mock translation for testing
- `test-setup.js` - Setup verification script
- `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions

## Cloudflare Deployment

For production use with the API endpoint:

```bash
# Deploy worker
wrangler deploy src/worker-simple.js -c wrangler-simple.toml

# Set secrets
wrangler secret put WEBFLOW_TOKEN
wrangler secret put OPENAI_API_KEY
```

See `DEPLOYMENT_GUIDE.md` for full instructions.

## Support

For issues or questions:
- Check `DEPLOYMENT_GUIDE.md` for detailed setup
- Review `WORK_LOG_2025_01_06.md` for implementation details
- Create an issue in the GitHub repository