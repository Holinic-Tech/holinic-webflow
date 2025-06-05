# Complete Webflow Translation Workflow

## Overview
Since Webflow's API doesn't support creating pages programmatically, we use a hybrid approach:
1. **Automated translation** of content
2. **Manual page creation** in Webflow (one-time setup)
3. **Automated content updates** via API

## Step 1: Translate Content (Automated)

Run the translation script to generate translations:

```bash
# Translate a single page
export OPENAI_API_KEY="your-api-key"
node scripts/translate-direct.js

# Or use environment variables
URL_PATTERNS="the-haircare-challenge" \
TARGET_LANGUAGE="de" \
OPENAI_API_KEY="your-api-key" \
node scripts/translate-direct.js
```

This will:
- Find the page(s) matching your pattern
- Translate all content to the target language
- Save translations to `translations/de/the-haircare-challenge-de.json`
- Cost: ~$0.002 per page

## Step 2: Create Pages in Webflow (Manual - One Time)

1. **Log into Webflow Designer**
2. **Duplicate the original page**:
   - Right-click on "the-haircare-challenge" in the Pages panel
   - Select "Duplicate"
3. **Rename the duplicated page**:
   - Slug: `de-the-haircare-challenge`
   - Name: Can be anything (e.g., "German - The Haircare Challenge")
4. **Save** (don't publish yet)

Repeat for each language you need:
- German: `de-the-haircare-challenge`
- French: `fr-the-haircare-challenge`
- Spanish: `es-the-haircare-challenge`
- Italian: `it-the-haircare-challenge`
- Portuguese: `pt-the-haircare-challenge`
- Dutch: `nl-the-haircare-challenge`

## Step 3: Apply Translations (Automated)

Once pages are created, update their content:

```bash
# Update all German pages
node scripts/update-translated-pages.js de

# Update a specific page
node scripts/update-translated-pages.js de the-haircare-challenge

# Update all French pages
node scripts/update-translated-pages.js fr
```

This will:
- Find all pages with the language prefix (e.g., `de-*`)
- Load the corresponding translation files
- Update the page content via Webflow API
- Preserve all styling and structure

## Step 4: Verify & Publish

1. **Review in Webflow Designer**:
   - Check that text is properly translated
   - Verify layout still works with translated text
   - Adjust any text overflow issues

2. **Publish the pages**:
   - Select the translated pages
   - Click "Publish"

## Automation via GitHub Actions

Set up automated translation workflow:

1. **Add your API keys to GitHub Secrets**:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `WEBFLOW_TOKEN`: Your Webflow API token

2. **Run the workflow**:
   - Go to Actions → "Webflow Direct Translation"
   - Enter patterns and language
   - Run workflow

3. **After workflow completes**:
   - Download translation files from workflow artifacts
   - Create pages manually in Webflow (if not already done)
   - Run the update script

## File Structure

```
translations/
├── de/
│   ├── the-haircare-challenge-de.json
│   └── another-page-de.json
├── fr/
│   └── the-haircare-challenge-fr.json
└── es/
    └── the-haircare-challenge-es.json
```

Each translation file contains:
- Original page info
- Translated title, SEO data
- All text translations with element IDs
- Instructions for manual steps

## Pattern Matching

- **Exact match**: `the-haircare-challenge` → Only that page
- **Wildcard prefix**: `the-haircare-*` → All pages starting with "the-haircare-"
- **Wildcard suffix**: `*-challenge` → All pages ending with "-challenge"
- **Contains**: `*haircare*` → All pages containing "haircare"

## Troubleshooting

### "No pages found with de- prefix"
- Make sure you created the pages in Webflow with correct slugs
- Pages must be saved (not necessarily published)
- Check the exact slug format: `de-original-slug`

### "Translation file not found"
- Run the translation script first to generate files
- Check the file exists in `translations/[language]/`
- Filename format: `original-slug-language.json`

### "Failed to update page content"
- Verify your Webflow token is valid
- Check API rate limits (60 requests/minute)
- Ensure the page structure hasn't changed dramatically

## Best Practices

1. **Test with one page first** before doing bulk translations
2. **Keep original pages as templates** - don't modify them
3. **Use consistent naming**: Always `[language]-[original-slug]`
4. **Version control translations**: Commit translation files to git
5. **Regular updates**: Re-run translations when original content changes

## Costs

- **Translation**: ~$0.002 per page (OpenAI API)
- **Webflow API**: Free (within rate limits)
- **Manual effort**: ~2 minutes per page for initial creation

## Future Enhancements

When Webflow releases Designer API for page creation:
1. Update scripts to create pages automatically
2. Remove manual page creation step
3. Full end-to-end automation

For now, this hybrid approach provides the best balance of automation and reliability.