# Webflow Translation System V3 - Simplified Data API Approach

## Overview
A streamlined translation system that works with manually created pages. You create the page structure, we handle the translation.

## How It Works

1. **You manually**:
   - Create language folders (/de, /es, /fr, etc.)
   - Duplicate pages into those folders with correct slugs
   - Example: `/the-haircare-challenge` → `/de/the-haircare-challenge`

2. **The system**:
   - Takes the URL of the page to translate
   - Uses Webflow Data API to get page content
   - Translates all text content via OpenAI
   - Updates the page with translated content via Data API

## Simple Workflow

```
Input: hairqare.co/de/the-haircare-challenge + target language (de)
                    ↓
         Get page content via Data API
                    ↓
           Extract all text nodes
                    ↓
         Translate via OpenAI API
                    ↓
      Update page via Data API with translations
                    ↓
Output: Fully translated German page at same URL
```

## Implementation

### 1. Simple Web Interface
```
URL to translate: [________________________]
Target language:  [German ▼]
[Translate Page]
```

### 2. Backend Process
- GET /pages/{pageId}/content → retrieve all DOM nodes
- Extract text from nodes
- Translate via OpenAI
- PUT /pages/{pageId}/content → update with translations

### 3. What Gets Translated
- All text content
- SEO metadata (title, description)
- Alt text for images
- Link text

### 4. What Stays The Same
- Page structure
- Styles
- Images
- Components
- Internal links (already in correct language folder)

## Benefits
- No complex page duplication logic
- Works with your existing workflow
- Can re-translate pages anytime
- Simple and reliable
- Uses proven Data API endpoints

## Technical Requirements
- Webflow API token (already have)
- OpenAI API key (already have)
- Site ID (already have)
- Simple script to run translations

## Usage Example

```bash
# Translate a page
node translate-page.js --url="hairqare.co/de/the-haircare-challenge" --lang="de"

# Or use web interface
1. Enter URL: hairqare.co/de/the-haircare-challenge
2. Select: German
3. Click: Translate Page
4. Done!
```

## Error Handling
- If page doesn't exist: Clear error message
- If translation fails: Keep original text
- If API limits hit: Retry with delay
- Always preserve page functionality