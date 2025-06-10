# Webflow Locale IDs

## Available Locales

The following locales are configured in the Webflow site:

### Primary Locale
- **English (en)**
  - ID: `684230454832f0132d5f6cd0`
  - CMS Locale ID: `64fab18041d7a2600b74c3d1`
  - Enabled: false
  - Subdirectory: (root)
  - Tag: en

### Secondary Locales
1. **German (Standard)**
   - ID: `684230454832f0132d5f6ccf`
   - CMS Locale ID: `684230464832f0132d5f6cd6`
   - Enabled: true
   - Subdirectory: /de/
   - Tag: de

2. **French (Standard)**
   - ID: `684683d87f6a3ae6079ec99f`
   - CMS Locale ID: `684683d87f6a3ae6079ec9a2`
   - Enabled: true
   - Subdirectory: /fr/
   - Tag: fr

## Usage

To use these locale IDs in the translation system, update the `LANGUAGE_CONFIG` in `translation-server.js`:

```javascript
const LANGUAGE_CONFIG = {
  de: {
    name: 'German',
    localeId: '684230454832f0132d5f6ccf',
    baseInstructions: `Use informal "du" throughout...`
  },
  fr: {
    name: 'French',
    localeId: '684683d87f6a3ae6079ec99f',
    baseInstructions: `Use informal "tu" throughout. Keep "Challenge" untranslated. Natural conversational French.
CURRENCY: Convert all USD ($, US$) to EUR (€).`
  }
};
```

## API Usage

When making API calls to get locale-specific content, use the `localeId` parameter:

```javascript
// Get German content
const germanResponse = await fetch(
  `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=684230454832f0132d5f6ccf`,
  { headers }
);

// Get French content
const frenchResponse = await fetch(
  `https://api.webflow.com/v2/pages/${pageId}/dom?localeId=684683d87f6a3ae6079ec99f`,
  { headers }
);
```

## Notes

- The locales are found in the site data under the `locales` property
- The primary locale (English) is set to not enabled, which might be intentional
- Both German and French locales are enabled and have subdirectories configured
- The locale IDs follow MongoDB ObjectId format (24 hex characters)