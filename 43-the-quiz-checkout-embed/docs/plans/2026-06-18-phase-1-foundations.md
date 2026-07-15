# Phase 1 — Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax. Each task uses TDD (failing test → minimal code → green → commit) and ends with an adversarial QC gate (see Cross-cutting protocol).

**Goal:** Build the foundation of the spec-driven quiz engine — repo scaffold, the typed quiz-spec schema, a framework-agnostic engine (derived navigation with NO magic indexes, conditional resolution, answer state), a tracking layer that matches the Phase-0 contract byte-for-byte, a spec validator, ONE representative screen component rendered end-to-end, and a Playwright golden-test harness — proving the whole vertical slice with one screen and verified tracking.

**Architecture:** Pure TS engine (`src/engine`, `src/spec`, `src/tracking`) with zero React imports, unit-tested with Vitest. A thin Zustand store wires the engine to React. Presentational components render resolved props only (conditions live in the spec as data, resolved by the engine). A Playwright test walks a small example spec and asserts the captured analytics against a fixture. Built with Vite for static subpath serving.

**Tech Stack:** Vite 5 + React 19 + TypeScript + Tailwind 3 + Zustand 5 (state) + Vitest (unit) + Playwright (e2e). Matches the stack the prior React attempt used, minus its mistakes.

**Inputs (the Phase-0 golden reference — treat as authoritative, read-only):**
- `docs/reference/tracking-contract.md` — the exact event/webhook/checkout contract
- `docs/reference/golden-events.json` — canonical event-sequence fixture
- `docs/reference/quiz-flow.md` — screen behaviors (progression, conditional tables, the idx-10 `cta`/reveal + "None of the above"=`'n/a'` corrections)
- `docs/reference/cdp-coupon-map.md` — CDP + coupon maps
- `docs/reference/ISSUES.md` — owner confirmations (Converge set, enrichment, checkout `-59` dropped)

**Phase 1 does NOT:** build the full component library (Phase 2), assemble the real 20-screen quiz (Phase 3), or polish design (Phase 4). It builds the skeleton + one screen type.

---

## Cross-cutting protocol (every task)

1. **TDD:** write the failing test first, run it red, implement minimally, run it green, commit.
2. **Contract fidelity:** any string/URL/param that touches analytics MUST match `docs/reference/tracking-contract.md` exactly (e.g. the two-space `Go to  checkout`, `event_category: 'Quiz'`). Tests assert exact strings.
3. **No magic indexes:** navigation/progress/chrome visibility are derived from screen data, never hardcoded position literals. A test asserts that inserting a screen does not change other screens' chrome.
4. **Adversarial QC gate per task:** after the implementer reports DONE and the spec-compliance review passes, a fresh QC subagent verifies the code against this plan + the Phase-0 contract and returns PASS/FAIL. Fix until PASS before the next task.
5. **Commits:** use `git -c user.name="Toby Dietz" -c user.email="toby@holinic.co" commit`.

---

## File structure

```
package.json, vite.config.ts, tsconfig*.json, tailwind.config.js, postcss.config.js, eslint.config.js
index.html
src/
  spec/
    types.ts            # the quiz-spec schema (single source of types)
    validate.ts         # validateSpec(spec) -> SpecError[]
    example.spec.ts     # small 3-screen spec for engine/e2e tests
  engine/
    conditions.ts       # resolveConditional(text, answers)
    answers.ts          # AnswerState helpers (record single/multi/none-of-the-above)
    navigation.ts       # deriveChrome(spec, index) + next/prev index logic (no magic numbers)
  tracking/
    events.ts           # exact GA event-name constants (from the contract)
    track.ts            # trackGAEvent(...) dataLayer.push primary + gtag fallback
    converge.ts         # client Converge: Completed Quiz (NOT quiz started/completed)
    webhook.ts          # buildWebhookPayload(...) + submitWebhook(...)
    checkout.ts         # resolveCoupon(...) + buildCheckoutUrl(...) + redirectToCheckout(...)
  store/
    quizStore.ts        # Zustand: state + actions wiring engine + tracking
  components/
    screens/SingleChoiceScreen.tsx   # one presentational screen type
    ScreenRenderer.tsx               # screen.kind/type -> component, passes resolved props
    QuizApp.tsx                      # shell: render current screen + progression handling
  main.tsx, index.css
e2e/
  golden.spec.ts        # Playwright: walk example spec, assert analytics vs fixture
CLAUDE.md               # operating manual + invariants + change recipes
docs/component-contract.md  # presentational-component contract
```

> Tasks 2,4,5,6,7,8,9 (types + engine + tracking + validator) carry full code because exactness is load-bearing. Tasks 10–12 (React/UI/e2e) give signatures + full test code; the implementer writes idiomatic component bodies to pass them.

---

### Task 1: Scaffold the project

**Files:** Create `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`, `index.html`, `src/main.tsx`, `src/index.css`, `vitest.config.ts`, `playwright.config.ts`.

- [ ] **Step 1: Initialize Vite React-TS app and add deps**

Run (in repo root, which already contains `docs/`):
```bash
cd /Users/tobydietz/github/hairqare-quiz-engine
npm create vite@latest . -- --template react-ts   # accept merging into existing dir
npm install zustand
npm install -D tailwindcss@^3 postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
npx tailwindcss init -p
```

- [ ] **Step 2: Configure Vite base for subpath serving + Vitest**

`vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is overridden per-quiz at build time, e.g. --base=/20-the-quiz-haircare/
export default defineConfig({
  plugins: [react()],
  base: './',
  test: { environment: 'jsdom', globals: true, setupFiles: './src/test-setup.ts' },
})
```
Create `src/test-setup.ts`:
```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Tailwind content paths**

`tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```
`src/index.css` starts with the three `@tailwind` directives. Add `playwright.config.ts` with `webServer: { command: 'npm run dev', url: 'http://localhost:5173', reuseExistingServer: true }` and `testDir: './e2e'`.

- [ ] **Step 4: Add scripts + a smoke test**

Add to `package.json` scripts: `"test": "vitest run"`, `"test:e2e": "playwright test"`, `"validate": "tsx src/spec/cli-validate.ts"` (cli added in Task 9; placeholder ok to add later), `"build": "tsc -b && vite build"`.
Create `src/smoke.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
describe('toolchain', () => { it('runs', () => { expect(1 + 1).toBe(2) }) })
```

- [ ] **Step 5: Run + commit**

Run: `npm run test` → Expected: PASS (1 test). Run `npm run build` → Expected: succeeds.
```bash
git add -A && git -c user.name="Toby Dietz" -c user.email="toby@holinic.co" commit -m "Phase 1 Task 1: scaffold Vite+React+TS+Tailwind+Vitest+Playwright"
```

**Acceptance:** `npm run test` green; `npm run build` produces `dist/`; Vite `base: './'`.

---

### Task 2: Quiz-spec schema types

**Files:** Create `src/spec/types.ts`; Test `src/spec/types.test.ts`.

- [ ] **Step 1: Write a compile-time + runtime test**

`src/spec/types.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import type { QuizSpec, QuestionScreen } from './types'

