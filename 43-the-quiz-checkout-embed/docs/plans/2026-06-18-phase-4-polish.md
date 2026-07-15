# Phase 4 — Polish & QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Checkbox (`- [ ]`) steps; TDD where there's logic; adversarial QC on tracking-touching tasks. Build on Phase 1-3 (master).

**Goal:** Clear the Phase-3 fidelity residuals, wire the FB-targeting event enrichment, apply tasteful design polish (close to the current look, mobile-first, no-scroll preserved), and QA the rebuild on real devices / in-app webviews / for load speed — without regressing the tracking-parity or no-scroll gates.

**Architecture:** No new engine concepts. Residual fixes touch the store/renderer/components; enrichment extends the tracking call sites declaratively from the spec's `eventEnrichment`; design polish is component + Tailwind/brand-token work behind the unchanged presentational contract. Every change must keep `npm run test`, `npm run test:e2e` (tracking parity + no-scroll), `npm run validate`, and `npm run build` green.

**Tech Stack:** unchanged. Adds: Holiniq brand tokens (Tailwind config), optionally `framer-motion` for transitions, and the web-perf / chrome-devtools skills for the load-speed pass.

**Inputs:** the Phase-3 residual list (in `project_quiz_web_rebuild.md` + `docs/reference/ISSUES.md`), `docs/reference/dashboard-spec.md`, `docs/reference/golden/*.png`, the Holiniq brand system (the `holiniq-brand` skill / brand book).

