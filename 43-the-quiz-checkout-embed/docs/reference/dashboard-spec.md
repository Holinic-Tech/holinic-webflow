# Dashboard / Result Screen Reference

Ground-truth extraction of the **behavior + content** of the current FlutterFlow quiz's
result/dashboard screen. Every claim cites a `file:line` from the read-only source at
`~/github/Flutter Quiz Raw/QuizV2-flutterflow/`. Tracking events cross-referenced against
the already-verified [`tracking-contract.md`](./tracking-contract.md) and [`quiz-flow.md`](./quiz-flow.md).

**Placeholder / random markers used below:**
- 🔴 **PLACEHOLDER** — leftover dev string or value that is NOT real content; Phase 4 must replace or remove.
- 🎲 **RANDOM** — value generated fresh per page load via `random_data.randomInteger(...)`; not deterministic.

The result page is composed of three widgets stacked in `pages/home_page/home_page_widget.dart`:
`DashboardWidget` (the scrolling result page) then `FinalPitchWidget` (pitch/plans block) — both inside a
PageView (`home_page_widget.dart:1256`, `:1300`). The floating countdown timer is rendered as the last child
of the dashboard `Stack` (`dashboard/dashboard/dashboard_widget.dart:2804-2808`).

---

## 1. Result page structure (top → bottom)

### 1a. `DashboardWidget` — `dashboard/dashboard/dashboard_widget.dart`

On load it fires GA `Viewed Results Page` (`dashboard_widget.dart:67-74`).

| # | Section | Source lines | Notes |
|---|---------|-------------|-------|
| 1 | `Congratulations, {name}!` heading (name → 🎉 fallback) | `:146-150` | name from `submittedContactDetails.name` |
| 2 | "You are a perfect fit…" subhead (loc `qm88njuv`) | `:186-189` | |
| 3 | **Matching-score card** (gradient): "Your matching score is", bar fixed at `percent: 0.9`, % text from `widget.percentage`, "That's an outstanding score!", goal-conditional "9 out of 10 women…" line | `:217-415` | see §2 (hairGoal) + §3 |
| 4 | **Summary card** (gradient): avatar SVG by age, name, age label, "My Goal:" + concern-conditional goal text, "Your hair transformation timeline" + two concern-conditional images | `:416-953` | see §2 |
| 5 | "You deserve this, {name}!" | `:954-981` | |
| 6 | "Join the 14-Day Haircare Challenge and say goodbye to your {concern}…" | `:982-1048` | concern-conditional noun, see §2 |
| 7 | "No more frustration…" italic line | `:1049-1072` | |
| 8 | Three ✅ benefit rows (loc `gupt5mjs`, `begqgauj`, `qopcc4n9`) | `:1073-1279` | static copy |
| 9 | **`JOIN THE CHALLENGE`** button → `reserveMySeatAction` | `:1318-1359` | fires two-space `Go to  checkout`, see §4 |
| 10 | "200,000+ women… 92% of finishers…" rich text | `:1360-1462` | static |
| 11 | Ratings image (`Rating image.webp`) | `:1463-1512` | static |
| 12 | **Before/after testimonial carousel** (7 slides; first 3 concern-conditional, last 4 static) | `:1513-1733` | see §2 |
| 13 | **`START MY CHALLENGE`** button → `reserveMySeatAction` | `:1772-1811` | two-space `Go to  checkout` |
| 14 | "Based on your answers… 10 min a day, for 14 days…" | `:1812-1926` | static |
| 15 | "Days images" graphic | `:1927-1941` | static |
| 16 | "100% Results" / "0% Hassle" badges | `:1942-2023` | static |
| 17 | 3-row benefits card (science-based / meal plan / save thousands) | `:2024-2497` | static |
| 18 | `lucia-busy-short.webp` image | `:2498-2528` | static |
| 19 | Concern-conditional result-page testimonial image | `:2529-2598` | see §2 |
| 20 | "Only {N} seats remaining. Hurry Up!" | `:2599-2633` | 🎲 `randomInteger(3, 9)` (`:2607`) |
| 21 | **`START MY CHALLENGE`** button → `reserveMySeatAction` | `:2687-2730` | two-space `Go to  checkout` |
| 22 | "100% Refund guarantee…" footer | `:2736-2774` | static |
| 23 | Redirect loader overlay (Lottie) when `showResultPageredirectLoader` | `:2778-2803` | |
| 24 | `FloatingTimerCheckoutWidget` (overlay) | `:2804-2808` | see §5 |