describe('spec types', () => {
  it('accepts a well-formed question screen with conditional prompt + cdp', () => {
    const q: QuestionScreen = {
      kind: 'question', id: 's_concern', type: 'single', questionId: 'hairConcern',
      prompt: 'What is your biggest concern?',
      answers: [{ answerId: 'concern_hairloss', label: 'Hair loss' }],
      progression: 'auto',
      cdp: { acField: 50, mpField: 'Hair Concern' },
    }
    expect(q.questionId).toBe('hairConcern')
  })
  it('accepts a conditional-text with set-logic rules', () => {
    const spec: Pick<QuizSpec, 'id'> = { id: 'test' }
    expect(spec.id).toBe('test')
  })
})
```

- [ ] **Step 2: Run (red)** — `npx vitest run src/spec/types.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement `src/spec/types.ts`**

```ts
export type AnswerId = string
export type QuestionId = string

export interface Answer { answerId: AnswerId; label: string; imageUrl?: string }

/** A condition over a multi-select answer array (recovers Flutter's dropped combination logic). */
export interface AnswerSetCondition {
  questionId: QuestionId
  containsAll?: AnswerId[]
  containsAny?: AnswerId[]
}

/** Static string, single-answer keyed lookup, or set-logic rules. Resolved by the engine. */
export type ConditionalText =
  | string
  | { by: QuestionId; cases: Record<AnswerId, string>; default: string }
  | { rules: Array<{ when: AnswerSetCondition; text: string }>; default: string }

export type Progression = 'auto' | 'cta'

export interface CdpMapping { acField?: number; mpField?: string }

export interface QuestionScreen {
  kind: 'question'
  id: string
  type: 'single' | 'image' | 'multi' | 'rating'
  questionId: QuestionId
  prompt: ConditionalText
  answers: Answer[]
  progression: Progression
  reveal?: ConditionalText
  /** Multi-select "None of the above": clears other picks, records this answerId (e.g. 'n/a'). */
  noneOfTheAbove?: { label: string; answerId: AnswerId }
  cdp?: CdpMapping
  /** Optional chrome overrides; defaults derived by kind in navigation.ts */
  chrome?: Partial<ScreenChrome>
}

export interface PitchScreen {
  kind: 'pitch'
  id: string
  /** label sent as `question` on the `Continued From Pitch` event, e.g. 'Damage Pitch' */
  label: string
  headline: ConditionalText
  body: ConditionalText
  imageUrl?: string
  chrome?: Partial<ScreenChrome>
}

export interface LoadingScreen { kind: 'loading'; id: string; messages: string[]; durationMs: number; chrome?: Partial<ScreenChrome> }
export interface EmailCaptureScreen { kind: 'email'; id: string; headline: ConditionalText; chrome?: Partial<ScreenChrome> }
export interface ResultScreen { kind: 'result'; id: string; chrome?: Partial<ScreenChrome> }

export type Screen = QuestionScreen | PitchScreen | LoadingScreen | EmailCaptureScreen | ResultScreen

export interface ScreenChrome { header: boolean; back: boolean; progress: boolean }

export interface CouponRule { when: AnswerSetCondition; coupon: string }
export interface CheckoutConfig { base: string; couponRules: CouponRule[]; defaultCoupon: string }

export interface QuizSpec {
  id: string
  screens: Screen[]
  checkout: CheckoutConfig
  webhookUrl: string
  /** questionIds whose answers attach as properties to client analytics events (for FB targeting) */
  eventEnrichment?: QuestionId[]
}
```

- [ ] **Step 4: Run (green)** — `npx vitest run src/spec/types.test.ts` → PASS.

- [ ] **Step 5: Commit**
```bash
git add src/spec/types.ts src/spec/types.test.ts && git -c user.name="Toby Dietz" -c user.email="toby@holinic.co" commit -m "Phase 1 Task 2: quiz-spec schema types"
```

**Acceptance:** types compile; test green; covers question/pitch/loading/email/result, ConditionalText variants, CdpMapping, CheckoutConfig, eventEnrichment.

---

### Task 3: Example spec fixture

**Files:** Create `src/spec/example.spec.ts`; Test `src/spec/example.spec.test.ts`.

- [ ] **Step 1: Test that the example spec is shaped correctly**

`src/spec/example.spec.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { exampleSpec } from './example.spec'

describe('example spec', () => {
  it('has a linear set of screens ending in result', () => {
    expect(exampleSpec.screens.length).toBeGreaterThanOrEqual(3)
    expect(exampleSpec.screens.at(-1)!.kind).toBe('result')
  })
  it('has a conditional prompt keyed by an earlier answer', () => {
    const pitch = exampleSpec.screens.find(s => s.kind === 'pitch')!
    expect(pitch).toBeDefined()
  })
})
```

- [ ] **Step 2: Run (red).**

- [ ] **Step 3: Implement `src/spec/example.spec.ts`** — a minimal but representative spec exercising every engine feature: a single-select question (`auto`), a multi-select with `noneOfTheAbove` (`cta`), a pitch with a `by`-keyed conditional body, an email screen, a result screen; plus a `checkout` with one couponRule + default and a `webhookUrl`. Use stable ids mirroring the real quiz (`hairConcern`, `concern_hairloss`, coupon `c_hl`). (Implementer authors it to satisfy the test and to be walkable by the engine/e2e tasks.)

- [ ] **Step 4: Run (green). Step 5: Commit** `-m "Phase 1 Task 3: example spec fixture"`.

**Acceptance:** example spec imports cleanly, exercises single/multi/none-of-above/pitch-conditional/email/result + checkout config.

