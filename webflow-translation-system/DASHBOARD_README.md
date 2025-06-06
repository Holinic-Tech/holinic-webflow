# Translation Dashboard

A simple web interface for translating Webflow pages using AI-powered localization.

## Features

- 🌐 **Multi-language support**: German, Spanish, French, Italian, Portuguese, Dutch
- 📝 **Custom instructions**: Add specific translation guidelines per page
- 🎯 **Smart translation modes**: Full page or only untranslated content
- 💱 **Automatic currency conversion**: USD to EUR for European languages
- 📊 **Real-time progress tracking**: See translation status as it happens
- 💾 **Automatic backups**: All translations are saved to JSON files

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Ensure your `.env` file has all required variables**:
   ```
   WEBFLOW_TOKEN=your_webflow_api_token
   OPENAI_API_KEY=your_openai_api_key
   WEBFLOW_SITE_ID=your_site_id
   ```

3. **Start the dashboard**:
   ```bash
   npm run dashboard
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

## Usage

1. **Enter Page Path**: Just the slug (e.g., `the-haircare-challenge`)
2. **Select Target Language**: Choose from the dropdown
3. **Choose Translation Mode**:
   - **Full page**: Translates all content
   - **Only untranslated**: Skips already translated content
4. **Add Custom Instructions** (optional): Any specific requirements for this translation
5. **Click "Start Translation"**

## Language Guidelines

Each language has default guidelines that are automatically applied:

### German (de)
- Informal "du" throughout
- "14-Day Haircare Challenge" → "14-Tage-Haarpflege-Challenge"
- "Good hair days" → "Tage mit perfektem Haar"
- Currency: USD ($) → EUR (€)

### Spanish (es)
- Informal "tú" throughout
- Natural, conversational tone
- Currency: USD ($) → EUR (€)

### French (fr)
- Informal "tu" throughout
- Natural, conversational tone
- Currency: USD ($) → EUR (€)

## Important Notes

1. **Pages must exist in Webflow first** - Create the page structure with language subdirectories (e.g., `/de/page-name`)
2. **Locale IDs must be configured** - Currently only German is set up. Other languages need their locale IDs added to `translation-server.js`
3. **Rate limits apply** - Webflow API: 60 requests/minute

## Troubleshooting

### "Locale ID not set" error
The locale ID for that language needs to be configured. Run:
```bash
node find-locale-id.js
```
Then update the `LANGUAGE_CONFIG` in `translation-server.js`

### Connection test fails
Check that your environment variables are set correctly and the API token has the necessary permissions.

### Translation seems stuck
Check the browser console for errors. The server logs also provide detailed information about what's happening.

## File Structure

- `translation-dashboard.html` - Frontend UI
- `translation-server.js` - Express backend server
- `translation-{page}-{lang}-{timestamp}.json` - Backup files created for each translation

## Adding New Languages

1. Find the locale ID in Webflow
2. Add to `LANGUAGE_CONFIG` in `translation-server.js`
3. Add guidelines to `languagePresets` in `translation-dashboard.html`
4. Update `TRANSLATION_INSTRUCTIONS.md` with language-specific rules