### 1b. `FinalPitchWidget` — `dashboard/final_pitch/final_pitch_widget.dart`

On load it calls `addToProfile(quizProfile)` then fires GA `Viewed Results Page` (`final_pitch_widget.dart:51-62`).

| # | Section | Source lines |
|---|---------|-------------|
| 1 | "We've found the right Haircare…" headline (loc `0r9t3oy8`) | `:129-134` |
| 2 | "Personal plan for {name} has been reserved." banner | `:188-327` |
| 3 | Concern-conditional hero image + transformation-timeline image | `:342-452` (see §2) |
| 4 | Before/after comparison: two columns of `DashboardWidgetWidget` cards (Hair goal / Confidence / concern label) + `HeaderProgressBar`s | `:453-844` |
| 5 | "{name}'s Holistic Haircare Routine plan is ready!" | `:845-956` |
| 6 | "Start today and become unrecognizable… {concern-conditional outcome}" | `:957-1070` (see §2) |
| 7 | "Main trigger: Wrong routine" / "Plan focus: {concern}" | `:1071-1293` (see §2) |
| 8 | **Plan cards** from `FFAppState().PlanData` (radio, price, "% OFF", "Focus: {concern}") | `:1294-1832` (see §2, §4) |
| 9 | "People using this program see…" info line | `:1833-1873` |
| 10 | **`GET MY PLAN`** button → opens `PitchPlanDialogWidget` | `:1874-1951` (see §4) |
| 11 | `FloatingTimerDialogBoxWidget` (bottom overlay) | `:1958-1964` |

`DashboardWidgetWidget` (`dashboard/dashboard_widget/dashboard_widget_widget.dart`) is a trivial
header+value two-`Text` card (`:50-88`); it has no conditional logic — all values are passed in by the parent.

---

## 2. Answer-conditional content branches

All branches read `FFAppState().quizProfile.qaPairs.contains(QuestionAnswerPairStruct(questionId, answerIds))`.
Every branch has an `else` fallback; `valueOrDefault` adds a second hard-coded fallback string. The "fallback"
column below is the `else` value (what shows for any unhandled answer such as `concern_mixed`).

### 2a. Match-card benefit line — by `hairGoal` answerId
`dashboard_widget.dart:360-392`

| `hairGoal` answerId | Output copy |
|---|---|
| `goal_hairloss` | "9 out of 10 women with this score said their shedding stopped, and they started seeing new baby hairs after the challenge." |
| `goal_betterhair` | "9 out of 10 women with this score said their hair felt softer, healthier, and looked better after the challenge. " |
| `goal_both` | "9 out of 10 women with this score said their shedding stopped, and their hair looked and felt better after the challenge." |
| _else / fallback_ | (same as `goal_both`) |

### 2b. Avatar SVG — by `age` answerId
`dashboard_widget.dart:471-522`

| `age` answerId | Image URL |
|---|---|
| `age_18to29` | `https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66b37050731caef7208325c3_Under%2018.svg` |
| `age_30to39` | `…/66b3705002a6a9516930e533_25-34.svg` |
| `age_40to49` | `…/66b3705003f42517011b493e_35-44.svg` |
| `age_50+` | `…/66b370508968423fab443088_45%2B.svg` |
| _else / fallback_ | `…_Under%2018.svg` |

⚠️ Note the asset filenames (`Under 18`, `25-34`, `35-44`, `45+`) do **not** match the answer brackets
(18-29 / 30-39 / 40-49 / 50+) — legacy art, replicate the mapping as-is.

### 2c. Age label text — by `age` answerId
`dashboard_widget.dart:566-608`: `age_18to29`→"In my 20s", `age_30to39`→"In my 30s",
`age_40to49`→"In my 40s", `age_50+`→"Age 50+", else→"Summary".

### 2d. "My Goal:" description — by `hairConcern` answerId
`dashboard_widget.dart:689-743`

| `hairConcern` answerId | Output copy |
|---|---|
| `concern_hairloss` | "Denser hair and noticeable regrowth that fills in sparse areas, so I can have peace of mind and feel beautiful again ." |
| `concern_splitends` | "Smoother, frizz-free hair that makes me feel confident and put-together every day." |
| `concern_scalp` | "A calm, itch and flake free scalp that allows me to go through my day without constant distraction or embarrassment from scratching." |
| `concern_damage` | "Stronger, more resilient hair that I can style daily without guilt or worry about damage." |
| _else / fallback_ | "Healthy, problem-free hair that behaves exactly how I want it to, letting me enjoy my hair without constantly battling different problems." |

