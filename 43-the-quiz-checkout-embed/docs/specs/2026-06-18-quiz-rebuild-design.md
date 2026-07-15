# Hairqare Quiz Engine — Rebuild Design

**Status:** Approved approach, pending spec review
**Date:** 2026-06-18
**Owner:** Toby
**Source of truth being replaced:** FlutterFlow project `holistic-haircare-plan-quiz27-vhmit6` (export at `~/github/Flutter Quiz Raw/`)

---

## 1. Goal

A non-technical martech manager (with repo access + Claude Code) can **completely rework the quiz** — add/remove/reorder questions, reconfigure conditions, edit result pages per quiz-profile, add/modify/remove pitch screens, swap testimonials/images, change answer types, layout and design — then **build and deploy**, *without* understanding the underlying architecture or any visual builder.

Two hard constraints:
1. **Tracking compatibility:** all GA/GTM/Converge events, the submission webhook, and the checkout redirect must remain byte-identical to the current quiz so existing analytics + CDP infrastructure keep working.
2. **Conversion fidelity:** the rebuilt quiz must look and convert at least as well as the current FlutterFlow quiz. (A prior React rebuild failed precisely here.)

## 2. Background & the lesson from attempt #1

A React rebuild already exists: `holinic-webflow/34-the-quiz-haircare` (Vite + React 19 + TS + Tailwind + Zustand, data-driven). It was built ~6–7 months ago and is **not** being continued because it lost visual fidelity and conversion, and — verified during this analysis — its tracking silently drifted from the live quiz:

- checkout event named `Go to checkout` (one space) instead of the live `Go to  checkout` (two spaces);
- submission webhook pointed at a **Make.com** hook instead of the canonical Worker;
- invented Converge `Quiz Started`/`Quiz Completed` events the live app never fires;
- pitch labels `Simple/Detailed/Dynamic` instead of `Damage/Holistic/Damage Practices`.

**Root cause:** it was built by eye, with no fidelity reference and no automated verification. **This design is organized around eliminating that failure mode: fidelity is measured against a golden reference, not eyeballed.** Quiz 34 is used as research/cautionary input only (notably its `image-inventory.csv` and migration notes); we do not build on its code.

## 3. Current app — verified comprehension

From a full code analysis of the FlutterFlow export (`QuizV2-flutterflow/lib` is ground truth):

- **Single page, one linear `PageView`.** `home_page_widget.dart` builds 25 children; the real journey is strictly linear **index 0 → 19** (Dashboard is the end). Motion is programmatic `nextPage()/previousPage()` (±1); swipe disabled.
- **No answer-driven navigation branching.** Every user walks the same screens. The "nested/stacked conditions" are **content substitution only** — `if answerIds contains X → this text/image`, resolvable as lookup tables (e.g. the 215-line pitch "claim" block is a 5×5 `routine × concern → string` table, duplicated in code).
- **Fragility is concentrated and named:** hardcoded magic screen indexes drive header/progress/back visibility (`quizIndex != 0/6/7/8/9/13/17/18/19/20`, `totalQuestion: 19`); conditional content is duplicated across widgets; result-page + testimonial copy/images are hardcoded inside Dart widgets (the `testimonialMapping` app-state that looks data-driven is dead). The dashboard match-% is `randomInteger(92,97)`.
- **Dead screens (confirmed not in use):** PageView idx 21 `StartLoadingComponent` (hidden), idx 22 `NotUsedHolistic`, idx 23 `NotUsedGoal` (V3 start). Plus many dead templates/actions/widgets and `_copy` dashboard duplicates.
- **Tracking is web-native already** (Firebase off): events go to `window.dataLayer`/`gtag`/Converge `trackEvent` via a `dart:js` bridge; submission is an HTTP POST; checkout is a `window.location` redirect. In a React rebuild these become direct calls — the bridge disappears.

## 4. Canonical contract (must be preserved byte-for-byte)

> Full detail in the analysis; summary here. Any change to these strings/URLs breaks downstream analytics/CDP.

