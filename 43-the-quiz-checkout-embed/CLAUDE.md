# CLAUDE.md — Hairqare Quiz Engine operating manual

This is a **spec-driven** quiz engine. A quiz is described by **data** (a `QuizSpec`),
and a small set of pure functions (the "engine") turns that data into navigation,
resolved copy, tracking events, a webhook payload, and a checkout URL. React
components only **render** what the engine has already resolved.

If you only read one thing: edit the **spec**, not the components. Conditions are
data; the engine resolves them; components are presentational.

---

## Architecture

```
spec  ──►  engine  ──►  tracking  ──►  components
(data)     (pure fns)   (side-effects)  (presentational)
```

- **`src/spec/`** — the schema and the quiz data.
  - `types.ts` — the `QuizSpec` schema: `Screen` union (`QuestionScreen` | `PitchScreen`
    | `LoadingScreen` | `EmailCaptureScreen` | `ResultScreen`), `ConditionalText`,
    `AnswerSetCondition`, `CdpMapping`, `CheckoutConfig`, `eventEnrichment`.
  - `example.spec.ts` — the representative quiz fixture (`exampleSpec`). Later phases
    swap this for the real production spec.
  - `validate.ts` — `validateSpec(spec)` returns a list of human-readable errors
    (empty = valid). `cli-validate.ts` is the `npm run validate` CI gate.
- **`src/engine/`** — pure, side-effect-free resolution of spec data against answers.
  - `answers.ts` — `AnswerState = Record<QuestionId, AnswerId[]>` plus immutable
    updates: `recordSingle`, `toggleMulti`, `recordNoneOfTheAbove`. Multi-select
    toggling drops the `'n/a'` sentinel; "None of the above" records `['n/a']`.
  - `conditions.ts` — `resolveConditional(text, answers)` turns a `ConditionalText`
    (a plain string, a `by`/`cases` keyed lookup, or set-logic `rules`) into a final
    string. **This is the only place conditions are resolved.**
  - `navigation.ts` — `deriveChrome`, `totalQuestions`, `questionPosition`. Chrome
    (header/back/progress) and the question position are **DERIVED from screen
    `kind` + position**, never from hardcoded screen indexes.
- **`src/tracking/`** — side-effecting integrations, all best-effort (never throw).
  - `events.ts` — the `GA` event-name constants (the sacred event strings).
  - `track.ts` — `trackGAEvent(event, extra, position)` pushes to `window.dataLayer`
    (primary) with a `window.gtag` fallback. Always sets `event_category: 'Quiz'`.
  - `converge.ts` — `trackConvergeCompletedQuiz` fires the client `Completed Quiz`
    Converge event only.
  - `webhook.ts` — `buildWebhookPayload` / `submitWebhook` build and POST the
    submission to the Worker (AC `field_<id>` map + Mixpanel props + raw answers).
  - `checkout.ts` — `resolveCoupon`, `buildCheckoutUrl`, `redirectToCheckout`.
- **`src/store/quizStore.ts`** — a zustand vanilla store (`createQuizStore(spec)`) that
  holds `{ index, answers }`, runs the engine, and fires tracking on each transition
  (`answer`, `toggleMulti`, `chooseNoneOfTheAbove`, `continue`, `back`, `viewed`).
- **`src/components/`** — presentational React. `ScreenRenderer` resolves
  `ConditionalText` via the engine and maps `screen.kind` + `type` to a component.
  Screen components (e.g. `SingleChoiceScreen`) receive **already-resolved props**.
  See `docs/component-contract.md`.

**Data flow on answering a single-select question:** the component calls
`onSelect(answerId)` → store `answer()` → `recordSingle` updates `AnswerState` →
`trackGAEvent(GA.QUESTION_ANSWERED, …, index)` → advance index. (The tracking
`position` is the RAW screen index — see `docs/reference/tracking-contract.md`
§"Event property rules"; `questionPosition` is only the progress-bar count.)

