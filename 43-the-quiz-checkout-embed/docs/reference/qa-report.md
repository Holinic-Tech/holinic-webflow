# Phase 4 QA Report — asset link-check, device/webview QA, load-speed

> Generated 2026-06-18 for Phase 4 Tasks 6–8 (branch `phase-4-polish`).
> Verification gates at time of writing: `npm run test` (182 pass), `npm run test:e2e`
> (golden parity + no-scroll, visual own-baseline, device matrix — all green),
> `npm run validate` (spec valid), `npm run build` (clean).

---

## Task 6 — Asset link-check

Decision gate **D3 = KEEP the legacy CDN images** (they are real brand assets). This
task is link-check only: every image URL referenced in
`src/quiz/content/result-content.ts` (transformation hero/timeline, before/after
testimonial carousel + lower images, age-bracket avatars) was extracted and checked
with `curl -sS -o /dev/null -w "%{http_code} %{url_effective}"`.

**Result: 38/38 URLs return HTTP 200. No dead URLs. No replacements needed.**

| Host | Count | Status | Examples |
| --- | --- | --- | --- |
| `assets.hairqare.co` (transformation hero + timeline `.webp`) | 10 | ✅ all 200 | `…/RP%20Hairloss.webp`, `…/RP%20hairloss%20timeline.webp`, `…/RP%20Others.webp` |
| `pub.hairqare.co` (testimonial carousel `width=450` + lower `width=750` `.webp`) | 24 | ✅ all 200 | `…/ji-woo-before-after.webp`, `…/marisol-before-after.webp`, `…/3_BH.webp` |
| `uploads-ssl.webflow.com` (age-bracket avatar `.svg`) | 4 | ✅ all 200 | `…_Under%2018.svg`, `…_25-34.svg`, `…_35-44.svg`, `…_45%2B.svg` |

Full URL list (all 200):

```
assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/
  RP Damage.webp · RP Dandruff.webp · RP Hairloss.webp · RP Others.webp
  RP Split ends.webp · RP Split ends timeline.webp · RP damage timeline.webp
  RP dandruff timeline.webp · RP hairloss timeline.webp · RP others timeline.webp
pub.hairqare.co/cdn-cgi/image/width=450,quality=85,format=auto/
  3_BH.webp · 4_BH.webp · 8_HL.webp · Better_Hair_4.webp
  Damage_Hair_1_Testimonial.webp · Damage_Hair_3_Testimonial.webp
  Hair_Loss_2_Testimonial.webp · Hair_Loss_3_Testimonial.webp
  Irritation_or_dandruff_1/2/3_Testimonial.webp · Others_3_testimonial.webp
  Split_ends_frizz_dryness_2/3_testimonial.webp
  alina-before-after-front.webp · anna-before-after-smaller.webp
  ariadna-before-after.webp · bella-before-after.webp · ji-woo-before-after.webp
pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/
  Color_Damage_Testimonial_Result_Page_1.webp · Dandruff_Testimonial_Result_Page_1.webp
  Frizzy_hair_Testimonial_Result_Page_2.webp · Other_issues_Testimonial_Result_Page_1.webp
  marisol-before-after.webp
uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/
  66b37050731caef7208325c3_Under 18.svg · 66b3705002a6a9516930e533_25-34.svg
  66b3705003f42517011b493e_35-44.svg · 66b370508968423fab443088_45+.svg
```

Note (carried from Phase 3, not a dead link): the avatar SVG filenames
(`Under 18` / `25-34` / `35-44` / `45+`) do not line up with the answer brackets
(`18-29` / `30-39` / `40-49` / `50+`) — a labelling mismatch, but all four assets
resolve. The avatar age-bracket mapping is Phase-4 Task 3's scope, not Task 6.

The spec itself (`docs/reference/dashboard-spec.md`) contains only one literal image
URL (the `Under 18` avatar), already covered above.

---

## Task 7 — Device + webview QA

Added `e2e/devices.spec.ts` — Playwright drives the REAL quiz at four viewports and,
on representative screens (start, a question, a pitch, email), asserts (1) the
NO-SCROLL invariant `document.scrollingElement.scrollHeight <= clientHeight` and
(2) the primary CTA / answer tap-target height.

### Device matrix

| Viewport | NO-SCROLL (start / question / pitch / email) | Tap targets | Notes |
| --- | --- | --- | --- |
| iPhone SE — 375×667 | ✅ pass on all 4 | ✅ ≥40px | content fits ~1:1; no scaler stress |
| iPhone 14 Pro — 393×852 | ✅ pass on all 4 | ✅ ≥40px | comfortable headroom |
| Pixel 7 — 412×915 | ✅ pass on all 4 | ✅ ≥40px | most headroom (tallest) |
| small landscape — 740×360 | ✅ pass on all 4 | ✅ ≥28px (scaled) | edge case — see fix below |

### No-scroll failure found + fixed (740×360 landscape)

The short landscape exposed a genuine reachability bug on the tallest screen (the
`hairMyth` multi-select). The *document* never scrolled (`overflow:hidden`, so the
no-scroll assertion technically passed), but content was clipped **off-viewport and
untappable** — two compounding causes in `FitViewport`:

1. **Scale floor too high.** The screen needs ~0.48 to fit 360px of height; the
   `computeScale` floor was `0.6`, so it stopped shrinking too early and the lower
   options overflowed the clipped container. → lowered the FitViewport `min` floor
   from `0.6` → `0.45` (portrait phones never approach the floor, so this only
   affects genuinely cramped viewports; 0.45 text stays legible).
2. **Centering offset pushed scaled content above the top.** The outer flex used
   `justify-center`; for taller-than-container content that offsets the block
   upward, and after the `transform-origin: center top` scale the FIRST rows landed
   **above** y=0 (negative bounding box, untappable). → top-align (`justify-start`)
   whenever the content is being scaled down (`scale < 1`); keep `justify-center`
   only when it fits at `scale === 1`.

Also added an 8px safety margin to the measured available height so a screen that
fits *exactly* still leaves a few px of slack at the bottom edge.

Files: `src/components/layout/FitViewport.tsx` (floor `0.45`, conditional align,
margin). After the change all 4 viewports pass no-scroll + tap-target on all 4
representative screens. The 19 own-baseline `toHaveScreenshot` snapshots were
regenerated (top-align shifts the scaled layout on the 390×844 e2e viewport) — these
are own-baselines, not Flutter-golden diffs; refreshed `e2e/review/*.react.png` for
owner eyeball.

### In-app webviews (FB / IG / Messenger)

React renders as plain HTML, so there is **no Flutter-style webview shim to port**.
The two things that matter in an in-app browser are already covered by unit tests, so
no new webview-specific assertion was added (noted in `e2e/devices.spec.ts`):

- **Reads host tracking globals + cookies.** The bundle consumes the host page's
  `window.dataLayer` / `gtag` / `cvg` / `trackEvent` and the `__cvg_uid` / `__cvg_sid`
  cookies (it does not inject GTM/Converge). Covered by `src/tracking/track.test.ts`
  and `src/tracking/converge.test.ts`, and end-to-end by the tracking-parity walk in
  `e2e/golden.spec.ts`.
- **Checkout redirect builds correctly.** `buildCheckoutUrl` / `resolveCoupon` are
  unit-tested (`src/tracking/checkout.test.ts`), and `golden.spec.ts` asserts the
  two-space `Go to  checkout` GA event fires with the correct checkout URL on the CTA
  tap (the redirect is route-aborted in test so no real navigation occurs).

---

## Task 8 — Load-speed / LCP

### Resource hints (added to `index.html` `<head>`)

`preconnect` (with a `dns-prefetch` fallback) to the checkout host and every result
-page image CDN, mirroring the Flutter app's `assets.hairqare.co` / `pub.hairqare.co`
preconnect intent. Warms the TLS handshake so the checkout redirect and below-the
-fold dashboard images load faster.

| Host | Hint | Why |
| --- | --- | --- |
| `https://checkout.hairqare.co` | `preconnect` + `dns-prefetch` | CTA redirect target — fastest possible checkout hop |
| `https://assets.hairqare.co` | `preconnect` + `dns-prefetch` | transformation hero/timeline images |
| `https://pub.hairqare.co` | `preconnect` + `dns-prefetch` | testimonial before/after images |
| `https://uploads-ssl.webflow.com` | `preconnect` + `dns-prefetch` | age-bracket avatar SVGs |

### Lazy-load below-the-fold images (`src/components/result/ResultDashboard.tsx`)

`loading="lazy" decoding="async"` on the dashboard's avatar, testimonial carousel,
and timeline transformation images. The **first** transformation image (the dashboard
hero) stays `loading="eager"` to protect LCP; the rest of the timeline and all
testimonials/avatar defer until scrolled into view.

### Bundle sizes (`npm run build`)

| Asset | Raw | Gzip |
| --- | --- | --- |
| `index-*.js` | 238.19 kB | **73.52 kB** |
| `index-*.css` | 18.99 kB | **4.38 kB** |
| `index.html` | 1.39 kB | 0.59 kB |
| Inter web fonts (woff2 ×4 + woff ×4) | ~24 kB each (woff2) | — (already compressed) |

JS ~73.5 kB gzip + CSS ~4.4 kB gzip is on target (~70 KB / ~4 KB) and a **fraction of
the Flutter original's 6.8 MB** (~1% of the JS payload). 67 modules, ~0.8s build.

### Metrics

A live Lighthouse/LCP pass was **not** run here (no headless Chrome perf run wired
into this environment / proxy). Recorded the static wins instead, which are the
load-speed levers for a static bundle:

- **Preconnect/dns-prefetch** to checkout + the 3 image CDNs → removes DNS + TLS RTTs
  from the critical path of the checkout redirect and the first dashboard images.
- **Lazy-load** of below-the-fold dashboard imagery → fewer bytes on first paint of
  the result page; hero kept eager so it remains the LCP candidate.
- **Tiny payload** (≈78 KB gzip JS+CSS vs Flutter's 6.8 MB) → fast parse/exec on
  low-end mobile and in-app webviews.

CLS/LCP can be captured later with the chrome-devtools `web-perf` skill against a
deployed subpath if a live number is required; no functional or tracking regression
was introduced (golden parity e2e stays green).
