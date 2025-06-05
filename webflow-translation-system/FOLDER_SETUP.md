# Webflow Folder Setup for Translations

## The Issue
Pages are not being created in the language folders (`/de`, `/fr`, etc.) because we need the folder IDs.

## How Webflow Folders Work
In Webflow, folders are actually pages with a special type. To create a page inside a folder, you need to set the `parentId` to the folder's page ID.

## Finding Your Folder IDs

### Option 1: Through Webflow Dashboard
1. Go to your Webflow dashboard
2. Navigate to the Pages panel
3. Find your `/de` folder
4. Click on it and look for the page ID in the URL or page settings
5. It will look something like: `672c82dd7bb594490ba42d38`

### Option 2: Using the API
Run this command to list all pages and find folders:
```bash
export WEBFLOW_TOKEN="916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb"
node find-folder-ids.js
```

## Setting Up Folder IDs

Once you have the folder IDs, add them to `wrangler.toml`:

```toml
[vars]
WEBFLOW_SITE_ID = "62cbaa353a301eb715aa33d0"
WEBFLOW_FOLDER_ID_DE = "your-de-folder-id-here"
WEBFLOW_FOLDER_ID_FR = "your-fr-folder-id-here"
WEBFLOW_FOLDER_ID_ES = "your-es-folder-id-here"
WEBFLOW_FOLDER_ID_IT = "your-it-folder-id-here"
WEBFLOW_FOLDER_ID_PT = "your-pt-folder-id-here"  
WEBFLOW_FOLDER_ID_NL = "your-nl-folder-id-here"
```

## Quick Test
After setting up the folder IDs, test with a single page:

```bash
curl -X POST "https://holinic-webflow-translation-worker.dndgroup.workers.dev/translate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "urlPatterns": ["the-haircare-challenge"],
    "targetLanguage": "de",
    "action": "translate",
    "webflowToken": "916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb",
    "openaiKey": "your-openai-key"
  }'
```

## Why Your Current Process Failed
1. **Pattern Matching**: Was matching 14 pages instead of 1 (now fixed to exact match)
2. **Folder Structure**: Pages were being created in root, not in language folders
3. **Long Processing**: 14 pages × ~1 minute each = 14+ minutes

## Next Steps
1. Cancel the current GitHub Actions workflow (it's been running too long)
2. Get the folder IDs from Webflow
3. Update wrangler.toml with folder IDs
4. Deploy the worker: `wrangler deploy`
5. Run a new translation for just one page