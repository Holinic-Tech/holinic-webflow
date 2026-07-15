# Phase 2 — Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement task-by-task. Steps use checkbox (`- [ ]`) syntax. TDD per task; adversarial QC gate after each (see protocol). Build on the Phase-1 foundation (master).

**Goal:** Build the full presentational component library — every screen type (image-choice, multi-select, rating, pitch, loading, email-capture, result/dashboard) plus the shared primitives (fit-to-viewport scaler, countdown timer, skip modal, progress header) — all mobile-first, all previewable in isolation, with the store wiring each type's progression and tracking. After Phase 2 the engine can render any screen kind from a spec; Phase 3 assembles the real 20-screen quiz.

**Architecture:** Components stay strictly presentational per `docs/component-contract.md` — they receive resolved props + callbacks, never read the spec/answers, never resolve conditions. `ScreenRenderer` resolves `ConditionalText` and maps `screen.kind`+`type` → component. The **fit-to-viewport primitive** wraps every non-result screen and scales content to fit `100dvh` minus chrome with no scroll; the result/dashboard is the one scrollable screen. The store gains progression/tracking actions for the new types.

**Tech Stack:** unchanged (Vite + React 19 + TS + Tailwind + Zustand + Vitest + Playwright). Add `ResizeObserver` (browser native; polyfilled in jsdom tests where needed).

**Inputs (read-only):** `docs/reference/quiz-flow.md` (per-screen behavior, progression, the idx-10 reveal/`cta` + "None of the above"=`'n/a'` facts), `docs/reference/golden/*.png` (visual reference), `docs/reference/tracking-contract.md`, `CLAUDE.md`, `docs/component-contract.md`. Phase-1 code under `src/`.

**Phase 2 does NOT:** assemble the real 20-screen spec, wire the dashboard's real conditional content / random-percentage / plan-details dialog, or assert against the real `golden-events.json` (all Phase 3). It builds the reusable pieces + proves them in isolation and with the example spec.

---

## Cross-cutting protocol (every task)

1. **TDD:** failing test → red → minimal code → green → commit.
2. **Presentational contract:** new screen components MUST NOT import the spec, answers, the store, or `resolveConditional`. They take resolved props + callbacks. A QC check enforces this (grep for forbidden imports).
3. **No-scroll invariant:** every non-result screen fits the viewport with no vertical scroll at the target mobile viewport (390×844). A Playwright assertion checks `document.scrollingElement.scrollHeight <= clientHeight` per screen.
4. **Tracking unchanged:** reuse the Phase-1 `trackGAEvent`/`GA`/converge/webhook/checkout — do not duplicate or alter event strings.
5. **Adversarial QC gate per task** (fresh subagent) before moving on. Commits via `git -c user.name="Toby Dietz" -c user.email="toby@holinic.co" commit` (`--no-gpg-sign` if signing fails).

---

## File structure (added/changed)

```
src/components/
  layout/
    FitViewport.tsx        # scale-to-fit-viewport primitive (+ fit.ts pure core)
    fit.ts                 # computeScale() pure logic
    ProgressHeader.tsx     # header: back + progress bar (derived)
  primitives/
    CountdownTimer.tsx     # countdown display (props: secondsLeft / onExpire)
    SkipModal.tsx          # "skip the quiz" modal (onConfirm/onDismiss)
  screens/
    SingleChoiceScreen.tsx # (exists)
    ImageChoiceScreen.tsx  # single-choice with images (large/small)
    MultiSelectScreen.tsx  # multi + None-of-the-above + Continue gating
    RatingScreen.tsx       # scale buttons (record+advance on tap)
    PitchScreen.tsx        # interstitial (headline/body/image + Continue)
    LoadingScreen.tsx      # messages + progress + auto-advance
    EmailCaptureScreen.tsx # name+email form + validation
    ResultScreen.tsx       # scrollable dashboard shell (slots)
  ScreenRenderer.tsx       # extended mapping for all kinds/types
  QuizApp.tsx              # applies FitViewport (non-result) / scroll (result) + chrome
  preview/
    PreviewGallery.tsx     # isolated previews of every component
src/store/quizStore.ts     # progression+tracking for multi/rating/pitch/loading/email/skip
e2e/golden.spec.ts         # extended walk + no-scroll assertions
CLAUDE.md, docs/component-contract.md  # updated recipes + fit-to-viewport usage
```

