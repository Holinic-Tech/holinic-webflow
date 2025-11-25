# Quiz 34 - Deployment Guide

This React quiz is deployed via GitHub Pages alongside the existing FlutterFlow quizzes.

## Quick Deploy Steps

1. Make your changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
4. Go to GitHub Actions: https://github.com/tobydietz/holinic-webflow/actions
5. Click "Build Quiz 34" workflow
6. Click "Run workflow" dropdown
7. Type `deploy` in the confirmation field
8. Click the green "Run workflow" button
9. Wait for both workflows to complete:
   - "Build Quiz 34" (builds and commits the production files)
   - "pages build and deployment" (deploys to GitHub Pages)
10. Visit https://join.hairqare.co/34-the-quiz-haircare/ (hard refresh if needed)

## Project Structure

```
34-the-quiz-haircare/
├── src/                    # React source code
├── index.html              # Source HTML (for local development)
├── index.dev.html          # Backup of source HTML (created after first deploy)
├── assets/                 # Built JS/CSS (created by deployment)
├── vite.config.ts          # Vite config with base path
├── package.json
└── .gitignore
```

## Local Development

```bash
cd 34-the-quiz-haircare
npm install
npm run dev
```

This starts the Vite dev server at `http://localhost:5173` (or similar port).

**Important**: Local dev uses the source `index.html`. After deployment, the workflow renames it to `index.dev.html` and replaces it with the production build. To restore for local dev:

```bash
git checkout index.html
# OR if index.dev.html exists:
cp index.dev.html index.html
```

## Deployment Details

### What the "Build Quiz 34" workflow does:

1. Checks out the repository
2. Installs Node.js 20 and npm dependencies
3. Runs `npm run build` (TypeScript + Vite)
4. Backs up `index.html` → `index.dev.html`
5. Copies `dist/index.html` → `index.html`
6. Copies `dist/assets/` → `assets/`
7. Commits and pushes to main
8. This triggers "pages build and deployment" automatically

### Manual Local Build (Alternative)

```bash
cd 34-the-quiz-haircare

# Build
npm run build

# Backup source index.html (first time only)
mv index.html index.dev.html

# Deploy built files
cp dist/index.html index.html
rm -rf assets/
cp -r dist/assets/ assets/
rm -rf dist/

# Commit and push
git add index.html assets/ index.dev.html
git commit -m "Deploy quiz 34"
git push
```

## URLs

- **Production**: https://join.hairqare.co/34-the-quiz-haircare/
- **Local Dev**: http://localhost:5173 (or port shown by Vite)

## Configuration

### Base Path
The quiz is configured to run at `/34-the-quiz-haircare/` via `vite.config.ts`:

```ts
export default defineConfig({
  base: '/34-the-quiz-haircare/',
})
```

### Tracking Scripts

**GTM** (Google Tag Manager):
- Container ID: `GTM-TT5MJDF`
- Loaded via proxied bundle: `https://hairqare.co/static/bundle-8f3a.js`

**CVG** (Converge):
- Pixel: `PmzQC4.js` (quiz-specific pixel)
- Proxy: `https://hairqare.co/cvg`
- Cookies `__cvg_cuid` and `__cvg_sid` are appended to checkout URLs for cross-domain tracking

### Checkout URL Parameters

When users click CTA buttons, the checkout URL includes:
- `billing_email` - User's email from lead capture
- `billing_first_name` - User's first name
- `billing_last_name` - User's last name
- `aero-coupons` - Coupon code based on quiz answers:
  - `c_hl` - Hair loss concern
  - `c_dh` - Damage or split ends concern
  - `c_si` - Scalp issues concern
  - `d_bc` - Custom/balanced diet
  - `o_df` - Default/other
- `__cvg_cuid` - CVG user ID cookie
- `__cvg_sid` - CVG session ID cookie

## Troubleshooting

### Local dev shows 404 for assets
The production `index.html` has hardcoded paths like `/34-the-quiz-haircare/assets/...`. Restore the source file:
```bash
git checkout index.html
```

### Changes not appearing on production
1. Check GitHub Actions completed successfully (both workflows)
2. Wait 2-5 minutes for Pages to rebuild
3. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
4. Check browser console for caching issues

### Build fails in GitHub Actions
- Check Node.js version matches (v20)
- Ensure `package-lock.json` is committed
- Check for TypeScript errors: `npm run build` locally

### favicon.svg 404 error
The index.html may have old favicon reference. Check that it uses:
```html
<link rel="icon" type="image/webp" href="https://pub.hairqare.co/fav-icon.webp" />
```

## Files to Commit

After deployment, these files should be in git:
- `index.html` - Production build (served by GitHub Pages)
- `index.dev.html` - Source backup (for local development)
- `assets/` - Built JS and CSS files
- All source files in `src/`

## Differences from FlutterFlow Quizzes

| Aspect | FlutterFlow Quizzes | React Quiz (34) |
|--------|---------------------|-----------------|
| Build | Pre-built, commit entire output | Source + built files separate |
| Dev Server | None (static files) | Vite dev server |
| Deployment | Direct commit | GitHub Actions workflow |
| Hot Reload | No | Yes (during development) |