---

## Screen-type catalog

`ScreenRenderer.renderBody` switches on `screen.kind` (and, for `kind: 'question'`,
on `screen.type`) to pick a presentational component. The component emits intent via
callbacks; the **store action** runs the engine + fires the **GA event**. (Source:
`src/components/ScreenRenderer.tsx`, `src/store/quizStore.ts`, `src/tracking/events.ts`.)

| `screen.kind` (+`type`) | Component (`src/components/screens/`) | Advances via (store action) | GA event fired |
| --- | --- | --- | --- |
| `question` + `single` | `SingleChoiceScreen` | `answer(id)` → `recordSingle`, advance | `GA.QUESTION_ANSWERED` (`'Question Answered'`) |
| `question` + `image` | `ImageChoiceScreen` | `answer(id)` → `recordSingle`, advance | `GA.QUESTION_ANSWERED` |
| `question` + `multi` | `MultiSelectScreen` | tap = `answer(id)` → `toggleMulti` (no event); `continue()` advances | `GA.QUESTION_ANSWERED` fired by `continue()` |
| `question` + `rating` | `RatingScreen` | `answer(id)` → `recordSingle`, advance | `GA.QUESTION_ANSWERED` |
| `pitch` | `PitchScreen` | `continue()` | `GA.CONTINUED_FROM_PITCH` (`'Continued From Pitch'`, `question` = `screen.label`) |
| `loading` | `LoadingScreen` | `onDone` (timer) → `continue()` | none (silent advance) |
| `email` | `EmailCaptureScreen` | `submitEmail({name,email})` → webhook + Converge, advance | `GA.QUIZ_SUBMITTED` (`'Quiz Submitted'`) |
| `result` | `ResultScreen` | `onCta` (wired to checkout/continue) | view fires `GA.VIEWED_RESULTS_PAGE` on entry |

Notes:
- `store.viewed()` (called by `QuizApp`'s `useEffect` on every index change) fires
  `GA.QUIZ_VIEWED` **ONCE on the first screen** (the "landed on the quiz" event — NOT
  per screen), `GA.QUIZ_COMPLETED` on the **email** view, and `GA.VIEWED_RESULTS_PAGE`
  on the **result** view. Every event also RESETS `question_id`/`question`/
  `selected_answer` so GTM can't carry a prior screen's values forward. See
  `docs/reference/tracking-contract.md` §"Event property rules — REBUILD CORRECTIONS".
- `back()` fires `GA.QUIZ_BACK`; the skip primitives fire `GA.OPENED_SKIP_DIALOG` /
  `GA.CLOSED_SKIP_DIALOG` / `GA.SKIP_QUIZ` via `openSkip`/`dismissSkip`/`confirmSkip`.

**Primitives** (not in the `screen.kind` switch — composed inside chrome/screens):

| Primitive | File | Role |
| --- | --- | --- |
| `FitViewport` | `src/components/layout/FitViewport.tsx` (+ `fit.ts`) | scale-to-fit wrapper for every non-result screen (see below) |
| `ProgressHeader` | `src/components/layout/ProgressHeader.tsx` | derived back-button + progress bar; props from `deriveChrome`/`questionPosition`/`totalQuestions` |
| `CountdownTimer` | `src/components/primitives/CountdownTimer.tsx` | counts down `secondsLeft` to `mm:ss`, fires `onExpire` once; used in the result `timer` slot |
| `SkipModal` | `src/components/primitives/SkipModal.tsx` | skip-confirmation dialog; `onConfirm`/`onDismiss` wired to `confirmSkip`/`dismissSkip` |

---

## Fit-to-viewport rule

**Most screens are auto-scaled to fit `100dvh` with no scroll** (exceptions: the
`result` screen scrolls, and **carousel pitch screens flex-fit** — both covered below).
`QuizApp` wraps non-result, non-flex-fit screens in `<FitViewport>` inside an
`h-[100dvh] overflow-hidden` shell, so the document never scrolls; `FitViewport`
measures content `scrollHeight` vs available `clientHeight` and applies a CSS
`transform: scale(...)` (via `computeScale` in `fit.ts`) when content overflows —
**never upscales, floors at `0.45`** (lowered from `0.6` in Phase-4 device QA so the
tallest screen still fully fits a short 740×360 landscape instead of clipping its
lower options off-viewport). **Width compensation:** a uniform `scale(s)` shrinks
WIDTH too, which made content-dense screens (pitches, multi-selects) render visibly
narrower than the lighter question screens. So when `s < 1` FitViewport widens the
inner logical box to `100/s %` and anchors `transform-origin: top left` — the scaled
result fills the full viewport width on EVERY screen (the content reflows wider, so
it still fits vertically). The `ResizeObserver` watches only the OUTER box so the
width mutation can't feed back into a measure loop. (Source: `src/components/QuizApp.tsx`,
`FitViewport.tsx`, `fit.ts`.)

