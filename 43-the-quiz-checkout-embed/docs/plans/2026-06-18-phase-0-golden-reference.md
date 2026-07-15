# Phase 0 — Golden Reference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a verified, machine- and human-readable "golden reference" of the current Hairqare quiz — the authoritative behavioral spec, the byte-exact tracking/webhook/checkout contract (client **and** server), the CDP/coupon maps, and per-screen mobile screenshots — that becomes the acceptance criteria every later phase is tested against.

**Architecture:** Pure analysis + capture. No application code is written in Phase 0. Every artifact is produced by reading ground-truth sources, then independently QC-verified by a fresh adversarial subagent against those same sources before it is allowed to become an input to Phase 1. Artifacts live in the new `hairqare-quiz-engine` repo under `docs/reference/`.

**Tech Stack:** Markdown + JSON artifacts; Playwright or chrome-devtools MCP for screenshot capture; subagents for extraction and QC.

**Ground-truth sources (read-only — never edit):**
- Flutter export (latest source of truth): `~/github/Flutter Quiz Raw/QuizV2-flutterflow/lib` (code) + `~/github/Flutter Quiz Raw/holistic-haircare-plan-quiz27-vhmit6_yamls` (FF project)
- Submission Worker: `~/github/QuizSubmissions/src` (+ `docs/flutterflow-integration.md`)
- Live reference quiz: `https://join.hairqare.co/the-quiz-haircare`
- Prior React attempt (cautionary research only, do NOT copy): `~/github/holinic-webflow/34-the-quiz-haircare` (+ its `image-inventory.csv`)
- Design doc: `docs/specs/2026-06-18-quiz-rebuild-design.md`

---

## Phase map (context — only Phase 0 is detailed here)

| Phase | Output | Plan written |
|---|---|---|
| **0 (this plan)** | Golden reference = acceptance criteria | now |
| 1 | Foundations: repo, spec schema, engine (derived nav), tracking layer, harness skeleton | after P0 verified |
| 2 | Component library (all screen types, fit-to-viewport, mobile-first) | after P1 |
| 3 | Assemble full quiz from spec; tracking + visual parity gates | after P2 |
| 4 | Polish & QA (design, webview, load speed) | after P3 |
| 5 | Templatize + marketer playbook + promotion script | after P4 |

**Why gated:** Phase 1 TDD tests assert against P0's contract artifacts. Planning P1 code before P0 resolves the Converge question would hard-code unverified assumptions — the exact failure of attempt #1.

---

## Cross-cutting QC & failsafe protocol (applies to EVERY task)

1. **Two-source rule.** No fact enters an artifact unless traced to a named ground-truth source with a `file:line` or URL citation. Uncited claims are rejected in QC.
2. **Adversarial QC gate.** After a task's artifact is drafted, a *fresh* subagent (no memory of how it was produced) is dispatched to verify it against the ground-truth source and produce a `PASS` / `FAIL(reasons)` verdict. The task is not "done" until QC returns PASS. The QC agent is instructed to assume the artifact is wrong and try to break it.
3. **Wrong-direction signals (stop immediately if any occur):**
   - An event name / URL / secret in an artifact does not appear verbatim in a ground-truth source.
   - The screen count or order in the behavioral spec disagrees with the live walkthrough.
   - The client-only Converge set is assumed complete without reading the Worker.
   - Any artifact cites quiz-34 as authority (it is research-only).
   If a signal fires, halt, record it in `docs/reference/ISSUES.md`, and resolve before proceeding — do not build later artifacts on top of it.
4. **Frozen inputs.** Once an artifact passes QC and is committed, later tasks treat it as read-only truth. Changes require a new commit with a stated reason.
5. **Human checkpoint.** The phase ends with Toby reviewing the golden reference before Phase 1 planning begins.

---

## File structure (artifacts this phase creates)

