# Tracking Contract (authoritative)
> Phase 0 golden reference. Every claim cites a source. Must be preserved byte-for-byte by the rebuild.

## Converge (CVG) — authoritative

Converge fires from **two independent origins** for the current Hairqare quiz: the Flutter **web client** (browser, via the `cvg`/`trackEvent` bridge) and the **submission Worker** (server side, direct HTTPS call to Converge). They are independent — there is no Make.com hop for Converge.

### Transport

**Client transport (browser).** Converge is loaded and initialized in the web publishing header. A global `trackEvent(eventName, properties, eventId, profileProperties, aliases)` wrapper forwards to `window.cvg({ method: "event", event, properties, eventId, profileProperties, aliases })`. The CVG pixel script and proxy are configured there too.
- `trackEvent` wrapper definition + `window["cvg"]({method:"event",...})` forwarding — `holistic-haircare-plan-quiz27-vhmit6_yamls/web-publishing.yaml:4` (within `customHeaders`, `function trackEvent(...)` block).
- CVG pixel load: `<script src="https://hairqare.co/cvg/static/pixels/PmzQC4.js" async>` — `web-publishing.yaml:4`.
- CVG stub + proxy config: `cvg({method:"proxy", tracking:"https://hairqare.co/cvg", static:"https://hairqare.co/cvg/static"})` — `web-publishing.yaml:4`.
- Auto page-load track: `cvg({method:"track", eventName:"$page_load"})` — `web-publishing.yaml:4`.

The Dart client reaches Converge by calling the JS `trackEvent` global via `js.context.callMethod('trackEvent', [...])`, guarded by `js.context.hasProperty('trackEvent')`.
- `webhook_callcvg.dart:53` (existence guard) and `webhook_callcvg.dart:61` (the `callMethod('trackEvent', ...)`).

**Server transport (Worker).** The Worker POSTs JSON directly to the Converge webhook API with an `X-Webhook-Token` header. No Make.com involvement.
- Endpoint constant `https://app.runconverge.com/api/webhooks` — `QuizSubmissions/src/services/converge.service.ts:5`.
- `fetch(... method:'POST', headers:{'X-Webhook-Token': env.CONVERGE_WEBHOOK_TOKEN}, body: JSON.stringify(payload))` — `converge.service.ts:69-76`.
- Token binding `CONVERGE_WEBHOOK_TOKEN` — `QuizSubmissions/src/types/env.ts:19`; set as a Worker secret — `QuizSubmissions/wrangler.toml` (Secrets list).

### Every Converge event across the whole system

| Event name (exact) | Origin | Exact payload / args | Trigger | Source citation |
|---|---|---|---|---|
| `$page_load` | Client (CVG init header, auto) | `cvg({method:"track", eventName:"$page_load"})` — no custom properties | Fires automatically on every web page load, once the CVG stub/proxy are configured | `web-publishing.yaml:4` |
| `Completed Quiz` | Client (`webhook_callcvg.dart` → `trackEvent` → `cvg`) | `event="Completed Quiz"`; `properties={ answers:[{questionId, answerIds}...], name:<fullName>, firstName, lastName, email }`; `eventId=null`; `profileProperties={ "$email": <email> }`; `aliases=["urn:email:<email>"]` | On the contact-details submit button (`submitAction`), after `webhookCallQuizProfile()`. Returns early (no event) if `quizProfile` or `submittedContactDetails` is null, or if `window.trackEvent` is absent | call site `home_page/home_page_widget.dart:1243`; event name + payload `webhook_callcvg.dart:61-75`; null guards `webhook_callcvg.dart:23-29`; `trackEvent`-exists guard `webhook_callcvg.dart:53` |
| `Signed Up` | **Worker** (`converge.service.ts`, server side) | `{ event_name:"Signed Up", event_id:<uuid>, properties:{ $first_name, $last_name, $email:<lowercased/trimmed>, $is_new_customer:true, $sales_channel_type:"web", ...mixpanel properties }, profile_properties:{ $first_name, $last_name, $email }, aliases:["urn:email:<email>"] }` | Fired from the queue consumer when processing a stored submission (Step 4 of `processQuizSubmission`), after Mixpanel + ActiveCampaign steps. Triggered by `POST /api/v1/quiz/submit` → D1 insert → queue → `processQuizSubmission` | payload `converge.service.ts:46-63`; call `quizProcessor.ts:121-127`; queue/submit chain `routes/quiz.ts:78-85` + `index.ts:65-93` |