---

### Task 4: Conditional resolver

**Files:** Create `src/engine/conditions.ts`; Test `src/engine/conditions.test.ts`.

- [ ] **Step 1: Write tests (all three ConditionalText forms + set-logic)**

`src/engine/conditions.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { resolveConditional } from './conditions'
import type { AnswerState } from './answers'

const answers: AnswerState = {
  hairConcern: ['concern_hairloss'],
  hairDamageActivity: ['damage_uv', 'damage_swimming'],
}

describe('resolveConditional', () => {
  it('returns a plain string unchanged', () => {
    expect(resolveConditional('hello', answers)).toBe('hello')
  })
  it('resolves a by/cases lookup', () => {
    const t = { by: 'hairConcern', cases: { concern_hairloss: 'hair fall', concern_scalp: 'scalp' }, default: 'issues' }
    expect(resolveConditional(t, answers)).toBe('hair fall')
  })
  it('falls back to default when the keyed answer is absent', () => {
    const t = { by: 'diet', cases: { diet_vegan: 'vegan' }, default: 'any diet' }
    expect(resolveConditional(t, answers)).toBe('any diet')
  })
  it('resolves set-logic containsAll (UV + swimming)', () => {
    const t = { rules: [
      { when: { questionId: 'hairDamageActivity', containsAll: ['damage_uv', 'damage_swimming'] }, text: 'active lifestyle' },
      { when: { questionId: 'hairDamageActivity', containsAll: ['damage_uv', 'damage_tightstyles'] }, text: 'tight styles' },
    ], default: 'generic' }
    expect(resolveConditional(t, answers)).toBe('active lifestyle')
  })
  it('resolves containsAny and first-match wins', () => {
    const t = { rules: [
      { when: { questionId: 'hairDamageActivity', containsAny: ['damage_heat'] }, text: 'heat' },
      { when: { questionId: 'hairDamageActivity', containsAny: ['damage_uv'] }, text: 'uv' },
    ], default: 'generic' }
    expect(resolveConditional(t, answers)).toBe('uv')
  })
})
```

- [ ] **Step 2: Run (red).**

- [ ] **Step 3: Implement `src/engine/conditions.ts`**
```ts
import type { ConditionalText, AnswerSetCondition } from '../spec/types'
import type { AnswerState } from './answers'

function matches(cond: AnswerSetCondition, answers: AnswerState): boolean {
  const picked = answers[cond.questionId] ?? []
  if (cond.containsAll && !cond.containsAll.every(a => picked.includes(a))) return false
  if (cond.containsAny && !cond.containsAny.some(a => picked.includes(a))) return false
  return Boolean(cond.containsAll || cond.containsAny)
}

export function resolveConditional(text: ConditionalText, answers: AnswerState): string {
  if (typeof text === 'string') return text
  if ('by' in text) {
    const picked = answers[text.by]?.[0]
    return (picked && text.cases[picked]) || text.default
  }
  for (const rule of text.rules) if (matches(rule.when, answers)) return rule.text
  return text.default
}
```

- [ ] **Step 4: Run (green). Step 5: Commit** `-m "Phase 1 Task 4: conditional resolver with set-logic"`.

**Acceptance:** all 5 tests green; set-logic combination conditionals (the Flutter-dropped capability) work.

---

### Task 5: Answer state + derived navigation (no magic indexes)

**Files:** Create `src/engine/answers.ts`, `src/engine/navigation.ts`; Tests `src/engine/answers.test.ts`, `src/engine/navigation.test.ts`.

- [ ] **Step 1: answers test**

`src/engine/answers.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { recordSingle, toggleMulti, recordNoneOfTheAbove, emptyAnswers } from './answers'

describe('answer state', () => {
  it('records a single answer (replacing)', () => {
    const a = recordSingle(emptyAnswers(), 'hairConcern', 'concern_hairloss')
    expect(a.hairConcern).toEqual(['concern_hairloss'])
  })
  it('toggles multi-select answers', () => {
    let a = toggleMulti(emptyAnswers(), 'hairMyth', 'myth_a')
    a = toggleMulti(a, 'hairMyth', 'myth_b')
    a = toggleMulti(a, 'hairMyth', 'myth_a') // off
    expect(a.hairMyth).toEqual(['myth_b'])
  })
  it('none-of-the-above clears other picks and records the sentinel', () => {
    let a = toggleMulti(emptyAnswers(), 'hairMyth', 'myth_a')
    a = recordNoneOfTheAbove(a, 'hairMyth', 'n/a')
    expect(a.hairMyth).toEqual(['n/a'])
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Implement `src/engine/answers.ts`**
```ts
import type { QuestionId, AnswerId } from '../spec/types'
export type AnswerState = Record<QuestionId, AnswerId[]>
export const emptyAnswers = (): AnswerState => ({})

export function recordSingle(s: AnswerState, q: QuestionId, a: AnswerId): AnswerState {
  return { ...s, [q]: [a] }
}
export function toggleMulti(s: AnswerState, q: QuestionId, a: AnswerId): AnswerState {
  const cur = (s[q] ?? []).filter(x => x !== 'n/a')
  const next = cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a]
  return { ...s, [q]: next }
}
export function recordNoneOfTheAbove(s: AnswerState, q: QuestionId, sentinel: AnswerId): AnswerState {
  return { ...s, [q]: [sentinel] }
}
```

- [ ] **Step 4: navigation test (the anti-magic-index core)**

`src/engine/navigation.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { deriveChrome, questionPosition, totalQuestions } from './navigation'
import { exampleSpec } from '../spec/example.spec'

describe('derived navigation', () => {
  it('hides back+progress on the first screen and on result/email', () => {
    const first = deriveChrome(exampleSpec, 0)
    expect(first.back).toBe(false)
    const resultIdx = exampleSpec.screens.findIndex(s => s.kind === 'result')
    expect(deriveChrome(exampleSpec, resultIdx).progress).toBe(false)
  })
  it('progress counts only question screens (denominator derived, not hardcoded)', () => {
    expect(totalQuestions(exampleSpec)).toBe(exampleSpec.screens.filter(s => s.kind === 'question').length)
  })
  it('inserting a screen does NOT change a later screen\'s chrome (no magic indexes)', () => {
    const spec2 = { ...exampleSpec, screens: [exampleSpec.screens[0], { kind: 'pitch', id: 'inserted', label: 'X', headline: 'h', body: 'b' } as any, ...exampleSpec.screens.slice(1)] }
    const resultIdxA = exampleSpec.screens.findIndex(s => s.kind === 'result')
    const resultIdxB = spec2.screens.findIndex(s => s.kind === 'result')
    expect(deriveChrome(spec2, resultIdxB)).toEqual(deriveChrome(exampleSpec, resultIdxA))
  })
})
```

- [ ] **Step 5: Implement `src/engine/navigation.ts`**
```ts
import type { QuizSpec, Screen, ScreenChrome } from '../spec/types'