- `docs/reference/tracking-contract.md` — authoritative client+server event/webhook/checkout contract
- `docs/reference/golden-events.json` — machine-readable expected event sequence for the canonical happy-path walkthrough (Phase 1/3 Playwright fixture)
- `docs/reference/quiz-flow.md` — screen-by-screen behavioral spec (type, progression, prompt, answers+IDs, conditional rules, reveal, tracking bindings, fit-to-viewport notes)
- `docs/reference/cdp-coupon-map.md` — questionId→{acField,mpField}; answerId→coupon tag
- `docs/reference/golden/` — per-screen mobile screenshots, named `NN-<screen-id>.png`
- `docs/reference/ISSUES.md` — running log of wrong-direction signals / discrepancies
- `docs/reference/README.md` — index + "how these artifacts are used downstream"

---

### Task 1: Scaffold the reference area + issues log

**Files:**
- Create: `docs/reference/README.md`
- Create: `docs/reference/ISSUES.md`

- [ ] **Step 1: Write the reference index**

`docs/reference/README.md` contents:
```markdown
# Golden Reference (Phase 0)
Authoritative, QC-verified description of the CURRENT quiz. Acceptance criteria for the rebuild.
Sources: Flutter export, QuizSubmissions worker, live quiz join.hairqare.co/the-quiz-haircare.
Files:
- tracking-contract.md — event/webhook/checkout contract (client+server)
- golden-events.json — expected event sequence (Playwright fixture)
- quiz-flow.md — screen-by-screen behavioral spec
- cdp-coupon-map.md — CDP + coupon maps
- golden/ — per-screen mobile screenshots
- ISSUES.md — discrepancies / wrong-direction signals
Rule: every claim cites a source (file:line or URL). quiz-34 is research-only, never authority.
```

- [ ] **Step 2: Initialize the issues log**

`docs/reference/ISSUES.md`:
```markdown
# Phase 0 Issues & Discrepancies
| # | Source A | Source B | Discrepancy | Resolution | Status |
|---|----------|----------|-------------|------------|--------|
```

- [ ] **Step 3: Acceptance criteria**

Both files exist; README lists all six downstream artifacts and the citation rule.

- [ ] **Step 4: Commit**

```bash
git add docs/reference/README.md docs/reference/ISSUES.md
git commit -m "Phase 0: scaffold golden-reference area + issues log"
```

---

### Task 2: Resolve the authoritative Converge event set (client + server) — TOP PRIORITY

**Why first:** It is the highest-risk unknown and critical for advertising; its answer shapes `tracking-contract.md`.

**Files:**
- Create: `docs/reference/tracking-contract.md` (Converge section first; other sections added in Task 3)

- [ ] **Step 1: Extract client-side Converge behavior**

Dispatch a subagent to read `~/github/Flutter Quiz Raw/QuizV2-flutterflow/lib/custom_code/actions/webhook_callcvg.dart`, the web-publishing init header (`holistic-haircare-plan-quiz27-vhmit6_yamls/web-publishing.yaml`), and every call site of `webhookCallcvg`. Output: exact list of Converge calls the **client** makes (event name, args, trigger, file:line).

- [ ] **Step 2: Extract server-side Converge / CDP behavior (Worker first, Make contingency)**

Dispatch a subagent to read `~/github/QuizSubmissions/src/index.ts`, `src/routes/quiz.ts`, `src/queue/quizProcessor.ts`, `src/types/env.ts`, and `docs/flutterflow-integration.md`. Output: what the Worker does on `POST /api/v1/quiz/submit` — does it forward to Converge, Make.com, ActiveCampaign, Mixpanel? With what event names/payloads? Cite file:line.