Notes:
- The `...properties` spread into the `Signed Up` event (`converge.service.ts:51-55`) is the `payload.mixpanel` object — the Mixpanel-property map the client builds (e.g. `Hair Goal`, `Age Cohort`, `hairMyth`, ...). Its shape is defined by `MixpanelPropertiesSchema` — `QuizSubmissions/src/schemas/webhook.schema.ts:36-50`, and the client populates it in `docs/flutterflow-integration.md` (`webhookCallQuizProfile`, payload field `mixpanel`).
- A second, unused helper `sendConvergeEvent(email, eventName, properties, env)` exists for future custom events — `converge.service.ts:101-138`. It is NOT called anywhere in the current flow (only `sendConvergeSignUpEvent` is invoked, `quizProcessor.ts:121`), so it fires no event today.

### (A) vs (B) Worker determination — RESOLVED: (A), the Worker fires Converge

**Outcome (A): the Worker fires Converge directly.** This contradicts the project owner's prior hypothesis that server-side Converge is handled by Make.com. The Worker's queue processor calls `converge.sendConvergeSignUpEvent(...)` (`quizProcessor.ts:121-127`), which POSTs a `Signed Up` event straight to `https://app.runconverge.com/api/webhooks` (`converge.service.ts:5, 36-95`). Make.com is not in this path.

**Architectural consequence for the rebuild.** Because the live server-side Converge event (`Signed Up`) originates in the Worker — not in the web client and not in Make — the rebuilt web app must:
1. Continue to send a **byte-identical submit payload to the same Worker endpoint** (`POST https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit`, `X-Webhook-Secret` header), so the Worker keeps emitting `Signed Up` with the same shape (`docs/flutterflow-integration.md:27-30, 102-109`). The Worker is the source of truth for `Signed Up`; the rebuild replicates the **call to the Worker**, not a re-implementation of the Converge call.
2. **NOT re-fire `Signed Up` (nor `Quiz Started`/`Quiz Completed`) client-side as a Converge event.** A prior React attempt wrongly fired quiz-lifecycle events client-side; doing so would double-count, because the Worker already fires `Signed Up`. The only Converge events the client may fire are `$page_load` (auto, from the CVG init header) and `Completed Quiz` (on submit) — exactly as the current Flutter client does.

> Even though (A) holds, whether `Signed Up` is additionally *re-shaped or fanned out* downstream of Converge (or whether a separate Make scenario also writes to Converge) cannot be confirmed from this repo. This is logged as a non-blocking dependency in ISSUES.md.

### Are `Quiz Started` / `Quiz Completed` real Converge events? — NO

`Quiz Started` and `Quiz Completed` are **NOT Converge events**. They are **Google Analytics / GTM (dataLayer) events**, fired via the `trackGAEvent(...)` custom action, which pushes to `window.dataLayer` (with a `gtag('event', ...)` fallback) — it never touches `cvg`/`trackEvent`/Converge.
- `trackGAEvent` implementation pushes to `dataLayer` / `gtag` only — `track_g_a_event.dart:61-88` (no `cvg` reference anywhere in the file).
- `Quiz Started` call sites: `templates/image_background_ques_body/image_background_ques_body_widget.dart:405, 540, 700, 761` and `templates/image_background_ques_body_v3/image_background_ques_body_v3_widget.dart:551, 793, 1012` — all `await actions.trackGAEvent('Quiz Started', ...)`.
- `Quiz Completed` call site: `email_template/login_component/login_component_widget.dart:52-59` — `await actions.trackGAEvent('Quiz Completed', ...)`.

**Summary of the lifecycle answer:** The only quiz-completion signal that reaches Converge is the client's `Completed Quiz` event (note: `Completed Quiz`, not `Quiz Completed`) plus the Worker's `Signed Up` event. `Quiz Started`/`Quiz Completed` are GA-only and must NOT be ported to Converge in the rebuild.

### Client Converge set is NOT assumed complete

The Flutter client's Converge surface was verified by grepping all of `QuizV2-flutterflow/lib/` for `webhookCallcvg`, `trackEvent`, `cvg(`, and `callMethod('trackEvent'`. The only client→Converge paths found are: the CVG init header's `$page_load` (`web-publishing.yaml:4`) and `webhook_callcvg.dart`'s `Completed Quiz` (one call site, `home_page_widget.dart:1243`). The export wiring is `custom_code/actions/index.dart:11`. No other client Converge call sites exist in `lib/`. The server set (`Signed Up`) is documented separately above from the Worker source, so the contract does not treat the client set as the whole system.