---

### Task 1: Fit-to-viewport core (the make-or-break)

**Files:** Create `src/components/layout/fit.ts`, `src/components/layout/fit.test.ts`.

- [ ] **Step 1: Test the pure scale logic**

`src/components/layout/fit.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { computeScale } from './fit'

describe('computeScale', () => {
  it('returns 1 when content fits', () => { expect(computeScale(400, 800)).toBe(1) })
  it('scales down proportionally when content overflows', () => { expect(computeScale(1000, 800)).toBe(0.8) })
  it('never scales below the floor', () => { expect(computeScale(4000, 800, 0.6)).toBe(0.6) })
  it('returns 1 for non-positive measurements (not yet measured)', () => {
    expect(computeScale(0, 800)).toBe(1); expect(computeScale(500, 0)).toBe(1)
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Implement `src/components/layout/fit.ts`**
```ts
/** Scale factor to fit `contentHeight` into `availableHeight` without scroll. Never upscales; floors at `min`. */
export function computeScale(contentHeight: number, availableHeight: number, min = 0.6): number {
  if (contentHeight <= 0 || availableHeight <= 0) return 1
  if (contentHeight <= availableHeight) return 1
  return Math.max(min, availableHeight / contentHeight)
}
```

- [ ] **Step 4: Run (green). Step 5: Commit** `-m "Phase 2 Task 1: fit-to-viewport scale logic (pure)"`.

**Acceptance:** scale math is correct, floored, and safe before measurement. (Fluid typography via Tailwind is the first line of defense; this scaler is the guarantee that nothing ever scrolls.)

---

### Task 2: FitViewport component

**Files:** Create `src/components/layout/FitViewport.tsx`, `src/components/layout/FitViewport.test.tsx`.

- [ ] **Step 1: Test (renders children; applies a transform style when overflowing)**

`src/components/layout/FitViewport.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FitViewport } from './FitViewport'