**Decision gates — RESOLVED by owner (2026-06-18):**
- **D1 Match-%:** KEEP `random(92,97)` (parity), flagged.
- **D2 Dashboard visual golden (ISSUES #8):** option (b) — owner approved ONE clearly-tagged test submission on the LIVE quiz to capture the dashboard reference. It is a long scrollable page → capture FULL-PAGE (not just viewport). Save as `docs/reference/golden/19-dashboard*.png`.
- **D3 Assets/testimonials:** KEEP the legacy CDN images (they are real). Task 6 = link-check only, NO re-host, NO survey-MCP swap.
- **D4 Design direction:** tasteful polish only (stay close to current).
- **Avatar:** keep the current age→avatar mapping unless there is a GROSS mismatch (e.g. a 20s bracket showing a 50+ avatar); only correct egregious cases.

---

## Cross-cutting protocol

1. TDD for logic; component tests for UI; commit per task.
2. **No regressions:** the tracking-parity e2e + no-scroll assertions must stay green after every task (run `npm run test:e2e`).
3. Tracking-touching tasks (enrichment) get an adversarial QC gate.
4. Commits via `git -c user.name="Toby Dietz" -c user.email="toby@holinic.co" commit` (`--no-gpg-sign` if needed).

---

### Task 1: Honor single-select `cta` + reveal (idx-10 fidelity)

**Files:** `src/store/quizStore.ts`, `src/components/ScreenRenderer.tsx`, `src/components/screens/SingleChoiceScreen.tsx` (+ tests).

- [ ] **Step 1: Tests** — for a `question` screen with `type:'single'` + `progression:'cta'` (idx-10 shampooSpending): `answer(answerId)` RECORDS the answer + makes the resolved `reveal` text visible, but does NOT advance; a `continue()` fires `Question Answered` + advances. For `type:'single'` + `progression:'auto'` (the default), behavior is unchanged (record + fire + advance on tap). Assert via store state + `window.dataLayer`.
- [ ] **Step 2: Implement** — in `quizStore.answer()`, branch on the current screen's `progression`: `auto` → record + `Question Answered` + advance (current); `cta` → record only (set a `revealed` flag), advance happens in `continue()` which fires `Question Answered`. `SingleChoiceScreen` renders the resolved `reveal` string + a Continue button when `progression==='cta'` and an answer is selected (ScreenRenderer resolves `reveal` and passes it + `selected`). Keep presentational.
- [ ] **Step 3: Run `npm run test` + `npm run test:e2e` (the golden walk must still pass — update the walk if idx-10 now needs a Continue click). Step 4: Commit** `-m "Phase 4 Task 1: honor single-select cta + reveal (idx-10)"`.

**Acceptance:** idx-10 shows reveal text and requires Continue, matching the live quiz; auto single-selects unchanged; tracking parity preserved.

---

### Task 2: Event enrichment for FB targeting

**Files:** `src/store/quizStore.ts` (+ test); possibly `src/tracking/track.ts` helper.

- [ ] **Step 1: Test** — when `spec.eventEnrichment = ['hairConcern','age','hairGoal']`, the `Question Answered`, `Quiz Submitted`, and result/checkout events carry the resolved enrichment attributes as extra params (e.g. `concern: 'concern_hairloss'`, `age: 'age_30to39'`, `goal: 'goal_both'`) drawn from the current `answers`. Assert the params appear on `window.dataLayer` pushes. (These flow through GTM to Converge/FB.)
- [ ] **Step 2: Implement** — a `enrichmentParams(spec, answers)` helper returning `{ [questionId]: answerIds.join(',') }` for each `eventEnrichment` questionId that has an answer; spread it into the `extra` of the relevant `trackGAEvent` calls (the existing pass-through in `track.ts` already forwards arbitrary extra keys). Decide the exact key names with the contract in mind (use the questionId or a clean alias; document in CLAUDE.md). Do NOT alter the fixed contract params or event names.
- [ ] **Step 3: QC gate** — adversarial review: enrichment adds only NEW keys, never changes `event`, `event_category`, `position`, `selected_answer`, or any contract string; the golden-events parity test still passes (enrichment keys are additive). PASS/FAIL.
- [ ] **Step 4: Run tests + e2e. Step 5: Commit** `-m "Phase 4 Task 2: event enrichment (concern/age/goal) for FB targeting"`.

**Acceptance:** completion/answer events carry answer attributes for targeting; no contract param is altered; parity intact.

---

### Task 3: SkipModal copy + avatar mapping fixes

**Files:** `src/components/primitives/SkipModal.tsx`, `src/quiz/content/result-content.ts` (+ tests).

- [ ] **Step 1: Tests** — SkipModal renders the live copy ("Before you continue…" headline; "BACK TO QUIZ" dismiss; "SKIP QUIZ" confirm — match `docs/reference/golden/00b-skip-modal.png`). `avatarByAge` maps each `age` answerId to the CORRECT bracket avatar (fix the legacy filename mismatch flagged in result-content).
- [ ] **Step 2: Implement** both. For avatars, map `age_18to29/30to39/40to49/50plus` (or the real ids) to the correct asset; if the legacy assets are mislabeled, pick the closest correct one and `// FLAG` if an asset is missing.
- [ ] **Step 3: Run tests + e2e. Step 4: Commit** `-m "Phase 4 Task 3: SkipModal live copy + avatar age-bracket fix"`.

**Acceptance:** skip modal copy matches the live quiz; avatar matches the user's age bracket.

---

### Task 4: Design polish (brand tokens + tasteful refinement)  — gated by D4

**Files:** `tailwind.config.js`, `src/index.css`, the screen/primitive components.

- [ ] **Step 1: Apply Holiniq brand tokens** — load the brand palette/typography (via the `holiniq-brand` skill / brand book) into `tailwind.config.js` as tokens (colors, font family, radii, spacing scale). No per-component hardcoded hexes.
- [ ] **Step 2: Refine each screen type** — apply tasteful, fidelity-preserving polish (consistent spacing rhythm, type scale, button styles, card treatment, selected-state affordances, subtle transitions). Use the `ui-design`/`frontend-design` skills for guidance. CONSTRAINTS: stay close to the current look (D4 default), mobile-first, and the no-scroll invariant must hold (fluid type so the scaler stays mild). Review against `docs/reference/golden/*.png` for structural parity.
- [ ] **Step 3: (optional) transitions** — add restrained screen-transition animation (e.g. `framer-motion` fade/slide) if it doesn't hurt LCP.
- [ ] **Step 4: Regenerate the visual baselines** (`toHaveScreenshot` snapshots) and refresh `e2e/review/` captures for owner eyeball. Run full test + e2e (no-scroll must hold). **Step 5: Commit** `-m "Phase 4 Task 4: design polish — brand tokens + screen refinement"`.

**Acceptance:** on-brand, more polished, still recognizably the current quiz; no-scroll + parity intact; new visual baselines committed.

---

### Task 5: Dashboard visual + match-% — gated by D1, D2

**Files:** `src/store/quizStore.ts` (if D1 changes %), `e2e/`, `docs/reference/ISSUES.md`.

- [ ] **Step 1: Match-% (D1)** — default keep `random(92,97)`; if owner chooses answer-derived, implement a deterministic mapping (e.g. by concern/routine) + test. Either way document the choice.
- [ ] **Step 2: Dashboard visual (D2)** — per owner choice: (a) build the Flutter export locally + screenshot the dashboard into `docs/reference/golden/19-dashboard.png` (+ 20-finalpitch, timer) and add a structural+own-baseline check; (b) approved tagged test capture; (c) accept React own-baseline + owner eyeball of `e2e/review/19-*.react.png`. Resolve/close ISSUES #8 with the chosen path.
- [ ] **Step 3: Run e2e. Step 4: Commit** `-m "Phase 4 Task 5: dashboard visual resolution + match-% decision"`.

**Acceptance:** the dashboard visual gap is closed (or explicitly accepted with owner sign-off); match-% decision recorded.

---

### Task 6: Assets & testimonials — gated by D3

**Files:** `src/quiz/content/result-content.ts`, possibly an asset-manifest.

- [ ] **Step 1 (default: keep legacy):** verify every legacy CDN asset URL in `result-content.ts` still resolves (HTTP 200); replace any dead URL. If owner chose to re-host (D3), move assets to R2/`glamiq-cdn` and update URLs; and/or pull real before/after testimonials via the `bhc-surveys` MCP keyed by `hairConcern`, replacing the hardcoded testimonial images.
- [ ] **Step 2: Test** the content maps still resolve + a link-check note. **Step 3: Commit** `-m "Phase 4 Task 6: asset verification / testimonial upgrade"`.

**Acceptance:** all result assets resolve; testimonials are either verified-legacy or upgraded to real survey media per D3.

---

### Task 7: Webview + real-device QA

**Files:** QA notes in `docs/reference/qa-report.md`; targeted fixes where needed.

- [ ] **Step 1: Device matrix** — using the chrome-devtools/web-perf skill or Playwright device emulation, verify the quiz at common mobile sizes (iPhone SE/14/Pro Max, Pixel) + landscape: fit-to-viewport holds (no scroll), `100dvh` + safe-area/notch handled, tap targets ≥44px.
- [ ] **Step 2: In-app webviews** — sanity-check FB/IG/Messenger in-app browser behavior (React renders as normal HTML so this should "just work"; verify the tracking globals + cookies are read, the checkout redirect works). Do NOT port the Flutter webview hacks unless a concrete bug appears.
- [ ] **Step 3: Write `docs/reference/qa-report.md`** with the matrix + results + any fixes. **Step 4: Commit** `-m "Phase 4 Task 7: webview + device QA"`.

**Acceptance:** the quiz renders + tracks + checks out across the device/webview matrix; issues fixed or logged.

---

### Task 8: Load-speed / conversion pass

**Files:** `index.html`, `vite.config.ts`, components; `docs/reference/qa-report.md`.

- [ ] **Step 1: Measure** — build + run a Lighthouse/web-perf pass (chrome-devtools skill): LCP, CLS, TBT, bundle size. Record the baseline (already ~237 KB JS — a fraction of Flutter's 6.8 MB).
- [ ] **Step 2: Optimize** — add `preconnect`/`dns-prefetch` to `checkout.hairqare.co` + the asset CDN(s) (mirroring the Flutter `assets.hairqare.co`/`pub.hairqare.co` preconnects); lazy-load below-the-fold dashboard images; ensure the first screen's hero is LCP-optimized; code-split if any heavy dialog warrants it. Keep the host-page GTM/Converge snippet expectations intact.
- [ ] **Step 3: Re-measure + record the win in `qa-report.md`. Step 4: Commit** `-m "Phase 4 Task 8: load-speed/LCP optimization"`.

**Acceptance:** measured Core Web Vitals recorded + improved; preconnects in place; no functional/tracking regression.

---

### Task 9: Close-out — docs + residual ledger

**Files:** `CLAUDE.md`, `docs/reference/ISSUES.md`.

- [ ] **Step 1:** Update `CLAUDE.md` (enrichment recipe, brand tokens, the QA/perf notes) and reconcile `ISSUES.md` — mark each Phase-3 residual resolved or explicitly deferred with the decision recorded.
- [ ] **Step 2:** Final green gate: `npm run test`, `npm run validate`, `npm run test:e2e`, `npm run build`. **Step 3: Commit** `-m "Phase 4 Task 9: close-out docs + residual ledger"`.

**Acceptance:** residual ledger is clean; docs current; all gates green.

---

## Self-Review

**Coverage (Phase-3 residuals + design §6a polish + fidelity-first QA):**
- idx-10 cta+reveal → Task 1. ✓
- eventEnrichment for FB targeting (Toby's ask) → Task 2. ✓
- SkipModal copy + avatar mapping → Task 3. ✓
- Design polish (brand, mobile-first, no-scroll preserved) → Task 4 (D4). ✓
- Match-% + dashboard visual (ISSUES #8) → Task 5 (D1, D2). ✓
- Legacy assets / real testimonials → Task 6 (D3). ✓
- Webview + device QA → Task 7. ✓
- Load-speed/LCP → Task 8. ✓
- Close-out → Task 9. ✓

**Out of scope (Phase 5):** templatize ("start a new quiz" generator + marketer playbook), the manual-promotion automation, and the design context pack (all deferred per Toby).

**Decision gates** D1–D4 are surfaced before their tasks with defaults, so execution can proceed unblocked if the owner doesn't override.

**No-regression discipline:** every task re-runs the tracking-parity + no-scroll e2e; enrichment (the only tracking-touching change) is additive-only and QC-gated.