**Transport:** `trackGAEvent` → `window.dataLayer.push({event, ...params})` primary, `gtag('event', name, params)` fallback. Converge via the `cvg`/`trackEvent` bridge.

**Fixed GA params:** `event`, `event_category: 'Quiz'`, `position` (=screen index); optional `question_id`, `question`, `selected_answer` (always an array), `q_name`, `q_email`.

**GA event names (exact, incl. spacing):** `Quiz Viewed`, `Quiz Started`, `Question Answered`, `Quiz Back`, `Opened Skip Dialog`, `Closed Skip Dialog`, `SkipQuiz`, `Continued From Pitch` (label `Damage Pitch`/`Holistic Pitch`/`Damage Practices Pitch`), `Quiz Completed`, `Quiz Submitted` (carries `q_name`/`q_email`), `Viewed Results Page`, `Opened Plan Details`, `Closed Plan Details`, `Go to  checkout` **(two spaces — primary results CTA)**, `Go to checkout` (one space — floating timer), `Go to next checkout step`.

**Converge (CRITICAL for advertising — full picture UNVERIFIED, must be resolved in Phase 0):** The Flutter *client* fires Converge twice only: `$page_load` (auto, from the init header) and `Completed Quiz` on submit (`trackEvent('Completed Quiz', {answers,name,firstName,lastName,email}, null, {'$email':email}, ['urn:email:'+email])`). It does **not** fire client-side `Quiz Started`/`Quiz Completed`. However, additional Converge events may fire **server-side** via the submission Worker and/or a Make.com scenario — this is not visible from client code. **Phase 0 must read the Worker source + any Make scenario and establish the authoritative client+server Converge event set before any tracking code is written.** Do not assume the Flutter client behavior is complete.

**Submission webhook (canonical = the Worker):** POST `https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit`, header `X-Webhook-Secret: a6e3a73e9d1d60d438efad6b5512b5a75db65c3c1f78f90ed9aeccfde3ac6969`. Body: `{name, firstName, lastName, email, quizData.rawAnswers[], activeCampaign{field_<acId>}, mixpanel{<mpField>, $name, $email}}`. AC/MP fields driven by a `cdpMapping` table; AC multi-answer joined by `", "`.

**Checkout (canonical, Toby-corrected):** base `https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/` — **note: the live `redirect_to_checkout.dart` hardcodes a wrong `-85-5-59/`; the rebuild uses the no-`59` URL.** Params: `billing_email`, `billing_first_name`, `billing_last_name`, `aero-coupons=<tag>`, `__cvg_uid`, `__cvg_sid` (from cookies, URL-param fallback). Coupon map from answer IDs: `concern_hairloss→c_hl`, `concern_damage|concern_splitends→c_dh`, `concern_scalp→c_si`, `diet_custom|diet_balanced→d_bc`, else `o_df`.

**Required host-page globals:** `window.dataLayer`, `gtag`, `trackEvent`/`cvg`, `__cvg_uid`/`__cvg_sid` cookies. The quiz consumes these; the host page (Webflow/GTM headers) provides them.

## 5. Architecture — seven pillars

