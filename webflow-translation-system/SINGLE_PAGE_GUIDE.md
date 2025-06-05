# How to Translate a Single Page

## For translating hairqare.co/challenge:

### 1. Go to GitHub Actions
https://github.com/Holinic-Tech/holinic-webflow/actions

### 2. Run the Workflow
- Click "Webflow Translation"
- Click "Run workflow"
- Fill in:
  - **URL patterns**: `/challenge`
  - **Target language**: `de`
  - **Action**: `translate`

### 3. What Happens
The system will:
1. Find the page with slug "challenge" in your Webflow site
2. Translate all content using OpenAI
3. Create a NEW page with slug "de/challenge"
4. Update all internal links to include /de/ prefix
5. Update checkout links: `checkout.hairqare.co/de/buy/...`
6. Update quiz links: `join.hairqare.co/de/...`

### Important Notes:

**About Existing Folders:**
- The system creates NEW Webflow pages, not folders
- If you already have a `/de/challenge` page in Webflow, it might create a duplicate
- Webflow handles URL routing, not folder structure

**Single Page Pattern Examples:**
- `/challenge` - Exact match for challenge page
- `/about` - Exact match for about page
- `/products/shampoo` - Specific product page

**Multiple Specific Pages:**
You can translate multiple specific pages by entering one per line:
```
/challenge
/about
/products/shampoo
```

### Checking Results:
1. After translation completes, go to your Webflow dashboard
2. Look for new page: "challenge" with path "/de/challenge"
3. The page will be in draft mode - you can review and publish

### Link Updates:
The system automatically updates these links:
- `checkout.hairqare.co/buy/...` → `checkout.hairqare.co/de/buy/...`
- `join.hairqare.co/...` → `join.hairqare.co/de/...`
- Internal links: `/other-page` → `/de/other-page`

### Cost:
- Single page translation typically costs $0.01-0.05 depending on content length
- You'll see exact cost in the workflow output