beforeAll(() => {
  // jsdom has no layout; stub ResizeObserver
  ;(globalThis as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

describe('FitViewport', () => {
  it('renders its children', () => {
    render(<FitViewport><p>hello</p></FitViewport>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })
  it('exposes a measuring inner wrapper with a data-fit-inner hook', () => {
    const { container } = render(<FitViewport><p>x</p></FitViewport>)
    expect(container.querySelector('[data-fit-inner]')).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Implement `FitViewport.tsx`** — an outer `div` (`h-full w-full overflow-hidden flex flex-col justify-center items-stretch`) and an inner `div[data-fit-inner]`. Use `ResizeObserver` (on inner content + a `useLayoutEffect` reading the outer `clientHeight`) to measure `contentHeight` (inner `scrollHeight`) and `availableHeight` (outer `clientHeight`); set scale via `computeScale`; apply `style={{ transform: scale === 1 ? undefined : `scale(${scale})`, transformOrigin: 'center top' }}`. Recompute on resize. Keep it dependency-free.

- [ ] **Step 4: Run (green). Step 5: Commit** `-m "Phase 2 Task 2: FitViewport scale-to-fit container"`.

**Acceptance:** renders children; measures + applies scale; no crash without a real layout engine (tests stub ResizeObserver). Real no-scroll behavior is asserted by Playwright in Task 12.

---

### Task 3: ProgressHeader + chrome wiring in QuizApp

**Files:** Create `src/components/layout/ProgressHeader.tsx` (+ test); Modify `src/components/QuizApp.tsx`.

- [ ] **Step 1: Test** — `ProgressHeader` shows a back control when `showBack` and renders a progress bar at `current/total`; calls `onBack` on tap.
- [ ] **Step 2–3: Implement** `ProgressHeader` (presentational: props `{ showBack, showProgress, current, total, onBack }`). Update `QuizApp` to render `<ProgressHeader>` from `deriveChrome` + `questionPosition`/`totalQuestions`, and to wrap the current screen in `<FitViewport>` for every kind EXCEPT `result` (result renders in a scrollable container `overflow-y-auto`).
- [ ] **Step 4: Run tests + `npm run build`. Step 5: Commit** `-m "Phase 2 Task 3: ProgressHeader + FitViewport/scroll wiring in QuizApp"`.

**Acceptance:** chrome derived (Phase-1 invariant intact); non-result screens wrapped in FitViewport; result scrolls.

---

### Task 4: ImageChoiceScreen

**Files:** Create `src/components/screens/ImageChoiceScreen.tsx` (+ test); Modify `src/components/ScreenRenderer.tsx`.

- [ ] **Step 1: Test** — presentational props `{ prompt: string; answers: Answer[]; onSelect: (answerId: string) => void; size?: 'large' | 'small' }`; renders each answer's `imageUrl` + `label` as a tappable card; tapping calls `onSelect(answerId)`. Resolved prompt rendered.
- [ ] **Step 2–3: Implement** the component (mobile-first card grid; `large` = one prominent image per row, `small` = compact rows) and extend `ScreenRenderer` so `kind:'question'` + `type:'image'` → `ImageChoiceScreen` (passing resolved `prompt`). Single-choice auto-advance handled by store (Task 11).
- [ ] **Step 4: Run + Step 5: Commit** `-m "Phase 2 Task 4: ImageChoiceScreen + renderer mapping"`.

**Acceptance:** renders images+labels; emits answerId; condition-agnostic.

---

### Task 5: MultiSelectScreen (None-of-the-above + Continue gating)

**Files:** Create `src/components/screens/MultiSelectScreen.tsx` (+ test); Modify `ScreenRenderer.tsx`.

- [ ] **Step 1: Test** — props `{ prompt: string; answers: Answer[]; selected: string[]; noneLabel?: string; onToggle: (id: string) => void; onNone?: () => void; onContinue: () => void }`. Asserts: tapping an option calls `onToggle`; the "None of the above" button (shown when `noneLabel` provided) calls `onNone`; the **Continue button is disabled when `selected.length === 0`** and enabled otherwise; tapping Continue (enabled) calls `onContinue`.

`src/components/screens/MultiSelectScreen.test.tsx` (key assertions):
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MultiSelectScreen } from './MultiSelectScreen'

const answers = [{ answerId: 'm1', label: 'Heat' }, { answerId: 'm2', label: 'Bleach' }]

it('disables Continue with zero selections, enables with ≥1', () => {
  const { rerender } = render(<MultiSelectScreen prompt="Pick" answers={answers} selected={[]} noneLabel="None of the above" onToggle={()=>{}} onNone={()=>{}} onContinue={()=>{}} />)
  expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  rerender(<MultiSelectScreen prompt="Pick" answers={answers} selected={['m1']} noneLabel="None of the above" onToggle={()=>{}} onNone={()=>{}} onContinue={()=>{}} />)
  expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled()
})
it('None of the above calls onNone', () => {
  const onNone = vi.fn()
  render(<MultiSelectScreen prompt="Pick" answers={answers} selected={[]} noneLabel="None of the above" onToggle={()=>{}} onNone={onNone} onContinue={()=>{}} />)
  fireEvent.click(screen.getByText('None of the above')); expect(onNone).toHaveBeenCalled()
})
```

- [ ] **Step 2–3: Implement** + map `kind:'question'`+`type:'multi'` → MultiSelectScreen in `ScreenRenderer`.
- [ ] **Step 4–5: Run + Commit** `-m "Phase 2 Task 5: MultiSelectScreen (none-of-the-above + Continue gating)"`.

**Acceptance:** Continue gated at ≥1; None-of-the-above wired; matches the live behavior captured in Phase 0.

---

### Task 6: RatingScreen

**Files:** Create `src/components/screens/RatingScreen.tsx` (+ test); Modify `ScreenRenderer.tsx`.

- [ ] **Step 1: Test** — props `{ prompt: string; answers: Answer[]; onSelect: (id: string) => void }` (scale options as buttons; a single tap records + advances, per Phase-0 finding). Tapping an option calls `onSelect(answerId)`.
- [ ] **Step 2–3: Implement** (horizontal/segmented scale buttons) + map `type:'rating'`.
- [ ] **Step 4–5: Run + Commit** `-m "Phase 2 Task 6: RatingScreen"`.

**Acceptance:** renders scale; one tap emits answerId (store advances).

---

### Task 7: PitchScreen

**Files:** Create `src/components/screens/PitchScreen.tsx` (+ test); Modify `ScreenRenderer.tsx`.

- [ ] **Step 1: Test** — props `{ headline: string; body: string; imageUrl?: string; onContinue: () => void }`; renders resolved headline/body/image; Continue calls `onContinue`.
- [ ] **Step 2–3: Implement** + map `kind:'pitch'` → PitchScreen (ScreenRenderer resolves `headline`/`body` `ConditionalText`).
- [ ] **Step 4–5: Run + Commit** `-m "Phase 2 Task 7: PitchScreen"`.

**Acceptance:** presentational; Continue fires (store sends `Continued From Pitch` with the spec `label` — Task 11).

---

### Task 8: LoadingScreen (auto-advance + progress)

**Files:** Create `src/components/screens/LoadingScreen.tsx` (+ test); Modify `ScreenRenderer.tsx`.

- [ ] **Step 1: Test** — props `{ messages: string[]; durationMs: number; onDone: () => void }`. Using fake timers, assert `onDone` is called after `durationMs`; assert messages render. Example:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LoadingScreen } from './LoadingScreen'
it('calls onDone after durationMs', () => {
  vi.useFakeTimers(); const onDone = vi.fn()
  render(<LoadingScreen messages={['Checking…']} durationMs={3000} onDone={onDone} />)
  expect(screen.getByText('Checking…')).toBeInTheDocument()
  vi.advanceTimersByTime(3000); expect(onDone).toHaveBeenCalledTimes(1); vi.useRealTimers()
})
```
- [ ] **Step 2–3: Implement** (animated progress bar + cycling messages; `setTimeout(onDone, durationMs)` cleared on unmount) + map `kind:'loading'`.
- [ ] **Step 4–5: Run + Commit** `-m "Phase 2 Task 8: LoadingScreen (auto-advance)"`.

**Acceptance:** auto-advances once after duration; cleans up its timer.

---

### Task 9: EmailCaptureScreen (form + validation)

**Files:** Create `src/components/screens/EmailCaptureScreen.tsx` (+ test); Modify `ScreenRenderer.tsx`.

- [ ] **Step 1: Test** — props `{ headline: string; onSubmit: (data: { name: string; email: string }) => void }`. Asserts: Submit is disabled / shows an error until a non-empty name and a valid email are entered; on valid submit, `onSubmit({ name, email })` is called with trimmed values. (Email regex basic: contains `@` and a dot.)
- [ ] **Step 2–3: Implement** (controlled inputs, inline validation) + map `kind:'email'`.
- [ ] **Step 4–5: Run + Commit** `-m "Phase 2 Task 9: EmailCaptureScreen (form + validation)"`.

**Acceptance:** validates; emits trimmed `{name,email}` only when valid. (Store wires submit → webhook + converge + `Quiz Submitted` in Task 11.)

---

### Task 10: CountdownTimer + SkipModal + ResultScreen shell

**Files:** Create `src/components/primitives/CountdownTimer.tsx` (+ test), `src/components/primitives/SkipModal.tsx` (+ test), `src/components/screens/ResultScreen.tsx` (+ test); Modify `ScreenRenderer.tsx`.

- [ ] **Step 1: Tests**
  - `CountdownTimer` props `{ secondsLeft: number; onExpire?: () => void }`: renders mm:ss; with fake timers, decrements and calls `onExpire` at 0.
  - `SkipModal` props `{ open: boolean; onConfirm: () => void; onDismiss: () => void }`: renders when `open`; Confirm→`onConfirm`, Dismiss→`onDismiss`.
  - `ResultScreen` props `{ children?: ReactNode; onCta: () => void; ctaLabel: string }`: renders in a scrollable container, CTA calls `onCta`.
- [ ] **Step 2–3: Implement** all three (presentational; `ResultScreen` is the one scrollable screen — `overflow-y-auto min-h-[100dvh]`, NOT wrapped in FitViewport) + map `kind:'result'` → ResultScreen. The real dashboard content (percentage, plan details, testimonials) is Phase 3; here it's a slot shell + CTA + an optional sticky `CountdownTimer`.
- [ ] **Step 4–5: Run + Commit** `-m "Phase 2 Task 10: CountdownTimer + SkipModal + ResultScreen shell"`.

**Acceptance:** timer counts down + expires; modal toggles; result scrolls and is NOT fit-scaled.

---

### Task 11: Store progression + tracking for all types

**Files:** Modify `src/store/quizStore.ts`; Test `src/store/quizStore.progression.test.ts`.

- [ ] **Step 1: Tests** (extend the Phase-1 store):
  - **multi:** `toggleMulti(id)` updates selection without advancing; `chooseNoneOfTheAbove()` records the screen's `noneOfTheAbove.answerId` (e.g. `'n/a'`) clearing others; `continue()` fires `GA.QUESTION_ANSWERED` with the selected array then advances.
  - **rating:** `answer(id)` records + fires `Question Answered` + advances (single tap).
  - **pitch:** `continue()` fires `GA.CONTINUED_FROM_PITCH` with `question` = the pitch `label`, then advances.
  - **loading:** `loadingDone()` advances (no event) — or store exposes the screen's `durationMs` for the component.
  - **email:** `submitEmail({name,email})` → records contact, fires `GA.QUIZ_SUBMITTED` with `q_name/q_email`, calls `submitWebhook(spec, answers, user, secret)` and `trackConvergeCompletedQuiz(...)`, then advances to result. (Use a injected `secret` from `import.meta.env.VITE_WEBHOOK_SECRET`.)
  - **skip:** `openSkip()` fires `GA.OPENED_SKIP_DIALOG`; `dismissSkip()` fires `GA.CLOSED_SKIP_DIALOG`; `confirmSkip()` fires `GA.SKIP_QUIZ` then `redirectToCheckout(...)`.
  Each asserts the exact `GA.*` event fired (via `window.dataLayer`) and the resulting index/state.
- [ ] **Step 2–3: Implement** the actions, reusing Phase-1 tracking/webhook/checkout/converge. Position always `questionPosition(spec, index)`. Email `name` split into first/last on first space (matches contract).
- [ ] **Step 4: Run all tests + `npm run build`. Step 5: Commit** `-m "Phase 2 Task 11: store progression + tracking for all screen types"`.

**Acceptance:** every screen type's progression fires the correct contract event at the right moment and transitions correctly.

---

### Task 12: Preview gallery + extended e2e (no-scroll + multi-type walk)

**Files:** Create `src/components/preview/PreviewGallery.tsx`; add a `?preview` route in `main.tsx`; Modify `e2e/golden.spec.ts`.

- [ ] **Step 1: PreviewGallery** — renders one instance of every screen component + primitive with representative sample props, each in a labeled frame at a mobile width. Mounted when `location.search.includes('preview')` (so `/?preview` shows the gallery; default shows the quiz). This is the isolated-preview deliverable (and the design-workflow surface).
- [ ] **Step 2: Extend `e2e/golden.spec.ts`** — (a) walk the example spec through MORE types now that they're interactive (single → multi[+Continue] → pitch[+Continue] → email[fill+submit is mocked: stub `window.fetch`] → result), asserting the GA event sequence; (b) add a **no-scroll assertion** at the question/pitch screens: `expect(await page.evaluate(() => document.scrollingElement!.scrollHeight <= document.scrollingElement!.clientHeight)).toBe(true)`; (c) assert the result screen IS allowed to scroll. Update `e2e/fixtures/example-events.json` to the new real sequence. Mock the webhook (`page.route('**/quiz/submit', r => r.fulfill({status:200}))`) so no real lead is created.
- [ ] **Step 3: Run** `npm run test:e2e` (green) + `npm run test` + `npm run build`. **Step 4: Commit** `-m "Phase 2 Task 12: preview gallery + extended e2e (no-scroll + multi-type walk)"`.

**Acceptance:** every component visible in `/?preview`; e2e walks multiple types, asserts events, and proves non-result screens don't scroll while result does. No real webhook hit.

---

### Task 13: Update CLAUDE.md + component contract

**Files:** Modify `CLAUDE.md`, `docs/component-contract.md`.

- [ ] **Step 1:** Add to `CLAUDE.md`: the catalog of screen types + which `kind`/`type` maps to which component; the **fit-to-viewport rule** (all screens are auto-scaled to fit; design content to a mobile viewport; the result screen is the only scrollable one; prefer fluid type so scaling stays mild); how to preview (`/?preview`); the no-scroll invariant + how it's enforced (Playwright). Add a recipe: *Add a new screen-type component* (create the presentational component, map it in `ScreenRenderer`, add a preview, add store progression if it advances differently).
- [ ] **Step 2:** Update `docs/component-contract.md` with the new components' prop signatures as further reference examples and the FitViewport contract (components must not assume a fixed height; they render natural content and the scaler fits it).
- [ ] **Step 3: Commit** `-m "Phase 2 Task 13: docs — screen-type catalog, fit-to-viewport rule, recipes"`.

**Acceptance:** a newcomer can see the full component catalog, the scaling rule, and how to add a new screen type.

---

## Self-Review

**Spec coverage (design §5 pillar 3 + §6a + Phase-0 carry-forwards):**
- All screen types (image/multi/rating/pitch/loading/email/result) → Tasks 4–10. ✓
- Fit-to-viewport no-scroll (except dashboard) — the attempt-#1 failure → Tasks 1,2,3 + the Playwright no-scroll assertion (Task 12). ✓
- Multi-select Continue gating + None-of-the-above (`'n/a'`) → Task 5 + Task 11. ✓
- Rating single-tap record+advance; idx-10-style reveal handled via PitchScreen/AdditionalInfo pattern (reveal text is a resolved prop) → Tasks 6,7,11. ✓
- Countdown timer + skip modal (library) → Task 10 + store wiring Task 11. ✓
- Progression + exact tracking per type (incl. `Continued From Pitch` label, `Quiz Submitted`+webhook+Converge, skip→`SkipQuiz`+checkout) → Task 11. ✓
- Isolated previews (design-workflow surface) → Task 12. ✓
- Presentational-component contract preserved + documented → all component tasks + Task 13. ✓

**Out of scope (correctly deferred to Phase 3):** the real 20-screen spec, the dashboard's real conditional content / random `percentage` / plan-details dialog / testimonials, and the assertion against the real `docs/reference/golden-events.json`.

**Placeholder scan:** fit-to-viewport core + key component tests + store-wiring assertions are concrete; component bodies are idiomatic React to pass the given tests (consistent with Phase-1 style). No "TBD/handle edge cases."

**Type/name consistency:** `computeScale`, `FitViewport`, `ProgressHeader`, `ImageChoiceScreen`, `MultiSelectScreen`, `RatingScreen`, `PitchScreen`, `LoadingScreen`, `EmailCaptureScreen`, `ResultScreen`, `CountdownTimer`, `SkipModal`, and the store actions (`toggleMulti`, `chooseNoneOfTheAbove`, `continue`, `submitEmail`, `openSkip/dismissSkip/confirmSkip`, `loadingDone`) are used consistently and build on Phase-1 symbols (`trackGAEvent`, `GA`, `submitWebhook`, `trackConvergeCompletedQuiz`, `redirectToCheckout`, `questionPosition`, `resolveConditional`).
