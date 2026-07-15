# Full Content Reference — All 20 Active Screens (idx 0 → 19)

> **Purpose.** The exhaustive, VERBATIM content acceptance reference for every active quiz screen: every prompt, sub-instruction, answer label, answer image URL, per-answer reveal, conditional copy variant, illustration, carousel, testimonial, CTA, and skip/secondary UI. Missing content here = missing content in the rebuilt product.
>
> **Companions (do not duplicate):** `quiz-flow.md` (flow/conditions/tracking + the big idx-13 5×5 claim matrix), `screen-detail-idx10-idx13.md` (depth template for idx 10 & 13). This doc adds that depth for the OTHER screens and consolidates everything per-screen.
>
> **Ground truth:** `Flutter Quiz Raw/QuizV2-flutterflow/lib/` — `pages/home_page/home_page_widget.dart` (the PageView), `app_state.dart` (content lists), `templates/*`, `pitch_body_templates/*`, `dashboard/*`, `loading_template/*`, `email_template/*`, `flutter_flow/internationalization.dart` (i18n → English). Cross-checked against `docs/reference/golden/*.png`.
>
> **Scope:** active PageView indices 0 → 19 only. DEAD indices 20 (FinalPitch, not reached in linear flow), 21 (StartLoading, `responsiveVisibility` all-false), 22 (NotUsedHolistic `mindsetState`), 23 (V3 alt start) are EXCLUDED — see `quiz-flow.md` § Excluded DEAD screens. (Their content lists — `mindsetState`, `final_pitch` — are documented at the end as APPENDICES for context, since `final_pitch` shares conditional images with idx 19.)
>
> **Conventions:** "verbatim" strings are reproduced exactly incl. emojis, leading/trailing spaces, and source typos (flagged `[sic]`). Image URLs are exact. The CONTINUE button label is the constant `FFAppConstants.continues = 'CONTINUE'` (`app_constants.dart:7`), orange fill `0xFFFE6903`, white uppercase, shown on `cta` screens (`footer_button_widget.dart:53`). Single-select question screens **auto-advance on tap** (no CTA).

---

## Quick scope table (rebuild sizing)

| idx | Screen | Type | Prompt | Sub-text | Answer options | Per-answer reveals | Other text blocks | Images/graphics | Carousel/testimonial | CTA |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | Start / Goal cover | start single | 1 | 2 (select goal + ↓) | 3 (2 buttons + 1 checkbox) | 0 | logo + skip link | 1 bg + 1 logo | — | tap goal (auto) |
| 1 | Hair type | single image grid | 1 | 0 | 5 | 0 | 0 | 5 answer imgs | — | tap (auto) |
| 2 | Age | single image list | 1 | 0 | 4 | 0 | 0 | 4 answer imgs | — | tap (auto) |
| 3 | Hair concern | single image list | 1 | 1 ("Select one") | 5 | 0 | 0 | 5 answer imgs | — | tap (auto) |
| 4 | Current routine | single title+desc | 1 | 0 | 5 (title+desc each) | 0 | 0 | 0 | — | tap (auto) |
| 5 | Knowledge state | single | 1 (**5 variants by concern**) | 0 | 3 (emoji labels) | 0 | 0 | 0 | — | tap (auto) |
| 6 | Damage Pitch | pitch | 1 (title) | 0 | — | — | 1 RichText body (concern×age conditional) | 1 before/after (concern×age) | — | CONTINUE |
| 7 | Hairqare familiarity | single image list | 1 | 0 | 3 (emoji imgs) | 0 | 0 | 3 answer imgs | — | tap (auto) |
| 8 | Holistic Pitch | pitch | 1 (title HIDDEN) | 0 | — | — | description + claim + valueProp + 4 values | 4 checkmark imgs | 3-img testimonial carousel | CONTINUE |
| 9 | Diet | single image list | 1 | 1 (before-title) | 5 | 0 | 0 | 5 answer imgs | — | tap (auto) |
| 10 | Shampoo spend | single + reveal | 1 | 0 | 4 | 4 (title+desc) | 0 | 4 answer imgs | — | CONTINUE (after select) |
| 11 | Hair myths | multi | 1 | 1 ("Select all…") | 5 + None-of-above | 0 | 0 | 5 answer imgs | — | CONTINUE (≥1) |
| 12 | Damaging practices | multi | 1 | 1 ("Select all…") | 5 + None-of-above | 0 | 0 | 5 answer imgs | — | CONTINUE (≥1) |
| 13 | Damage-Practices Pitch | pitch | 1 (title HIDDEN) | 0 | — | — | desc(activity) + claim(5×5) + conclusion + valueProp | — | 5-img auto carousel (concern) | CONTINUE |
| 14 | Mirror confidence | rating 1–5 | 1 | 1 | 5 (numerals) | 0 | 2 anchors | 0 | — | tap rating (auto) |
| 15 | Comparison | rating 1–5 | 1 | 1 | 5 (numerals) | 0 | 2 anchors | 0 | — | tap rating (auto) |
| 16 | Professional referral | single | 1 | 0 | 3 | 0 | 0 | 0 | — | tap (auto) |
| 17 | Loading | loading | 1 (title) | 0 | — | — | 3 checkpoint lines | 4-img carousel | — | auto-advance |
| 18 | Email capture | email | 1 (headline) | 1 | name+email fields | 0 | subhead + concern line + card hdr + privacy | 0 | — | Submit |
| 19 | Dashboard / result | result (scrolls) | name header | — | — | — | ~22 sections (see § idx 19) | many (concern/age/goal conditional) | before/after carousel + testimonials | JOIN / START × multiple |

---

# idx 0 — Start / Goal cover

- **Screen id / type:** `ImageBackgroundQuesBodyWidget` — start screen (single-select goal). `home_page_widget.dart:147-261`.
- **questionId:** `hairGoal`. **Progression:** auto (tap a goal → next). **Chrome:** no header, no back. **Fit:** yes. **Screenshot:** `00-start.png` (+ skip modal `00b-skip-modal.png`).
- **Tracking:** on load `Quiz Viewed`; on answer `Quiz Started` + `Question Answered`; skip-link `Opened Skip Dialog`.

**Render order (template `image_background_ques_body_widget.dart`):**

1. **Background:** full-bleed `Image.network` (`BoxFit.cover`), the whole screen.
   `https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/sarah-quiz-start-cover.webp` (passed at `home_page_widget.dart:162`; template default fallback `https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66bde2fe72c37fa3520283e2_Quiz%20Start%20Screen%201.webp`).
