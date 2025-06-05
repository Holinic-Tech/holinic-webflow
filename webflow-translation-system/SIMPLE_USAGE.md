# Simple Translation System - Usage Guide

## Overview
This simplified system translates existing Webflow pages that you've already created in language folders.

## Prerequisites
✅ You've created language folders (/de, /es, /fr, etc.)
✅ You've duplicated pages into those folders
✅ Pages have correct slugs (e.g., /de/the-haircare-challenge)

## How to Use

### Option 1: Command Line Script

```bash
# Navigate to the translation system folder
cd webflow-translation-system

# Run the translation
node translate-existing-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"
```

### Option 2: Web Interface

1. Open `translate-page.html` in your browser
2. Enter the full URL: `hairqare.co/de/the-haircare-challenge`
3. Select the target language: `German`
4. Click "Translate Page Content"

### Option 3: Deploy Worker and Use API

1. Deploy the worker:
```bash
wrangler publish src/worker-simple.js -c wrangler-simple.toml
```

2. Call the API:
```bash
curl -X POST https://your-worker.workers.dev/translate-page \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "url": "hairqare.co/de/the-haircare-challenge",
    "targetLanguage": "de"
  }'
```

## What Gets Translated

✅ All text content on the page
✅ Headings, paragraphs, buttons, links
✅ SEO metadata (if accessible)
✅ Alt text for images

## What Stays the Same

✅ Page structure and layout
✅ Styles and design
✅ Images and media
✅ Internal links (already in correct folder)
✅ Components and interactions

## Example Workflow

1. **You manually create**: `/de/the-haircare-challenge` (copy of English page)
2. **Run translation**: `node translate-existing-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"`
3. **Result**: All text on the page is now in German

## Troubleshooting

### "Page not found"
- Make sure the page is published
- Check the slug is correct
- Try without the domain: just use "de/the-haircare-challenge"

### "Translation failed"
- Check your API keys are valid
- Ensure you have API quota remaining
- Try translating a smaller page first

### Text not updating
- Make sure the page was published after duplication
- Check that the page isn't using dynamic content
- Verify the API has write permissions

## Benefits of This Approach

1. **Simple**: No complex page duplication logic
2. **Reliable**: Uses proven Webflow Data API
3. **Flexible**: Can re-translate anytime
4. **Safe**: Original page structure preserved
5. **Fast**: Only updates text content

## Next Steps

1. Test with one page first
2. Verify the translation quality
3. Run batch translations for multiple pages
4. Set up automated workflows if needed