---

## GA / GTM events

All GA/GTM events fire through the single custom action `trackGAEvent(eventName, questionId, question, selectedAnswer, name, email)` — `Flutter Quiz Raw/QuizV2-flutterflow/lib/custom_code/actions/track_g_a_event.dart:14-22`. There is no other GA entry point in `lib/` (grep of `trackGAEvent` across `lib/` returns this action + its call sites only).

### Transport

- **Primary:** push to `window.dataLayer` — `dataLayer.callMethod('push', [jsParams])`, guarded by `js.context.hasProperty('dataLayer')` — `track_g_a_event.dart:64-73`.
- **Fallback:** if `dataLayer` is absent (or the push throws), `gtag('event', eventName, params)` — `track_g_a_event.dart:82-85`.
- All failures are swallowed (`print` only) — `track_g_a_event.dart:78-93`. GA is best-effort and never blocks the flow.

### Params (every event)

Built in `track_g_a_event.dart:31-53`.

**Fixed params (always present):**

| Param | Value | Source |
|---|---|---|
| `event` | the `eventName` arg (the GA event name) | `track_g_a_event.dart:32` |
| `event_category` | constant string `'Quiz'` | `track_g_a_event.dart:33` |
| `position` | `FFAppState().quizIndex` (int, current quiz step index) | `track_g_a_event.dart:27,34` |
| `selected_answer` | `selectedAnswer ?? []` (always set, defaults to empty list) | `track_g_a_event.dart:49` |

**Optional params (added only when non-null / non-empty):**

| Param | Condition | Source |
|---|---|---|
| `question_id` | `questionId != null` | `track_g_a_event.dart:38` |
| `question` | `question != null` | `track_g_a_event.dart:39` |
| `q_name` | `name != null && name.isNotEmpty` | `track_g_a_event.dart:52` |
| `q_email` | `email != null && email.isNotEmpty` | `track_g_a_event.dart:53` |

> Note: the 3rd positional arg (`question`) is frequently overloaded as a free-text **label/context** for non-question events (e.g. `'Result Page'`, `'Contact Details Form'`, the Pitch labels) — it lands in the `question` param regardless. An `answer` param exists in the action but is commented out (`track_g_a_event.dart:41-46`) — it never fires today.

### Event property rules — REBUILD CORRECTIONS (what the live React quiz does, and why)

The Flutter original has two tracking defects that corrupt the GTM data, plus a noisy
view event. The React rebuild (`src/tracking/track.ts`, `src/store/quizStore.ts`) **fixes**
all three — it is deliberately MORE correct than Flutter here, while keeping every event
NAME and the `event_category:'Quiz'` + `position` contract intact (so GTM needs no
changes). **Every quiz built in this engine MUST follow these rules**; the e2e
`golden.spec.ts` enforces them against `golden-events.json`.

1. **`position` = the RAW screen index (0-based) — NOT a question count.**
   `position` is the screen's index in `spec.screens` (== Flutter's `FFAppState().quizIndex`,
   the PageView page index — see the "Fixed params" table above). EVERY screen — questions,
   pitches, loading, email, result — gets its OWN distinct position.
   - *Bug it fixes:* an interim React build passed `questionPosition` (a count of only
     question screens) as the position, so each pitch/result REUSED the preceding question's
     number (e.g. the first pitch and the question before it both reported `position 6`).
   - *Implementation:* the store passes `index` (NOT `questionPosition(spec, index)`) to
     `trackGAEvent`. `questionPosition` survives ONLY for the visible progress bar
     ("Question X of Y") — never for tracking.

2. **Every event RESETS its per-event props so GTM can't carry stale values.**
   GTM's Data Layer Variables persist across pushes: a key you OMIT keeps its previous
   value. So `trackGAEvent` ALWAYS sets `question_id` (`''` when N/A), `question` (`''`
   when N/A) and `selected_answer` — the answer array on a `Question Answered`, else
   **`null`**. (null, NOT `[]`: GTM merges arrays by index, so `[]` leaves a prior
   non-empty array in place; `null` overwrites and clears it.)
   - *Bug it fixes:* Flutter only adds `question_id`/`question` when non-null
     (`track_g_a_event.dart:38-39`) and pushes `[]` for `selected_answer`, so its
     `Continued From Pitch` / `Viewed Results Page` events inherit the LAST question's
     `question_id` + `selected_answer` straight out of GTM's dataLayer.