2. **Logo** (top, `logoShow: true`): `https://assets.hairqare.co/Hairqare_white_logo_1.webp` (white, ~80×18).
3. **Headline (verbatim, hardcoded at `home_page_widget.dart:153`):**
   > See if the Challenge is a fit for you and your hair profile

   (white, Inter w500, 27px, centered.)
4. **Sub-instruction (verbatim, i18n `ixew8z9q`):**
   > Start by selecting your goal:

   followed by an animated **↓ down-arrow icon** (`Icons.keyboard_arrow_down_sharp`, white).
5. **Answer options** (`hairGoal`, `app_state.dart:565-571`) — two side-by-side white buttons + one checkbox row below:

   | # | answerId | label (verbatim) | image URL (in app_state; **not displayed** — these are text buttons) |
   |---|---|---|---|
   | 1 | `goal_hairloss` | I want to stop my hair loss | `https://assets.hairqare.co/mid-hairloss-graphic.webp` |
   | 2 | `goal_betterhair` | I want longer, better looking hair | `https://assets.hairqare.co/mid-hair-graphic.webp` |
   | 3 | `goal_both` | I want both | `https://picsum.photos/seed/682/600` |

   - Buttons 1 & 2 = side-by-side white tappable cards (label only; fallbacks in code: `'I want to stop my hair loss'`, `'I want better hair'`).
   - Option 3 (`I want both`) = a **checkbox + underlined label** row (circular checkbox, fallback label `'I want BOTH'`); tapping the row OR the checkbox records `goal_both` and advances.
6. **Skip link (verbatim, i18n `r3fmpz9h`):**
   > Skip the Quiz

   (white, underlined, bottom of screen) → opens the Skip modal.

**Skip modal** (`SkipDialogWidget`; shown on tapping "Skip the Quiz"; golden `00b-skip-modal.png`):
- Heading (i18n `0cja6uh2`): `⚠️ Before you continue...`
- Body (i18n `biuiym7a`): `Only skip the quiz if you've previously completed it, as it's required to create a personalized routine based on your hair condition, lifestyle, and other key factors.`
- Primary button (i18n `6x7g4z0e`): `BACK TO QUIZ` → fires `Closed Skip Dialog`, dismisses.
- Secondary button (i18n `jn6yshoa`): `SKIP QUIZ` → fires `SkipQuiz` then `redirectToCheckout()` (leaves quiz straight to checkout).

---

# idx 1 — Hair type

- **Type:** `SingleChoiceQuestionLargeImageWidget` — single-select image grid. `home_page_widget.dart:262-298`. questionId derived from answer `.type` = `hairType`. Auto-advance. Screenshot `01-hairtype.png`.
- **Prompt (i18n `g2q0w5rd`):**
  > Which hair type do you have?
- **Sub-question:** none (`bdqv46ra` = empty).
- **Answer options** (`hairType`, `app_state.dart:601-611`) — masonry grid (2-col), each tile = image + label strip:

  | answerId | label | image URL |
  |---|---|---|
  | `hairType_straight` | Straight | `https://assets.hairqare.co/Straight%20Hair%20.webp` |
  | `hairType_wavy` | Wavy | `https://assets.hairqare.co/Wavy%20Hair.webp` |
  | `hairType_curly` | Curly | `https://assets.hairqare.co/Curly%20Hair.webp` |
  | `hairType_coily` | Coily | `https://assets.hairqare.co/Coily%20Hair.webp` |
  | `hairType_unknown` | I don't know | `https://assets.hairqare.co/Q1-Not%20Sure.webp` |

---

# idx 2 — Age

- **Type:** `SingleChoiceQuestionSmalllmageWidget` — single-select image list. `home_page_widget.dart:299-336`. questionId `age`. Auto-advance. Screenshot `02-age.png`.
- **Prompt (i18n `uaeia9o3`):**
  > How old are you?
- **Sub-question / before-title:** none (`zf9jz0od`, `i2ojmi0m` empty; `showBeforeQuestionTitle: false`).
- **Answer options** (`age`, `app_state.dart:641-649`) — each row = small image + label:

  | answerId | label | image URL |
  |---|---|---|
  | `age_18to29` | 18 - 29 | `https://assets.hairqare.co/Age%2018-29.webp` |
  | `age_30to39` | 30 - 39 | `https://assets.hairqare.co/Age%2030-39.webp` |
  | `age_40to49` | 40 - 49 | `https://assets.hairqare.co/Age%2040-49.webp` |
  | `age_50+` | 50 + | `https://assets.hairqare.co/Age%2050%2B.webp` |

---

# idx 3 — Biggest hair concern

- **Type:** `SingleChoiceQuestionSmalllmageWidget` — single image list. `home_page_widget.dart:337-376`. questionId `hairConcern`. Auto-advance. Screenshot `03-hairconcern.png`.
- **Prompt (i18n `15jpp8px`):**
  > What is your biggest hair concern right now?
- **Sub-question (i18n `onimc71u`, verbatim incl. leading space):**
  > ` Select one`
- **before-title:** none (`3qsxpsqp` empty; `showBeforeQuestionTitle: false`).
- **Answer options** (`hairConcern`, `app_state.dart:283-293`):

  | answerId | label | image URL |
  |---|---|---|
  | `concern_hairloss` | Hair loss or hair thinning | `https://assets.hairqare.co/Q3%20Hair%20loss.webp` |
  | `concern_damage` | Damage from dye, heat, or chemical treatments | `https://assets.hairqare.co/Q3%20Damage%20Hair.webp` |
  | `concern_scalp` | Scalp irritation or dandruff | `https://assets.hairqare.co/Q3%20Irritation.webp` |
  | `concern_splitends` | Split ends, frizz, and dryness | `https://assets.hairqare.co/Q3%20Split%20ends.webp` |
  | `concern_mixed` | Other, mixed issues | `https://assets.hairqare.co/Q3%20other.webp` |

> `hairConcern` is the **single most reused conditional key** downstream — it drives copy/images on idx 5, 6, 13, 18, and most of idx 19. Capture it accurately.

---

# idx 4 — Current routine

- **Type:** `TitlesAndDescriptionAnsBodyWidget` — single-select, title + description per option (no images). `home_page_widget.dart:377-409`. questionId `currentRoutine`. Auto-advance. Screenshot `04-currentroutine.png`.
- **Prompt (i18n `zaokmujb`):**
  > What best describes your current haircare routine?
- **Description / sub:** none (`dp0mkedt` empty).
- **Answer options** (`currentRoutine`, `app_state.dart:1076-1086`) — each tile = bold title (with emoji) + grey description:

  | answerId | title (verbatim) | description (verbatim) |
  |---|---|---|
  | `routine_complex` | 🤓 Advanced | Salon visits, premium products, specialists, supplements |
  | `routine_basic` | 🫧 Basic care | Mostly just shampoo and conditioner |
  | `routine_intermediete` [sic] | 🤗 Occasional pampering | Basic care and occasional hair masks |
  | `routine_natural` | 🌿 Natural remedies | Mostly oils, herbs or DIY treatments |
  | `routine_other` | 😌 None of the above | I follow a different haircare routine |

