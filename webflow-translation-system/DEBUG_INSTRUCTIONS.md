# Debug Instructions - Webflow Translation System

## The Issue
The translation is failing with the error: `node.text.trim is not a function`

This means that Webflow's DOM API is returning `node.text` values that aren't strings.

## How to Debug

### Option 1: Use the Debug HTML Page (Easiest)

1. Open the debug page in your browser:
   ```bash
   open debug-test.html
   ```

2. Enter your credentials:
   - **Webflow API Token**: Your token from Webflow settings
   - **Page Slug**: Leave as `the-haircare-challenge`
   - **OpenAI API Key**: Only needed for translation test

3. Click **"🧪 Run Debug Test"**

4. Check the browser console (F12 → Console tab) to see the raw response

5. The page will show:
   - What type `node.text` actually is
   - How many non-string text nodes exist
   - Sample data causing the error

### Option 2: Run Direct API Test

1. Set your Webflow token:
   ```bash
   export WEBFLOW_TOKEN="your-webflow-token-here"
   ```

2. Run the test script:
   ```bash
   node test-webflow-api.js
   ```

3. Check the output and the generated `webflow-dom-response.json` file

### Option 3: Use curl to Test Debug Worker

```bash
# Replace YOUR_TOKEN with your actual Webflow token
curl -s "https://webflow-translation-debug.dndgroup.workers.dev/debug/the-haircare-challenge?token=YOUR_TOKEN&siteId=62cbaa353a301eb715aa33d0" | jq '.'
```

## What We're Looking For

1. **Non-string text values**: The error suggests `node.text` exists but isn't a string
2. **Array or object text**: Maybe Webflow returns arrays or objects for rich text
3. **Null/undefined handling**: Perhaps some nodes have `node.text = null`

## Once We Find the Issue

Based on what type `node.text` actually is, we can:
- Handle arrays of text (join them?)
- Handle objects (extract a specific property?)
- Skip non-string text nodes
- Convert non-strings to strings appropriately

## Current Status

✅ Fixed in code but error persists
✅ Debug tools deployed
❌ Need to understand actual Webflow response
❌ Need to handle the specific data type causing the error