**Toby's steer:** server-side Converge is *probably in Make, not the Worker.* Two outcomes:
- **(A) Worker fires Converge** → record it fully; rebuild replicates the same Worker call. Done.
- **(B) Worker does NOT fire Converge** → server-side Converge is handled by **Make** (external; not in this repo, so not directly readable). Record the **architectural consequence explicitly**: the rebuild preserves all server-side Converge events by sending a **byte-identical payload to the same Worker endpoint** that ultimately feeds Make — the React app therefore **must NOT re-fire `Quiz Started`/`Quiz Completed` client-side** (that was quiz-34's error). Confirming Make's exact event list is a dependency on Toby (share the Make scenario blueprint or check the Converge dashboard); flag it in `ISSUES.md`. It does **not** block Phase 1, because Phase 1 only needs to (i) replicate the Flutter client's real Converge calls and (ii) reproduce the webhook payload exactly — both fully knowable from sources we have.

- [ ] **Step 3: Write the resolved Converge section**

In `tracking-contract.md`, write a `## Converge (authoritative)` section stating, with citations: every Converge event that fires across the WHOLE system, where each originates (client vs Worker vs Make), exact name + payload, and the trigger. Explicitly answer: "does `Quiz Started`/`Quiz Completed` fire anywhere, and if so from where?"

- [ ] **Step 4: QC gate (adversarial)**

Dispatch a fresh subagent: "Assume this Converge section is wrong. Verify every claim against the Flutter `lib/` and `~/github/QuizSubmissions/src`. Confirm no event is missing and none is invented. Return PASS or FAIL(reasons)." Record result.
Expected: PASS. If FAIL, fix and re-run. Log any client-vs-server surprise in `ISSUES.md`.

- [ ] **Step 5: Wrong-direction check**

Confirm: the contract distinguishes client vs server events and does NOT assume the Flutter client set is complete. If it does, STOP and fix.

- [ ] **Step 6: Commit**

```bash
git add docs/reference/tracking-contract.md docs/reference/ISSUES.md
git commit -m "Phase 0: resolve authoritative Converge event set (client+server)"
```

---

### Task 3: Complete the tracking/webhook/checkout contract + machine-readable event sequence

**Files:**
- Modify: `docs/reference/tracking-contract.md` (add GA/GTM, webhook, checkout sections)
- Create: `docs/reference/golden-events.json`
- Create: `docs/reference/cdp-coupon-map.md`

- [ ] **Step 1: Extract GA/GTM + webhook + checkout from the Flutter client**

Dispatch a subagent to read `track_g_a_event.dart`, `webhook_call_quiz_profile.dart`, `redirect_to_checkout.dart`, and every call site in `lib/`. Output, with file:line: all 16 GA event names (preserve exact spacing incl. `Go to  checkout` two-space), the fixed+optional param keys, the webhook URL + `X-Webhook-Secret` + payload shape, and the checkout param construction + coupon derivation.

- [ ] **Step 2: Write the contract sections + apply the corrections**

Add `## GA / GTM events`, `## Submission webhook`, `## Checkout redirect` to `tracking-contract.md`. Apply the two Toby-confirmed corrections: checkout base = `https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/` (NOT `-59`); canonical webhook = the Worker (NOT Make, unless Task 2 proved Make is the real path — if so, record both with their roles).

- [ ] **Step 3: Write `cdp-coupon-map.md`**

From `app_state.dart` (`cdpMapping`) and `redirect_to_checkout.dart`: a table of questionId → {acField, mpField} and a table of answerId → coupon tag (`concern_hairloss→c_hl`, `concern_damage|concern_splitends→c_dh`, `concern_scalp→c_si`, `diet_custom|diet_balanced→d_bc`, else `o_df`). Cite file:line.

- [ ] **Step 4: Write `golden-events.json` (the Playwright fixture)**

Encode the expected ordered event sequence for ONE canonical happy-path walkthrough (a fixed set of answers, defined inline). Shape:
```json
{
  "walkthrough": "canonical-happy-path",
  "answers": { "hairGoal": ["goal_both"], "hairConcern": ["concern_hairloss"], "diet": ["diet_balanced"] },
  "expectedEvents": [
    { "step": "start", "channel": "ga", "event": "Quiz Viewed", "params": { "event_category": "Quiz", "position": 0 } }
  ],
  "expectedWebhook": { "url": "https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit", "headerKeys": ["X-Webhook-Secret"], "bodyKeys": ["name","firstName","lastName","email","quizData","activeCampaign","mixpanel"] },
  "expectedCheckout": { "base": "https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/", "params": ["billing_email","billing_first_name","billing_last_name","aero-coupons","__cvg_uid","__cvg_sid"], "coupon": "c_hl" }
}
```
The subagent fills `expectedEvents` with the full ordered sequence for the chosen answers, derived from the contract.

- [ ] **Step 5: QC gate (adversarial)**

Fresh subagent: "Verify every event name, param key, URL, secret-key-name, and coupon mapping in `tracking-contract.md`, `golden-events.json`, and `cdp-coupon-map.md` appears verbatim in the cited Flutter/Worker sources. Confirm the two-space `Go to  checkout` is present and distinct from the one-space variant. Confirm the checkout base has no `-59`. Return PASS/FAIL(reasons)."
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add docs/reference/tracking-contract.md docs/reference/golden-events.json docs/reference/cdp-coupon-map.md
git commit -m "Phase 0: complete tracking/webhook/checkout contract + event fixture"
```

---

### Task 4: Behavioral spec — screen-by-screen

**Files:**
- Create: `docs/reference/quiz-flow.md`

- [ ] **Step 1: Extract the live flow**

Dispatch a subagent to read `lib/pages/home_page/home_page_widget.dart` (the real PageView) plus the templates it instantiates. Output the ordered ACTIVE screens (idx 0→19; exclude dead 21/22/23). For each screen record, with file:line: human label, screen `type` (single/image/multi/rating/pitch/loading/email-capture/result), `progression` (`auto` for single-select; `cta` for multi/pitch/rating/reveal), `questionId` + stable `answerId`s, the prompt text (and any answer-keyed variants), any `reveal` text rule, the tracking event(s) bound to view/answer/continue, and whether content must fit-to-viewport (all except dashboard).

- [ ] **Step 2: Capture the conditional-content rules as data**

For each screen with answer-dependent copy (e.g. idx 5 prompt by `hairConcern`; idx 13 pitch by `currentRoutine`×`hairConcern`), express the rule as an explicit lookup table in `quiz-flow.md` (inputs → output string), flattening the Flutter nested conditions. Note where Flutter kept copy generic due to the dropped multi-select combination logic (mark as "generic today; combination-capable in new engine").

- [ ] **Step 3: Acceptance criteria**

`quiz-flow.md` lists exactly the active screens in order; every screen has type + progression + tracking binding + fit-to-viewport flag; every conditional copy block is a table, not prose.

- [ ] **Step 4: QC gate (adversarial)**

Fresh subagent: "Verify the screen list, order, types, progression modes, and conditional tables against `home_page_widget.dart` and the templates. Confirm dead screens 21/22/23 are excluded and the count of active screens matches a real linear walkthrough 0→19. Return PASS/FAIL(reasons)."
Expected: PASS. Log mismatches in `ISSUES.md`.

- [ ] **Step 5: Commit**

```bash
git add docs/reference/quiz-flow.md docs/reference/ISSUES.md
git commit -m "Phase 0: screen-by-screen behavioral spec with conditional tables"
```

---

### Task 5: Visual golden reference — per-screen mobile screenshots

**Files:**
- Create: `docs/reference/golden/NN-<screen-id>.png` (one per screen)
- Modify: `docs/reference/quiz-flow.md` (link each screen to its screenshot)

- [ ] **Step 1: Walk + capture the live quiz at a mobile viewport**

Using Playwright or chrome-devtools MCP, open `https://join.hairqare.co/the-quiz-haircare` at a mobile viewport (e.g. 390×844). Step through the canonical happy-path answers from `golden-events.json`, screenshotting each screen (including reveal-text and multi-select min-1 CTA states, the skip modal, loading, dashboard, and the floating timer). Save as `docs/reference/golden/NN-<screen-id>.png`.

- [ ] **Step 2: Cross-check live vs latest source of truth**

The live path may lag the FlutterFlow export (the true latest). Note in `ISSUES.md` any screen where the live render appears to differ from `quiz-flow.md` (derived from the export). Flag for Toby; do not silently trust either.

- [ ] **Step 3: Link screenshots into the flow doc**

In `quiz-flow.md`, add each screen's screenshot path so the behavioral spec and the visual reference are cross-linked.

- [ ] **Step 4: Acceptance criteria**

One screenshot per active screen + key states (reveal, multi-select-enabled CTA, skip modal, dashboard, timer); all at the mobile viewport; each linked from `quiz-flow.md`; live-vs-export differences logged.

- [ ] **Step 5: QC gate**

Fresh subagent: "Confirm every active screen in `quiz-flow.md` has a corresponding screenshot file and link, and that the captured states include reveal text, the multi-select Continue-enabled state, the skip modal, and the dashboard+timer. Return PASS/FAIL(reasons)."
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add docs/reference/golden docs/reference/quiz-flow.md docs/reference/ISSUES.md
git commit -m "Phase 0: per-screen mobile golden screenshots + cross-links"
```

---

### Task 6: Phase 0 sign-off

**Files:**
- Modify: `docs/reference/README.md` (add a "Verified" checklist + open issues summary)

- [ ] **Step 1: Consolidate**

Summarize in `README.md`: each artifact, its QC status (PASS), and a digest of unresolved `ISSUES.md` rows (e.g. any live-vs-export visual diffs, any Make-vs-Worker nuance) that Phase 1 must account for.

- [ ] **Step 2: Whole-phase QC gate**

Dispatch a fresh subagent to confirm: all six artifacts exist, every QC gate passed, no wrong-direction signal is unresolved, and no artifact cites quiz-34 as authority. Return PASS/FAIL(reasons).

- [ ] **Step 3: Human checkpoint**

Present the golden reference to Toby for review. Phase 1 planning does not begin until he approves and the open Converge/visual items are resolved.

- [ ] **Step 4: Commit**

```bash
git add docs/reference/README.md
git commit -m "Phase 0: golden reference sign-off"
```

---

## Self-Review

**Spec coverage (against the design doc):**
- §4 contract → Tasks 2–3 (incl. corrected checkout URL, Worker webhook, two-space event). ✓
- Converge criticality (Toby) → Task 2 (top priority, client+server). ✓
- §6/§6a spec, progression, reveal, multi-select arrays, combination conditionals, fit-to-viewport → Task 4 captures all as the behavioral reference. ✓
- Fidelity-first visual reference → Task 5. ✓
- CDP/coupon maps → Task 3 (`cdp-coupon-map.md`). ✓
- Verification harness fixture (`golden-events.json`) → Task 3, feeds Phase 1/3. ✓
- QC-agent verification + failsafes + wrong-direction detection (Toby's explicit ask) → cross-cutting protocol + a QC gate in every task. ✓
- Non-goals (no app code, no quiz-34 reuse, no localization) → honored; Phase 0 is analysis only. ✓

**Placeholder scan:** No "TBD/handle edge cases" — each task has concrete deliverables, sources, and acceptance criteria. The one intentional fill-in (`golden-events.json` `expectedEvents` body) is explicitly derived from the contract within the same task, not deferred. ✓

**Type/name consistency:** Artifact filenames, event names, the checkout base (`…save-85-5/`, no `-59`), and the Worker URL are used identically across tasks and match `tracking-contract.md`. ✓

**Note:** Phase 0 is reference-building, so classic red-green TDD is replaced by draft → adversarial-QC-gate per task. Phases 1+ (code) use full TDD; their plans are written after this phase's artifacts are verified.
