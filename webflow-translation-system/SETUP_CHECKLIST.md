# Setup Checklist - Information Needed

## 1. Webflow Configuration
- [ ] **Webflow Site ID**: Found in Webflow Site Settings → General → Site ID
  - Format: `507f1f77bcf86cd799439011`
  - Current value: `your_webflow_site_id` (needs update)

## 2. API Keys/Tokens We Already Have (from GitHub secrets)
- [x] OPENAI_API_KEY
- [x] OPENAI_ORG_ID
- [x] WEBFLOW_TOKEN

## 3. New Secrets Needed
- [ ] **WORKER_AUTH_TOKEN**: A secure token for authenticating requests to the Cloudflare Worker
  - Can generate one or you can provide
  - Example: `hq-worker-auth-2024-secure-token`

## 4. Cloudflare Configuration
- [ ] **Cloudflare Account ID**: For deployment
- [ ] **KV Namespace Creation**: Will create via wrangler

## 5. Email Configuration (for notifications)
- [ ] **EMAIL_USERNAME**: Gmail address for sending notifications
- [ ] **EMAIL_PASSWORD**: Gmail app password (not regular password)

## 6. After Deployment
- [ ] **CLOUDFLARE_WORKER_URL**: Will be generated after deployment
  - Format: `https://holinic-webflow-translation-worker.{subdomain}.workers.dev`

Please provide:
1. Your Webflow Site ID
2. A secure token for WORKER_AUTH_TOKEN (or I can generate one)
3. Your preference for email notifications (optional)