The **result screen** is rendered in a `min-h-[100dvh] overflow-y-auto` container
(and `ResultScreen` itself is scrollable), so it is **not** fit-scaled and **is** the
only screen allowed to scroll.

**Carousel pitch screens (`isFlexFitPitch`) are the second exception — they FLEX-FIT,
not scale.** A pitch carrying a testimonial `carousel` block would, under the uniform
scaler, shrink its COPY and social-proof bar along with everything else (they read as
"squished"). So `QuizApp` instead renders these in a height-bounded flex column (NOT
`FitViewport`; `ScreenRenderer` gives them `h-full` instead of `min-h-[100dvh]`), where
the text + trust-bar keep their **natural size** and ONLY the carousel flexes
(`flex-1 min-h-0 max-h-[440px]`, `object-contain`) to fill the room left above the CTA —
shrinking on short screens, capped so it never balloons on tall/desktop. No-scroll still
holds (the column is `overflow-hidden`). Non-carousel pitches stay on `FitViewport`.
(Source: `QuizApp.tsx` `isFlexFitPitch`, `ScreenRenderer.tsx`, `screens/PitchScreen.tsx`.)

Design implications:
- **Design content to a mobile viewport** (the e2e target is 390×844). Prefer **fluid
  type / spacing** so the scaler stays mild (the `0.6` floor is a safety net, not a
  design target). If a non-result screen needs more room, trim content — don't rely on
  scroll; there is none.
- Enforced by **no-scroll Playwright assertions** in `e2e/golden.spec.ts`
  (`scrollHeight <= clientHeight` on every screen; the result screen is explicitly
  exempted).

---

## Preview surface

`/?preview` mounts the isolated component gallery instead of the live quiz. The switch
is in `src/main.tsx` (`location.search.includes('preview')` → `<PreviewGallery />`,
else `<QuizApp spec={exampleSpec} />`). `src/components/preview/PreviewGallery.tsx`
renders **one instance of every screen component and primitive** with representative
sample props in labeled mobile-width frames — using only presentational components with
local sample data (no spec, store, or tracking). This is the **design-workflow surface**
and the manual visual-regression check.

---

## Invariants — do not break

1. **The tracking contract is sacred.** `docs/reference/tracking-contract.md` and
   `docs/reference/cdp-coupon-map.md` are Phase-0, QC-verified, byte-for-byte truth.
   The live data depends on the exact event strings. In particular:
   - **`GA.GO_TO_CHECKOUT_RESULTS` is `'Go to  checkout'` with TWO spaces** between
     "to" and "checkout". `GA.GO_TO_CHECKOUT_TIMER` is `'Go to checkout'` with ONE
     space. These are two **distinct** event names in production — do NOT "fix" the
     double space. (`src/tracking/events.ts`)
   - Every GA event carries **`event_category: 'Quiz'`** and a `position`. Do not drop
     or rename these. (`src/tracking/track.ts`)
   - The webhook AC keys are literally **`field_<acField>`** and Mixpanel values are a
     single string for single-answer questions, an array for multi-select.
     (`src/tracking/webhook.ts`)
