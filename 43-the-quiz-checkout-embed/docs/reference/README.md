# Golden Reference (Phase 0)

Authoritative, QC-verified description of the **current** quiz. These artifacts are the acceptance criteria for the rebuild.

**Sources of truth:** Flutter export (`~/github/Flutter Quiz Raw/QuizV2-flutterflow/lib`), the FlutterFlow project export (`…_yamls`), the submission Worker (`~/github/QuizSubmissions/src`), and the live quiz `https://join.hairqare.co/the-quiz-haircare`.

## Files
- `tracking-contract.md` — event/webhook/checkout contract (client + server)
- `golden-events.json` — expected event sequence for the canonical happy-path walkthrough (Playwright fixture for Phase 1/3)
- `quiz-flow.md` — screen-by-screen behavioral spec (type, progression, prompt, answers, conditional tables, reveal, tracking bindings, fit-to-viewport flags)
- `cdp-coupon-map.md` — questionId → {acField, mpField}; answerId → coupon tag
- `golden/` — per-screen mobile screenshots of the live quiz
- `ISSUES.md` — discrepancies / wrong-direction signals

## Rules
- Every claim cites a source (`file:line` or URL).
- `holinic-webflow/34-the-quiz-haircare` (the prior React attempt) is **research-only**, never an authority.
- Once an artifact passes its QC gate and is committed, later work treats it as read-only truth.

---

## Phase 0 — Verified status (sign-off)

All five analysis tasks complete; each artifact passed an independent adversarial QC gate against ground-truth source.

| Artifact | QC | Notes |
|---|---|---|
| `tracking-contract.md` — Converge | ✅ PASS | 3 events total: client `$page_load` + `Completed Quiz`; **Worker `Signed Up`** (direct to `app.runconverge.com`, NOT Make). `Quiz Started`/`Quiz Completed` are GA-only. |
| `tracking-contract.md` — GA/webhook/checkout | ✅ PASS | 16 GA events incl. distinct two-space `Go to  checkout`; webhook → Worker; checkout base corrected to `…save-85-5/`. |
| `cdp-coupon-map.md` | ✅ PASS | 15 CDP rows (incl. `field_56` crossover quirk); coupon map verified. |
| `golden-events.json` | ✅ PASS | Valid JSON; canonical happy-path fixture for Phase 1/3 Playwright. |
| `quiz-flow.md` | ✅ PASS | 20 active screens (0→19); dead 21/22/23 excluded; 5×5 routine×concern matrix verified. |
| `golden/` screenshots | ✅ PASS | 22 mobile screenshots (0→18 + skip modal, multi-select-enabled, reveal). |

### Carry-forward into Phase 1 (verified facts that override the export)
- **idx 10 (shampoo spend)** is `cta` (reveal-then-Continue), not `auto`. idx 9 (diet) IS auto — do not conflate. (ISSUES #6)
- **Multi-selects (idx 11, 12)** have a template-injected **"None of the above"** that clears other picks, records answer `'n/a'`, and advances. (ISSUES #7)
- **Rating screens (idx 14, 15)** record + advance on a single tap (functionally auto, though each option is its own button).
- Source strings use curly apostrophes (U+2019) — preserve exactly if copy parity matters.

### Open / deferred items (non-blocking for Phase 1)
- **ISSUES #2** — confirm no *additional* server-side Converge events exist in Make / the Converge dashboard (owner).
- **ISSUES #3** — confirm the live `-59` checkout slug is not an intentional cart variant (owner); rebuild uses the corrected base regardless.
- **ISSUES #8** — dashboard/result (19), final pitch (20), floating timer screenshots **deferred** pending a safe capture path (staging URL, local export build, or owner-approved tagged test submission).
