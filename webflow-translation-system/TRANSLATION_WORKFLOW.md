# Translation Workflow Guide

## Quick Start - Translating a New Page

### Step 1: Check Available Languages
```bash
node translate-any-page.js
```
This shows which languages are configured and ready to use.

### Step 2: Translate a Page
```bash
# German (already configured)
node translate-any-page.js --slug="your-page-slug" --lang="de"

# Examples:
node translate-any-page.js --slug="about-us" --lang="de"
node translate-any-page.js --slug="pricing" --lang="de"
node translate-any-page.js --slug="contact" --lang="de"
```

## Setting Up a New Language

### Step 1: Enable in Webflow
1. Go to Site Settings → Localization
2. Add new locale (e.g., Spanish)
3. Configure the subdirectory (e.g., /es/)
4. Save and publish

### Step 2: Find the Locale ID
```bash
node find-locale-id.js
```
Look for your new locale and copy its ID (looks like: `684230454832f0132d5f6ccf`)

### Step 3: Update the Script
Edit `translate-any-page.js` and add your language:

```javascript
es: {
  name: 'Spanish',
  localeId: 'YOUR_LOCALE_ID_HERE',  // Replace with actual ID
  instructions: `Use informal "tú" throughout. Keep "Challenge" untranslated. Natural conversational Spanish.`
}
```

### Step 4: Translate Pages
```bash
node translate-any-page.js --slug="the-haircare-challenge" --lang="es"
```

## Batch Translation

To translate multiple pages at once:

```bash
# Create a simple batch script
cat > translate-batch.sh << 'EOF'
#!/bin/bash
LANG=$1
if [ -z "$LANG" ]; then
  echo "Usage: ./translate-batch.sh <language-code>"
  exit 1
fi

echo "Translating all pages to $LANG..."

# Add your pages here
PAGES=(
  "the-haircare-challenge"
  "about-us"
  "pricing"
  "contact"
  "faq"
)

for page in "${PAGES[@]}"; do
  echo "Translating: $page"
  node translate-any-page.js --slug="$page" --lang="$LANG"
  sleep 2  # Pause between pages
done

echo "Batch translation complete!"
EOF

chmod +x translate-batch.sh

# Run it
./translate-batch.sh de
```

## Finding Page Slugs

To see all available pages:

```bash
node list-all-pages.js
```

Or check specific pages:

```bash
node test-webflow-connection.js
```

## Translation Quality Control

### 1. Review Translations
- Check the backup JSON files created for each translation
- Use `view-translations.js` to see results

### 2. Update Style Guide
If you find issues, update `TRANSLATION_INSTRUCTIONS.md` with:
- New terms to keep untranslated
- Style preferences
- Common corrections

### 3. Re-translate if Needed
```bash
# Just run the same command again
node translate-any-page.js --slug="page-slug" --lang="de"
```

## Common Issues & Solutions

### "Page not found"
- Check the exact slug in Webflow
- Make sure the page is published
- Use `list-all-pages.js` to see available slugs

### "Locale ID not found"
- Run `find-locale-id.js`
- Make sure the locale is enabled in Webflow
- Update the script with the correct ID

### HTML Errors
Some nodes require specific HTML formatting. These usually still update correctly but show as errors.

## Best Practices

1. **Test One Page First**
   - Start with a small page
   - Review the translation quality
   - Adjust instructions if needed

2. **Keep Backups**
   - All translations are saved to JSON files
   - Keep these for reference or rollback

3. **Monitor Costs**
   - Each page translation uses OpenAI API credits
   - Batch translations use less due to efficiency

4. **Update Regularly**
   - Keep `TRANSLATION_INSTRUCTIONS.md` updated
   - Add new brand terms as needed
   - Refine language-specific instructions

## Current Status

### ✅ Ready to Use
- **German (de)**: Fully configured and tested

### 🔧 Needs Setup
- **Spanish (es)**: Need locale ID
- **French (fr)**: Need locale ID
- **Italian (it)**: Need locale ID
- **Portuguese (pt)**: Need locale ID
- **Dutch (nl)**: Need locale ID

## Example Full Workflow

```bash
# 1. Check what pages exist
node list-all-pages.js

# 2. Translate a specific page to German
node translate-any-page.js --slug="pricing" --lang="de"

# 3. Check the result
# Visit: https://yoursite.com/de/pricing

# 4. If adjustments needed, update instructions and re-run
```