2. **Navigation and chrome stay DERIVED.** Never introduce magic index literals like
   `if (index === 10)`. Header/back/progress come from `deriveChrome(spec, index)`
   keyed on `screen.kind` + `isFirst`; question count/position come from
   `totalQuestions` / `questionPosition`. (`src/engine/navigation.ts`) Per-screen
   overrides go in the spec via `screen.chrome`, not in code.
3. **Conditions live in the spec as data** and are resolved only by
   `resolveConditional`. Components must never read the spec or answers, and never
   resolve conditions themselves.
4. **Verify in proportion to the change; full gate at the boundary.** Don't run the whole
   suite for every edit (slow + token-heavy). The cheap checks `npm run check` (= `tsc
   --noEmit` + `validate` + `audit`) run on any spec change and before each commit; the
   **full gate** `npm run gate` (= `check` + `test` + `test:e2e`) runs **before building
   locally and before pushing to main** — so nothing un-verified reaches a build or `main`.
   Match depth to blast radius; risky changes (reorders, removals, conditions, ids,
   tracking, new screens) always get `audit` + the relevant tests immediately. Full policy:
   the `hairqare-quiz` skill's `references/verification.md`.

---

## Recipes

All recipes edit the **spec** (`src/spec/example.spec.ts`, later the real spec) and
then run `npm run validate` + `npm run test`. The types referenced are in
`src/spec/types.ts`.

### Add a question

Append a `QuestionScreen` to `spec.screens` at the desired position:

```ts
{
  kind: 'question',
  id: 's_routine',              // must be unique across all screens
  type: 'single',              // 'single' | 'image' | 'multi' | 'rating'
  questionId: 'currentRoutine',// stable id used by answers, conditions, cdp
  prompt: 'How would you describe your current routine?',
  answers: [
    { answerId: 'routine_basic', label: 'Just shampoo & conditioner' },
    { answerId: 'routine_full',  label: 'A full multi-step routine' },
  ],
  progression: 'auto',         // 'auto' = advance on tap; 'cta' = wait for Continue
  cdp: { acField: 18, mpField: 'Haircare Background' }, // optional, see "Add a CDP field"
}
```

- `progression: 'auto'` records + advances on a single tap (single/image/rating).
  `progression: 'cta'` is for multi-select and reveal screens: tapping only toggles;
  the user advances via `continue()`, which fires `Question Answered` then.
- For a multi-select, set `type: 'multi'`, `progression: 'cta'`, and optionally
  `noneOfTheAbove: { label: 'None of the above', answerId: 'n/a' }`. The sentinel
  `answerId` must NOT collide with a real answer.
- `validateSpec` enforces: unique screen ids, ≥1 answer, no duplicate answerIds,
  `noneOfTheAbove` non-collision, and (for conditionals) backward references only.

### Add a pitch screen

Append a `PitchScreen`. The **`label` is load-bearing**: it is sent as the `question`
param on the **`Continued From Pitch`** GA event when the user taps Continue
(`quizStore.ts` → `GA.CONTINUED_FROM_PITCH`). Use the contract's exact pitch labels
(e.g. `'Damage Pitch'`, `'Holistic Pitch'`, `'Damage Practices Pitch'`).

```ts
{
  kind: 'pitch',
  id: 's_damage_pitch',
  label: 'Damage Pitch',       // → `question` on `Continued From Pitch` — keep exact
  headline: "Here's what's going on",
  body: { by: 'hairConcern', cases: { /* … */ }, default: '…' }, // ConditionalText
}
```

`validateSpec` rejects an empty pitch `label`.

