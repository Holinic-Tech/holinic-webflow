#!/bin/bash

# Test the debug endpoint
echo "Testing debug endpoint for 'the-haircare-challenge' page..."

# You'll need to add your actual Webflow token here
WEBFLOW_TOKEN="${WEBFLOW_TOKEN:-your-webflow-token-here}"
SITE_ID="62cbaa353a301eb715aa33d0"

curl -s "https://webflow-translation-debug.dndgroup.workers.dev/debug/the-haircare-challenge?token=${WEBFLOW_TOKEN}&siteId=${SITE_ID}" | jq '.'