> `currentRoutine` drives the idx-13 claim "despite…" clause (5×5 matrix). `routine_intermediete` spelling is intentional [sic].

---

# idx 5 — Knowledge state (prompt varies by `hairConcern`)

- **Type:** `QuestionAnswerWidget` — single-select (text labels, optional image; none here). `home_page_widget.dart:410-476`. questionId `knowledgeState`. Auto-advance. Screenshot `05-knowledgestate.png`.
- **Prompt** = `"Do you already know exactly " + <suffix>` — **CONDITIONAL on `hairConcern`** (`home_page_widget.dart:414-454`):

  | hairConcern | full prompt (verbatim) |
  |---|---|
  | `concern_hairloss` | Do you already know exactly what's triggering your hair fall or thinning? |
  | `concern_splitends` | Do you already know exactly how you can tame your frizz and dryness? |
  | `concern_scalp` | Do you already know exactly what's behind your scalp irritation or dandruff issues? |
  | `concern_damage` | Do you already know exactly how you can save your hair from further damage? |
  | else (`concern_mixed`, unanswered) | Do you already know exactly what's causing your hair issues? |

  > Note: the apostrophes in source are typographic `'` (U+2019) — "what's". (golden `05-knowledgestate.png` shows the hairloss variant.)
- **Answer options** (`knowledgeState`, `app_state.dart:679-685`) — emoji-prefixed text labels, no images:

  | answerId | label (verbatim) |
  |---|---|
  | `knowledge_yes` | 🙌 Yes, but I need more support |
  | `knowledge_no` | 😢 No and I'm tired of searching |
  | `knowledge_notsure` | 😥 Not sure, it's complicated by myself |

---

# idx 6 — Damage Pitch

- **Type:** `PitchBodySimpleTextImagesBodyWidget` — interstitial pitch. `home_page_widget.dart:477-502`. **Progression:** CONTINUE. **Chrome:** no back. **Tracking:** Continue → `Continued From Pitch` label `Damage Pitch`. Screenshot `06-damage-pitch.png`.
- **Title prop (i18n `7wg3bgoq`, RENDERED, Inter w500 ~22px):**
  > Don't worry! We got you.
- **`description` prop is passed but NOT rendered** (`blcnnajw` empty; only assigned to model). The body is a hardcoded conditional RichText.

**Render order (template `pitch_body_simple_text_images_body_widget.dart`):**

1. **Before/after image** (`BoxFit.contain`, rounded 8) — **CONDITIONAL on `hairConcern` × `age`** (baked into template, NOT a prop):

   | condition (first match wins) | image URL |
   |---|---|
   | `concern_hairloss` AND `age_18to29` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Aleeyah_before-after.webp` |
   | `concern_splitends` | `https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/P5%20Split%20Ends.webp` |
   | `concern_scalp` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/alina-before-after.webp` |
   | `concern_damage` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/bella-before-after.webp` |
   | `concern_hairloss` AND `age_30to39` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Aleeyah_before-after.webp` |
   | `concern_hairloss` AND `age_40to49` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/anna-before-after-smaller.webp` |
   | `concern_hairloss` AND `age_50+` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/anna-before-after-smaller.webp` |
   | else / fallback | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/claudia-large-before-after.webp` |

2. **Title** (the rendered "Don't worry! We got you.").
3. **Body RichText** (assembled from spans, all **CONDITIONAL**) =
   `"Did you know research shows that" + <%> + " of women, struggling with" + <concern phrase> + <age phrase> + <outcome phrase> + " within 14 days of switching to a holistic haircare routine."`

   - `<%>` by concern (leading space): hairloss `" 96.3%"` · splitends `" 92.5%"` · scalp `" 93.8%"` · damage `" 91.2%"` · else `" over 90%"`
   - `<concern phrase>` (leading space): hairloss `" hair loss and thinning"` · splitends `" split ends and dryness"` · scalp `" dandruff and scalp irritation"` · damage `" damaged hair and breakage"` · else `" mixed hair issues"`
   - `<age phrase>` (leading space): `age_18to29` `" in their twenties,"` · `age_30to39` `" in their thirties,"` · `age_40to49` `" in their fourties,"` [sic] · `age_50+` `" after the age of 50,"` · else `" regardless of their age,"`
   - `<outcome phrase>` (leading space): hairloss `" see visibly denser and thicker hair"` · splitends `" see visibly see visibly denser hair and less frizz"` [sic — duplicated "see visibly"] · scalp `" stop experiencing scalp irritation and flakes"` · damage `" experience less breakage and more density"` · else `" achieve visibly better hair"`
   - Static tail (i18n `5rp2c0xu`): `" within 14 days of switching to a holistic haircare routine."`

   Example (hairloss, 30s): *"Did you know research shows that 96.3% of women, struggling with hair loss and thinning in their thirties, see visibly denser and thicker hair within 14 days of switching to a holistic haircare routine."*
4. **CONTINUE** button (orange, pinned bottom).

> No testimonial card / no star rating on idx 6.

---

# idx 7 — Hairqare-method familiarity

- **Type:** `SingleChoiceQuestionSmalllmageWidget` — single image list. `home_page_widget.dart:503-542`. questionId `hairqare`. Auto-advance. **Chrome:** no back. Screenshot `07-hairqare-familiarity.png`.
- **Prompt (i18n `m7uh7oex`):**
  > How familiar are you with HairQare and our approach to holistic haircare?
- **Sub / before-title:** none (`646rpwwb`, `rn48g3to` empty).
- **Answer options** (`hairqareKnowledge`, `app_state.dart:715-721`) — small emoji images + labels:

  | answerId | label (verbatim) | image URL |
  |---|---|---|
  | `hairqare_unknown` | I'm hearing about it for the first time | `https://assets.hairqare.co/emoji-1.webp` |
  | `hairqare_notunknown` | I know a few things | `https://assets.hairqare.co/emoji-3.webp` |
  | `hairqare_familiar` | Yes, I know everything about it | `https://assets.hairqare.co/emoji-2.webp` |

  > Label apostrophe is typographic ("I'm"). CDP note: `hairqare` maps to AC `field_56` (shared with `mindsetState`) — see `cdp-coupon-map.md`.

---

# idx 8 — Holistic Pitch