3. **`Quiz Viewed` fires EXACTLY ONCE — on the first screen, before any interaction.**
   It is the "landed on the quiz" event. The cover then fires `Quiz Started` on the Start
   tap; per-question screens fire only their `Question Answered`; pitches fire only
   `Continued From Pitch`.
   - *Bug it fixes:* Flutter fired `Quiz Viewed` on every screen's mount
     (`image_background_ques_body...:85`), double-counting funnel entry.

4. **Back-navigation + changing an answer REPLACES, never appends.**
   `recordSingle` overwrites the question's array with `[newAnswer]`; multi `toggleMulti`
   is a set (no duplicates). Re-answering re-fires `Question Answered` with ONLY the new
   selection, and because conditions, FB-enrichment and the webhook payload all read the
   SAME answer state, every downstream system sees only the new answer.

Per-screen property summary (long-hair-v1; `position` = the raw screen idx):

| Screen (idx) | Event | position | question_id | question | selected_answer |
|---|---|---|---|---|---|
| cover (0) | `Quiz Viewed` | 0 | `''` | `''` | `null` |
| cover (0) | `Quiz Started` | 0 | `quizStart` | cover prompt | `null` |
| question (n) | `Question Answered` | n | the questionId | the prompt | `[answerId,…]` |
| pitch (n) | `Continued From Pitch` | n | `''` | pitch label | `null` |
| email (17) | `Quiz Completed` | 17 | `''` | `Contact Details Form` | `null` |
| email (17) | `Quiz Submitted` | 17 | `''` | `''` | `null` (+`q_name`/`q_email`) |
| result (18) | `Viewed Results Page` | 18 | `''` | `Result Page` | `null` |
| result (18) | `Go to  checkout` | 18 | `''` | `''` | `null` |

(Answer/completion/checkout events ALSO carry the additive `spec.eventEnrichment` keys —
`hairConcern`/`age` — for FB targeting; those are extra keys, not part of this table.)

> **Benign `dataLayer` duplication — NOT a double-count.** On the live page each GA
> event appears **twice in `window.dataLayer`** (an artifact of gtag `G-15HXMXW4HW` and
> GTM `GTM-TT5MJDF` sharing the same `dataLayer`, exactly as on the Flutter quiz). Both
> entries carry the **same `gtm.uniqueEventId`**, so GTM processes the event **once** and
> Mixpanel/Converge receive it **once** — there is no double-count. Do NOT "fix" this by
> de-duping in the app: the app pushes each event exactly once (verified: `next()` /
> answer-recording run once), and GTM keys off `gtm.uniqueEventId`. When QA'ing live, count
> **distinct `gtm.uniqueEventId`s**, not raw array entries.

### Distinct GA event names (exact spelling/spacing)

Verified by grepping every `trackGAEvent(` call site in `lib/` and reading the first string arg. Note the TWO distinct checkout events: `Go to  checkout` (two spaces between "to" and "checkout") and `Go to checkout` (one space) — they are different strings and both fire in production.

