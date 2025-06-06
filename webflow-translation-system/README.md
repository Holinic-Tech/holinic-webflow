# Webflow Translation System

A comprehensive system for translating Webflow pages to different languages using the Webflow API v2 and OpenAI GPT-4. Now with full locale support for automatic translation to German and other languages.

## Features

- 🌍 Automatic translation to multiple languages (German fully configured)
- ✅ Handles large pages with progressive batch processing
- 🔄 Uses Webflow API v2 with locale support
- 📝 Multiple access methods: CLI scripts, Web UI, API
- 🚀 Automatic page publishing after translation
- 💾 Progress saving and resume capability
- 🔧 Specific translation rules (currency conversion, brand names, etc.)

## How It Works

1. **Fetches page content** using Webflow's DOM API
2. **Identifies text nodes** that need translation
3. **Translates in batches** using OpenAI GPT-4
4. **Applies translations** to the specific locale
5. **Publishes automatically** to make translations live

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

2. **Create environment file**
   ```bash
   # Create .env file with:
   WEBFLOW_TOKEN=your_webflow_api_token
   WEBFLOW_SITE_ID=your_site_id
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Configure page to translate**
   - Edit `translate-all-english-progressive.js` line 65:
   ```javascript
   const page = pagesData.pages.find(p => p.slug === 'your-page-slug');
   ```

4. **Run translation**
   ```bash
   node translate-all-english-progressive.js
   ```

## Usage

### Method 1: Progressive Translation (Recommended)

```bash
# Translate entire page progressively
node translate-all-english-progressive.js

# Check translation status
node check-challenge-status.js

# Fix specific issues (currency, phrases)
node check-and-fix-german-translations.js
```

### Method 2: Web Interface

1. Open `translation-dashboard.html` in your browser
2. Enter the page slug (e.g., "challenge")
3. Select target language (German)
4. Choose translation mode (full or untranslated only)
5. Click "Start Translation" and monitor progress

### Method 3: Quick Scripts

```bash
# Complete partial translations
node complete-challenge-translation.js

# Rapid parallel translation
node rapid-complete-translation.js

# Fix currency symbols
node fix-remaining-currency.js
```

## German Translation Configuration

The system includes specific rules for German translations:

```javascript
// Key translations enforced:
"14-Day Haircare Challenge" → "14-Tage-Haarpflege-Challenge"
"Good hair days" → "Tage mit perfektem Haar"
"Challenge" (standalone) → "Challenge" (kept as-is)
"Hairqare" → "Hairqare" (brand name, never translated)

// Currency conversion:
$99 → €99
USD → EUR
```

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

## Key Files

### Main Translation Scripts
- `translate-all-english-progressive.js` - Primary translation script with progress saving
- `complete-challenge-translation.js` - Completes partial translations
- `rapid-complete-translation.js` - Fast parallel translation for remaining nodes
- `check-and-fix-german-translations.js` - Fixes specific German translation issues

### Utility Scripts
- `check-challenge-status.js` - Shows translation progress and status
- `fix-remaining-currency.js` - Converts USD to EUR symbols
- `verify-live-page.js` - Verifies translations on live site
- `find-all-dollar-signs.js` - Searches for remaining currency symbols

### UI and Configuration
- `translation-dashboard.html` - Web interface with real-time progress
- `translate-via-cli.html` - CLI command generator
- `src/translation-worker-complete.js` - Cloudflare Worker implementation
- `wrangler-dashboard.toml` - Worker configuration

## Cloudflare Deployment

**Note**: OpenAI API has geographic restrictions that may block Cloudflare Workers. Use local scripts for reliable operation.

```bash
# Deploy worker (if in supported region)
wrangler deploy --config wrangler-dashboard.toml

# Set secrets
wrangler secret put WEBFLOW_TOKEN
wrangler secret put OPENAI_API_KEY
```

## Known Limitations

1. **Rich Text Content**: Some prices/content in Webflow Designer Rich Text elements must be updated manually
2. **CMS Content**: CMS-driven content requires separate handling
3. **OpenAI Geographic Restrictions**: Cloudflare Workers may be blocked; use local scripts instead
4. **Rate Limits**: Webflow API has rate limits; scripts include automatic delays

## Support

For issues or questions:
- Check `WORK_LOG_2025_01_06_FINAL.md` for detailed implementation notes
- Review error messages in console output
- Verify Webflow localization is enabled for your site
- Ensure API tokens have proper permissions