### 2e. Transformation-timeline **top hero image** — by `hairConcern`
`dashboard_widget.dart:828-872` (base path `https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/`)

| answerId | File |
|---|---|
| `concern_hairloss` | `RP%20Hairloss.webp` |
| `concern_splitends` | `RP%20Split%20ends.webp` |
| `concern_scalp` | `RP%20Dandruff.webp` |
| `concern_damage` | `RP%20Damage.webp` |
| _else_ | `RP%20Others.webp` |

### 2f. Transformation-timeline **graph image** — by `hairConcern`
`dashboard_widget.dart:888-925` (same base path)

| answerId | File |
|---|---|
| `concern_hairloss` | `RP%20hairloss%20timeline.webp` |
| `concern_splitends` | `RP%20Split%20ends%20timeline.webp` |
| `concern_scalp` | `RP%20dandruff%20timeline.webp` |
| `concern_damage` | `RP%20damage%20timeline.webp` |
| _else_ | `RP%20others%20timeline.webp` |

### 2g. "say goodbye to your {X}" noun — by `hairConcern`
`dashboard_widget.dart:990-1027`: `concern_hairloss`→"hair loss", `concern_splitends`→"split-ends",
`concern_scalp`→"scalp issues", `concern_damage`→"damaged hair", else→"chronic hair problems".

### 2h. Before/after carousel slides 1-3 — by `hairConcern`
Slides 4-7 are STATIC (`3_BH.webp`, `Better_Hair_4.webp`, `4_BH.webp`, `8_HL.webp` — `dashboard_widget.dart:1680-1715`).
Base path `https://pub.hairqare.co/cdn-cgi/image/width=450,quality=85,format=auto/`.
These branches uniquely include a `concern_mixed` case (other branches fall through to `else`).

**Slide 1** (`:1524-1568`):

| answerId | File |
|---|---|
| `concern_splitends` | `bella-before-after.webp` |
| `concern_damage` | `Damage_Hair_1_Testimonial.webp` |
| `concern_hairloss` | `ji-woo-before-after.webp` |
| `concern_scalp` | `Irritation_or_dandruff_1_Testimonial.webp` |
| `concern_mixed` / else | `alina-before-after-front.webp` |

**Slide 2** (`:1577-1621`):

| answerId | File |
|---|---|
| `concern_splitends` | `Split_ends_frizz_dryness_2_testimonial.webp` |
| `concern_damage` | `anna-before-after-smaller.webp` |
| `concern_hairloss` | `Hair_Loss_2_Testimonial.webp` |
| `concern_scalp` | `Irritation_or_dandruff_2_Testimonial.webp` |
| `concern_mixed` / else | `ariadna-before-after.webp` |

**Slide 3** (`:1630-1674`):

| answerId | File |
|---|---|
| `concern_splitends` | `Split_ends_frizz_dryness_3_testimonial.webp` |
| `concern_damage` | `Damage_Hair_3_Testimonial.webp` |
| `concern_hairloss` | `Hair_Loss_3_Testimonial.webp` |
| `concern_scalp` | `Irritation_or_dandruff_3_Testimonial.webp` |
| `concern_mixed` / else | `Others_3_testimonial.webp` |

### 2i. Lower result-page testimonial image — by `hairConcern`
`dashboard_widget.dart:2550-2587` (base `https://pub.hairqare.co/cdn-cgi/image/width=750,…/`):
`concern_splitends`→`Frizzy_hair_Testimonial_Result_Page_2.webp`, `concern_damage`→`Color_Damage_Testimonial_Result_Page_1.webp`,
`concern_hairloss`→`marisol-before-after.webp`, `concern_scalp`→`Dandruff_Testimonial_Result_Page_1.webp`,
else→`Other_issues_Testimonial_Result_Page_1.webp`.

### 2j. FinalPitch concern-conditional branches (`final_pitch_widget.dart`)

