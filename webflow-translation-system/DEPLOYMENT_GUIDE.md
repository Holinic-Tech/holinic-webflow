# Webflow Translation System - Deployment Guide

## Prerequisites

1. **API Keys Required:**
   - Webflow API Token: Get from https://webflow.com/dashboard/account/integrations
   - OpenAI API Key: Get from https://platform.openai.com/api-keys

2. **Tools Required:**
   - Node.js (v14 or higher)
   - Cloudflare account (for Worker deployment)
   - Wrangler CLI (`npm install -g wrangler`)

## Local Setup

1. **Clone and install dependencies:**
   ```bash
   cd webflow-translation-system
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your actual API keys
   ```

3. **Test your setup:**
   ```bash
   node test-setup.js
   ```

4. **Test with mock data (no API keys needed):**
   ```bash
   node translate-mock.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"
   ```

## Cloudflare Worker Deployment

1. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

2. **Deploy the worker:**
   ```bash
   wrangler deploy src/worker-simple.js -c wrangler-simple.toml
   ```

3. **Set secrets (after deployment):**
   ```bash
   wrangler secret put WEBFLOW_TOKEN
   # Paste your Webflow API token when prompted
   
   wrangler secret put OPENAI_API_KEY
   # Paste your OpenAI API key when prompted
   ```

4. **Get your worker URL:**
   ```bash
   # It will be something like:
   # https://holinic-webflow-translation-simple.YOUR-SUBDOMAIN.workers.dev
   ```

## Usage Methods

### Method 1: Command Line

```bash
# Set up environment variables first
export WEBFLOW_TOKEN="your-token"
export OPENAI_API_KEY="your-key"

# Run translation
node translate-existing-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"
```

### Method 2: Web Interface

1. Open `translate-page.html` in your browser
2. Update line 184 with your worker URL:
   ```javascript
   const WORKER_URL = 'https://your-worker-url.workers.dev';
   ```
3. Enter the page URL and select language
4. Click "Translate Page Content"

### Method 3: Direct API Call

```bash
curl -X POST https://your-worker-url.workers.dev/translate-page \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-auth-token" \
  -d '{
    "url": "hairqare.co/de/the-haircare-challenge",
    "targetLanguage": "de"
  }'
```

## Workflow

1. **Manual Steps (You do this):**
   - Create language folder in Webflow (e.g., /de)
   - Duplicate your page into that folder
   - Ensure the page is published

2. **Automated Steps (System does this):**
   - Fetches page content via Webflow API
   - Translates all text using OpenAI
   - Updates the page with translations
   - Publishes the updated page

## Troubleshooting

### "Page not found" error
- Ensure the page is published in Webflow
- Check the URL format (should include language folder)
- Try using just the slug without domain

### "Unauthorized" error
- Check your API keys are correct
- Ensure secrets are set in Cloudflare Worker
- Verify token has proper permissions

### "Translation failed" error
- Check OpenAI API quota/credits
- Verify API key is active
- Try a smaller page first

### Empty translations
- Page might be using dynamic content
- Check if text is in CMS collections
- Verify page structure in Webflow

## Security Notes

- Never commit API keys to git
- Use environment variables locally
- Use Cloudflare secrets for production
- Rotate keys regularly
- Monitor API usage

## Next Steps

1. Test with a single page first
2. Verify translation quality
3. Set up batch processing for multiple pages
4. Consider adding translation caching
5. Monitor API costs and usage