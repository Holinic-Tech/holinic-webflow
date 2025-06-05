# GitHub Secrets Configuration

## Already Configured ✅
These secrets are already set in your GitHub repository:
- `OPENAI_ORG_ID`
- `OPENAI_API_KEY` 
- `WEBFLOW_TOKEN`

## New Secrets to Add 🔧

Go to your GitHub repository settings → Secrets and variables → Actions, and add:

### 1. CLOUDFLARE_WORKER_URL
```
https://holinic-webflow-translation-worker.dndgroup.workers.dev
```

### 2. WORKER_AUTH_TOKEN
```
743433bd8e4eedf784ecf092f2baedfd9e2ca814a0d9e157c6081cedee30e39d
```

### 3. EMAIL_USERNAME (Optional - Skip if not using email notifications)
```
[skip this one]
```

### 4. EMAIL_PASSWORD (Optional - Skip if not using email notifications)
```
[skip this one]
```

## Testing the Setup

Once you've added the secrets, you can test the system by:

1. Going to the Actions tab in your GitHub repository
2. Selecting "Webflow Translation" workflow
3. Clicking "Run workflow"
4. Entering a test URL pattern (e.g., `/test-page`)
5. Selecting a target language
6. Running the workflow

## Worker Details

- **Worker URL**: https://holinic-webflow-translation-worker.dndgroup.workers.dev
- **Worker Name**: holinic-webflow-translation-worker
- **Account**: Holinic (7776689e1c22aeed19a74763a55800f2)
- **KV Namespace**: TRANSLATION_STATUS (113cf97455944cc5a76331ef8443567e)