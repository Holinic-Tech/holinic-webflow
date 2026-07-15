# Quiz Flow — Screen-by-Screen Behavioral Spec (authoritative)

> Phase 0 golden reference. Describes the CURRENT quiz exactly so the rebuild can reproduce it. Every claim cites a ground-truth source (`file:line`).
> Primary source: `Flutter Quiz Raw/QuizV2-flutterflow/lib/pages/home_page/home_page_widget.dart` — the single FlutterFlow page whose `PageView` (`home_page_widget.dart:137-1473`) holds every screen as an ordered child. Answer-option content + stable ids: `lib/app_state.dart`. GA event names referenced below are defined in `docs/reference/tracking-contract.md` (§ GA / GTM events).

## How the flow works

- One FlutterFlow page (`HomePageWidget`) renders a horizontal `PageView` with `NeverScrollableScrollPhysics` (`home_page_widget.dart:137-145`) — the user never swipes; navigation is driven entirely by `_model.pageViewController.nextPage(...)` / `.previousPage(...)`.
- `FFAppState().quizIndex` mirrors the current page index (`home_page_widget.dart:141-144`); the progress-bar header reads it (`home_page_widget.dart:96-131`).
- **The journey is strictly LINEAR, index 0 → 19.** There is **no answer-driven navigation branching** anywhere in the PageView: every `answerAction`/`navigationTap`/`buttonAction` calls `nextPage(...)` unconditionally. Answer conditions only change CONTENT (prompt/description/claim strings), never the next destination. Verified: every `nextPage` call in `home_page_widget.dart` is unconditional (`:214, :234, :254, :292, :330, :370, :403, :470, :496, :536, :580, :617, :659, :691, :723, :1039, :1069, :1113, :1157, :1174, :1244, :1318, :1346, :1429, :1447, :1465`).
- Single-select question screens advance **automatically on selection** (`progression: auto`). Multi-select, pitch/interstitial, and reveal-text screens advance via a **Continue CTA** (`progression: cta`). Rating screens advance when a rating button is tapped (each option is its own button that both records the answer and advances — classed `cta`). The loading screen **auto-advances** when its carousel completes (`progression: auto`).
- Multi-select Continue is **disabled until ≥1 option is selected**: the FooterButton is only rendered when `_model.selectedValue != null` (`templates/multi_choice_with_image_question_check_box/multi_choice_with_image_question_check_box_widget.dart:619`).
- **Fit-to-viewport:** all active screens render to a fixed viewport EXCEPT the Dashboard/result page (idx 19), which scrolls vertically (`dashboard/dashboard/dashboard_widget.dart:136`, `scrollDirection: Axis.vertical`).

## Active screen table (idx 0 → 19, in order)