### Add a condition

A `ConditionalText` (used by `prompt`, `headline`, `body`, `reveal`, etc.) is one of:

```ts
// 1. a plain static string
'Where should we send your plan?'

// 2. single-answer keyed lookup (uses the FIRST picked answer of `by`)
{ by: 'hairConcern',
  cases: { concern_hairloss: '…', concern_damage: '…' },
  default: '…' }

// 3. set-logic rules over a multi-select array (first matching rule wins)
{ rules: [
    { when: { questionId: 'hairSymptoms', containsAll: ['symptom_shedding', 'symptom_dryness'] }, text: '…' },
    { when: { questionId: 'hairSymptoms', containsAny: ['symptom_itch'] }, text: '…' },
  ],
  default: '…' }
```

`validateSpec` requires that any referenced `questionId` is defined by an **EARLIER**
question screen and that every referenced `answerId` exists on that question.

### Add / sort / remove screens

`spec.screens` is a strictly linear array; the engine walks it top-to-bottom. To
reorder, move the object; to remove, delete it. Because navigation/chrome are derived
by `kind` + position, no index constants need updating. After any change:

- run `npm run validate` (catches forward references, duplicate ids, broken cdp), and
- keep the `result` screen last and any conditional `by`/`rules` references pointing
  at earlier question screens.

### Add a new screen-type component

Unlike the other recipes, this one touches **components**, because the catalog above
is keyed on `screen.kind` + `type`. Keep every component presentational (see
`docs/component-contract.md`):

1. **Create the component** under `src/components/screens/` — props are **resolved
   primitives / data shapes** (`string`, `Answer[]`, image URLs) + callbacks only.
   **NO** imports of the spec, the store, `AnswerState`, raw answers, or
   `resolveConditional`.
2. **Map it in `ScreenRenderer.tsx`** — add a `case`/branch in `renderBody` that
   resolves any `ConditionalText` there (via `resolveConditional`) and passes resolved
   props + the `onAnswer`/`onContinue`/`onSubmitEmail` callbacks down.
3. **Add it to `PreviewGallery.tsx`** — one labeled `Frame` with representative sample
   props, so it appears at `/?preview`.
4. **If it advances differently**, add a store action in `quizStore.ts` that fires the
   correct `GA.*` event (with the raw screen `index` as `position`) and calls `next()`.
   Reuse an existing action if the advance semantics match.
5. **Go green:** `npm run test`, `npm run test:e2e`, `npm run build` (plus
   `npm run validate` per the green-before-commit invariant).

### Add a CDP field

Put a `CdpMapping` on the question's `cdp`:

```ts
cdp: { acField: 50, mpField: 'Hair Current Issues' }
```

- `acField` becomes the webhook key `field_<acField>`; `mpField` is the Mixpanel
  property name. `validateSpec` requires `acField` to be a positive integer.
- **EXTERNAL STEP 1 (not in this repo) — the ActiveCampaign custom field must EXIST
  first.** Create the custom field in ActiveCampaign (via the AC UI or the AC MCP),
  read back its numeric id, and only then put that number in `cdp.acField`. AC will
  NOT auto-create the field; a missing field id silently drops the value.
- **EXTERNAL STEP 2 (not in this repo) — the submission Worker must ALSO whitelist
  the field, or the value is SILENTLY DROPPED.** The Worker (`QuizSubmissions`) only
  writes `field_<id>` values present in its `AC_FIELD_MAPPING` (`src/constants/tags.ts`);
  any `field_<id>` NOT in that map is dropped even when the AC field exists and the quiz
  sends it. So a NEW `cdp.acField` needs THREE things aligned: (1) the AC field exists,
  (2) `cdp.acField` is set here, AND (3) `field_<id>: <id>` is added to the Worker's
  `AC_FIELD_MAPPING` and the Worker is redeployed. Re-using an `acField` already in the
  map (see `cdp-coupon-map.md` Table A) needs no Worker change.
