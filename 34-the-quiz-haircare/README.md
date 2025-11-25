# Haircare Quiz 34 - React Implementation

## Deployment

### Two-Workflow Deployment Process

1. **Build Quiz 34** (manual trigger via GitHub Actions)
   - Builds the React app with `npm run build`
   - Commits `index.html` + `assets/` to the repo
   - Type "deploy" to confirm

2. **pages-build-deployment** (auto-triggered by GitHub)
   - Runs after Build Quiz 34 commits
   - Deploys repo to GitHub Pages

**Both workflows must succeed for the live site to update.**

### Critical: index.html Files

The repo has TWO index.html files:
- `index.html` - **Production build** (references `/34-the-quiz-haircare/assets/index-HASH.js`)
- `index.dev.html` - **Dev source** (references `/src/main.tsx`)

**For local development:** The workflow restores `index.dev.html` before building. You can also manually copy it:
```bash
cp index.dev.html index.html
npm run dev
```

**Do NOT commit `index.html` changes manually** - the workflow handles this.

### Jekyll/Liquid Conflicts

Any markdown files with `{{ }}` syntax (JavaScript template literals) will break the `pages-build-deployment` workflow because Jekyll interprets them as Liquid templates.

**Solution:** Add such files to `.gitignore`:
```
# Documentation files that break Jekyll
FLUTTERFLOW_TO_REACT_MIGRATION_GUIDE.md
DEPLOYMENT.md
```

---

## Development

```bash
# Install dependencies
npm install

# Run dev server (uses index.dev.html)
npm run dev

# Build for production (don't run manually - use GitHub Actions)
npm run build
```

---

# Original Vite Template Docs

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