1. **Fidelity-first.** Phase 0 produces a **golden reference**: complete behavioral spec + per-screen/state screenshots + the contract above, captured from the latest source of truth. This is the acceptance criteria for every later phase.
2. **Spec-driven core.** One strongly-typed, human-readable `quiz` spec (TypeScript modules under `src/quiz/`) is the marketer's editing surface. It declares screens, order, questions, answers (stable IDs), conditional content, result variants, testimonials, pitch screens, pricing, CDP/coupon mappings, and tracking bindings. **All indexes/navigation/progress/back-visibility are derived from the spec** — magic numbers are designed out. Conditional content is data (lookup tables keyed by answer ID), never nested code.
3. **Component library.** Screen-type components — single-choice, image-choice, multi-select, rating/slider, pitch/interstitial, loading, email-capture, result/dashboard — plus primitives (progress bar, countdown timer, skip modal, carousel). **Mobile-first**, Tailwind + Holiniq brand tokens, each previewable in isolation. New layout/element = add one component, register its `type`, and it becomes available to every quiz via the spec.
4. **Tracking layer (locked).** A typed `track()` reproduces the §4 contract exactly (incl. two-space `Go to  checkout`) via direct `window` calls + webhook `fetch` + checkout redirect with coupon derivation. Events are bound declaratively in the spec so content edits cannot desync analytics.
5. **Verification harness.** (a) Playwright walks the full quiz and asserts every tracking event fires with exact name + props at the right step; (b) visual-snapshot diffs vs the golden screenshots; (c) a spec validator catches dangling answer IDs / missing tracking bindings / unreachable screens before build. Runs in CI → green/red after every edit.
6. **Engine.** Renders the current screen from the spec, manages the linear flow + back, holds answer state, resolves conditional content via lookups, and fires the bound tracking at the correct triggers.
7. **Deploy & versioning.** Dev happens in this engine/template repo (`hairqare-quiz-engine`), the source of truth for engine + components. A given quiz = a spec + assets; `vite build` produces a static bundle (relative/base-pathed for subpath serving). The built folder is **promoted manually** into `holinic-webflow` as `NN-the-quiz-haircare`, served on GitHub Pages at `join.hairqare.co/NN-the-quiz-haircare`. Testing variant = new path; winner overwrites canonical `the-quiz-haircare`. Each promoted folder is a frozen snapshot, so improving the engine never breaks live quizzes.

## 6. Quiz spec shape (sketch, finalized in Phase 1)

```ts
// One screen in the ordered flow.
type Screen =
  | QuestionScreen   // type: 'single' | 'image' | 'multi' | 'rating'
  | PitchScreen      // interstitial; carries the Continued-From-Pitch label
  | LoadingScreen
  | EmailCaptureScreen
  | ResultScreen;    // dashboard

interface QuestionScreen {
  id: string;                 // stable; used in tracking + CDP + coupon logic
  type: 'single' | 'image' | 'multi' | 'rating';
  questionId: string;         // stable analytics id (e.g. 'hairConcern')
  prompt: ConditionalText;    // static, or keyed by prior answers
  answers: Answer[];          // each with stable answerId, label, image?
  progression: 'auto' | 'cta';// single→'auto'; multi/rating/reveal→'cta'
  reveal?: ConditionalText;   // optional answer-dependent extra text before CTA
  tracking: { onView?: EventBinding; onAnswer: EventBinding };
}

// Conditional content supports single-answer keying AND set logic over
// multi-select arrays (contains-all / contains-any), recovering the
// answer-combination conditionals the Flutter app had to drop.
type ConditionalText =
  | string
  | { by: string /*questionId*/; cases: Record<string,string>; default: string }
  | { rules: Array<{ when: AnswerSetCondition; text: string }>; default: string };
```

Indexes, progress denominator, header/back visibility, and the `position` tracking field are all **derived** from the screen array — no literals. Conditional copy that the Flutter app duplicated (e.g. the routine×concern table) is authored once as a lookup.

## 6a. Interaction & layout requirements (verified with Toby)

**Progression model** — each screen declares how it advances:
- `progression: 'auto'` — single-select questions advance immediately on answer selection (no CTA).
- `progression: 'cta'` — multi-select, pitch/interstitial, rating/scale, and reveal-text screens advance via an explicit **Continue** button.
- Multi-select Continue is **disabled until ≥1 answer is selected**.

**Reveal text** — some question screens show extra, answer-dependent text after the user selects, *before* the Continue CTA (the Flutter `AnswerWithAdditionalInfo` / animated-text behaviour). Modeled as optional `reveal: ConditionalText` on a screen.

**Multi-select data & combination conditions** — multi-select answers are stored as a correct array of stable `answerId`s. The conditional-content model must support **set logic over those arrays** (e.g. `contains UV AND swimming → output A`; `contains UV AND tightStyles → output B`). The Flutter app could not do this reliably and fell back to generic copy; the new engine supports it as a first-class capability (current content stays generic, but the schema/engine allow combination rules so this can be recovered later without re-architecture).