/** Default chrome derived from screen KIND + position — never from hardcoded index literals. */
function defaultChrome(spec: QuizSpec, index: number): ScreenChrome {
  const s: Screen = spec.screens[index]
  const isFirst = index === 0
  switch (s.kind) {
    case 'result': return { header: false, back: false, progress: false }
    case 'email': return { header: true, back: false, progress: false }
    case 'loading': return { header: false, back: false, progress: false }
    case 'pitch': return { header: true, back: false, progress: true }
    case 'question': return { header: !isFirst, back: !isFirst, progress: !isFirst }
  }
}
export function deriveChrome(spec: QuizSpec, index: number): ScreenChrome {
  const base = defaultChrome(spec, index)
  return { ...base, ...(spec.screens[index].chrome ?? {}) }
}
export const totalQuestions = (spec: QuizSpec): number => spec.screens.filter(s => s.kind === 'question').length
export function questionPosition(spec: QuizSpec, index: number): number {
  return spec.screens.slice(0, index + 1).filter(s => s.kind === 'question').length
}
```

- [ ] **Step 6: Run all (green). Step 7: Commit** `-m "Phase 1 Task 5: answer state + derived navigation (no magic indexes)"`.

**Acceptance:** answers handle single/multi/none-of-the-above; chrome + progress are derived; the insertion test proves no positional coupling.

---

### Task 6: Tracking layer — GA events (contract-exact)

**Files:** Create `src/tracking/events.ts`, `src/tracking/track.ts`; Test `src/tracking/track.test.ts`.

- [ ] **Step 1: Test exact event params + dataLayer-primary/gtag-fallback**

`src/tracking/track.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { trackGAEvent } from './track'
import { GA } from './events'

declare global { interface Window { dataLayer: any[]; gtag: (...a: any[]) => void } }

beforeEach(() => { (window as any).dataLayer = []; (window as any).gtag = undefined })