| Use | Lines | Outputs (hairloss / splitends / scalp / damage / else) |
|---|---|---|
| Hero image | `:344-381` | `RP%20Hairloss.webp` / `RP%20Split%20ends.webp` / `RP%20Dandruff.webp` / `RP%20Damage.webp` / `RP%20Others.webp` (base `https://assets.hairqare.co/`) |
| Timeline image | `:395-432` | `RP%20hairloss%20timeline.webp` / `RP%20Split%20ends%20timeline.webp` / `RP%20dandruff%20timeline.webp` / `RP%20damage%20timeline.webp` / `RP%20others%20timeline.webp` |
| Concern label (cards ×2) | `:558-611`, `:753-807` | " Hair loss" / " Split ends / dryness" / "Scalp issues" / "Damage" / "Hair problems" |
| "become unrecognizable" outcome | `:990-1027` | thicker-fuller / smoother-manageable / **damage→** stronger-resilient / **scalp→** calmer-itch-free / else healthier-problem-free (NB: order is hairloss, splitends, damage, scalp) |
| "Plan focus:" | `:1214-1263` | "Hair loss" / "Split ends" / "Scalp issues" / "Damage" / "Complex issues" |
| Per-plan "Focus:" | `:1533-1581` | "Focus: Hair loss" / "Focus: Split ends" / "Focus: Scalp healing" / "Focus: Damage" / "Focus: Hair health" |

---

## 3. Match percentage

- The `%` shown in the match-score card is **`widget.percentage`** (`dashboard_widget.dart:303-309`), with a
  hard-coded fallback string `'90'`.
- The progress **bar fill is hard-coded to `percent: 0.9`** (`dashboard_widget.dart:289`) — it does NOT track the
  number; the bar always shows 90% regardless of the displayed %.
- `widget.percentage` is supplied at the instantiation site: 🎲 **`random_data.randomInteger(92, 97)`** with
  `valueOrDefault` fallback `97` (`pages/home_page/home_page_widget.dart:1258-1261`). Confirmed: range 92-97 inclusive,
  re-rolled on each build.

### Placeholder props (passed in, never displayed)
At the same instantiation site, `DashboardWidget` is also given:
- 🔴 `description:` → loc key `v1fdv9fv` = **"ewew"** (`home_page_widget.dart:1262-1264`)
- 🔴 `goal:` → loc key `k5vkwbbc` = **"test"** (`home_page_widget.dart:1265-1267`)

Both are declared as constructor params (`dashboard_widget.dart:26-27, 35-36`) but are **never referenced** in the
`DashboardWidget` build method — the page builds all goal/description copy directly from `qaPairs` (§2). So "ewew"/"test"
are dead placeholder strings that never render. The rebuild can drop them; flag for Phase 4.

---

## 4. Pricing / plans

### `PlanData` (`app_state.dart:484-487`) — drives the FinalPitch plan card(s)
Single `PlanStruct`:

| Field | Value |
|---|---|
| `title` | "14 Day Challenge" |
| `actualPrice` | "300" |
| `discountedPrice` | "37" |
| `perDayActualPrice` | "300" |
| `discountedPerDayPrice` | "85" |
| `isPopularPlan` | "true" |

Rendered at `final_pitch_widget.dart:1294-1827`: `.title` (`:1489`), struck-through `perDayActualPrice` shown only
if popular (`:1621`), `$ discountedPrice` big (`:1722-1732`), `discountedPerDayPrice + "% OFF"` (`:1787`).
Note `perDayActualPrice`="300" and `discountedPerDayPrice`="85" are reused as the strike price and the "% OFF" number —
i.e. the data field names don't match their display use; replicate values, not the semantics. FinalPitch is also handed
`previousDiscountPercentage: 30` and `discountPercentage: 85` literals (`home_page_widget.dart:1301-1302`).

### `personalPlan` (`app_state.dart:517-536`) — the 9 line-items in the plan-details dialog
All `discountedPrice` = "0" (i.e. shown free) except the last two structs which omit it:

| title | price |
|---|---|
| 14 Day Haircare Journal & Templates | 29 |
| DIY Luxury Shampoo Workshop | 39 |
| Haircare Ingredients No-No List | 35 |
| Total Hair Wellness Handbook | 29 |
| Silicones & Sulfates Smart Usage Manual | 29 |
| 30 Day Hair Mindfulness Experience | 15 |
| Exclusive Members-Only Community | 20 |
| Haircare Product Analyzer | 5 |
| Certificate of Completion | (no price) |

### Plan-details dialog — `dashboard/pitch_plan_dialog/pitch_plan_dialog_widget.dart`
- **Opened** from FinalPitch `GET MY PLAN` (`final_pitch_widget.dart:1884-1891`): fires GA
  **`Opened Plan Details`** (label arg `'Result Page'`), then `showDialog(... PitchPlanDialogWidget())`.
- On open it also starts its own stopwatch timer (`pitch_plan_dialog_widget.dart:40`).
- **Closed** two ways, both firing GA **`Closed Plan Details`** (label `'Plan Details'`): the X/close tap
  (`:112-119`) and the dispose handler (`:50-57`). On close it writes `timerSecElapsed` (resets to `1800000`
  then to `_model.timerMilliseconds`, `:59-62` / `:122-125`) so the floating timer resumes from the dialog's elapsed time.