**Fit-to-viewport scaling (first-class constraint; a known prior pain point)** — every screen must fit the viewport **without scrolling**, scaling content down as needed while staying readable, **mobile-first**. The **only** exception is the dashboard/result page, which may scroll. This requires a dedicated fit-to-viewport layout primitive in the component library (measure available height, scale typography/spacing/media to fit) and an explicit acceptance check per screen at target mobile breakpoints. Failure to hold this was a major contributor to attempt #1 feeling unusable.

## 7. Verification strategy (acceptance gates)

- **Tracking parity:** an automated Playwright run drives the entire quiz; a recorder captures every `dataLayer.push`/`gtag`/`cvg` call and webhook/redirect; the test asserts the captured sequence equals the golden contract (names, props, order, the two-space variant, the single Converge event, the Worker webhook payload, the corrected checkout URL + coupon).
- **Visual parity:** per-screen screenshots diffed against the Phase-0 golden reference within tolerance; deviations triaged as bug vs intentional Phase-4 polish.
- **Spec integrity:** validator run in CI — every answerId referenced by a condition/CDP/coupon exists; every screen has required tracking bindings; no unreachable screens; no duplicate ids.

## 8. Phased plan (each phase gated by §7)

- **Phase 0 — Golden reference.** Capture the complete behavioral spec + per-screen screenshots + contract from the latest source of truth (live ref `join.hairqare.co/the-quiz-haircare`, cross-checked against the FlutterFlow export which is the *latest* truth if the live path lags). **Includes resolving the authoritative Converge event set (client + server: Worker + Make) — top priority, critical for advertising.** Deliverable = acceptance criteria. *No app code yet.*
- **Phase 1 — Foundations.** Repo scaffold (Vite+React+TS+Tailwind), spec schema + types, engine with derived navigation, tracking layer matching §4, harness skeleton. Gate: one screen renders; one event verified green.
- **Phase 2 — Component library.** All screen types, mobile-first, isolated previews vs visual references.
- **Phase 3 — Assemble from spec.** Full flow + dashboard/countdown timer/skip modal + all conditional content authored as lookups. Gate: full Playwright tracking parity + visual diff within tolerance.
- **Phase 4 — Polish & QA.** Tasteful design improvements (kept clearly separate so they can't be confused with fidelity regressions), mobile/responsive + in-app-webview checks, load-speed/conversion tuning.
- **Phase 5 — Templatize & document.** "Start a new quiz" workflow, the marketer playbook (editing the spec via Claude Code), manual-promotion script/checklist into `holinic-webflow`.
- **Phase 6 (optional, later).** Lightweight web UI over the same spec files.

## 9. Non-goals (YAGNI)

- No language localization (explicitly dropped; the Flutter German/Spanish pipeline is not ported).
- No spec-editing UI in the initial build (Phase 6, optional).
- No reuse of quiz-34 code (research input only).
- No reproduction of the Flutter in-app-webview detection hacks unless a concrete rendering issue requires it (they were experimental and unverified).

## 10. Open items

- **Golden-reference URL:** live ref confirmed = `join.hairqare.co/the-quiz-haircare`; cross-check against the FlutterFlow export (the latest source of truth) and, if available, the FlutterFlow published preview. Resolve in Phase 0.
- **Converge server-side picture:** need access to the `quiz-submissions-worker` source and any Make.com scenario to establish the authoritative event set. Phase-0 dependency.
- Final repo name confirmation: `hairqare-quiz-engine` under `Holinic-Tech`.

## 11. Risks

- **Visual fidelity drift** (attempt-#1 failure) → mitigated by Phase-0 screenshots + visual-diff gate + clone-before-polish ordering.
- **Tracking drift** → mitigated by the contract + automated parity test.
- **Subpath serving** (assets must resolve under `/NN-the-quiz-haircare/`) → handled by Vite `base` config + verified in the promotion checklist.
- **Spec expressiveness:** if a future quiz needs real answer-driven branching (current quiz has none), the spec/engine must extend cleanly — design the screen-transition model to allow optional per-answer `next` targets without requiring them.