describe('trackGAEvent', () => {
  it('pushes to dataLayer with fixed params (event, event_category, position, selected_answer[])', () => {
    trackGAEvent(GA.QUESTION_ANSWERED, { questionId: 'hairConcern', question: 'Concern?', selectedAnswer: ['concern_hairloss'] }, 3)
    expect(window.dataLayer[0]).toEqual({
      event: 'Question Answered', event_category: 'Quiz', position: 3,
      selected_answer: ['concern_hairloss'], question_id: 'hairConcern', question: 'Concern?',
    })
  })
  it('keeps the TWO-space checkout event string intact', () => {
    expect(GA.GO_TO_CHECKOUT_RESULTS).toBe('Go to  checkout')
    expect(GA.GO_TO_CHECKOUT_TIMER).toBe('Go to checkout')
  })
  it('always sends selected_answer as an array even when omitted', () => {
    trackGAEvent(GA.QUIZ_VIEWED, {}, 0)
    expect(window.dataLayer[0].selected_answer).toEqual([])
  })
  it('uses gtag fallback only when dataLayer is unavailable', () => {
    ;(window as any).dataLayer = undefined
    const gtag = vi.fn(); (window as any).gtag = gtag
    trackGAEvent(GA.QUIZ_BACK, {}, 2)
    expect(gtag).toHaveBeenCalledWith('event', 'Quiz Back', expect.objectContaining({ event_category: 'Quiz', position: 2 }))
  })
  it('attaches q_name/q_email only when provided', () => {
    trackGAEvent(GA.QUIZ_SUBMITTED, { qName: 'Ann', qEmail: 'a@b.co' }, 18)
    expect(window.dataLayer[0]).toMatchObject({ q_name: 'Ann', q_email: 'a@b.co' })
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Implement `src/tracking/events.ts`** — the exact strings from `docs/reference/tracking-contract.md` (copy them verbatim; the two-space one is intentional):
```ts
export const GA = {
  QUIZ_VIEWED: 'Quiz Viewed',
  QUIZ_STARTED: 'Quiz Started',
  QUESTION_ANSWERED: 'Question Answered',
  QUIZ_BACK: 'Quiz Back',
  CONTINUED_FROM_PITCH: 'Continued From Pitch',
  OPENED_SKIP_DIALOG: 'Opened Skip Dialog',
  CLOSED_SKIP_DIALOG: 'Closed Skip Dialog',
  SKIP_QUIZ: 'SkipQuiz',
  OPENED_PLAN_DETAILS: 'Opened Plan Details',
  CLOSED_PLAN_DETAILS: 'Closed Plan Details',
  VIEWED_RESULTS_PAGE: 'Viewed Results Page',
  QUIZ_COMPLETED: 'Quiz Completed',
  QUIZ_SUBMITTED: 'Quiz Submitted',
  GO_TO_CHECKOUT_RESULTS: 'Go to  checkout', // TWO spaces — load-bearing, do not "fix"
  GO_TO_CHECKOUT_TIMER: 'Go to checkout',    // one space
  GO_TO_NEXT_CHECKOUT_STEP: 'Go to next checkout step',
} as const
export type GAEventName = typeof GA[keyof typeof GA]
```
Implement `src/tracking/track.ts`:
```ts
import type { GAEventName } from './events'
export interface GAExtra { questionId?: string; question?: string; selectedAnswer?: string[]; qName?: string; qEmail?: string; [k: string]: unknown }

export function trackGAEvent(event: GAEventName, extra: GAExtra = {}, position = 0): void {
  const params: Record<string, unknown> = { event, event_category: 'Quiz', position, selected_answer: extra.selectedAnswer ?? [] }
  if (extra.questionId) params.question_id = extra.questionId
  if (extra.question) params.question = extra.question
  if (extra.qName) params.q_name = extra.qName
  if (extra.qEmail) params.q_email = extra.qEmail
  for (const [k, v] of Object.entries(extra)) {
    if (!['questionId', 'question', 'selectedAnswer', 'qName', 'qEmail'].includes(k) && v !== undefined) params[k] = v
  }
  try {
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) window.dataLayer.push(params)
    else if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', event, params)
  } catch { /* analytics must never break the quiz */ }
}
```

- [ ] **Step 4: Run (green). Step 5: Commit** `-m "Phase 1 Task 6: contract-exact GA tracking layer"`.

**Acceptance:** params match the contract exactly; two-space event preserved; dataLayer-primary/gtag-fallback; arbitrary enrichment props pass through (for the FB-targeting enhancement).

---

### Task 7: Converge (client) + webhook payload + submit

**Files:** Create `src/tracking/converge.ts`, `src/tracking/webhook.ts`; Tests `src/tracking/converge.test.ts`, `src/tracking/webhook.test.ts`.

- [ ] **Step 1: Converge test** — client fires ONLY `Completed Quiz` (NOT quiz started/completed); arg shape matches contract.

`src/tracking/converge.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { trackConvergeCompletedQuiz } from './converge'
declare global { interface Window { trackEvent?: (...a: any[]) => void } }
beforeEach(() => { (window as any).trackEvent = undefined })

describe('client Converge', () => {
  it('calls trackEvent("Completed Quiz", props, null, {$email}, [urn:email])', () => {
    const te = vi.fn(); (window as any).trackEvent = te
    trackConvergeCompletedQuiz({ answers: { hairConcern: ['concern_hairloss'] }, name: 'Ann Lee', firstName: 'Ann', lastName: 'Lee', email: 'a@b.co' })
    expect(te).toHaveBeenCalledWith('Completed Quiz',
      expect.objectContaining({ name: 'Ann Lee', firstName: 'Ann', lastName: 'Lee', email: 'a@b.co' }),
      null, { $email: 'a@b.co' }, ['urn:email:a@b.co'])
  })
  it('is a no-op when trackEvent is absent (does not throw)', () => {
    expect(() => trackConvergeCompletedQuiz({ answers: {}, name: '', firstName: '', lastName: '', email: '' })).not.toThrow()
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Implement `src/tracking/converge.ts`**
```ts
import type { AnswerState } from '../engine/answers'
export interface ConvergeUser { answers: AnswerState; name: string; firstName: string; lastName: string; email: string }

export function trackConvergeCompletedQuiz(u: ConvergeUser): void {
  try {
    if (typeof window === 'undefined' || typeof window.trackEvent !== 'function') return
    window.trackEvent('Completed Quiz',
      { answers: u.answers, name: u.name, firstName: u.firstName, lastName: u.lastName, email: u.email },
      null, { $email: u.email }, [`urn:email:${u.email}`])
  } catch { /* never break the quiz */ }
}
// NOTE: do NOT fire `Quiz Started`/`Quiz Completed` to Converge — those reach Converge via the GTM relay of the GA dataLayer events. Re-firing here would double-count. (ISSUES #2)
```

- [ ] **Step 4: Webhook test** — payload shape + AC field_X + mixpanel + header.

`src/tracking/webhook.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildWebhookPayload, submitWebhook } from './webhook'
import { exampleSpec } from '../spec/example.spec'

const answers = { hairConcern: ['concern_hairloss'] }
const user = { name: 'Ann Lee', firstName: 'Ann', lastName: 'Lee', email: 'a@b.co' }

describe('webhook payload', () => {
  it('builds rawAnswers + activeCampaign field_<id> + mixpanel from cdp mappings', () => {
    const p = buildWebhookPayload(exampleSpec, answers, user)
    expect(p.quizData.rawAnswers).toContainEqual({ questionId: 'hairConcern', answerIds: ['concern_hairloss'] })
    // exampleSpec maps hairConcern -> acField 50, mpField 'Hair Concern'
    expect(p.activeCampaign['field_50']).toBe('concern_hairloss')
    expect(p.mixpanel['Hair Concern']).toBeDefined()
    expect(p.mixpanel.$name).toBe('Ann Lee'); expect(p.mixpanel.$email).toBe('a@b.co')
  })
  it('joins multi-select AC values with ", "', () => {
    const p = buildWebhookPayload(exampleSpec, { hairMyth: ['m1', 'm2'] } as any, user)
    // if hairMyth has acField in exampleSpec
    const v = Object.values(p.activeCampaign).find(x => String(x).includes(','))
    expect(v === undefined || String(v).includes(', ')).toBe(true)
  })
})

describe('submitWebhook', () => {
  beforeEach(() => { vi.restoreAllMocks() })
  it('POSTs to the spec webhookUrl with X-Webhook-Secret header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchMock)
    await submitWebhook(exampleSpec, answers, user, 'SECRET123')
    expect(fetchMock).toHaveBeenCalledWith(exampleSpec.webhookUrl, expect.objectContaining({
      method: 'POST', headers: expect.objectContaining({ 'X-Webhook-Secret': 'SECRET123', 'Content-Type': 'application/json' }),
    }))
  })
})
```

- [ ] **Step 5: Implement `src/tracking/webhook.ts`**
```ts
import type { QuizSpec } from '../spec/types'
import type { AnswerState } from '../engine/answers'

export interface WebhookUser { name: string; firstName: string; lastName: string; email: string }
export interface WebhookPayload {
  name: string; firstName: string; lastName: string; email: string
  quizData: { rawAnswers: Array<{ questionId: string; answerIds: string[] }> }
  activeCampaign: Record<string, string>
  mixpanel: Record<string, unknown>
}

export function buildWebhookPayload(spec: QuizSpec, answers: AnswerState, user: WebhookUser): WebhookPayload {
  const rawAnswers = Object.entries(answers).map(([questionId, answerIds]) => ({ questionId, answerIds }))
  const activeCampaign: Record<string, string> = {}
  const mixpanel: Record<string, unknown> = { $name: user.name, $email: user.email }
  for (const s of spec.screens) {
    if (s.kind !== 'question' || !s.cdp) continue
    const picked = answers[s.questionId]; if (!picked) continue
    if (s.cdp.acField) activeCampaign[`field_${s.cdp.acField}`] = picked.join(', ')
    if (s.cdp.mpField) mixpanel[s.cdp.mpField] = picked.length > 1 ? picked : picked[0]
  }
  return { name: user.name, firstName: user.firstName, lastName: user.lastName, email: user.email, quizData: { rawAnswers }, activeCampaign, mixpanel }
}

export async function submitWebhook(spec: QuizSpec, answers: AnswerState, user: WebhookUser, secret: string): Promise<boolean> {
  try {
    const res = await fetch(spec.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': secret },
      body: JSON.stringify(buildWebhookPayload(spec, answers, user)),
    })
    return (res as Response).ok
  } catch { return false }
}
```

- [ ] **Step 6: Run all (green). Step 7: Commit** `-m "Phase 1 Task 7: client Converge + webhook payload/submit"`.

**Acceptance:** Converge fires only `Completed Quiz` with the exact arg shape; webhook payload reproduces the contract; AC multi-join `", "`; secret header sent. (Secret is build-injected via `VITE_WEBHOOK_SECRET`; note in CLAUDE.md that it ships to the browser like the Flutter original — parity, not new exposure.)

---

### Task 8: Checkout URL builder (configurable coupon + prefill + cvg stitching)

**Files:** Create `src/tracking/checkout.ts`; Test `src/tracking/checkout.test.ts`.

- [ ] **Step 1: Tests**

`src/tracking/checkout.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { resolveCoupon, buildCheckoutUrl } from './checkout'
import type { CheckoutConfig } from '../spec/types'

const checkout: CheckoutConfig = {
  base: 'https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/',
  couponRules: [
    { when: { questionId: 'hairConcern', containsAny: ['concern_hairloss'] }, coupon: 'c_hl' },
    { when: { questionId: 'hairConcern', containsAny: ['concern_damage', 'concern_splitends'] }, coupon: 'c_dh' },
  ],
  defaultCoupon: 'o_df',
}

describe('coupon resolution', () => {
  it('first matching rule wins', () => {
    expect(resolveCoupon(checkout, { hairConcern: ['concern_hairloss'] })).toBe('c_hl')
  })
  it('falls back to default', () => {
    expect(resolveCoupon(checkout, { diet: ['diet_vegan'] })).toBe('o_df')
  })
})

describe('checkout url', () => {
  beforeEach(() => { document.cookie = '__cvg_uid=U1; __cvg_sid=S1'; window.history.replaceState({}, '', '/') })
  it('uses the canonical base (no -59) and appends prefill + coupon + cvg ids in order', () => {
    const url = buildCheckoutUrl(checkout, { firstName: 'Ann', lastName: 'Lee', email: 'a@b.co' }, { hairConcern: ['concern_hairloss'] })
    expect(url.startsWith('https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/?')).toBe(true)
    expect(url).toContain('billing_email=a%40b.co')
    expect(url).toContain('billing_first_name=Ann')
    expect(url).toContain('aero-coupons=c_hl')
    expect(url).toContain('__cvg_uid=U1'); expect(url).toContain('__cvg_sid=S1')
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Implement `src/tracking/checkout.ts`**
```ts
import type { CheckoutConfig } from '../spec/types'
import type { AnswerState } from '../engine/answers'

function setIncludes(answers: AnswerState, questionId: string, ids?: string[], all = false): boolean {
  if (!ids) return false
  const picked = answers[questionId] ?? []
  return all ? ids.every(i => picked.includes(i)) : ids.some(i => picked.includes(i))
}
export function resolveCoupon(cfg: CheckoutConfig, answers: AnswerState): string {
  for (const r of cfg.couponRules) {
    if (setIncludes(answers, r.when.questionId, r.when.containsAny, false) ||
        setIncludes(answers, r.when.questionId, r.when.containsAll, true)) return r.coupon
  }
  return cfg.defaultCoupon
}
function cvgValue(name: string): string | null {
  const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (m) return m[2]
  return new URLSearchParams(window.location.search).get(name)
}
export interface CheckoutUser { firstName?: string; lastName?: string; email?: string }
export function buildCheckoutUrl(cfg: CheckoutConfig, user: CheckoutUser, answers: AnswerState): string {
  const p = new URLSearchParams()
  if (user.email) p.set('billing_email', user.email)
  if (user.firstName) p.set('billing_first_name', user.firstName)
  if (user.lastName) p.set('billing_last_name', user.lastName)
  p.set('aero-coupons', resolveCoupon(cfg, answers))
  const uid = cvgValue('__cvg_uid'); const sid = cvgValue('__cvg_sid')
  if (uid) p.set('__cvg_uid', uid)
  if (sid) p.set('__cvg_sid', sid)
  return `${cfg.base}?${p.toString()}`
}
export function redirectToCheckout(cfg: CheckoutConfig, user: CheckoutUser, answers: AnswerState): void {
  window.location.href = buildCheckoutUrl(cfg, user, answers)
}
```

- [ ] **Step 4: Run (green). Step 5: Commit** `-m "Phase 1 Task 8: configurable checkout url builder (coupon + prefill + cvg stitching)"`.

**Acceptance:** coupon map is spec-config-driven; canonical base; prefill + cvg session-stitching params preserved.

---

### Task 9: Spec validator (the "don't break things" enforcement)

**Files:** Create `src/spec/validate.ts`, `src/spec/cli-validate.ts`; Test `src/spec/validate.test.ts`.

- [ ] **Step 1: Tests** — catches duplicate ids, dangling condition refs, missing pitch label, bad cdp, coupon referencing unknown answers, missing tracking-relevant fields.

`src/spec/validate.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { validateSpec } from './validate'
import { exampleSpec } from './example.spec'

describe('validateSpec', () => {
  it('passes the example spec', () => { expect(validateSpec(exampleSpec)).toEqual([]) })
  it('flags duplicate screen ids', () => {
    const bad = { ...exampleSpec, screens: [...exampleSpec.screens, exampleSpec.screens[0]] }
    expect(validateSpec(bad).some(e => e.includes('duplicate'))).toBe(true)
  })
  it('flags a by/cases condition referencing an unknown questionId', () => {
    const q = { kind: 'pitch', id: 'p_x', label: 'X', headline: 'h', body: { by: 'NOPE', cases: {}, default: 'd' } } as any
    const bad = { ...exampleSpec, screens: [exampleSpec.screens[0], q, ...exampleSpec.screens.slice(1)] }
    expect(validateSpec(bad).some(e => e.includes('NOPE'))).toBe(true)
  })
  it('flags a cdp acField that is not a positive integer', () => {
    const screens = exampleSpec.screens.map(s => s.kind === 'question' ? { ...s, cdp: { acField: -1 } } : s)
    expect(validateSpec({ ...exampleSpec, screens } as any).some(e => e.includes('acField'))).toBe(true)
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Implement `src/spec/validate.ts`** — returns `string[]` (empty = valid): unique screen ids; every question has ≥1 answer + unique answerIds; `by`/set-logic conditions reference a `questionId` that exists earlier in the flow and `cases`/`containsAny/All` reference real answerIds of that question; pitch has non-empty `label`; `cdp.acField` (if present) is a positive integer; `checkout.couponRules` reference known questionIds/answerIds; `noneOfTheAbove.answerId` not colliding with a real answer. Implement straightforwardly.
Also `src/spec/cli-validate.ts`: imports `exampleSpec` (later the real spec), runs `validateSpec`, `console.error` + `process.exit(1)` on errors. Add dep `tsx` (`npm i -D tsx`) and wire `"validate"` script.

- [ ] **Step 4: Run (green). Step 5: Commit** `-m "Phase 1 Task 9: spec validator + validate CLI"`.

**Acceptance:** validator catches each error class; `npm run validate` exits non-zero on a broken spec. (This is the CI gate that stops Claude Code shipping a mis-wired screen.)

---

### Task 10: One presentational screen + ScreenRenderer

**Files:** Create `src/components/screens/SingleChoiceScreen.tsx`, `src/components/ScreenRenderer.tsx`; Test `src/components/ScreenRenderer.test.tsx`.

- [ ] **Step 1: Test (resolved props in, callback out — component is condition-agnostic)**

`src/components/ScreenRenderer.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ScreenRenderer } from './ScreenRenderer'
import type { QuestionScreen } from '../spec/types'

const q: QuestionScreen = {
  kind: 'question', id: 's1', type: 'single', questionId: 'hairConcern',
  prompt: { by: 'hairConcern', cases: { concern_hairloss: 'Hair fall?' }, default: 'Your concern?' },
  answers: [{ answerId: 'concern_hairloss', label: 'Hair loss' }, { answerId: 'concern_scalp', label: 'Scalp' }],
  progression: 'auto',
}

describe('ScreenRenderer', () => {
  it('renders the RESOLVED prompt (engine resolves; component just displays)', () => {
    render(<ScreenRenderer screen={q} answers={{}} onAnswer={() => {}} onContinue={() => {}} />)
    expect(screen.getByText('Your concern?')).toBeInTheDocument() // default since no prior answer
  })
  it('calls onAnswer with the answerId when an option is tapped', () => {
    const onAnswer = vi.fn()
    render(<ScreenRenderer screen={q} answers={{}} onAnswer={onAnswer} onContinue={() => {}} />)
    fireEvent.click(screen.getByText('Hair loss'))
    expect(onAnswer).toHaveBeenCalledWith('concern_hairloss')
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Implement** `SingleChoiceScreen.tsx` (presentational: receives `prompt: string`, `answers: Answer[]`, `onSelect(answerId)`) and `ScreenRenderer.tsx` (resolves `ConditionalText` via `resolveConditional`, maps `screen.kind`+`type` → component, passes resolved props + `onAnswer`/`onContinue`). For Phase 1 only `question/single` needs a real component; other kinds can render a labeled placeholder. Mobile-first Tailwind; a basic fit-to-viewport wrapper (`min-h-[100dvh] flex flex-col`) — full scaling lands in Phase 2.

- [ ] **Step 4: Run (green). Step 5: Commit** `-m "Phase 1 Task 10: SingleChoiceScreen + ScreenRenderer (presentational, resolved props)"`.

**Acceptance:** component renders resolved prompt; emits answerId; knows nothing about conditions.

---

### Task 11: Store + QuizApp shell (progression + tracking wiring)

**Files:** Create `src/store/quizStore.ts`, `src/components/QuizApp.tsx`; Update `src/main.tsx`; Test `src/store/quizStore.test.ts`.

- [ ] **Step 1: Store test** — answering a single-select records the answer, fires `Question Answered`, and advances; multi-select needs Continue; `Quiz Viewed` fires on view.

`src/store/quizStore.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { createQuizStore } from './quizStore'
import { exampleSpec } from '../spec/example.spec'

beforeEach(() => { (window as any).dataLayer = [] })

describe('quiz store', () => {
  it('single-select records + fires Question Answered + advances', () => {
    const s = createQuizStore(exampleSpec)
    const firstQ = exampleSpec.screens.findIndex(x => x.kind === 'question')
    s.getState().goTo(firstQ)
    const before = s.getState().index
    s.getState().answer('concern_hairloss')
    expect(window.dataLayer.some((e: any) => e.event === 'Question Answered')).toBe(true)
    expect(s.getState().index).toBe(before + 1)
  })
})
```

- [ ] **Step 2: Run (red). Step 3: Implement** `quizStore.ts` (Zustand): state `{ spec, index, answers }`; actions `goTo`, `answer(answerId)` (uses `screen.progression`: `single`/`rating`→record+`trackGAEvent(QUESTION_ANSWERED, …, position)`+`next()`; `multi`→`toggleMulti` only), `toggleMulti`, `chooseNoneOfTheAbove`, `continue()` (for `cta` screens: fire the right event — `Question Answered` for multi, `Continued From Pitch` with the pitch `label` for pitch — then `next()`), `back()` (`trackGAEvent(QUIZ_BACK, …)` + prev), `viewed()` (fire `Quiz Viewed`/`Viewed Results Page` by kind). Position passed to tracking = `questionPosition(spec, index)` (derived). `QuizApp.tsx` subscribes, renders `<ScreenRenderer>` for the current screen with `deriveChrome`, calls `viewed()` on screen change, wires `onAnswer`/`onContinue`/`onBack`. `main.tsx` mounts `<QuizApp spec={exampleSpec} />`.

- [ ] **Step 4: Run (green) + `npm run build`. Step 5: Commit** `-m "Phase 1 Task 11: quiz store + app shell (progression + tracking wiring)"`.

**Acceptance:** end-to-end in-app: a single-select answer records, tracks (contract event + derived position), and advances; app builds.

---

### Task 12: Playwright golden-test harness skeleton

**Files:** Create `e2e/golden.spec.ts`, `e2e/fixtures/example-events.json`.

- [ ] **Step 1: Write the e2e test** — load the app (example spec), capture `dataLayer` pushes, walk the single-select happy path, assert the captured GA event names/params equal the fixture (a small expected sequence for the example spec, mirroring the structure of `docs/reference/golden-events.json`).

`e2e/golden.spec.ts`:
```ts
import { test, expect } from '@playwright/test'

test('example-spec walkthrough emits the expected GA event sequence', async ({ page }) => {
  const events: any[] = []
  await page.addInitScript(() => {
    (window as any).dataLayer = new Proxy([], { set(t, p, v) { (window as any).__events = (window as any).__events || []; if (p !== 'length' && typeof v === 'object') (window as any).__events.push(v); return Reflect.set(t, p, v) } })
  })
  await page.goto('/')
  // walk: click the first answer label(s) per the example spec happy path
  await page.getByText('Hair loss').click()
  // ... advance through the example spec to the result ...
  const captured = await page.evaluate(() => (window as any).__events || [])
  const expected = require('./fixtures/example-events.json')
  const names = captured.map((e: any) => e.event)
  expect(names).toEqual(expected.map((e: any) => e.event))
  // assert fixed params on the first answered event
  const answered = captured.find((e: any) => e.event === 'Question Answered')
  expect(answered).toMatchObject({ event_category: 'Quiz', selected_answer: expect.any(Array) })
})
```

- [ ] **Step 2: Run (red)** — `npm run test:e2e` (after `npx playwright install chromium`). Expect failure until fixture + walk match.
- [ ] **Step 3: Author `e2e/fixtures/example-events.json`** — the expected ordered event names/params for the example-spec happy path (derived from the spec + contract). Adjust the walk in the test to traverse the example spec to the result screen.
- [ ] **Step 4: Run (green). Step 5: Commit** `-m "Phase 1 Task 12: Playwright golden-test harness skeleton"`.

**Acceptance:** an automated browser walk asserts the GA event sequence + fixed params for the example spec. (Phase 3 swaps the example spec for the real one and asserts against `docs/reference/golden-events.json`.)

---

### Task 13: CLAUDE.md operating manual + component contract

**Files:** Create `CLAUDE.md`, `docs/component-contract.md`.

- [ ] **Step 1: Write `CLAUDE.md`** — the operating manual:
  - **Architecture** (spec → engine → tracking → components; conditions are data, resolved by the engine; components are presentational).
  - **Invariants (do not break):** the tracking contract in `docs/reference/tracking-contract.md` is sacred (esp. the two-space `Go to  checkout`, `event_category:'Quiz'`); navigation/chrome must stay derived (no magic indexes); `npm run test`, `npm run validate`, `npm run test:e2e` must pass before any commit.
  - **Recipes** (concrete steps): *Add a question* (spec entry: id/type/questionId/answers/progression/cdp + run validate) · *Add a pitch screen* (+ the `label` for `Continued From Pitch`) · *Add a condition* (use `by`/`cases` or set-logic `rules`) · *Add a CDP field* (the EXTERNAL step: create the ActiveCampaign custom field first → get `field_<id>` → put it in `cdp.acField`; Mixpanel props need no pre-creation) · *Change the coupon map* (edit `checkout.couponRules`) · *Enrich an event for FB targeting* (add the questionId to `eventEnrichment`).
  - **External systems** (NOT in this repo): GTM (GTM-TT5MJDF) relays GA events to Converge — don't add client `cvg` calls for quiz started/completed; the AC field ids and the GTM tags live outside.
- [ ] **Step 2: Write `docs/component-contract.md`** — the rule that screen components are presentational: they receive already-resolved props (strings/images/option lists) + callbacks, never read the spec or answers, never resolve conditions. Include the `SingleChoiceScreen` prop signature as the reference example.
- [ ] **Step 3: Commit** `-m "Phase 1 Task 13: CLAUDE.md operating manual + component contract"`.

**Acceptance:** a newcomer (or Claude Code) can read CLAUDE.md and know how to add a screen/condition/CDP field safely and what the external steps are.

---

## Self-Review

**Spec coverage (design doc §5–§6a + Phase-0 carry-forwards):**
- Spec-driven core, derived nav (no magic indexes) → Tasks 2, 5. ✓
- Conditional content incl. multi-select set-logic → Task 4. ✓
- Progression auto/cta; idx-10 reveal+cta and "None of the above"=`'n/a'` → modeled in types (Task 2) + answers (Task 5) + store (Task 11). ✓
- Tracking contract byte-exact incl. two-space `Go to  checkout`; dataLayer-primary/gtag-fallback → Task 6. ✓
- Converge client = only `Completed Quiz`, no re-fire of quiz started/completed → Task 7. ✓
- Webhook payload (AC field_X + mixpanel + rawAnswers) → Task 7. ✓
- Configurable checkout (coupon rules + prefill + cvg stitching, canonical base) → Task 8. ✓
- Event enrichment for FB targeting → pass-through in Task 6 + `eventEnrichment` in types + recipe in Task 13. ✓
- Spec validator + golden-test enforcement → Tasks 9, 12. ✓
- CLAUDE.md + recipes + external-step callouts + component contract → Task 13. ✓
- Presentational-component contract → Task 10 + docs. ✓
- Subpath build → Task 1 (`base: './'`). ✓

**Out of scope (correctly deferred):** full component library + fit-to-viewport scaling (Phase 2); the real 20-screen spec + dashboard/timer/skip + assertion against the real `golden-events.json` (Phase 3); design polish (Phase 4); design context pack + marketer recipes depth + promotion script (Phase 5).

**Placeholder scan:** contract-bearing tasks (2,4,5,6,7,8,9) carry full code; UI tasks (10,11,12) carry full test code + precise signatures, with component bodies left to the implementer by design (idiomatic React). No "TBD/handle edge cases."

**Type/name consistency:** `AnswerState`, `resolveConditional`, `deriveChrome`, `questionPosition`, `trackGAEvent`, `GA.*`, `buildWebhookPayload`, `buildCheckoutUrl`, `resolveCoupon`, `validateSpec`, `QuizSpec/Screen/QuestionScreen` are used identically across tasks. The two-space `Go to  checkout` string is fixed in Task 6 and asserted there.