| Event name (EXACT) | `question`/label arg | `question_id` | Firing location (file:line) | Quiz step / context |
|---|---|---|---|---|
| `Quiz Viewed` | the question text | the questionId | `templates/image_background_ques_body/image_background_ques_body_widget.dart:85`; `templates/image_background_ques_body_v3/image_background_ques_body_v3_widget.dart:95` | On-load of the cover/first-question template (postFrame callback) |
| `Quiz Started` | the question text | the questionId | `templates/image_background_ques_body/..._widget.dart:405,540,700,761`; `templates/image_background_ques_body_v3/..._widget.dart:551,793,1012` | Fired together with the first `Question Answered`, when the user answers the first quiz question (`hairGoal`) |
| `Question Answered` | the question text | the questionId | `templates/image_background_ques_body/..._widget.dart:413,548,708,769`; `templates/image_background_ques_body_v3/..._widget.dart:559,801,1020`; `templates/question_answer/..._widget.dart:176`; `templates/titles_and_description_ans_body/..._widget.dart:211`; `templates/single_choice_question_large_image/..._widget.dart:244`; `templates/single_choice_question_smalllmage/..._widget.dart:291`; `templates/multi_choice_with_image_question_check_box/..._widget.dart:515,628`; `pages/home_page/home_page_widget.dart:648,1059,1103,1335` | Once per question answered, on the answer/next tap |
| `Quiz Back` | `''` | `''` | `header/header_with_progress_bar/header_with_progress_bar_widget.dart:120` | Back button in the progress-bar header |
| `Continued From Pitch` | `Damage Pitch` / `Holistic Pitch` / `Damage Practices Pitch` | `''` | `pages/home_page/home_page_widget.dart:489` (`Damage Pitch`), `:573` (`Holistic Pitch`), `:1032` (`Damage Practices Pitch`) | Continue tap on each of the three interstitial pitch screens |
| `Opened Skip Dialog` | `''` | `''` | `pages/home_page/home_page_widget.dart:169,1386` | Skip link tapped on a question |
| `Closed Skip Dialog` | `''` (label arg empty) | `''` | `dashboard/skip_dialog/skip_dialog_widget.dart:41,96,185` | Skip dialog dismissed/closed |
| `SkipQuiz` | label arg | `''` | `dashboard/skip_dialog/skip_dialog_widget.dart:264` | User confirms skipping the quiz |
| `Opened Plan Details` | label arg | `''` | `dashboard/final_pitch/final_pitch_widget.dart:1885`; `components/floating_timer_dialog_box_widget.dart:189` | Opens the plan-details dialog |
| `Closed Plan Details` | label arg | `''` | `dashboard/pitch_plan_dialog/pitch_plan_dialog_widget.dart:51,113`; `dashboard/pitch_plan_dialog_copy/pitch_plan_dialog_copy_widget.dart:54,101` | Closes the plan-details dialog |
| `Viewed Results Page` | label arg | `''` | `dashboard/final_pitch/final_pitch_widget.dart:55`; `dashboard/final_pitch_copy/final_pitch_copy_widget.dart:52`; `dashboard/dashboard/dashboard_widget.dart:68` | Results/dashboard screen viewed |
| `Quiz Completed` | `Contact Details Form` | `''` | `email_template/login_component/login_component_widget.dart:53` | On-load (postFrame) of the contact-details form (GA only — NOT the Converge `Completed Quiz`) |
| `Quiz Submitted` | label arg | `''` | `email_template/login_component/login_component_widget.dart:624` | Contact-details submit |
| `Go to  checkout` (TWO spaces) | `Result Page` | `''` | `pages/home_page/home_page_widget.dart:1273,1286`; `dashboard/pitch_plan_dialog/pitch_plan_dialog_widget.dart:681` | "Start my challenge" / "Reserve my seat" CTA on the results page → fires immediately before `redirectToCheckout()` |
| `Go to checkout` (ONE space) | label arg | `''` | `components/floating_timer_checkout_widget.dart:234` | Floating-timer checkout CTA → precedes `redirectToCheckout()` |
| `Go to next checkout step` | label arg | `''` | `dashboard/pitch_plan_dialog_copy/pitch_plan_dialog_copy_widget.dart:738` | Plan-dialog (copy variant) checkout CTA |

> Both `Go to  checkout` (two-space) and `Go to checkout` (one-space) MUST be reproduced byte-for-byte in the rebuild — they are distinct GA event names in the live data, not a typo to "fix".

---

## Submission webhook

The canonical quiz submission goes to the **Worker**, not Make. Sent from `webhook_call_quiz_profile.dart` via `http.post` (fire-and-forget, `catch` is silent — `webhook_call_quiz_profile.dart:101-103`).

- **URL:** `https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit` — `webhook_call_quiz_profile.dart:18-19`; Worker route `QuizSubmissions/src/routes/quiz.ts:23-24` (`POST /submit`, mounted under `/api/v1/quiz`).
- **Method:** `POST`.
- **Auth header:** `X-Webhook-Secret: <secret>` — sent at `webhook_call_quiz_profile.dart:95-98`; validated server-side at `QuizSubmissions/src/middlewares/auth.ts:8` (`c.req.header('X-Webhook-Secret')` vs `env.WEBHOOK_SECRET`). Also `Content-Type: application/json`.

### Body shape

Built at `webhook_call_quiz_profile.dart:76-91`:

```jsonc
{
  "name": "<full name>",                  // contactDetails.name, title-cased — :77
  "firstName": "<first token of name>",   // :62-70,78
  "lastName": "<rest of name, may be ''>",// :63-70,79
  "email": "<email>",                     // :80
  "quizData": {
    "rawAnswers": [                        // :82-87
      { "questionId": "<id>", "answerIds": ["<id>", ...] }
    ]
  },
  "activeCampaign": {                      // :89; built :32,44-47
    "field_<acId>": "<answerIds joined by ', '>"
  },
  "mixpanel": {                            // :90; built :33,49-55,73-74
    "<mpField>": "<answerId string OR array if multi-select>",
    "$name": "<full name>",
    "$email": "<email>"
  }
}
```