- **Checkout CTA** = `START NOW →` button (`:678-692`): fires GA 🟧 **`Go to  checkout` (TWO spaces, category arg `'Plan Details'`)** (`:680-687`) then `redirectToCheckout()` (`:688`).

---

## 5. Floating countdown timer — `components/floating_timer_checkout_widget.dart`

- Renders a fixed black bar pinned to the bottom of the dashboard `Stack` ("85% OFF valid for:" + countdown + `JOIN` button).
- **Duration / source:** `FlutterFlowTimer(initialTime: FFAppState().timerSecElapsed …)` (`floating_timer_checkout_widget.dart:176`).
  `timerSecElapsed` defaults to **`1800000`** ms = **1,800,000 ms ≈ 30 minutes** (`app_state.dart:1228`). Display is
  mm:ss (`hours: false, milliSecond: false`, `:177-182`). Timer counts down from app-state value; the plan dialog
  syncs its own elapsed value back into `timerSecElapsed` on close (§4).
- **Behavior:** auto-starts on load (`:40`), updates every 60 ms (`:184-185`).
- **Checkout CTA** = `JOIN` button (label flips to `'Loading ...'`, `:243-245`): sets `showResultPageredirectLoader = true`
  (triggers the dashboard Lottie overlay), then fires GA 🟦 **`Go to checkout` (ONE space, category arg `'Result Page'`)**
  (`:233-240`) then `redirectToCheckout()` (`:241`).

### ⚠️ The two distinct checkout events
| Event string | Where it fires | Category arg |
|---|---|---|
| **`Go to  checkout`** (TWO spaces) | dashboard `JOIN THE CHALLENGE`/`START MY CHALLENGE` via `reserveMySeatAction`/`startMyChallengeAction` (`home_page_widget.dart:1273, 1286`); plan dialog `START NOW →` (`pitch_plan_dialog_widget.dart:681`) | `'Result Page'` / `'Plan Details'` |
| **`Go to checkout`** (ONE space) | floating-timer `JOIN` button (`floating_timer_checkout_widget.dart:234`) | `'Result Page'` |

Both are real, distinct GA event names in live data and must be reproduced byte-for-byte (per
`tracking-contract.md:97, 114-118`). The plan dialog's CTA is **two-space**; the floating timer's is **one-space**.

---

## 6. Skip dialog — `dashboard/skip_dialog/skip_dialog_widget.dart`

The skip dialog is opened from the **question pages** (not the dashboard) but uses the same dashboard tracking trio:
- **Opened** from a question's skip link: GA **`Opened Skip Dialog`** then `showDialog(... SkipDialogWidget())`
  (`pages/home_page/home_page_widget.dart:169, 191` and `:1386, 1408`).
- **Closed** three ways, all GA **`Closed Skip Dialog`** (label arg empty): close/X taps (`skip_dialog_widget.dart:95-100`,
  `:184-185`) and the dispose handler (`:40-47`), each followed by `context.safePop()`.
- **Confirm-skip CTA** (`:262-271`): fires GA **`SkipQuiz`** (`:264`) then `redirectToCheckout()` (`:271`).

So the skip flow is: `Opened Skip Dialog` → (user confirms) `SkipQuiz` → `redirectToCheckout`; or
`Opened Skip Dialog` → (user backs out) `Closed Skip Dialog`.

---

## Phase-4 flags (placeholder / non-deterministic content)

- 🔴 `description="ewew"` / `goal="test"` props passed to `DashboardWidget` (`home_page_widget.dart:1263, 1266`) — dead, never rendered.
- 🎲 Match % = `randomInteger(92, 97)` per load (`home_page_widget.dart:1259`); progress bar hard-coded `0.9` (`dashboard_widget.dart:289`).
- 🎲 "Only {N} seats remaining" = `randomInteger(3, 9)` per load (`dashboard_widget.dart:2607`).
- ⚠️ Age avatar filenames (`Under 18`, `25-34`, `35-44`, `45+`) mismatch the actual age brackets (§2b).
- ⚠️ Two checkout event strings differ only by a space — intentional, must be preserved (§5).
- Hard-coded external thumbs from `encrypted-tbn*.gstatic.com` in FinalPitch trigger rows (`final_pitch_widget.dart:1086, 1172`) — fragile Google-cache URLs; flag for replacement.