- **Mixpanel is schema-on-write AND needs no whitelist:** `mpField` needs no
  pre-creation (the property appears on first send) and the Worker passes the whole
  `mixpanel` object through — so a new `mpField` always lands with no external steps.
- See `docs/reference/cdp-coupon-map.md` Table A for the canonical existing mappings
  (and the `field_56` crossover quirk between `mindsetState` and `hairqare`).

### Change the coupon map

Edit `spec.checkout.couponRules` (and `defaultCoupon`). Rules are evaluated in order;
**first match wins**, default applies if none match. `resolveCoupon` appends the tag
as `aero-coupons=<tag>` on the checkout URL.

```ts
checkout: {
  base: 'https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/', // canonical (no -59)
  couponRules: [
    { when: { questionId: 'hairConcern', containsAny: ['concern_hairloss'] }, coupon: 'c_hl' },
    { when: { questionId: 'hairConcern', containsAny: ['concern_damage', 'concern_splitends'] }, coupon: 'c_dh' },
  ],
  defaultCoupon: 'o_df',
}
```

Preserve the priority ordering from `cdp-coupon-map.md` Table B (`hairConcern` wins
over `diet`). Use the **canonical base with no `-59`** slug.

### Enrich an event for FB targeting

To attach a question's answers as properties on client analytics events (for Facebook
targeting), add its `questionId` to `spec.eventEnrichment`:

```ts
eventEnrichment: ['hairConcern']
```

Pass the extra attributes through the `extra` argument of `trackGAEvent` — `track.ts`
copies any extra keys (beyond the known `questionId`/`question`/`selectedAnswer`/
`qName`/`qEmail`) straight onto the dataLayer params. Mixpanel props are
schema-on-write, so no pre-creation is needed.

**Which client events carry the enrichment (Phase 4 Task 2):** the enriched answer
attributes (concern / age / goal — i.e. the `questionId`s listed in
`spec.eventEnrichment`) are forwarded onto the **answer**, **completion**, and
**checkout** client events. This closes ISSUES #2b — previously the client
`quiz started/completed` events carried only GA params (`event_category`, `position`,
`q_name`/`q_email`) and no answer attributes. The server-side `Signed Up` Converge
event was already enriched by the Worker, so this only affects the client-fired events.

---

## External systems (NOT in this repo)

