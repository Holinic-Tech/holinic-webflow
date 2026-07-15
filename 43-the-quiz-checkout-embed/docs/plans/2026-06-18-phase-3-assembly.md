# Phase 3 — Real Quiz Assembly Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Checkbox (`- [ ]`) steps; TDD/verification per task; adversarial QC gate after each. Build on Phase 1+2 (master).

**Goal:** Assemble the REAL Hairqare quiz — author the actual 20-screen spec from the golden reference (all questions, answers, conditional content, the 5×5 routine×concern matrix), build the real result/dashboard (personalized content, countdown timer, plan-details dialog, CTA→checkout), wire the start-screen skip modal — then prove fidelity with two gates: the full walk's GA event sequence matches `docs/reference/golden-events.json`, and screens 0–18 visually match the golden screenshots.

**Architecture:** No new engine concepts — this is content authoring + the dashboard composition, validated by the Phase-1 validator and the Phase-2 component library. The real spec lives in `src/quiz/hairquiz.spec.ts` and becomes the default mounted spec. The dashboard is composed from new presentational result components fed by spec-driven, answer-conditional content (replacing the Flutter widgets' hardcoded branches).

**Tech Stack:** unchanged. Visual diffing uses Playwright's `toHaveScreenshot`/image comparison.

**Inputs (authoritative, read-only):**
- `docs/reference/quiz-flow.md` — the 20-screen spec + conditional tables + progression + tracking bindings
- `docs/reference/golden-events.json` — the event-sequence parity target
- `docs/reference/cdp-coupon-map.md` — questionId→{acField,mpField} + answerId→coupon
- `docs/reference/golden/*.png` — visual targets (screens 0–18; dashboard deferred per ISSUES #8)
- `docs/reference/tracking-contract.md` — the contract
- The Flutter dashboard source `~/github/Flutter Quiz Raw/QuizV2-flutterflow/lib/dashboard/` — for Task 1 extraction

**Known open dependency (ISSUES #8):** the dashboard/result/timer have NO golden screenshots (Phase 0 didn't submit a fake lead). Task 1 resolves the dashboard *behavior* from the Flutter code; the dashboard *visual* parity is handled in Task 8 (a decision point — local Flutter build, approved test capture, or defer to Phase 4).

**Phase 3 does NOT:** redesign anything (Phase 4 polish), build the design context pack or the promotion automation (Phase 5). It reproduces the current quiz faithfully and proves it.

---

## Cross-cutting protocol (every task)

1. **Fidelity to the golden reference:** every screen/answerId/condition/event comes from `docs/reference/*`. Where the Flutter app had placeholder content (e.g. dashboard `description="ewew"`, match-% = `randomInteger(92,97)`), replicate the *behavior* and FLAG it for Phase 4 — do not silently invent copy.
2. **Validator gate:** `npm run validate` must pass after every spec change (the real spec replaces the example spec as the validator's target).
3. **Parity gates:** the e2e walk asserts the GA sequence equals `golden-events.json` (Task 7) and screenshots match `golden/` within tolerance (Task 8).
4. **Stable ids are load-bearing:** answerIds must match the Flutter values exactly (`concern_hairloss`, `goal_both`, `age_30to39`, `diet_balanced`, the `'n/a'` sentinel, etc.) — they drive CDP, coupons, and conditional content. A wrong id silently breaks tracking + targeting.
5. **Adversarial QC gate per task.** Commits via `git -c user.name="Toby Dietz" -c user.email="toby@holinic.co" commit` (`--no-gpg-sign` if needed).

---

## File structure (added/changed)

```
docs/reference/dashboard-spec.md     # Task 1: extracted dashboard behavior/content (completes Phase-0 deferral)
src/quiz/
  hairquiz.spec.ts                   # the REAL 20-screen spec (becomes default)
  content/
    pitch-claim-matrix.ts            # the 5×5 routine×concern table (+ other conditional tables)
    result-content.ts               # answer→result content maps (benefit by goal, transformation by concern, avatar by age)
    plans.ts                         # pricing/plan data
src/spec/types.ts                    # extend ResultScreen with result-content config (if needed)
src/components/result/
  ResultDashboard.tsx                # composes the real result page (percentage, benefit, testimonials, plan, CTA)
  PlanDetailsDialog.tsx              # plan-details modal (Opened/Closed Plan Details)
src/components/screens/ResultScreen.tsx  # render ResultDashboard + sticky CountdownTimer
src/components/QuizApp.tsx           # render SkipModal on the start screen; pass real result props
src/store/quizStore.ts               # openPlanDetails/closePlanDetails actions; result-percentage seed
src/main.tsx                         # mount hairquiz.spec by default
e2e/golden.spec.ts + fixtures        # full real-spec walk vs golden-events.json + visual diff
e2e/visual.spec.ts                   # screenshot comparisons vs docs/reference/golden/
```

---

### Task 1: Extract the real dashboard behavior + content (Phase-0 deferral)

**Files:** Create `docs/reference/dashboard-spec.md`.

- [ ] **Step 1: Read the Flutter dashboard source**

Dispatch reads `~/github/Flutter Quiz Raw/QuizV2-flutterflow/lib/dashboard/` — `dashboard/dashboard_widget.dart`, `final_pitch/final_pitch_widget.dart`, `pitch_plan_dialog/pitch_plan_dialog_widget.dart`, `dashboard_widget/dashboard_widget_widget.dart`, `skip_dialog/skip_dialog_widget.dart`, and `components/floating_timer_checkout_widget.dart` (+ `app_state.dart` PlanData/personalPlan). Cite file:line.

- [ ] **Step 2: Write `docs/reference/dashboard-spec.md`** documenting, with citations:
  - The result page structure + every answerId-conditional branch: benefit copy by `hairGoal` (`goal_hairloss/goal_betterhair/goal_both`), goal description + transformation-timeline images + before/after testimonials by `hairConcern`, avatar by `age`.
  - The match-% behavior (`randomInteger(92,97)`) and any placeholder strings still in the source (flag them).
  - Pricing/plan data (`PlanData`, `personalPlan`) and the plan-details dialog (its `Opened Plan Details` / `Closed Plan Details` events + the `Go to  checkout` from the dialog vs the timer's one-space `Go to checkout`).
  - The floating countdown timer (30 min / `timerSecElapsed`) and its checkout CTA.
  - The skip dialog (Opened/Closed Skip Dialog → SkipQuiz → checkout).

- [ ] **Step 3: QC gate** — fresh agent verifies every branch + event + the random-% against the Flutter source. PASS/FAIL.
- [ ] **Step 4: Commit** `-m "Phase 3 Task 1: extract dashboard behavior/content reference"`.

**Acceptance:** the dashboard's real behavior is documented with citations — the missing half of the golden reference.

---

### Task 2: Author the real quiz spec — screens 0–18

**Files:** Create `src/quiz/hairquiz.spec.ts`, `src/quiz/content/pitch-claim-matrix.ts`; Test `src/quiz/hairquiz.spec.test.ts`.

- [ ] **Step 1: Test that the real spec is structurally valid + matches the flow**

`src/quiz/hairquiz.spec.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { hairquizSpec } from './hairquiz.spec'
import { validateSpec } from '../spec/validate'

describe('real hairquiz spec', () => {
  it('passes the validator', () => { expect(validateSpec(hairquizSpec)).toEqual([]) })
  it('has the 20 active screens in order ending in result', () => {
    expect(hairquizSpec.screens.length).toBe(20)
    expect(hairquizSpec.screens[0].kind).toBe('question')        // start/goal
    expect(hairquizSpec.screens.at(-1)!.kind).toBe('result')     // dashboard
  })
  it('uses the canonical checkout base + coupon rules from the contract', () => {
    expect(hairquizSpec.checkout.base).toBe('https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/')
    expect(hairquizSpec.checkout.defaultCoupon).toBe('o_df')
  })
  it('wires the webhook to the Worker', () => {
    expect(hairquizSpec.webhookUrl).toBe('https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit')
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Author `hairquiz.spec.ts`** — translate `docs/reference/quiz-flow.md` screens 0→18 into spec entries: real `id`, `type`, `questionId`, `answers` (exact `answerId`s + labels + imageUrls), `progression` (per the flow doc — note idx 10 is `cta` with `reveal`; multi screens have `noneOfTheAbove: { label: 'None of the above', answerId: 'n/a' }`), the `prompt`/`reveal` as `ConditionalText` (idx 5 by `hairConcern`; etc.), and `cdp` from `cdp-coupon-map.md`. Put the big conditional tables in `src/quiz/content/pitch-claim-matrix.ts` (the 5×5 routine×concern claim, the damage-activity description, the idx-5 prompt, idx-18 resolution line) and import them. Add `checkout` (couponRules from the coupon map, base, `o_df` default) and `webhookUrl`. The result screen (idx 19) is a placeholder here; its content lands in Tasks 4–5.

- [ ] **Step 4: Run (green) + `npm run validate` (after Task 6 points it at the real spec) — for now assert via the test. Step 5: Commit** `-m "Phase 3 Task 2: author real quiz spec (screens 0-18) + conditional tables"`.

**Acceptance:** 20 screens, validator-clean, canonical checkout/webhook, real answerIds, conditional tables authored from the flow doc.

---

### Task 3: QC the spec content against the golden reference

**Files:** none (review task) — log findings in `docs/reference/ISSUES.md`.

- [ ] **Step 1: Adversarial QC** — a fresh agent diffs `src/quiz/hairquiz.spec.ts` + `content/*` against `docs/reference/quiz-flow.md` and `cdp-coupon-map.md`: every screen present in order; every answerId matches Flutter; every conditional table cell matches the 5×5 matrix; every cdp mapping matches; progression flags correct (esp. idx 10 `cta`+reveal, multi `noneOfTheAbove`). Return PASS/FAIL with a per-discrepancy list.
- [ ] **Step 2:** Fix any FAIL in the spec (re-commit) until PASS. Log notable mismatches in ISSUES.md.

**Acceptance:** the authored spec provably matches the golden reference content.

---

### Task 4: Result content maps + types

**Files:** Create `src/quiz/content/result-content.ts`, `src/quiz/content/plans.ts`; extend `src/spec/types.ts` (ResultScreen config); Tests alongside.

- [ ] **Step 1: Test** the content maps resolve per answerId (benefit by `hairGoal`, transformation set by `hairConcern`, avatar by `age`) and plan data shape.
- [ ] **Step 2–3: Implement** `result-content.ts` (answerId→content, from `docs/reference/dashboard-spec.md`) + `plans.ts` (PlanData/personalPlan). Extend `ResultScreen`/`QuizSpec` types with a `result` config block (benefit/transformation/avatar maps + plans + timer seconds + ctaLabel). Keep it data; conditions resolved by existing helpers.
- [ ] **Step 4–5: Run + Commit** `-m "Phase 3 Task 4: result content maps + plan data + result spec config"`.

**Acceptance:** all answer-conditional result content is data, validated, sourced from the dashboard reference.

---

### Task 5: Dashboard composition (ResultDashboard + PlanDetailsDialog)

**Files:** Create `src/components/result/ResultDashboard.tsx` (+ test), `src/components/result/PlanDetailsDialog.tsx` (+ test); Modify `src/components/screens/ResultScreen.tsx`, `src/store/quizStore.ts`.

- [ ] **Step 1: Tests** — `ResultDashboard` (presentational props: `{ name, percentage, benefit, transformation, avatarUrl, plans, ctaLabel, onCta, onOpenPlan }`) renders the personalized content + CTA; `PlanDetailsDialog` (`{ open, plans, onClose, onCheckout }`) renders plan rows, Close→`onClose`, checkout→`onCheckout`. Store: `openPlanDetails()` fires `GA.OPENED_PLAN_DETAILS`, `closePlanDetails()` fires `GA.CLOSED_PLAN_DETAILS`; the dialog's checkout fires `GA.GO_TO_CHECKOUT_RESULTS` (two-space) then `redirectToCheckout`; the result CTA fires `GA.GO_TO_CHECKOUT_RESULTS` then redirect; the sticky timer CTA fires `GA.GO_TO_CHECKOUT_TIMER` (one-space) then redirect.
- [ ] **Step 2–3: Implement.** `percentage` seeded once in the store as `randomInteger(92,97)` (replicate Flutter; FLAG for Phase 4) — pass a fixed value in tests for determinism. Compose `ResultDashboard` + sticky `CountdownTimer` + `PlanDetailsDialog` inside `ResultScreen`. Wire the three distinct checkout events to the exact GA constants.
- [ ] **Step 4: Run + `npm run build`. Step 5: Commit** `-m "Phase 3 Task 5: real dashboard (ResultDashboard + plan dialog + checkout events)"`.

**Acceptance:** the result page renders personalized content; the three checkout entry points fire the correct (and correctly-spaced) GA events; plan dialog fires Opened/Closed Plan Details.

---

### Task 6: Wire start-screen skip modal + mount the real spec

**Files:** Modify `src/components/QuizApp.tsx`, `src/components/screens/SingleChoiceScreen.tsx` (or the start screen) , `src/main.tsx`, `src/spec/cli-validate.ts`.

- [ ] **Step 1: Test** — the start screen exposes a skip trigger; `QuizApp` renders `<SkipModal>` driven by store `openSkip/dismissSkip/confirmSkip`; tapping skip fires `GA.OPENED_SKIP_DIALOG`, confirm fires `GA.SKIP_QUIZ`+redirect, dismiss fires `GA.CLOSED_SKIP_DIALOG`.
- [ ] **Step 2–3: Implement** the skip-link on the start screen (a small "skip the quiz" affordance, per `golden/00b-skip-modal.png`), render SkipModal in QuizApp, and point `main.tsx` + `cli-validate.ts` at `hairquizSpec` (so `npm run validate` validates the REAL spec).
- [ ] **Step 4: Run `npm run test` + `npm run validate` (real spec) + `npm run build`. Step 5: Commit** `-m "Phase 3 Task 6: skip modal wiring + mount real spec as default"`.

**Acceptance:** the app boots the real 20-screen quiz; the skip modal works and tracks; the validator guards the real spec.

---

### Task 7: Full tracking-parity gate (e2e vs golden-events.json)

**Files:** Modify `e2e/golden.spec.ts`; replace `e2e/fixtures/example-events.json` usage with `docs/reference/golden-events.json`.

- [ ] **Step 1: Implement the full walk** — Playwright walks the REAL spec along the canonical happy path defined in `docs/reference/golden-events.json` (`hairGoal: goal_both`, `hairConcern: concern_hairloss`, `diet: diet_balanced`, etc.; fill remaining screens with valid answers), STUBBING the webhook (`page.route('**/quiz/submit', …200)`) and Converge (`window.trackEvent = ()=>{}`) so no real lead/event leaves. Capture `dataLayer` pushes.
- [ ] **Step 2: Assert parity** — the captured GA `event` sequence (deduped for StrictMode) equals the `expectedEvents` sequence in `golden-events.json`; the `Question Answered` for `hairConcern` carries `selected_answer: ['concern_hairloss']`; the checkout step uses the two-space `Go to  checkout`; the resolved coupon is `c_hl`. If `golden-events.json` used placeholder/`_repeatsPerQuestion` shorthand, expand it to the concrete real-spec sequence and update the fixture (keeping it the source of truth).
- [ ] **Step 3: Run `npm run test:e2e` (green). Step 4: Commit** `-m "Phase 3 Task 7: full tracking-parity gate vs golden-events.json"`.

**Acceptance:** the real quiz's end-to-end analytics sequence provably matches the Phase-0 contract fixture. This is the core fidelity gate.

---

### Task 8: Visual parity (screens 0–18) + dashboard-visual decision

**Files:** Create `e2e/visual.spec.ts`; add `e2e/visual.spec.ts-snapshots/` (generated).

- [ ] **Step 1: Implement screenshot comparison** — at 390×844, walk screens 0–18 and compare each against the corresponding `docs/reference/golden/NN-*.png` using Playwright image diff with a tolerance (`maxDiffPixelRatio` ~0.1 to allow font/render differences; the goal is structural parity, not pixel-perfection). Where a screen legitimately differs (the rebuild's tasteful spacing), record the new baseline and note it.
- [ ] **Step 2: Dashboard visual (ISSUES #8)** — the dashboard (19) + timer have no golden screenshot. Do NOT submit a real lead. Options, pick per the controller/owner: (a) build the Flutter export locally and screenshot the dashboard offline; (b) owner-approved tagged test submission with downstream suppressed; (c) defer dashboard visual to Phase 4. Default: **defer** — assert the dashboard's structure via DOM (key elements present) in `e2e/golden.spec.ts`, and log the pending visual capture in ISSUES.md.
- [ ] **Step 3: Run `npm run test:e2e`. Step 4: Commit** `-m "Phase 3 Task 8: visual parity gate (screens 0-18) + dashboard structural check"`.

**Acceptance:** screens 0–18 structurally match the golden screenshots; the dashboard visual gap is explicitly tracked, not silently skipped.

---

### Task 9: Per-quiz subpath build + promotion dry-run + docs

**Files:** Create `scripts/promote.md` (checklist); Modify `CLAUDE.md`.

- [ ] **Step 1: Verify subpath build** — `npm run build -- --base=/the-quiz-haircare/` produces a bundle whose asset paths resolve under that subpath (inspect `dist/index.html`). Confirm the app loads when served from a subdir (e.g. `npx vite preview --base=/the-quiz-haircare/` or a static serve of `dist` under the path).
- [ ] **Step 2: Write `scripts/promote.md`** — the manual promotion checklist into `holinic-webflow`: build with the target `--base=/NN-the-quiz-haircare/`, copy `dist/*` into the `holinic-webflow/NN-the-quiz-haircare/` folder, the testing-path vs winner-overwrite (`the-quiz-haircare`) convention, and the host-page requirement that GTM/gtag/Converge globals exist (they're provided by the page, not the bundle). Note: secrets via `VITE_WEBHOOK_SECRET` at build time.
- [ ] **Step 3: Update `CLAUDE.md`** with the build+promote flow + the dashboard-% and dashboard-visual flags for Phase 4. **Step 4: Commit** `-m "Phase 3 Task 9: subpath build verification + promotion checklist"`.

**Acceptance:** the real quiz builds for subpath serving and there's a documented promotion path; Phase-4 flags recorded.

---

## Self-Review

**Spec coverage (design §3 fidelity-first + the real quiz):**
- Real 20-screen spec from quiz-flow.md (questions, answers, conditional 5×5 matrix, progression incl. idx-10/none-of-above) → Tasks 2,3. ✓
- Dashboard real content + timer + plan dialog + skip modal → Tasks 1,4,5,6. ✓
- CDP/coupon from the maps → Task 2 (cdp) + Task 5/6 (checkout events). ✓
- Tracking parity vs golden-events.json → Task 7 (the core gate). ✓
- Visual parity vs golden screenshots (0–18) + dashboard gap handled → Task 8. ✓
- Subpath build + promotion → Task 9. ✓
- Fidelity-first: placeholders/random-% replicated + flagged, not invented → protocol + Tasks 5,9. ✓

**Out of scope (Phase 4/5):** design polish/redesign, real testimonials via the survey MCP, answer-derived match-%, the dashboard visual capture (if deferred), the design context pack, and promotion automation.

**Placeholder scan:** spec-authoring tasks reference `quiz-flow.md`/`dashboard-spec.md` as the content source (too large to inline) but are bounded by hard acceptance gates (`validateSpec` clean + e2e equals `golden-events.json` + visual diff) — correctness is machine-checked, not asserted. Component/dialog tasks carry concrete prop signatures + tracking assertions.

**Type/name consistency:** `hairquizSpec`, `pitch-claim-matrix`, `result-content`, `ResultDashboard`, `PlanDetailsDialog`, `openPlanDetails/closePlanDetails`, and the GA constants (`GO_TO_CHECKOUT_RESULTS` two-space vs `GO_TO_CHECKOUT_TIMER` one-space) are used consistently and build on Phase 1/2 symbols (`validateSpec`, `resolveConditional`, `CountdownTimer`, `SkipModal`, `redirectToCheckout`, the store actions).

**Decision flagged for the owner before/within Task 8:** how to capture the dashboard visual (local Flutter build vs approved tagged test submission vs defer). Default = defer with a DOM structural check.