- `activeCampaign` keys are `field_<acField>` where `acField` comes from `cdpMapping` and only included when `acField > 0` (`webhook_call_quiz_profile.dart:44-47`). See `cdp-coupon-map.md` Table A.
- `mixpanel` values are a single string for single-answer questions, an array for multi-select (`webhook_call_quiz_profile.dart:50-55`), plus the literal `$name` / `$email` keys (`:73-74`).
- The Worker validates this with `QuizWebhookPayloadSchema` — `QuizSubmissions/src/schemas/webhook.schema.ts:62-86` (`firstName` required; `lastName`/`name`/`quizData`/`activeCampaign`/`mixpanel` optional; both AC and MP schemas `.passthrough()`).

### Worker downstream (server side)

On receiving the POST, the Worker stores to D1, returns `202`, and queues async processing (`routes/quiz.ts:68-98`). The queue consumer `processQuizSubmission` runs, in order (`QuizSubmissions/src/queue/quizProcessor.ts`):

1. **Mixpanel** profile upsert — `quizProcessor.ts:65-82` (`mixpanel.upsertMixpanelProfile`).
2. **ActiveCampaign** contact upsert + tag (`LEAD_V2` for EN, `LEAD_ES` + lists for ES) — `quizProcessor.ts:84-116`.
3. **Converge** `Signed Up` event → `https://app.runconverge.com/api/webhooks` — `quizProcessor.ts:118-136` (`converge.sendConvergeSignUpEvent`), see the Converge section above. Each step is independently try/caught so a failure in one does not block the others.

---

## Checkout redirect

Implemented in `redirect_to_checkout.dart` (`redirectToCheckout()`), invoked from 6 call sites (`pitch_plan_dialog_widget.dart:688`, `skip_dialog_widget.dart:271`, `pitch_plan_dialog_copy_widget.dart:745`, `floating_timer_checkout_widget.dart:241`, `home_page_widget.dart:1280,1293`). It builds a URL and sets `window.location.href`.

### Base URL

| | Value | Source |
|---|---|---|
| **Live value (WRONG — has `-59`)** | `https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5-59/` | `redirect_to_checkout.dart:22` (and the catch fallback `:168`) |
| **Canonical / corrected (NO `-59`)** | `https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/` | per Phase 0 correction — the rebuild MUST use this base |

> The live Flutter code hardcodes the `-59` slug in two places (`:22`, `:168`). The rebuild must emit the corrected no-`59` base. This discrepancy is logged in ISSUES.md.

### Appended query params (in build order)

Built at `redirect_to_checkout.dart:35-161`, joined with `&` and appended after `?` (`:160-161`). Order:

| # | Param | Condition / source | Source |
|---|---|---|---|
| 1 | `billing_email` | if email non-empty; `Uri.encodeComponent` | `:38-41` |
| 2 | `billing_first_name` | if first name non-empty | `:43-47` |
| 3 | `billing_last_name` | if last name non-empty | `:49-53` |
| 4 | `aero-coupons=<tag>` | coupon tag from answers; default `o_df`; on any error in the coupon block, defaults to `aero-coupons=o_df` | `:55-91` (see `cdp-coupon-map.md` Table B) |
| 5 | `__cvg_uid` | from cookie `__cvg_uid`, fallback to URL query param `__cvg_uid`; appended only if non-empty | `:93-124` |
| 6 | `__cvg_sid` | from cookie `__cvg_sid`, fallback to URL query param `__cvg_sid`; appended only if non-empty | `:126-157` |

`__cvg_uid` / `__cvg_sid` are read via `jsEval` of an IIFE that checks `document.cookie` first, then `new URLSearchParams(window.location.search)` (`:96-113`, `:129-146`).

### `redirect_to_checkout_scalp.dart` — DEAD CODE

`redirectToCheckoutScalp()` has **no call sites** in `lib/` (grep of `redirectToCheckoutScalp` across `lib/` returns only its definition in `redirect_to_checkout_scalp.dart` and the `index.dart` export). It uses a different base (`...-85-5-37-copy-3/`) and a `session_id` param instead of `__cvg_sid`. It is dead and MUST NOT be ported to the rebuild.