- **Type:** `PitchBodyDetailedTextImagesWidget` — interstitial pitch. `home_page_widget.dart:543-586`. **Progression:** CONTINUE. **Chrome:** no back. **Tracking:** Continue → `Continued From Pitch` label `Holistic Pitch`. Screenshot `08-holistic-pitch.png`.

**Props & render order (template `pitch_body_detailed_text_images_widget.dart`):**

1. **Title** (i18n `g791wwh4` = `Beautiful hair needs more than just products.`) — **HIDDEN** (`responsiveVisibility` all-false; never shown on any breakpoint).
2. **Description** (i18n `5begehn5`, RENDERED, normal, verbatim incl. trailing space):
   > Our evidence-based programs are developed by Sarah Tran, a certified hair loss specialist, along with a team of researchers, formulation scientists, and medical professionals.
3. **Claim** (i18n `dnzs3t47`, RENDERED, w500):
   > Clinically proven to heal your hair quickly and permanently.
4. **ValueProp** (i18n `s3viwwxq`, RENDERED, theme-`secondary` color, w500):
   > Proven Results for:
5. **4-value checkmark grid** (each = checkmark image `https://assets.hairqare.co/checkmark-medium.webp` + value text). Layout: col1 = value1(top)/value3(bottom), col2 = value2(top)/value4(bottom):
   - value1 (i18n `dhw0xi88`, verbatim incl. trailing space): `Any hair concern `
   - value2 (i18n `vyzhveff`): `Any age`
   - value3 (i18n `t05pit2o`): `Any hair type`
   - value4 (i18n `kuvd0wnn`): `Any hair goal`
6. **Divider** (thickness 2, theme `alternate`).
7. **Testimonial carousel** (`CarouselSlider`, autoPlay, interval ~3.8s, `initialPage: 1`, `enlargeCenterPage`) — **3 fixed images** (`BoxFit.contain`):
   - `https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/67098b9996f780267051a1eb_Pitch%202%20Lindsey.webp`
   - `https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/67098b996a9a2ab7893daea6_Pitch%202%20beingdani.webp`
   - `https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/67098b98dd5e7ffff5bd68d8_Pitch%202%20Melodie.webp`
8. **CONTINUE** button (orange, pinned bottom).

> `image` prop exists (default `Dont%20Know%20Hair.webp`) but is NEVER rendered. No star-rating widget (testimonials are baked images).

---

# idx 9 — Diet

- **Type:** `SingleChoiceQuestionSmalllmageWidget` — single image list. `home_page_widget.dart:587-623`. questionId `diet`. Auto-advance. **Chrome:** no back. Screenshot `09-diet.png`.
- **Prompt (i18n `khaadglv`):**
  > What best describes your diet?
- **Before-title (i18n `x3t83a7y`, `showBeforeQuestionTitle: true` — shown ABOVE the prompt):**
  > What we eat affects our hair growth and quality.
- **Sub-question:** none (`subQuestion: ''`).
- **Answer options** (`diet`, `app_state.dart:791-801`):

  | answerId | label | image URL |
  |---|---|---|
  | `diet_processed` | Fast food / Processed food diet | `https://assets.hairqare.co/Mostly%20unhealthy%20diet.webp` |
  | `diet_balanced` | Balanced / Whole foods | `https://assets.hairqare.co/Healthy%20and%20balanced%20diet.webp` |
  | `diet_custom` | Custom nutrition protocol | `https://assets.hairqare.co/Professional%20planned%20diet.webp` |
  | `diet_vegan` | Vegan / vegetarian | `https://assets.hairqare.co/Vegan-vegetarian%20diet.webp` |
  | `diet_other` | Something else | `https://assets.hairqare.co/None.webp` |

---

# idx 10 — Shampoo spend (single-select + per-answer reveal)

- **Type:** `QuestionAnswerAdditionlInfoWidget` (+ `AnimatedText` reveal card). `home_page_widget.dart:624-665`. questionId `shampooSpending`. **Progression:** selecting reveals a card AND a CONTINUE button (effectively `cta`). Screenshots `10-shampoo-spend.png`, `10b-reveal.png`.
- **Prompt (i18n `25wr54y6`):**
  > How much do you spend on a bottle of shampoo?
- **Answer options + reveals** (`shampooSpending`, `app_state.dart:831-839`) — image tile (75×75) + label; on tap a yellow reveal card (📚 + typewriter title + body) appears ABOVE the list:

  **Option 1 — `spend_under10`** · label `Less than $10` · image `https://assets.hairqare.co/Less%20than%20%2410.webp`
  - Reveal title: `Awesome 🤩 you're budget conscious!`
  - Reveal body: `You can actually have amazing results without spending more than you do now (or even less) while avoiding harmful products that secretly ruin your hair. You just need the right routine for your unique situation.`

  **Option 2 — `spend_10to20`** · label `$10 - $20` · image `https://assets.hairqare.co/%2410%20-%20%2420.webp`
  - Reveal title: `Amazing 🙌 you value your hair!`
  - Reveal body: `You're spending thoughtfully, but likely still paying for marketing rather than results. With the right routine, you could get truly transformative results tailored to your unique needs without spending more.`

  **Option 3 — `spend_20to50`** · label `$20 - $50` · image `https://assets.hairqare.co/%2420-%2450.webp`
  - Reveal title: `You clearly care about your hair 💜`
  - Reveal body: `Did you know, in premium haircare up to 90% of what you're paying goes to packaging and marketing, not quality ingredients? With the right routine, you can actually get the premium results you're looking for without the price tag.`

  **Option 4 — `spend_over50`** · label `More than $50` · image `https://assets.hairqare.co/More%20than%20%2450.webp`
  - Reveal title: `Your hair deserves the best ✨`
  - Reveal body: `Did you know premium haircare often uses the same ingredients as budget options? With the right personalized routine, you can actually achieve the results those luxury brands are just promising.`

- **CTA:** CONTINUE (orange, appears after a selection). Reveal card = bg `0xFFFFF9E6`, border `0xFFFFE6B3`, 📚 leading emoji, typewriter animation. (Full styling: `screen-detail-idx10-idx13.md`.)

---

# idx 11 — Hair myths (multi-select)

- **Type:** `MultiChoiceWithImageQuestionCheckBoxWidget`. `home_page_widget.dart:666-697`. questionId `hairMyth`. **Progression:** CONTINUE, gated ≥1 selection. Screenshots `11-hairmyths.png`, `11b-multiselect-enabled.png`.
- **Prompt (i18n `rihaqphi`):**
  > Which of these hair care myths do you believe?
- **Sub-instruction (i18n `7o5y8tc0`):**
  > Select all that apply
