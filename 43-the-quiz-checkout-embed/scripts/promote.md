# Promotion checklist — publish a quiz build to a numbered subpath

The quiz ships as a **static bundle** that is dropped into a folder of the
`holinic-webflow` repo (`Holinic-Tech/holinic-webflow`). GitHub Pages serves that
repo at `join.hairqare.co`, so a folder named `NN-the-quiz-haircare/` is served at
`https://join.hairqare.co/NN-the-quiz-haircare/`. **The folder name IS the URL path.**

This is a **manual** promotion: build with the right `--base`, copy `dist/*` into the
matching folder in `holinic-webflow`, commit there, and let GitHub Pages publish.

---

## 0. Pre-promotion checklist (all must be green)

Run from this repo (`hairqare-quiz-engine`) before building anything to ship:

```bash
npm run test       # Vitest unit/component suites
npm run validate   # spec validator CI gate (tsx src/spec/cli-validate.ts)
npm run test:e2e   # Playwright golden e2e
npm run build      # tsc -b && vite build (default base './') — must compile clean
```

Then confirm, in the spec you are shipping (`src/quiz/hairquiz.spec.ts`):

- **checkout base** = `https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/`
  (canonical, **no `-59`** slug). See CLAUDE.md "Change the coupon map".
- **webhook URL** = `https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit`.

Do NOT promote if any of the four commands above is red.

---

## 1. Build with the target base

The published path is injected via Vite's `--base`. Build with the **exact** folder
name (including trailing slashes) and the webhook secret:

```bash
VITE_WEBHOOK_SECRET=<secret> npm run build -- --base=/NN-the-quiz-haircare/
```

- `--base=/NN-the-quiz-haircare/` rewrites every asset `src`/`href` in
  `dist/index.html` to `/NN-the-quiz-haircare/assets/...` so they resolve when served
  from that subpath. Verify after building:

  ```bash
  grep -o '/NN-the-quiz-haircare/assets/[^"]*' dist/index.html
  ```

  You should see the JS and CSS both prefixed with `/NN-the-quiz-haircare/`.

- **`VITE_WEBHOOK_SECRET` is a build-time env var that ships to the browser** — it is
  embedded into the JS bundle (`X-Webhook-Secret` on the submit POST). This matches the
  original Flutter quiz, which also shipped the secret client-side. Treat it as
  public-ish; rotate at the Worker if it leaks. Get the current value from 1Password
  (Claudio Vault) — never hardcode it in the repo.

> The build base default is `./` (relative) in `vite.config.ts`; the `--base` flag
> overrides it per-quiz. Relative `./` also resolves under a subpath, but use the
> explicit `/NN-the-quiz-haircare/` base so deep links and absolute asset refs are
> unambiguous.

---

## 2. Copy the bundle into holinic-webflow

```bash
# from this repo, with holinic-webflow checked out as a sibling
rm -rf ../holinic-webflow/NN-the-quiz-haircare
mkdir -p ../holinic-webflow/NN-the-quiz-haircare
cp -R dist/* ../holinic-webflow/NN-the-quiz-haircare/
```

Then commit + push in `holinic-webflow`; GitHub Pages publishes within a minute or two.

---

## 3. Path convention — test vs winner

- **Testing path = a NEW number.** Pick the next unused `NN` (e.g. `20-the-quiz-haircare`)
  and publish the candidate there. Run/share it at
  `https://join.hairqare.co/NN-the-quiz-haircare/` without touching the live winner.
- **Winner = overwrite `the-quiz-haircare`** (no number). When a numbered candidate
  wins, rebuild with `--base=/the-quiz-haircare/` and copy `dist/*` over the
  `holinic-webflow/the-quiz-haircare/` folder. That URL is the canonical live quiz.
- The prior React attempt at `holinic-webflow/34-the-quiz-haircare` is **research-only**,
  never an authority — do not promote on top of it.

---

## 4. Host-page requirement (provided by the Webflow/GTM page, NOT this bundle)

The bundle **consumes** browser globals/cookies that the host page sets up. The host
page (Webflow page + GTM header/footer) MUST already provide:

- **GTM container `GTM-TT5MJDF`** — relays the GA `window.dataLayer` events to Converge.
- **gtag `G-15HXMXW4HW`** — the GA4 stream backing `window.gtag`.
- **Converge `cvg` init** — so `window.cvg` / `trackEvent` exist for the client
  `Completed Quiz` event, plus the `__cvg_uid` / `__cvg_sid` cookies.

The bundle only reads `window.dataLayer` / `gtag` / `cvg` / `trackEvent` and those
cookies; it does NOT inject GTM or initialise Converge. If the host page lacks these,
tracking silently no-ops (all tracking is best-effort and never throws). Confirm the
GTM/gtag/Converge snippet is present on the published Webflow page before relying on
analytics.
