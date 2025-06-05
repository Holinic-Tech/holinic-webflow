#!/bin/bash

# Test translation of a single page

WEBFLOW_TOKEN="916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb"
OPENAI_KEY="${OPENAI_API_KEY:-sk-test}"  # Use your actual OpenAI key

echo "Testing translation of single page: the-haircare-challenge"
echo "Expected output: de-the-haircare-challenge"
echo ""

curl -X POST "https://holinic-webflow-translation-worker.dndgroup.workers.dev/translate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d "{
    \"urlPatterns\": [\"the-haircare-challenge\"],
    \"targetLanguage\": \"de\",
    \"action\": \"translate\",
    \"webflowToken\": \"${WEBFLOW_TOKEN}\",
    \"openaiKey\": \"${OPENAI_KEY}\"
  }" | jq '.'

echo ""
echo "Check your Webflow dashboard for a new page: de-the-haircare-challenge"