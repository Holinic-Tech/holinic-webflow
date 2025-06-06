# Cloudflare Worker Deployment Guide

## Local Development

1. **Copy your environment variables**:
   ```bash
   cp .env .dev.vars
   ```

2. **Start the development server**:
   ```bash
   wrangler dev --config wrangler-dashboard.toml --local
   ```

3. **Access the dashboard**: http://localhost:8787

## Production Deployment

### Step 1: Set Secrets
```bash
# Set your API keys as secrets
wrangler secret put WEBFLOW_TOKEN --config wrangler-dashboard.toml
wrangler secret put OPENAI_API_KEY --config wrangler-dashboard.toml
```

### Step 2: Deploy to Cloudflare
```bash
wrangler deploy --config wrangler-dashboard.toml
```

This will give you a URL like: `https://webflow-translation-dashboard.{your-subdomain}.workers.dev`

### Step 3: Custom Domain (Optional)
1. Add to `wrangler-dashboard.toml`:
   ```toml
   routes = [
     { pattern = "translate.hairqare.co/*", custom_domain = true }
   ]
   ```

2. Set up the custom domain in Cloudflare dashboard

## Usage

1. Navigate to your worker URL
2. Enter page details:
   - **Page Path**: `the-haircare-challenge` (just the slug)
   - **Language**: Select from dropdown
   - **Mode**: Full or untranslated only
   - **Custom Instructions**: Optional additional guidelines

3. Click "Start Translation" and watch real-time progress!

## Features

- ✅ Real-time progress tracking
- ✅ Handles pagination (all nodes)
- ✅ Only updates selected language locale
- ✅ Automatic currency conversion for EUR countries
- ✅ Custom translation instructions per page
- ✅ No local setup required once deployed

## Troubleshooting

### "Locale ID not set" Error
Some languages need their locale IDs configured. Run this locally:
```bash
node find-all-locale-ids.js
```
Then update the `LANGUAGE_CONFIG` in `src/translation-worker.js`.

### Rate Limits
- Webflow API: 60 requests/minute
- OpenAI API: Check your plan limits

### Debugging
Check the Cloudflare dashboard for:
- Real-time logs
- Error messages
- Worker analytics