- **GTM (`GTM-TT5MJDF`) relays the GA dataLayer events to Converge.** Because of this
  relay, **do NOT add client `cvg` / `trackEvent` calls for `Quiz Started` /
  `Quiz Completed`** — they already reach Converge through GTM, and re-firing them
  client-side would **double-count** (see `tracking-contract.md` and ISSUES #2). The
  only Converge events the client may fire are `$page_load` (auto, from the publishing
  header) and `Completed Quiz` (`converge.ts`).
- **The submission Worker (`quiz-submissions-worker`) fires the server-side Converge
  `Signed Up` event.** The rebuild's job is to send a byte-identical submit payload to
  `POST https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit`
  (with the `X-Webhook-Secret` header); the Worker is the source of truth for
  `Signed Up`, Mixpanel upsert, and AC upsert/tagging.
- **AC custom-field ids and GTM tags live outside this repo.** Creating an AC field or
  a GTM tag is a manual/MCP step done in those systems first; this repo only references
  the resulting numeric `field_<id>`.

---

## How to run

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build  (base defaults to './')
npm run preview    # preview the production build
npm run test       # Vitest unit/component tests (only *.test.* files are suites)
npm run validate   # tsx src/spec/cli-validate.ts — spec validator CI gate
npm run test:e2e   # Playwright e2e
```

> Note: `*.spec.ts` files are **quiz-spec fixtures**, not test suites — Vitest only
> includes `src/**/*.test.{ts,tsx}` (see `vite.config.ts`).

### Build & promote (per-quiz subpath)

**Deploy boundary (read the root `CLAUDE.md` first).** Claude branches/commits/pushes to
**this dev repo only** (`Holinic-Tech/hairqare-quiz-engine`). Claude **NEVER** writes to,
builds into, or pushes to `holinic-webflow` (the GitHub Pages live site, `join.hairqare.co`).
**Toby alone** promotes bundles there. To "ship", Claude runs the gates + builds the bundle,
then hands **Toby copy-paste promotion instructions** — Claude does not perform the copy into
`holinic-webflow` or the commit there.

Each published quiz is a **static bundle** served from a numbered subpath on
`join.hairqare.co`. Claude builds it with an explicit `--base` matching the target
folder/URL:

```bash
VITE_WEBHOOK_SECRET=<secret> npm run build -- --base=/NN-the-quiz-haircare/
```

The `--base` flag overrides the default `base: './'` from `vite.config.ts` and prefixes
every asset `src`/`href` in `dist/index.html` with `/NN-the-quiz-haircare/` so they
resolve under the subpath. `VITE_WEBHOOK_SECRET` is injected at build time and **ships
to the browser** in the JS bundle (the `X-Webhook-Secret` submit header) — exactly like
the Flutter original; pull it from 1Password, never hardcode it.

After Claude builds, the `dist/` output is **promoted by Toby** into the `holinic-webflow`
repo under the matching `NN-the-quiz-haircare/` directory (folder name = URL path).
**Test quizzes go on a new number; a winner overwrites `the-quiz-haircare`** (no number).
The bundle consumes the host page's `dataLayer`/`gtag`/`cvg`/`trackEvent` globals +
`__cvg_uid`/`__cvg_sid` cookies — it does NOT inject GTM/Converge. The prior React attempt
at `holinic-webflow/34-the-quiz-haircare` is research-only, never an authority.

**Claude does the gates + the build, then hands Toby the steps.** See the
`hairqare-quiz` skill's `references/deploy.md` for exactly what to build and the
copy-paste promotion block to give Toby. `scripts/promote.md` holds the full manual
checklist (pre-promotion green gate, the GTM `GTM-TT5MJDF` / gtag `G-15HXMXW4HW` /
Converge host-page requirement) — its `cp`-into-`holinic-webflow` + commit steps are
**Toby's**, not Claude's.

---

## Brand tokens (Hairqare Challenge sub-brand)

Design polish lives behind the presentational contract — **tokens in
`tailwind.config.js`**, never per-component hardcoded hexes. Source of truth is the
Holiniq brand book (`~/github/figma-holiniq-brand/`).

- **Colors** (Tailwind names): `periwinkle #B2BAE0`, `plum #7375A6` (primary),
  `violet #E9EBFB` (card/panel tint), `almond`/`almond-warm`, `tangerine #F2B485`
  (CTA/accent — **never a background fill**), `tangerine-deep #DD8144` (CTA/link hover),
  `rich-black #3A2D32` (primary text), `shadow #696969` (muted text), `dove #F5F5F5`
  (soft bg), plus a warm `neutral` ramp (100–900) for borders/dividers.
- **Fonts:** body = **Inter** (self-hosted latin subset via `@fontsource/inter`,
  imported in `src/index.css`; `font-sans`). Headlines = **Reckless Neue** if present,
  but **no Reckless Neue files ship in the brand repo**, so `font-display` degrades to
  a tasteful serif stack (`'Reckless Neue', Georgia, 'Times New Roman', serif`); `h1–h3`
  use it by default. Swap in the real font files (e.g. via `@font-face`) when available.
- **Component utility classes** (`@layer components` in `index.css`):
  `.btn-primary` (tangerine fill, white uppercase Inter 600, +0.7px tracking, rounded;
  hover `tangerine-deep`), `.btn-secondary` (outlined tangerine), `.link-brand`
  (rich-black text-link → deep-tangerine hover), `.answer-card` /
  `.answer-card--selected` (white card, periwinkle border, plum selected state).
- **Background:** soft periwinkle→white gradient on `body` (white stays dominant).
- The non-result **no-scroll invariant** still holds — prefer fluid type so the
  FitViewport scaler stays mild. The visual `toHaveScreenshot` baselines are
  **own-baselines**; after any intentional styling change, regenerate with
  `npm run test:e2e -- --update-snapshots` (the loading-bar mask targets
  `[data-loading-bar]`).

## Device / no-scroll QA

`e2e/devices.spec.ts` (Phase 4 Task 7) drives the **real quiz** at four viewports and,
on representative screens (start, a question, a pitch, email), asserts (1) the
**NO-SCROLL invariant** (`document.scrollingElement.scrollHeight <= clientHeight`) and
(2) the primary CTA / answer **tap-target height**:

| Viewport | NO-SCROLL | Tap targets |
| --- | --- | --- |
| iPhone SE — 375×667 | ✅ | ✅ ≥40px |
| iPhone 14 Pro — 393×852 | ✅ | ✅ ≥40px |
| Pixel 7 — 412×915 | ✅ | ✅ ≥40px |
| small landscape — 740×360 | ✅ | ✅ ≥28px (scaled) |

The short landscape surfaced a real reachability bug (tallest `hairMyth` multi-select
clipped off-viewport): fixed in `FitViewport` by lowering the scale floor `0.6`→`0.45`,
top-aligning (`justify-start`) whenever `scale < 1`, and adding an 8px height safety
margin — see the "Fit-to-viewport rule" above and `docs/reference/qa-report.md`.

**In-app webviews (FB/IG/Messenger):** React renders plain HTML, so there is no
Flutter webview shim to port. The two things that matter — reading the host tracking
globals/cookies and building the checkout redirect — are covered by unit tests
(`track.test.ts`, `converge.test.ts`, `checkout.test.ts`) and the tracking-parity walk
in `e2e/golden.spec.ts`; no webview-specific e2e assertion is needed.

## Load-speed (static-bundle levers)

The published bundle is tiny (~73.5 kB gzip JS + ~4.4 kB gzip CSS — ~1% of the Flutter
original's 6.8 MB). Two load-speed hints are in place (Phase 4 Task 8):

- **`preconnect` + `dns-prefetch`** in `index.html` `<head>` to the checkout host
  (`checkout.hairqare.co`) and the three result-image CDNs (`assets.hairqare.co`,
  `pub.hairqare.co`, `uploads-ssl.webflow.com`) — warms TLS for the checkout hop and
  the first dashboard images.
- **Lazy-load below-the-fold images** (`loading="lazy" decoding="async"`) on the
  dashboard avatar, testimonial carousel, and timeline images in
  `src/components/result/ResultDashboard.tsx`. The **first** transformation image (the
  dashboard hero) stays `loading="eager"` to protect LCP.

A live Lighthouse/LCP number was not captured in-environment; rerun with the
chrome-devtools `web-perf` skill against a deployed subpath if a number is required.
See `docs/reference/qa-report.md` for the full asset/device/load-speed report.

## Project status

**Phases 0–4 complete.** Phase 0 (golden reference + tracking contract), Phase 1
(spec/engine), Phase 2 (tracking integrations), Phase 3 (components + visual/content
parity), Phase 4 (polish: progression/enrichment fixes, live brand tokens, SkipModal
copy, asset link-check, device/no-scroll QA, load-speed). Open residuals and their
resolution/deferral are tracked in `docs/reference/ISSUES.md` (the only DEFERRED visual
gap is the missing **Reckless Neue** headline font files — currently a serif fallback).

**Phase 5 (next):** templatize the engine for multiple quizzes, the build/promote
flow (`scripts/promote.md`) to publish per-quiz subpaths, and a design context pack.