> **Screenshot column** = the golden mobile (390×844) capture in `docs/reference/golden/` from the LIVE quiz (Phase 0 Task 5). Captures are the happy path goal_both → hairType_wavy → age_30to39 → concern_hairloss → routine_basic → … . Screens 19, 20 and the floating timer are **deferred** (require a real form submission — see ISSUES.md #8).

| idx | Human label | Container / template (file) | Type | Progression | questionId | Fit-to-viewport? | Tracking event(s) bound | Screenshot (golden/) | Citation (home_page_widget.dart, unless noted) |
|---|---|---|---|---|---|---|---|---|---|
| 0 | Start / Goal cover ("See if the Challenge is a fit…") | `ImageBackgroundQuesBodyWidget` (`templates/image_background_ques_body/…`) | start (single-select goal) | auto (tap a goal button → next) | `hairGoal` | yes | view: `Quiz Viewed` (on load); answer: `Quiz Started` + `Question Answered`; skip: `Opened Skip Dialog` | `00-start.png` (+ skip modal: `00b-skip-modal.png`) | screen `:147-261`; questionId `:166`; skipAction `:167-196`; answerActions `:199-258`; view+answer events `templates/image_background_ques_body/..._widget.dart:85` (Quiz Viewed), `:404-411` (Quiz Started), `:412-418` (Question Answered) |
| 1 | Hair type | `SingleChoiceQuestionLargeImageWidget` | single | auto | `hairType` (passed `''`; struct supplies `hairType` via answer `.type`) | yes | answer: `Question Answered` | `01-hairtype.png` | screen `:262-298`; answer event `templates/single_choice_question_large_image/..._widget.dart:243-244` |
| 2 | Age | `SingleChoiceQuestionSmalllmageWidget` | single (image) | auto | `age` | yes | answer: `Question Answered` | `02-age.png` | screen `:299-336`; answer event `templates/single_choice_question_smalllmage/..._widget.dart:290-291` |
| 3 | Biggest hair concern | `SingleChoiceQuestionSmalllmageWidget` | single (image) | auto | `hairConcern` | yes | answer: `Question Answered` | `03-hairconcern.png` | screen `:337-376`; answer event `single_choice_question_smalllmage/..._widget.dart:290-291` |
| 4 | Current routine | `TitlesAndDescriptionAnsBodyWidget` | single | auto | `currentRoutine` | yes | answer: `Question Answered` | `04-currentroutine.png` | screen `:377-409`; answer event `templates/titles_and_description_ans_body/..._widget.dart:210-211` |
| 5 | Knowledge state ("Do you already know exactly …?") — **prompt varies by `hairConcern`** | `QuestionAnswerWidget` | single | auto | `knowledgeState` | yes | answer: `Question Answered` | `05-knowledgestate.png` (hairloss variant: "…what's triggering your hair fall or thinning?") | screen `:410-476`; conditional prompt `:414-454`; answer event `templates/question_answer/..._widget.dart:175-176` |
| 6 | Damage Pitch ("Don't worry! We got you.") | `PitchBodySimpleTextImagesBodyWidget` | pitch (interstitial) | cta (Continue) | — | yes | continue: `Continued From Pitch` (label `Damage Pitch`) | `06-damage-pitch.png` | screen `:477-502`; event `:488-495` |
| 7 | Hairqare-method familiarity | `SingleChoiceQuestionSmalllmageWidget` | single (image) | auto | `hairqare` (list `hairqareKnowledge`) | yes | answer: `Question Answered` | `07-hairqare-familiarity.png` | screen `:503-542`; questionId `:514`; answer event `single_choice_question_smalllmage/..._widget.dart:290-291` |
| 8 | Holistic Pitch ("Beautiful hair needs more than…") | `PitchBodyDetailedTextImagesWidget` | pitch (interstitial) | cta (Continue) | — | yes | continue: `Continued From Pitch` (label `Holistic Pitch`) | `08-holistic-pitch.png` | screen `:543-586`; event `:572-579` |
| 9 | Diet | `SingleChoiceQuestionSmalllmageWidget` | single (image) | auto | `diet` | yes | answer: `Question Answered` | `09-diet.png` | screen `:587-623`; answer event `single_choice_question_smalllmage/..._widget.dart:290-291` |
| 10 | Shampoo spend (reveal-text per answer) | `QuestionAnswerAdditionlInfoWidget` | single (with reveal block) | auto¹ | `shampooSpending` | yes | answer: `Question Answered` (fired in home_page) | `10-shampoo-spend.png` (+ reveal state: `10b-reveal.png`) | screen `:624-665`; answer event `:647-658` |
| 11 | Hair myths (multi-select) | `MultiChoiceWithImageQuestionCheckBoxWidget` | multi | cta (Continue, ≥1 required) | `hairMyth` | yes | answer/continue: `Question Answered` (on Continue) | `11-hairmyths.png` (+ enabled-Continue: `11b-multiselect-enabled.png`) | screen `:666-697`; gating `multi_choice_with_image_question_check_box/..._widget.dart:619`; event `:627-628` |
| 12 | Damaging practices (multi-select) | `MultiChoiceWithImageQuestionCheckBoxWidget` | multi | cta (Continue, ≥1 required) | `hairDamageActivity` | yes | answer/continue: `Question Answered` (on Continue) | `12-damaging-practices.png` | screen `:698-729`; gating `multi_choice_with_image_question_check_box/..._widget.dart:619`; event `:627-628` |
| 13 | Damage-Practices Pitch — **description varies by `hairDamageActivity`; claim varies by `currentRoutine` × `hairConcern`** | `PitchBodySimpleDetailedTextImagesWidget` | pitch (interstitial) | cta (Continue) | — | yes | continue: `Continued From Pitch` (label `Damage Practices Pitch`) | `13-damage-practices-pitch.png` (heat × basic × hairloss variant) | screen `:730-1045`; description rule `:737-794`; claim rule `:795-1011`; event `:1031-1038` |
| 14 | Mirror confidence (rating/scale) | `RatingQuestionOptionsWidget` | rating | cta (rating-button tap advances) | `confidence` | yes | answer: `Question Answered` (fired in home_page) | `14-mirror-confidence.png` | screen `:1046-1089`; questionId `:1056`; event `:1058-1068`; rating buttons `templates/rating_question_options/..._widget.dart:213,291,369,447,525` |
| 15 | Comparison (rating/scale) | `RatingQuestionOptionsWidget` | rating | cta (rating-button tap advances) | `comparison` | yes | answer: `Question Answered` (fired in home_page) | `15-comparison.png` | screen `:1090-1133`; questionId `:1100`; event `:1102-1112` |
| 16 | Professional referral | `QuestionAnswerWidget` | single | auto | `professionalReferral` | yes | answer: `Question Answered` | `16-professional-referral.png` | screen `:1134-1163`; answer event `templates/question_answer/..._widget.dart:175-176` |
| 17 | Loading ("The only haircare program you'll ever need" / "Checking your hair condition") | `LoadingScreenBeforeResultWidget` | loading | auto (carousel completes → next, ~4 s) | — | yes | (no GA event bound on this screen) | `17-loading.png` | screen `:1164-1180`; autoNavigation `:1173-1178`; carousel→nav `loading_template/loading_screen_before_result/..._widget.dart:231-233` |
| 18 | Email capture / contact details | `LoginComponentWidget` | email-capture | cta (Submit) | — (collects name+email) | yes | view: `Quiz Completed` (on load); submit: `Quiz Submitted`; submit also calls webhook + `webhookCallcvg` (`Completed Quiz`) | `18-email-capture.png` (NOT submitted — capture only) | screen `:1181-1252`; submitAction `:1229-1250`; view event `email_template/login_component/..._widget.dart:52-53`; submit event `:623-624`; webhook+cvg calls `:1242-1243` |
| 19 | Dashboard / result page (TERMINAL) | `DashboardWidget` | result | (end — CTAs redirect to checkout) | — | **NO — scrolls vertically** | view: `Viewed Results Page` (on load); CTA: `Go to  checkout` (TWO spaces) → `redirectToCheckout()` | **DEFERRED** (needs submission — ISSUES.md #8) | screen `:1253-1296`; CTAs `:1269-1294`; checkout event `:1272-1273` & `:1285-1286`; view event `dashboard/dashboard/..._widget.dart:67-68`; scroll `:136` |

> ¹ **idx 10 progression — live correction.** quiz-flow originally derived `auto` from source. The LIVE quiz (golden `10-shampoo-spend.png` / `10b-reveal.png`) shows idx 10 does **not** auto-advance: selecting an answer reveals the per-answer title+description block AND renders a **CONTINUE** button (effectively `cta`). See ISSUES.md #6.
>
> **Live multi-select extra option (idx 11 & 12).** Both multi-selects render a "None of the above" button below the 5 `app_state.dart` options (visible in `11-hairmyths.png` / `12-damaging-practices.png`) — not in the answer-option tables below. See ISSUES.md #7.

### Notes on the table

- **Header / back button.** The progress-bar header (`HeaderWithProgressBarWidget`) is shown for `quizIndex != 0 && != 19 && != 20` (`home_page_widget.dart:96-101`). Its Back button (`Quiz Back` GA event) is suppressed on the pitch/loading/email/dashboard indices via the `isBack` predicate (`:110-120`, excludes idx 0,6,7,8,9,13,17,18,19,20). Back uses `previousPage(...)` (`:125-130`).
- **idx 0 goal mapping.** The three start-screen answer buttons map to `hairGoal[0/1/2]` = `goal_hairloss` / `goal_betterhair` / `goal_both` (`templates/image_background_ques_body/..._widget.dart:391-398` selects `hairGoal.elementAtOrNull(0).id`, repeated for buttons 2 and 3). The widget passes `questionId: 'hairGoal'` (`home_page_widget.dart:166`).
- **idx 1 questionId.** Passed as `''` at the call site (`:273`); the recorded `questionId` comes from the selected answer struct's `type` (`hairType`) via `valueOrDefault(..., 'test')` (`:279-284`). All other single-select screens similarly derive questionId from the answer struct `.type`.
- **Single-select = `auto`** because the answer's `onTap` directly records the answer and calls `nextPage` with no intermediate Continue (e.g. `:199-218`, `:274-296`). **Multi-select = `cta`** because selections only toggle checkboxes; advancing requires the Continue FooterButton which is gated on `selectedValue != null`.

## Excluded DEAD screens (idx 21, 22, 23) — NOT part of the active flow

These exist as trailing `PageView` children but are unreachable in the linear 0→19 journey (no `nextPage` from idx 19/20 ever reaches them — idx 19's CTAs leave the app to checkout).

| idx | Widget | Why dead | Citation |
|---|---|---|---|
| 21 | `StartLoadingComponentWidget` | Wrapped in `Visibility(visible: responsiveVisibility(phone:false, tablet:false, tabletLandscape:false, desktop:false))` → never visible on any breakpoint | `home_page_widget.dart:1305-1325` |
| 22 | `QuestionAnswerAdditionlInfoWidget` (holistic / `mindsetState`) | "NotUsedHolistic" — never linked in the linear flow; nothing advances to idx 22 | `home_page_widget.dart:1326-1366` |
| 23 | `ImageBackgroundQuesBodyV3Widget` (alt goal start / "V3 start") | "NotUsedGoal/V3 start" — an alternate cover never reached; idx 0 is the live cover | `home_page_widget.dart:1367-1472` |

> **idx 20 (`FinalPitchWidget`, `home_page_widget.dart:1297-1304`)** is present in the PageView but is also not reached in the live linear walkthrough: the Dashboard (idx 19) CTAs call `redirectToCheckout()` and leave the app rather than advancing (`:1280, :1293`). It is therefore out of scope for the active 0→19 spec. The header logic explicitly special-cases 19 and 20 as non-question screens (`:100-101, :107-109, :116-117`).

---

## Answer options per question screen (stable answerIds + labels)

All from `lib/app_state.dart`. Order = display order.

### idx 0 — `hairGoal` (`app_state.dart:565-571`)
| answerId | label |
|---|---|
| `goal_hairloss` | I want to stop my hair loss |
| `goal_betterhair` | I want longer, better looking hair |
| `goal_both` | I want both |

### idx 1 — `hairType` (`app_state.dart:601-611`)
| answerId | label |
|---|---|
| `hairType_straight` | Straight |
| `hairType_wavy` | Wavy |
| `hairType_curly` | Curly |
| `hairType_coily` | Coily |
| `hairType_unknown` | I don't know |

### idx 2 — `age` (`app_state.dart:641-649`)
| answerId | label |
|---|---|
| `age_18to29` | 18 - 29 |
| `age_30to39` | 30 - 39 |
| `age_40to49` | 40 - 49 |
| `age_50+` | 50 + |

### idx 3 — `hairConcern` (`app_state.dart:283-293`)
| answerId | label |
|---|---|
| `concern_hairloss` | Hair loss or hair thinning |
| `concern_damage` | Damage from dye, heat, or chemical treatments |
| `concern_scalp` | Scalp irritation or dandruff |
| `concern_splitends` | Split ends, frizz, and dryness |
| `concern_mixed` | Other, mixed issues |

### idx 4 — `currentRoutine` (`app_state.dart:1076-1086`)
| answerId | title | description |
|---|---|---|
| `routine_complex` | 🤓 Advanced | Salon visits, premium products, specialists, supplements |
| `routine_basic` | 🫧 Basic care | Mostly just shampoo and conditioner |
| `routine_intermediete` | 🤗 Occasional pampering | Basic care and occasional hair masks |
| `routine_natural` | 🌿 Natural remedies | Mostly oils, herbs or DIY treatments |
| `routine_other` | 😌 None of the above | I follow a different haircare routine |

### idx 5 — `knowledgeState` (`app_state.dart:679-685`)
| answerId | label |
|---|---|
| `knowledge_yes` | 🙌 Yes, but I need more support |
| `knowledge_no` | 😢 No and I'm tired of searching |
| `knowledge_notsure` | 😥 Not sure, it's complicated by myself |

### idx 7 — `hairqareKnowledge` (questionId `hairqare`) (`app_state.dart:715-721`)
| answerId | label |
|---|---|
| `hairqare_unknown` | I'm hearing about it for the first time |
| `hairqare_notunknown` | I know a few things |
| `hairqare_familiar` | Yes, I know everything about it |

### idx 9 — `diet` (`app_state.dart:791-801`)
| answerId | label |
|---|---|
| `diet_processed` | Fast food / Processed food diet |
| `diet_balanced` | Balanced / Whole foods |
| `diet_custom` | Custom nutrition protocol |
| `diet_vegan` | Vegan / vegetarian |
| `diet_other` | Something else |

### idx 10 — `shampooSpending` (`app_state.dart:831-839`) — each answer has a reveal title+description
| answerId | label | reveal title |
|---|---|---|
| `spend_under10` | Less than $10 | Awesome 🤩 you're budget conscious! |
| `spend_10to20` | $10 - $20 | Amazing 🙌 you value your hair! |
| `spend_20to50` | $20 - $50 | You clearly care about your hair 💜 |
| `spend_over50` | More than $50 | Your hair deserves the best ✨ |

(Full reveal descriptions verbatim at `app_state.dart:833-839`.)

### idx 11 — `hairMyth` (multi-select; ids in `Id` field) (`app_state.dart:871-881`)
| answerId | label |
|---|---|
| `myth_rosemary` | Rosemary oil is reduces hair loss |
| `myth_coconut` | Coconut oil is the best hair oil |
| `myth_ricewater` | Rice water makes hair grow faster |
| `myth_organic` | Natural / organic products are better |
| `myth_nopoo` | Not washing hair is good for the scalp |

### idx 12 — `hairDamageActivity` (multi-select) (`app_state.dart:914-924`)
| answerId | label |
|---|---|
| `damageAction_heat` | Heat styling |
| `damageAction_dye` | Bleaching / hair colouring |
| `damageAction_sun` | Sun exposure |
| `damageAction_swimming` | Frequent swimming |
| `damageAction_hairstyles` | Tight hair styles (braids, bun, ponytail...) |

### idx 14 — `confidence` (rating; "My reflection in the mirror after…", relate-scale) (`home_page_widget.dart:1050-1056`)
Rating-scale options (5 buttons, `templates/rating_question_options/..._widget.dart:213,291,369,447,525`); answerIds are the scale values recorded by the rating widget. No `app_state` list — the scale is intrinsic to the template.

### idx 15 — `comparison` (rating; "I tend to compare my hair to others…", relate-scale) (`home_page_widget.dart:1094-1100`)
Same rating-scale template as idx 14.

### idx 16 — `professionalReferral` (`app_state.dart:958-964`)
| answerId | label |
|---|---|
| `professional_yes` | Yes |
| `professional_no` | No |
| `professional_self` | I'm a professional |

> `mindsetState` (`app_state.dart:751-759`: `mindset_aware`, `mindset_unsure`, `mindset_unaware`, `mindset_oblivious`) is ONLY consumed by the dead idx 22 screen — it is not part of the active flow.

---

## Conditional-content lookup tables (flattened from Flutter nested conditions)

The Flutter app has **no answer-driven navigation** — these conditions only swap displayed strings. The conditions test `FFAppState().quizProfile.qaPairs.contains(QuestionAnswerPairStruct(questionId, answerIds))`, i.e. an exact single-answerId match (`.contains` of a one-element list).

### Table 1 — idx 5 knowledge-state PROMPT by `hairConcern`
Prompt = `"Do you already know exactly " + <suffix>`. Source: `home_page_widget.dart:414-454`.

| hairConcern answer | prompt suffix (output string) |
|---|---|
| `concern_hairloss` | what's triggering your hair fall or thinning? |
| `concern_splitends` | how you can tame your frizz and dryness? |
| `concern_scalp` | what's behind your scalp irritation or dandruff issues? |
| `concern_damage` | how you can save your hair from further damage? |
| else (`concern_mixed`, unanswered) | what's causing your hair issues? |

### Table 2 — idx 13 pitch DESCRIPTION by `hairDamageActivity`
Description = `"With the right routine it's fine to " + <fragment>`. Source: `home_page_widget.dart:737-794`. Evaluated as an ordered if/else-if; the **first** matching group wins.

| hairDamageActivity contains (first match wins) | description fragment (output string) |
|---|---|
| `damageAction_heat` OR `damageAction_dye` OR `damageAction_hairstyles` (checked first) | to style, curl or color your hair. |
| else if `damageAction_swimming` OR `damageAction_sun` | live an active lifestyle. |
| else (none of the above selected) | style your hair any way you like and do the activities you enjoy. |

> **Generic-copy limitation (mark for new engine):** this is a multi-select question, but the Flutter code can only test single-answerId membership and uses **first-match-wins ordered groups** — so a user who selected BOTH a heat/dye/hairstyle option AND a swimming/sun option gets ONLY the "style, curl or color" fragment (the active-lifestyle branch is never reached). Combinations like `UV + swimming` vs `UV + tight-styles` are **not distinguished**. *Generic today; combination-capable in the new engine.*

### Table 3 — idx 13 pitch CLAIM by `currentRoutine` × `hairConcern` (5 × 5)
Claim template = `"But if you are still struggling with" + <concern phrase> + " " + <routine despite-clause> + ", you're missing important haircare knowledge. "`. Outer switch on `currentRoutine` (`home_page_widget.dart:795-1011`), inner switch on `hairConcern` (the inner concern→phrase mapping is identical in all five outer branches). The full claim string concatenates the column header phrase and the routine-row clause.

**Inner concern phrase** (`<concern phrase>`, same in every routine branch):

| hairConcern | concern phrase |
|---|---|
| `concern_hairloss` | hair loss and thinning |
| `concern_splitends` | split ends and dryness |
| `concern_scalp` | dandruff and scalp irritation |
| `concern_damage` | damaged hair and breakage |
| else (`concern_mixed`, unanswered) | mixed hair issues |

**Outer routine despite-clause** (the text appended after the concern phrase, before `", you're missing important haircare knowledge."`):

| currentRoutine | routine "despite…" clause |
|---|---|
| `routine_complex` | despite all the treatments, specialists and products you've tried |
| `routine_basic` | while only relying on using shampoo & conditioner |
| `routine_intermediete` | despite making time for hair masks and other treatments |
| `routine_natural` | despite using organic products and home remedies |
| else (`routine_other`, unanswered) | despite what you've already tried |

**Resulting 5 × 5 claim matrix** (rows = `currentRoutine`, cols = `hairConcern`; cell = the full sentence `"But if you are still struggling with <concern phrase> <routine clause>, you're missing important haircare knowledge."`):

| currentRoutine ↓ \ hairConcern → | hairloss ("hair loss and thinning") | splitends ("split ends and dryness") | scalp ("dandruff and scalp irritation") | damage ("damaged hair and breakage") | mixed/else ("mixed hair issues") |
|---|---|---|---|---|---|
| **complex** (despite all the treatments, specialists and products you've tried) | …struggling with hair loss and thinning despite all the treatments, specialists and products you've tried, you're missing important haircare knowledge. | …split ends and dryness despite all the treatments… | …dandruff and scalp irritation despite all the treatments… | …damaged hair and breakage despite all the treatments… | …mixed hair issues despite all the treatments… |
| **basic** (while only relying on using shampoo & conditioner) | …hair loss and thinning while only relying on using shampoo & conditioner… | …split ends and dryness while only relying on… | …dandruff and scalp irritation while only relying on… | …damaged hair and breakage while only relying on… | …mixed hair issues while only relying on… |
| **intermediete** (despite making time for hair masks and other treatments) | …hair loss and thinning despite making time for hair masks and other treatments… | …split ends and dryness despite making time for hair masks… | …dandruff and scalp irritation despite making time for hair masks… | …damaged hair and breakage despite making time for hair masks… | …mixed hair issues despite making time for hair masks… |
| **natural** (despite using organic products and home remedies) | …hair loss and thinning despite using organic products and home remedies… | …split ends and dryness despite using organic products… | …dandruff and scalp irritation despite using organic products… | …damaged hair and breakage despite using organic products… | …mixed hair issues despite using organic products… |
| **other/else** (despite what you've already tried) | …hair loss and thinning despite what you've already tried… | …split ends and dryness despite what you've already tried… | …dandruff and scalp irritation despite what you've already tried… | …damaged hair and breakage despite what you've already tried… | …mixed hair issues despite what you've already tried… |

(Every cell ends with `", you're missing important haircare knowledge."` — truncated above for width. Verbatim outer branches: complex `:803-839`, basic `:847-883`, intermediete `:891-927`, natural `:935-971`, else `:973-1009`.)

### Table 4 — idx 18 email-capture "concern resolution chance" line by `hairConcern`
Line = `"Probability to fix your " + <phrase> + " in 14 days:"`. Source: `home_page_widget.dart:1187-1227` (passed as `concernResolutionChance`).

| hairConcern | phrase |
|---|---|
| `concern_hairloss` | hair loss |
| `concern_splitends` | split-ends |
| `concern_scalp` | scalp issues |
| `concern_damage` | damaged hair |
| else (`concern_mixed`, unanswered) | hair problems |

---

## Start-screen skip modal

- **Trigger.** The start cover (idx 0) exposes a Skip link; tapping it fires GA `Opened Skip Dialog` (`home_page_widget.dart:168-175`) then shows `SkipDialogWidget` in a transparent full-screen `Dialog` (`:176-195`).
- **Behavior.** Dismiss/close buttons fire GA `Closed Skip Dialog` (`dashboard/skip_dialog/skip_dialog_widget.dart:40-41, 95-96, 184-185`). The confirm/"skip the quiz" button fires GA `SkipQuiz` (`skip_dialog_widget.dart:263-264`) and then immediately calls `actions.redirectToCheckout()` (`skip_dialog_widget.dart:271`) — i.e. **skipping routes straight to checkout**, bypassing the rest of the quiz. (Checkout URL/params: see `tracking-contract.md` § Checkout redirect.)

## Dashboard countdown + floating timer

- **Floating timer.** The Dashboard (idx 19) renders a `FloatingTimerCheckoutWidget` overlay (`dashboard/dashboard/dashboard_widget.dart:2805-2807`). It is a **countdown** timer: the model creates `FlutterFlowTimerController(StopWatchTimer(mode: StopWatchMode.countDown))` with `timerInitialTimeMs = 0` (`components/floating_timer_checkout_model.dart:16, 24`), started on init via `_model.timerController.onStartTimer()` (`components/floating_timer_checkout_widget.dart:40`) and displayed through `FlutterFlowTimer` (`floating_timer_checkout_widget.dart:175-188`).
- **Floating-timer checkout CTA.** Its button fires GA `Go to checkout` (ONE space — distinct from the Dashboard CTA's two-space variant; `floating_timer_checkout_widget.dart:233`) then `actions.redirectToCheckout()` (`:241`).
- **Result-view tracking.** On Dashboard load, GA `Viewed Results Page` fires (`dashboard/dashboard/dashboard_widget.dart:67-68`).
- **Dashboard is the one scrolling screen** (`Axis.vertical`, `dashboard_widget.dart:136`) — all other active screens fit a fixed viewport.
</content>
</invoke>
