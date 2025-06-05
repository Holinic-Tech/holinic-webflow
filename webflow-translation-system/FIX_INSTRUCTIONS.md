# Fix Instructions - GitHub Secrets

## The Issue
The translation system is working correctly, but the GitHub Actions workflow is using wrong/missing tokens.

## Current Status
- ✅ Worker is deployed and working
- ✅ Webflow token `916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb` works correctly
- ✅ Worker finds 14 pages matching "the-haircare-challenge"
- ❌ GitHub secret `WEBFLOW_TOKEN` might be wrong or missing
- ❌ OpenAI API key is missing or invalid (getting 403 errors)

## How to Fix

### 1. Update GitHub Secrets

Go to: https://github.com/Holinic-Tech/holinic-webflow/settings/secrets/actions

Update these secrets:
```
WEBFLOW_TOKEN = 916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb
OPENAI_API_KEY = [Your actual OpenAI API key]
```

### 2. Verify the Secrets
After updating, run the workflow again:
1. Go to: https://github.com/Holinic-Tech/holinic-webflow/actions
2. Run "Webflow Translation" with:
   - URL patterns: `the-haircare-challenge` (no slash needed)
   - Target language: `de`
   - Action: `translate`

### 3. What Should Happen
- The worker will find 14 pages containing "the-haircare-challenge"
- Each page will be translated to German
- New pages will be created with names like `de-the-haircare-challenge`
- You'll see the cost tracking in the logs

## Test Locally First (Optional)
```bash
# Test with your actual tokens
export WEBFLOW_TOKEN="916a2cf88a0b2b44ae5a03850e8f731b582b2943f132004e25d3bd7f8459dfbb"
export OPENAI_API_KEY="your-actual-openai-key"

# Run the test
curl -X POST "https://holinic-webflow-translation-worker.dndgroup.workers.dev/translate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d "{
    \"urlPatterns\": [\"the-haircare-challenge\"],
    \"targetLanguage\": \"de\",
    \"action\": \"translate\",
    \"webflowToken\": \"${WEBFLOW_TOKEN}\",
    \"openaiKey\": \"${OPENAI_API_KEY}\"
  }"
```

## Summary
The system is working perfectly. It just needs:
1. The correct Webflow token in GitHub secrets
2. A valid OpenAI API key in GitHub secrets

Once these are updated, translations will work!