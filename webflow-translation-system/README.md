# Webflow Translation System

An automated translation system for Webflow websites that integrates GitHub Actions, Cloudflare Workers, and OpenAI to provide seamless multi-language page creation and management.

## Features

- 🌍 Translate Webflow pages to 6 languages (German, French, Spanish, Italian, Portuguese, Dutch)
- 🔗 Automatic link localization for checkout and quiz flows
- 💰 Cost tracking and reporting
- 🔄 Fallback mechanism for failed translations
- 📧 Email notifications for status updates
- 🎯 Pattern-based page selection for batch translation
- 🔍 SEO metadata translation

## Architecture

- **GitHub Actions**: Orchestrates translation workflows
- **Cloudflare Worker**: Handles Webflow API interactions and translations
- **OpenAI API**: Provides high-quality translations
- **Dashboard**: Web interface for triggering translations
- **KV Storage**: Tracks translation status and history

## Quick Start

### Prerequisites

1. Webflow API token
2. OpenAI API key
3. Cloudflare account
4. GitHub repository with Actions enabled

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Holinic-Tech/holinic-webflow.git
   cd holinic-webflow/webflow-translation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Cloudflare Worker**
   ```bash
   # Login to Cloudflare
   wrangler login
   
   # Create KV namespaces
   wrangler kv:namespace create "TRANSLATION_STATUS"
   wrangler kv:namespace create "TRANSLATION_STATUS" --preview
   
   # Update wrangler.toml with the returned namespace IDs
   ```

4. **Set Cloudflare secrets**
   ```bash
   wrangler secret put WEBFLOW_TOKEN
   wrangler secret put OPENAI_API_KEY
   wrangler secret put WORKER_AUTH_TOKEN
   ```

5. **Update configuration**
   - Edit `wrangler.toml` and add your Webflow Site ID
   - Get Site ID from: Webflow Site Settings → General → Site ID

6. **Deploy Worker**
   ```bash
   wrangler publish
   ```

7. **Configure GitHub Secrets**
   
   In your GitHub repository settings → Secrets and variables → Actions:
   
   Already configured:
   - `OPENAI_ORG_ID`
   - `OPENAI_API_KEY`
   - `WEBFLOW_TOKEN`
   
   Still needed:
   - `CLOUDFLARE_WORKER_URL`: Your worker URL (e.g., https://holinic-webflow-translation-worker.YOUR_SUBDOMAIN.workers.dev)
   - `WORKER_AUTH_TOKEN`: Same token you set in Cloudflare
   - `EMAIL_USERNAME`: Gmail address for notifications
   - `EMAIL_PASSWORD`: Gmail app password

## Usage

### Via GitHub Actions

1. Go to Actions tab in your repository
2. Select "Webflow Translation" workflow
3. Click "Run workflow"
4. Enter URL patterns and target language
5. Monitor progress in Actions log

### Via Dashboard

1. Access the dashboard at your GitHub Pages URL
2. Enter URL patterns to translate
3. Select target language
4. Click "Start Translation"

### URL Pattern Examples

- `/blog/*` - All blog pages
- `/products/*/overview` - Specific product pages
- `/about` - Exact page match
- `*pricing*` - Pages containing "pricing"

## Link Localization

The system automatically updates links:
- Checkout links: `checkout.hairqare.co/buy/...` → `checkout.hairqare.co/{lang}/buy/...`
- Quiz links: `join.hairqare.co/...` → `join.hairqare.co/{lang}/...`
- Internal links: `/page` → `/{lang}/page`

## Cost Tracking

- Uses GPT-4o-mini for cost-effective translations
- Tracks token usage and cost per page
- Provides total cost summary for each batch

## Monitoring

- Email notifications on success/failure
- KV storage for translation history
- Dashboard for checking status

## Troubleshooting

### Common Issues

1. **Rate Limiting**
   - The system includes delays between API calls
   - For large batches, consider splitting into smaller groups

2. **Translation Failures**
   - System creates fallback pages with original content
   - Manual translation can be done later

3. **Authentication Errors**
   - Verify all API tokens are correct
   - Check worker URL matches GitHub secret

## Development

### Local Testing
```bash
npm run dev
```

### Deploy Changes
```bash
npm run deploy
```

## Support

For issues or questions:
- Create an issue in the GitHub repository
- Check the work log for implementation details
- Review task files for specific features

## License

MIT License - see LICENSE file for details