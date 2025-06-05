#!/bin/bash

# Quick test to see if the API is working

echo "Testing if we can fetch pages from Webflow..."
echo "Please set your WEBFLOW_TOKEN environment variable first"
echo ""

if [ -z "$WEBFLOW_TOKEN" ]; then
    echo "Error: WEBFLOW_TOKEN not set"
    echo "Usage: export WEBFLOW_TOKEN='your-token-here'"
    exit 1
fi

# Test the debug endpoint to see what pages exist
echo "Fetching page list via debug endpoint..."
curl -s "https://webflow-translation-debug.dndgroup.workers.dev/debug/the-haircare-challenge?token=${WEBFLOW_TOKEN}&siteId=62cbaa353a301eb715aa33d0" | jq '.pageInfo'

echo ""
echo "Now testing translation with pattern 'the-haircare-challenge' (no slash)..."

# Test translation
curl -s -X POST "https://holinic-webflow-translation-worker.dndgroup.workers.dev/translate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d "{
    \"urlPatterns\": [\"the-haircare-challenge\"],
    \"targetLanguage\": \"de\",
    \"action\": \"translate\",
    \"webflowToken\": \"${WEBFLOW_TOKEN}\",
    \"openaiKey\": \"${OPENAI_API_KEY:-sk-test}\"
  }" | jq '.'