- **Answer options** (`hairMyth`, `app_state.dart:871-881`) — image tile + checkbox + label (multi-select; ids in the `Id` field):

  | answerId | label (verbatim) | image URL |
  |---|---|---|
  | `myth_rosemary` | Rosemary oil is reduces hair loss [sic] | `https://assets.hairqare.co/Rosemary%20Oil.webp` |
  | `myth_coconut` | Coconut oil is the best hair oil | `https://assets.hairqare.co/Coconut%20Oil.webp` |
  | `myth_ricewater` | Rice water makes hair grow faster | `https://assets.hairqare.co/Rice%20Water.webp` |
  | `myth_organic` | Natural / organic products are better | `https://assets.hairqare.co/Natural.webp` |
  | `myth_nopoo` | Not washing hair is good for the scalp | `https://assets.hairqare.co/Not%20Washing.webp` |

- **Extra option (live, ISSUES #7):** a **None of the above** button (i18n `1var0gwm`) below the 5 tiles.
- **CTA:** CONTINUE (only rendered when ≥1 option selected).

---

# idx 12 — Damaging practices (multi-select)

- **Type:** `MultiChoiceWithImageQuestionCheckBoxWidget`. `home_page_widget.dart:698-729`. questionId `hairDamageActivity`. **Progression:** CONTINUE, gated ≥1. Screenshot `12-damaging-practices.png`.
- **Prompt (i18n `ugf9xggr`):**
  > Select the damaging practices that you regularly do
- **Sub-instruction (i18n `7o5y8tc0`):**
  > Select all that apply
- **Answer options** (`hairDamageActivity`, `app_state.dart:914-924`):

  | answerId | label (verbatim) | image URL |
  |---|---|---|
  | `damageAction_heat` | Heat styling | `https://assets.hairqare.co/heat.webp` |
  | `damageAction_dye` | Bleaching / hair colouring | `https://assets.hairqare.co/dye.webp` |
  | `damageAction_sun` | Sun exposure | `https://assets.hairqare.co/sun.webp` |
  | `damageAction_swimming` | Frequent swimming | `https://assets.hairqare.co/swim.webp` |
  | `damageAction_hairstyles` | Tight hair styles (braids, bun, ponytail...) | `https://assets.hairqare.co/hairstyle.webp` |

  > **Display order ≠ id order:** the list renders sun (3rd) before swimming (4th); ids stay as above.
- **Extra option:** **None of the above** (i18n `1var0gwm`).
- **CTA:** CONTINUE (gated ≥1). `hairDamageActivity` drives the idx-13 description fragment.

---

# idx 13 — Damage-Practices Pitch

- **Type:** `PitchBodySimpleDetailedTextImagesWidget` — interstitial pitch. `home_page_widget.dart:730-1045`. **Progression:** CONTINUE. **Chrome:** no back. **Tracking:** Continue → `Continued From Pitch` label `Damage Practices Pitch`. Screenshot `13-damage-practices-pitch.png`.

> **Full depth in `screen-detail-idx10-idx13.md`.** Summary of render order + the conditional rules (do not re-transcribe the 5×5 — see `quiz-flow.md` Table 3):

1. *(Title `o7lj8r75` = empty AND hidden — never shown.)*
2. **Description** (`home_page_widget.dart:737-794`) = `"With the right routine it's fine to " + <fragment>`, fragment by `hairDamageActivity` (first match wins): heat/dye/hairstyles → `to style, curl or color your hair. ` (note duplicated "to to" [sic]) · swimming/sun → `live an active lifestyle.` · else → `style your hair any way you like and do the activities you enjoy.`
3. **Claim** — the **5×5 conditional** (`currentRoutine` × `hairConcern`). Template: `"But if you are still struggling with" + <concern phrase> + <routine tail> + ", you're missing important haircare knowledge. "`. Full matrix = `quiz-flow.md` Table 3.
4. **Conclusion** (i18n `6beos8zn`, w500): `That's why nothing has worked so far.`
5. **Divider** (thickness 2) + **valueProp** (i18n `xgrtm968`, theme-`secondary`): `Here is what you can achieve in 14 days of following the right routine for your hair:`
6. *(value1–value4 = empty, never rendered.)*
7. **5-image auto-play carousel** (`viewportFraction 0.74`, autoPlay 3.1s) — items 1–3 CONDITIONAL on `hairConcern`, items 4–5 fixed. Full per-concern URL tables in `screen-detail-idx10-idx13.md` § 3. Item 4 fixed `https://pub.hairqare.co/easy-unlearn-garbage.webp`; item 5 fixed `https://assets.hairqare.co/text-only-recommended-testimonial.webp`.
8. **CONTINUE** button (orange).

> The "Melissa Klinefelter / 5-star / Fully recommend…" testimonial card belongs to a **separate** `ManualCarusell` component **not wired into idx-13** — see `screen-detail-idx10-idx13.md` § 3 reference note.

---

# idx 14 — Mirror confidence (rating 1–5)

- **Type:** `RatingQuestionOptionsWidget` — 1–5 Likert. `home_page_widget.dart:1046-1089`. questionId `confidence`. **Progression:** tapping a rating button records + advances (auto). Screenshot `14-mirror-confidence.png`.
- **Sub-question** (i18n `ltw8dxc6`, shown ABOVE prompt; hidden on desktop):
  > How much do you relate to the following statement?
- **Prompt / statement (i18n `vazebtnl`):**
  > My reflection in the mirror affects my mood and self-esteem.
- **Rating scale:** five 50×50 buttons labelled **1, 2, 3, 4, 5** (plain numerals — i18n `09emjmhf`/`jdaoyjnt`/`n9815tnp`/`bex1s1ta`/`3n1wpdrn`; values `'1'`–`'5'`). No emojis.
- **Anchor labels** (row below buttons):
  - Left (i18n `kfse574s`): `Not at all`
  - Right (i18n `9qrzqazn`): `Totally`

---

# idx 15 — Comparison (rating 1–5)

- **Type:** `RatingQuestionOptionsWidget` — 1–5 Likert (same template as idx 14). `home_page_widget.dart:1090-1133`. questionId `comparison`. Auto-advance on rating tap. Screenshot `15-comparison.png`.
- **Sub-question (i18n `j1jzv4xz`):**
  > How much do you relate to the following statement?
- **Prompt / statement (i18n `zcjftwlh`):**
  > I tend to compare my hair to others' and it makes me frustrated.
- **Rating scale:** 1, 2, 3, 4, 5 (numerals). **Anchors:** `Not at all` (left) / `Totally` (right).

---

# idx 16 — Professional referral

- **Type:** `QuestionAnswerWidget` — single-select (text labels). `home_page_widget.dart:1134-1163`. questionId `professionalReferral`. Auto-advance. Screenshot `16-professional-referral.png`.
- **Prompt (i18n `hoc1sdcs`):**
  > Did a professional refer you to us?
- **Answer options** (`professionalReferral`, `app_state.dart:958-964`) — text only (images empty):

  | answerId | label |
  |---|---|
  | `professional_yes` | Yes |
  | `professional_no` | No |
  | `professional_self` | I'm a professional |

---

# idx 17 — Loading

- **Type:** `LoadingScreenBeforeResultWidget`. `home_page_widget.dart:1164-1180`. **Progression:** auto-advance when the progress bar completes (~3 checkpoints, `delay: 1000`). **Chrome:** no back. Screenshot `17-loading.png`.

**Render order (template `loading_screen_before_result_widget.dart`):**

1. **Title** (i18n `thdd4opu` — the rendered title; the `title` prop `44639e0e`="Creating your personalized haircare program" is passed but NOT used):
   > The only haircare program you'll ever need
2. **Image carousel** (`HairCareSliders`, autoPlay 1.2s) — source `FFAppState().imageList` (`app_state.dart:404-409`), 4 images:
   - `https://assets.hairqare.co/Hair-Routine_TP-Updated.webp`
   - `https://assets.hairqare.co/illustration-tp-91.webp`
   - `https://assets.hairqare.co/Hair%20Routine-04.webp`
   - `https://assets.hairqare.co/Hair%20Routine-05.webp`
3. **Progress bar** (`LoadingProgressBar`, 3 items, gradient fill; on complete → auto-advance).
4. **Checkpoint list** (each row = local checkmark `assets/images/m9sar_.png` + text) — source `FFAppState().beforeLoadingData` (`app_state.dart:66-70`), 3 lines, staggered fade-in:
   - `Checking your hair condition`
   - `Analysing your routine`
   - `Checking your challenge-fit`

> The `loadingWidget` list (`app_state.dart:324-329`: "🚫 No more hidden harmful ingredients." etc.) is NOT used by this screen.

---

# idx 18 — Email capture / contact details

- **Type:** `LoginComponentWidget`. `home_page_widget.dart:1181-1252`. **Progression:** Submit. **Chrome:** no back, no progress. **Tracking:** on load `Quiz Completed` (stage `Contact Details Form`); on submit `Quiz Submitted` + webhook (`webhookCallQuizProfile`) + Converge (`webhookCallcvg`). Screenshot `18-email-capture.png`.

**Render order (template `login_component_widget.dart`):**

1. **Headline** (i18n `1e5gv14v`):
   > Your results are ready!
2. **Subhead** (i18n `a2n3qu3n`):
   > On the next screen, you'll see if the Challenge can help you achieve your hair goal.
3. **Concern-resolution line** = `<concernResolutionChance> + " 🔒"`. The prop is **CONDITIONAL on `hairConcern`** (`home_page_widget.dart:1186-1228`): `"Probability to fix your " + <phrase> + " in 14 days:"` + ` 🔒`:

   | hairConcern | phrase | full line (verbatim) |
   |---|---|---|
   | `concern_hairloss` | hair loss | Probability to fix your hair loss in 14 days: 🔒 |
   | `concern_splitends` | split-ends | Probability to fix your split-ends in 14 days: 🔒 |
   | `concern_scalp` | scalp issues | Probability to fix your scalp issues in 14 days: 🔒 |
   | `concern_damage` | damaged hair | Probability to fix your damaged hair in 14 days: 🔒 |
   | else | hair problems | Probability to fix your hair problems in 14 days: 🔒 |

   (template default if prop null: `Probability to achieve your hair goal 🔒`.)
4. **Progress bar** (`LoginProgressBar`, animates to 80%; gradient fill). (`progressBarValue` prop = 90.0 is passed but the widget uses `maxProgress: 80.0`.)
5. **Gradient form card** (periwinkle gradient, plum border):
   - **Card header** (i18n `9kxb0hra`, literal newline after "details"):
     > Enter your details
     > to unlock your results 🔐
   - **Name field** — label `Name` (i18n `dhice1ou`); validation (not shown unless triggered): `Name is required`.
   - **Email field** — label `Email` (i18n `76eyp598`); validation: `Email is required` / `Please enter valid email`.
   - **Submit button** — label **`Submit`** (hardcoded literal, orange fill, rounded-100).
6. **Privacy text** (i18n `glfaezfb`, grey, verbatim incl. trailing space):
   > Your info is 100% secure and never shared with third parties.

> No social-proof imagery on this screen.

---

# idx 19 — Dashboard / Result page (TERMINAL, the ONLY scrolling screen)

- **Type:** `DashboardWidget`. `home_page_widget.dart:1253-1296`. Scrolls vertically. **Props:** `name` = submitted name, `percentage` = `randomInteger(92,97)` (`home_page_widget.dart:1256-1267`). **Tracking:** on load `Viewed Results Page` (extra `Result Page`). CTAs → `Go to  checkout` (TWO spaces) + `redirectToCheckout()`. Screenshot `19-dashboard-live.png`.

> The widget reads `FFAppState().submittedContactDetails.name` directly (the `name` prop is largely ignored). All `<name>` below = that submitted name. Sections IN RENDER ORDER:

### S1 — Congratulations header (`dashboard_widget.dart:146-179`)
> Congratulations, `<name>`!  *(if name empty → "Congratulations, 🎉!")*

### S2 — Perfect-fit subheader (`:186-216`, i18n `qm88njuv`)
> You are a perfect fit for the Haircare Challenge 😍

### S3 — Matching-score card (`:217-415`, gradient `0xFFF2B485`→tertiary)
- `26c1jnac`: **Your matching score is**
- Green progress bar — **hardcoded `percent: 0.9`** (always 90% fill) [⚠️ see flag below].
- Percentage text: `<percentage>%` (the random 92–97; fallback `90`).
- Static: **That's an outstanding score!**
- **CONDITIONAL on `hairGoal`** (`:360-410`):
  - `goal_hairloss`: 9 out of 10 women with this score said their shedding stopped, and they started seeing new baby hairs after the challenge.
  - `goal_betterhair`: 9 out of 10 women with this score said their hair felt softer, healthier, and looked better after the challenge. *(trailing space)*
  - `goal_both` / else: 9 out of 10 women with this score said their shedding stopped, and their hair looked and felt better after the challenge.

### S4 — Profile / "My Goal" / timeline card (`:416-953`, gradient alternate→`0xFFC4D0FF`)
- **Avatar SVG, CONDITIONAL on `age`** (`:470-522`):
  - `age_18to29` → `https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66b37050731caef7208325c3_Under%2018.svg`
  - `age_30to39` → `…/66b3705002a6a9516930e533_25-34.svg`
  - `age_40to49` → `…/66b3705003f42517011b493e_35-44.svg`
  - `age_50+` → `…/66b370508968423fab443088_45%2B.svg`
  - else → `…/66b3705002a6a9516930e533_25-34.svg`
- Name: `<name>`.
- **Age label, CONDITIONAL on `age`** (`:565-609`): `age_18to29` → "In my 20s" · `age_30to39` → "In my 30s" · `age_40to49` → "In my 40s" · `age_50+` → "Age 50+" · else → "Summary".
- `afncsqx6`: **My Goal: **
- **Goal text, CONDITIONAL on `hairConcern`** (`:689-744`):
  - `concern_hairloss`: Denser hair and noticeable regrowth that fills in sparse areas, so I can have peace of mind and feel beautiful again . *(verbatim space before period)*
  - `concern_splitends`: Smoother, frizz-free hair that makes me feel confident and put-together every day.
  - `concern_scalp`: A calm, itch and flake free scalp that allows me to go through my day without constant distraction or embarrassment from scratching.
  - `concern_damage`: Stronger, more resilient hair that I can style daily without guilt or worry about damage.
  - else: Healthy, problem-free hair that behaves exactly how I want it to, letting me enjoy my hair without constantly battling different problems.
- `aq4pinvd`: **Your hair transformation timeline:**
- **Top decoration image, CONDITIONAL on `hairConcern`** (`:826-872`, prefix `https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/`):
  hairloss `RP%20Hairloss.webp` · splitends `RP%20Split%20ends.webp` · scalp `RP%20Dandruff.webp` · damage `RP%20Damage.webp` · else `RP%20Others.webp`
- **Timeline image, CONDITIONAL on `hairConcern`** (`:886-926`, same prefix):
  hairloss `RP%20hairloss%20timeline.webp` · splitends `RP%20Split%20ends%20timeline.webp` · scalp `RP%20dandruff%20timeline.webp` · damage `RP%20damage%20timeline.webp` · else `RP%20others%20timeline.webp`

### S5 — "You deserve this" (`:954-981`, orange)
> You deserve this, `<name>`!

### S6 — Join line, CONDITIONAL on `hairConcern` for the noun (`:982-1048`)
> Join the 14-Day Haircare Challenge  and  say goodbye to your `<X>` permanently with a routine that works.

where `<X>` = hairloss "hair loss" · splitends "split-ends" · scalp "scalp issues" · damage "damaged hair" · else "chronic hair problems". *(verbatim double spaces around "and".)*

### S7 — (`:1049-1072`, italic)
> ` No more frustration or disappointments!` *(leading space)*

### S8 — Three ✅ benefit rows (`:1073-1279`)
- ✅ Target the root causes of your hair issues and stop them from coming back.
- ✅ Build a personalized, easy-to-follow haircare plan tailored to your unique needs.
- ✅ Create your own gentle, DIY shampoo & conditioner for lasting results

### S9 — CTA #1 (`:1280-1359`, i18n `tvn54o9f`, orange)
> JOIN THE CHALLENGE

→ `reserveMySeatAction` → `Go to  checkout` (TWO spaces) + `redirectToCheckout()`.

### S10 — 200k social proof (RichText, `:1360-1462`)
> **200,000+ women ** *(orange)* + **have taken this challenge, and ** + **92% of finishers said "It has changed their life".** *(orange)*

(spans `2cdo81nl` / `clhaelj4` / `fwse24sg`. Note de/es localizations say "91,000+"; EN is 200,000+.)

### S11 — Trustpilot/rating image (`:1463-1512`)
`https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Rating%20image.webp`

### S12 — Before/after carousel (`:1513-1733`, `enlargeCenterPage`, infinite, autoPlay off) — 7 slides:
- **Slide 1, CONDITIONAL on `hairConcern`** (prefix `https://pub.hairqare.co/cdn-cgi/image/width=450,quality=85,format=auto/`): splitends `bella-before-after.webp` · damage `Damage_Hair_1_Testimonial.webp` · hairloss `ji-woo-before-after.webp` · scalp `Irritation_or_dandruff_1_Testimonial.webp` · mixed/else `alina-before-after-front.webp`
- **Slide 2, CONDITIONAL:** splitends `Split_ends_frizz_dryness_2_testimonial.webp` · damage `anna-before-after-smaller.webp` · hairloss `Hair_Loss_2_Testimonial.webp` · scalp `Irritation_or_dandruff_2_Testimonial.webp` · mixed/else `ariadna-before-after.webp`
- **Slide 3, CONDITIONAL:** splitends `Split_ends_frizz_dryness_3_testimonial.webp` · damage `Damage_Hair_3_Testimonial.webp` · hairloss `Hair_Loss_3_Testimonial.webp` · scalp `Irritation_or_dandruff_3_Testimonial.webp` · mixed/else `Others_3_testimonial.webp`
- **Slides 4–7 fixed** (same `width=450` prefix): `3_BH.webp` · `Better_Hair_4.webp` · `4_BH.webp` · `8_HL.webp`

### S13 — CTA #2 (`:1734-1811`, i18n `phsineyb`, orange)
> START MY CHALLENGE  → `reserveMySeatAction`.

### S14 — "10 min a day" RichText (`:1812-1926`)
> Based on your answers, you just need + `\n`**10 min a day, for 14 days**`\n` + to get beautiful and healthy hair that turns heads and boosts your confidence every single day.

(spans `x0h469el` / `u03zkhmn` / `lxtttebt`.)

### S15 — Days graphic (`:1927-1941`)
`https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Result%20Page-%20Days%20Images.webp`

### S16 — "100% Results / 0% Hassle" badges (`:1942-2023`, plum)
> 100%\nResults  ·  0%\nHassle  (i18n `rpb2l5tr` / `7qu4hw6f`)

### S17 — 3-point value card (`:2024-2497`, each = local icon + RichText)
- `Group_(8).png` + **Science-based and ** + **reviewed by haircare experts.**
- `Group_(9).png` + **Get a ** + **nutrient-rich meal plan ** + to minimise hair loss and enhance hair thickness.
- `Icons_(1).png` + **Save thousands ** + on products and salon treatments you won't need anymore.

### S18 — Testimonial image #1 fixed (`:2498-2528`)
`https://pub.hairqare.co/cdn-cgi/image/width=400,quality=85,format=auto/lucia-busy-short.webp`

### S19 — Testimonial image #2, CONDITIONAL on `hairConcern` (`:2529-2598`, prefix `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/`):
splitends `Frizzy_hair_Testimonial_Result_Page_2.webp` · damage `Color_Damage_Testimonial_Result_Page_1.webp` · hairloss `marisol-before-after.webp` · scalp `Dandruff_Testimonial_Result_Page_1.webp` · else `Other_issues_Testimonial_Result_Page_1.webp`

### S20 — Scarcity / seats (`:2599-2633`)
> Only `<N>` seats remaining. Hurry Up!  *(N = `randomInteger(3,9)`, fallback 7)*

### S21 — CTA #3 (`:2634-2735`, i18n `8p79eqjq`, orange)
> START MY CHALLENGE  → `reserveMySeatAction`.

### S22 — Refund guarantee footer (`:2736-2774`, i18n `6kg20sml`, periwinkle)
> 100% Refund guarantee | No Questions Asked

### Overlay — redirect loader (`:2778-2803`)
When `showResultPageredirectLoader == true`: full-screen 0.7-opacity Lottie `https://lottie.host/016d1410-f58a-4084-ab24-042294afa7b8/aInCgIkJOA.json`.

### Sticky bottom bar — `FloatingTimerCheckoutWidget` (`:2804-2808`)
- Left (i18n `mtbfmoax`): **85% OFF valid for:** + countdown `mm:ss` (from `FFAppState().timerSecElapsed`).
- **Timer config:** `StopWatchTimer(mode: StopWatchMode.countDown)`, `timerInitialTimeMs = 0`, started on load; displayed value seeded from `timerSecElapsed` (the pitch dialog sets it to 1800000 ms = 30:00).
- Right button: text `JOIN` (or `Loading ...`) → fires **`Go to checkout` (ONE space)** + `redirectToCheckout()`.

> **⚠️ Source vs screenshot flags (idx 19):**
> 1. The match-score progress bar is hardcoded `percent: 0.9` (always 90% fill) in source, but `19-dashboard-live.png` shows ~94% fill tracking the 94% number — possible live/source drift. The **number** is dynamic (random 92–97); the **bar** is fixed at 0.9 in this source.
> 2. EN "200,000+ women" vs localized de/es "91,000+".
> 3. Screenshot is a QA build (placeholder name "QA Dashboard Test!"); section order otherwise matches source exactly.

---

# APPENDIX A — Pricing / plan content (used by the plan dialog & final pitch; reached from idx 19 CTAs leaving to checkout)

> Not part of the linear 0→19 viewport flow, but the plan dialog (`pitch_plan_dialog`) is opened from the result/final-pitch CTAs, so its content is catalogued here.

**`PlanData`** (`app_state.dart:484-487`): one plan — title `14 Day Challenge`, actualPrice `300`, discountedPrice `37`, perDayActualPrice `300`, discountedPerDayPrice `85`, popular `true`.

**`personalPlan`** bonus modules (`app_state.dart:517-536`) — each shown as title + struck `$<price>` + `$0`:
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

**Plan dialog (`pitch_plan_dialog_widget.dart`) key copy:**
- Header (i18n `hgyl4nrl`): Your Haircare Challenge Plan
- Banner: **YOUR DISCOUNT** (`b1ck4ulz`) + ** IS STILL RESERVED FOR:** (`vu8o4qzc`) + countdown.
- Mockup image: `https://assets.hairqare.co/bhc-mockup-orange.webp`
- `5ths0qr4`: 14 Day Plan
- **Plan name, CONDITIONAL on `hairConcern`** (`:395-443`): hairloss "Hair Density Boost" · splitends "Hair Strength Boost" · scalp "Calm Scalp Boost" · damage "Hair Strength Boost" · else "Hair Health Boost".
- `iu28pmt3`: Full Access · `ichnww2b` + `h4mmue8a`: Based on your profile, we've added these modules to your plan to ensure success:
- CTA (i18n `32vzsk0t`): **START NOW →** → `Go to  checkout` (TWO spaces, extra `Plan Details`) + `redirectToCheckout()`.

---

# APPENDIX B — Final Pitch (DEAD idx 20, context only)

`FinalPitchWidget` (`home_page_widget.dart:1297-1304`, `previousDiscountPercentage: 30`, `discountPercentage: 85`) is NOT reached in the linear flow (idx-19 CTAs leave to checkout). It shares the concern-conditional hero/timeline images with idx 19 (from `https://assets.hairqare.co/...` without the cdn-cgi transform: `RP%20Hairloss.webp`, `RP%20Split%20ends.webp`, `RP%20Dandruff.webp`, `RP%20Damage.webp`, `RP%20Others.webp` + `…%20timeline.webp`). Headline (i18n `0r9t3oy8`): "We've found the right \nHaircare Program for you 🎉". Bottom CTA (i18n `99ghm8vs`): **GET MY PLAN** → `Opened Plan Details` → opens the plan dialog. Full breakdown available in source if idx 20 is ever revived.

---

# APPENDIX C — `mindsetState` (DEAD idx 22, context only)

`mindsetState` (`app_state.dart:751-759`) feeds only the unreachable idx-22 holistic screen. Options (answer / reveal title / reveal body), for completeness:
| answerId | answer | image | reveal title | reveal body |
|---|---|---|---|---|
| `mindset_aware` | Yes, definitely | `…/Natural.webp` | You're absolutely right! | Diet, stress, environment, and internal health all impact your hair. Our holistic approach addresses ALL these factors for truly transformative results. |
| `mindset_unsure` | Maybe, I'm not sure | `…/None.webp` | You're on the right track! | (same body as above) |
| `mindset_unaware` | I've never considered that | `…/Occasional.webp` | You'll be surprised! | (same body as above) |
| `mindset_oblivious` | No, I just need the right product | `…/Basic%20care.webp` | It's a common misconception | Most women focus only on external treatments, missing 50% of what determines hair health. Our approach changes that by addressing both internal and external factors for complete hair transformation. |

(All images prefixed `https://assets.hairqare.co/`. The idx-22 prompt is hardcoded: "Do you believe your hair problems could be influenced by factors beyond just products?")

---

## Catalogue counts

- **Active screens documented:** 20 (idx 0–19) + 3 appendix content sets.
- **Verbatim text blocks catalogued:** ~150 (prompts, sub-instructions, answer labels, reveals, pitch bodies, all idx-19 sections, conditional variants, skip modal, CTAs).
- **Image/illustration URLs catalogued:** ~115 (answer-option images, pitch before/afters, carousels, idx-19 conditional hero/timeline/testimonial/avatar sets, fixed graphics, plan mockup, Lottie).
- **Per-answer reveals:** idx 10 (4) + appendix mindsetState (4) = 8.
- **Carousels:** idx 8 (3-img), idx 13 (5-img conditional), idx 17 (4-img), idx 19 before/after (7-slide conditional).
</content>
</invoke>
