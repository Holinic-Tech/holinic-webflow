# Component contract — presentational screen components

> The single rule that keeps the engine and the UI decoupled. If you are writing or
> reviewing a screen component, this is the contract it must obey.

## The rule

Screen components are **purely presentational**. They:

- **receive already-resolved props** — final strings, image URLs, and option lists,
  plus callbacks;
- **emit intent via callbacks** (e.g. `onSelect(answerId)`, `onContinue()`);
- **NEVER read the spec** (`QuizSpec` / `Screen`);
- **NEVER read `AnswerState`**;
- **NEVER resolve conditions** (`ConditionalText` / `resolveConditional`).

All resolution happens **upstream** in `ScreenRenderer` and the engine. A component
should be renderable in isolation (e.g. in a test or Storybook) given only plain props,
with no quiz state, no spec, and no engine import.

## Reference example — `SingleChoiceScreen`

From `src/components/screens/SingleChoiceScreen.tsx` — note the prop type imports only
`Answer` (a plain data shape), nothing about conditions, the spec, or answer state:

```ts
import type { Answer } from '../../spec/types'

export interface SingleChoiceScreenProps {
  prompt: string                          // already-resolved string, NOT ConditionalText
  answers: Answer[]                        // the option list to render
  onSelect: (answerId: string) => void     // emits the picked answerId on tap
}

export function SingleChoiceScreen({ prompt, answers, onSelect }: SingleChoiceScreenProps) {
  // renders <h1>{prompt}</h1> and a button per answer that calls onSelect(a.answerId)
}
```

Key points:

- `prompt` is a **`string`**, not a `ConditionalText`. The condition has already been
  resolved before it reaches the component.
- The component has **no** `answers: AnswerState` prop and **no** `spec` prop. It cannot
  inspect what was previously picked or which screen it is; it only renders this
  screen's options and reports a tap.
- It calls `onSelect(a.answerId)` — it does not record the answer, advance the index,
  or fire tracking. Those are the store's job.

## Reference — the full screen-component prop signatures

All of these obey the rule above: props are resolved primitives / `Answer[]` +
callbacks; none imports the spec, `AnswerState`, the store, or `resolveConditional`.
Read the source for the rendering details; the signatures are the contract.

```ts
// src/components/screens/ImageChoiceScreen.tsx — single-select with images
interface ImageChoiceScreenProps {
  prompt: string
  answers: Answer[]              // each Answer may carry an imageUrl
  onSelect: (answerId: string) => void
  size?: 'large' | 'small'        // card density; default 'large'
}

// src/components/screens/MultiSelectScreen.tsx — toggle-many + Continue
interface MultiSelectScreenProps {
  prompt: string
  answers: Answer[]
  selected: string[]              // currently-picked ids (owned upstream by the store)
  noneLabel?: string              // renders a "None of the above" button when present
  onToggle: (id: string) => void
  onNone?: () => void
  onContinue: () => void          // enabled only when ≥1 selected
}

// src/components/screens/RatingScreen.tsx — segmented scale, one tap = answer
interface RatingScreenProps {
  prompt: string
  answers: Answer[]
  onSelect: (id: string) => void
}

// src/components/screens/PitchScreen.tsx — interstitial headline/body + Continue
interface PitchScreenProps {
  headline: string                // resolved upstream from ConditionalText
  body: string                    // resolved upstream from ConditionalText
  imageUrl?: string
  onContinue: () => void
}

// src/components/screens/LoadingScreen.tsx — timer that calls onDone once
interface LoadingScreenProps {
  messages: string[]
  durationMs: number
  onDone: () => void              // fired exactly once after durationMs
}

// src/components/screens/EmailCaptureScreen.tsx — controlled name+email, validates
interface EmailCaptureScreenProps {
  headline: string
  onSubmit: (data: { name: string; email: string }) => void  // TRIMMED values
}

// src/components/screens/ResultScreen.tsx — the ONE scrollable screen (see below)
interface ResultScreenProps {
  children?: ReactNode            // the Phase-3 dashboard content
  onCta: () => void
  ctaLabel: string
  timer?: ReactNode               // optional sticky CountdownTimer slot
}
```

Note `selected: string[]` on `MultiSelectScreen` is **not** `AnswerState` — it is a
plain id list the parent derives (`answers[questionId] ?? []` in `ScreenRenderer`) and
hands down; the component never reads the answer map itself.

## The FitViewport contract

Every screen renders **natural-height content** and must **NOT assume a fixed viewport
height** (no `h-screen` / `100dvh` / `flex-1` that expects a sized parent to stretch
into, no internal scroll regions). `QuizApp` wraps each non-result screen in
`<FitViewport>` (`src/components/layout/FitViewport.tsx`), which measures the content
and applies a `transform: scale(...)` so it fits `100dvh` with no document scroll
(scale never exceeds 1, floors at `0.6` via `computeScale` in `fit.ts`). Because the
scaler does the fitting, components should size to a **mobile viewport** and prefer
fluid type/spacing so the scale stays mild.

The **one exception is `ResultScreen`**: it is intentionally **scrollable**
(`min-h-[100dvh] overflow-y-auto`) and is **not** wrapped in `FitViewport`. It is the
only screen permitted to overflow and scroll. The no-scroll guarantee for every other
screen is enforced by Playwright assertions in `e2e/golden.spec.ts`.

## How `ScreenRenderer` upholds the contract

`src/components/ScreenRenderer.tsx` is the boundary between the engine and the
presentational components. It does two things:

1. **Resolves `ConditionalText`.** Before rendering, it calls
   `resolveConditional(screen.prompt, answers)` (and the equivalent for `headline` /
   `body`) so the component receives a finished string. The `answers: AnswerState` and
   the raw `screen` stay inside `ScreenRenderer`; only resolved values cross the
   boundary.

2. **Maps `screen.kind` + `type` → component.** `renderBody` switches on
   `screen.kind`; for `kind: 'question'` it further switches on `screen.type`. After
   Phase 2 every kind/type has a real component (`single`→`SingleChoiceScreen`,
   `image`→`ImageChoiceScreen`, `multi`→`MultiSelectScreen`, `rating`→`RatingScreen`,
   and `pitch`/`loading`/`email`/`result`); an unknown `question` type falls back to a
   labeled placeholder. See the screen-type catalog in `CLAUDE.md`. New screen
   components plug in here — add a `case`/branch that resolves the needed conditionals
   and passes resolved props down.

```tsx
// inside ScreenRenderer's renderBody, simplified:
case 'question': {
  const prompt = resolveConditional(screen.prompt, answers) // ← resolved here
  if (screen.type === 'single') {
    return <SingleChoiceScreen prompt={prompt} answers={screen.answers} onSelect={onAnswer} />
  }
  // image / multi / rating → real components in Phase 2
}
```

`ScreenRenderer` also receives `onAnswer` / `onContinue` from above (wired to the
store's `answer` / `continue`) and forwards them as the component's callbacks. The
component never imports the store either — it only knows the callbacks it was handed.

## Checklist for a new screen component

- [ ] Props are resolved primitives / data shapes (`string`, `Answer[]`, image URLs) +
      callbacks — **no** `QuizSpec`, `Screen`, `AnswerState`, or `ConditionalText`.
- [ ] No import of `resolveConditional`, the spec types for navigation, or the store.
- [ ] Side effects (recording answers, advancing, tracking) are triggered only via
      callbacks the parent supplies.
- [ ] Wired into `ScreenRenderer.renderBody` with its conditionals resolved there.
- [ ] Renderable in a unit test with plain props and no quiz state.
