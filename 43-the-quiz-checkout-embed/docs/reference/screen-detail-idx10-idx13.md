# Screen Detail — idx-10 (Shampoo Spend) & idx-13 (Damage-Practices Pitch)

Fidelity rebuild reference. All strings are **verbatim** from the Flutter source. Image URLs are **exact**. `file:line` citations are relative to `QuizV2-flutterflow/lib/`.

> **Source note:** The references `docs/reference/golden/*.png` and `docs/reference/quiz-flow.md` do **not** exist in this workspace at extraction time, so cross-checking against the golden screenshots could not be performed. Everything below is extracted directly from the Flutter source (the read-only ground truth). The big 5×5 conditional claim matrix is fully transcribed here since `quiz-flow.md` was unavailable.

## PageView index confirmation

PageView children list starts at `pages/home_page/home_page_widget.dart:146`. 0-based index mapping (each `wrapWithModel` is one page):

- **idx-0** = `ImageBackgroundQuesBodyWidget` (`home_page_widget.dart:151`, wrapped in `Builder`)
- idx-1…idx-9 = pages at lines 262, 299, 337, 377, 410, 477, 503, 543, 587
- **idx-10** = `QuestionAnswerAdditionlInfoWidget` (`home_page_widget.dart:624`, child at `:627`) → **shampoo spend** ✓
- idx-11 = MultiChoice myths (`:666`), idx-12 = MultiChoice damaging practices (`:698`)
- **idx-13** = `PitchBodySimpleDetailedTextImagesWidget` (`home_page_widget.dart:730`, child at `:733`) → **Damage-Practices pitch** ✓

---

# Screen idx-10 — Shampoo Spend (`shampooSpending`)

**Template:** `templates/question_answer_additionl_info/question_answer_additionl_info_widget.dart`
**Reveal-card / answer-tile renderer:** `custom_code/widgets/animated_text.dart` (the `AnimatedText` custom widget)
**Instantiation:** `home_page_widget.dart:627-664`

## 1. Question prompt (verbatim)

> **How much do you spend on a bottle of shampoo?**

- Passed at `home_page_widget.dart:628-630` via i18n key `25wr54y6`.
- Resolved English string at `flutter_flow/internationalization.dart:300`.
- (de: `Wie viel geben Sie für eine Flasche Shampoo aus?` · es: `¿Cuánto gastas en una botella de champú?`)

Rendered as centered text, Inter, `FontWeight.w500`, color `textRichBlack`, font size 20 (phone) / 24 / 27. Source: template `:115-146`.

## 2. The 4 answer options

Data source: `FFAppState().shampooSpending` (passed at `home_page_widget.dart:631`), defined in `app_state.dart:831-840`. Each item is an `AnswerWithAdditionalInfoStruct` with fields `answer`, `image`, `AnswerTitle`, `AnswerDescription`, `id`, `type`. All four, in list order:

### Option 1 — "Less than $10"  (`app_state.dart:833`, id `spend_under10`)
- **Label (`answer`):** `Less than $10`
- **Image URL:** `https://assets.hairqare.co/Less%20than%20%2410.webp`
- **Reveal AnswerTitle (verbatim):** `Awesome 🤩 you're budget conscious!`
- **Reveal AnswerDescription (verbatim):** `You can actually have amazing results without spending more than you do now (or even less) while avoiding harmful products that secretly ruin your hair. You just need the right routine for your unique situation.`

### Option 2 — "$10 - $20"  (`app_state.dart:835`, id `spend_10to20`)
- **Label:** `$10 - $20`
- **Image URL:** `https://assets.hairqare.co/%2410%20-%20%2420.webp`
- **Reveal AnswerTitle:** `Amazing 🙌 you value your hair!`
- **Reveal AnswerDescription:** `You're spending thoughtfully, but likely still paying for marketing rather than results. With the right routine, you could get truly transformative results tailored to your unique needs without spending more.`

### Option 3 — "$20 - $50"  (`app_state.dart:837`, id `spend_20to50`)
- **Label:** `$20 - $50`
- **Image URL:** `https://assets.hairqare.co/%2420-%2450.webp`
- **Reveal AnswerTitle:** `You clearly care about your hair 💜`
- **Reveal AnswerDescription:** `Did you know, in premium haircare up to 90% of what you're paying goes to packaging and marketing, not quality ingredients? With the right routine, you can actually get the premium results you're looking for without the price tag.`

### Option 4 — "More than $50"  (`app_state.dart:839`, id `spend_over50`)
- **Label:** `More than $50`
- **Image URL:** `https://assets.hairqare.co/More%20than%20%2450.webp`
- **Reveal AnswerTitle:** `Your hair deserves the best ✨`
- **Reveal AnswerDescription:** `Did you know premium haircare often uses the same ingredients as budget options? With the right personalized routine, you can actually achieve the results those luxury brands are just promising.`

## 3. Reveal CARD styling

Source: `custom_code/widgets/animated_text.dart:62-155`. The card renders only after an answer is selected (`if (selectedValue != null)`).

- **Background color:** `Color(0xFFFFF9E6)` (light yellow) — `:70`
- **Border:** `Border.all(color: Color(0xFFFFE6B3))` (light yellow border) — `:71-72`
- **Border radius:** `BorderRadius.circular(8)` — `:73`
- **Inner padding:** vertical 18, horizontal 12 — `:75-76`
- **Leading icon/emoji:** 📚 (books emoji), `fontSize: 20`, right padding 12 — `:83-88`
- **Title** (`AnswerTitle`): bold (`FontWeight.bold`), `titleFontSize: 15.0` (passed from template `:157`), color = `primaryText`.
- **Body** (`AnswerDescription`): `FontWeight.w400`, `descriptionFontSize: 13.0` (template `:158`), color = `primaryText`.
- Both title and body are rendered with a **typewriter animation** (`TypewriterAnimatedText`, speed 20 ms/char) — title first, then description — `:113-146`. Texts are loaded into the list on tap from `answerTitle` + `answerDescription` (`:167-170`).

## 4. Answer tiles (image rows) styling

Source: `animated_text.dart:157-240`.
- Each option is a row: left **75×75 image** (`BoxFit.cover`, left corners rounded radius 11) + the **label text** (Inter, fontSize 16, `FontWeight.w500`).
- Tile background: selected = `selectedBoxColor` (`secondaryViolet`), unselected = `unSelectedBoxColor` (`secondaryBackground`). Selected border = `secondaryPlum`. (Colors passed from template `:160-169`.)
- Tile radius 11, drop shadow `Color(0xffb3dae1fe)` offset (0,3) blur 14.
- Vertical spacing between tiles: 7.5 (`:162`).

## 5. Continue button

Source: template `:195-207` → `footer/footer_button/footer_button_widget.dart` → `CommonButtonWidget`.
- Only shown after a selection (`if (_model.selctedValue != null)`), pinned to bottom (`AlignmentDirectional(0.0, 1.0)`).
- **Label:** `CONTINUE` (`FFAppConstants.continues = 'CONTINUE'`, `app_constants.dart:7`).
- **Fill color:** `Color(0xFFFE6903)` (orange) — `footer_button_widget.dart:51`.
- **Text color:** `secondaryBackground` (white). Radius 10, transparent border.

## 6. Layout order (top → bottom)

1. Question prompt (centered) — template `:112-147`.
2. **Reveal card** (yellow, 📚 + typewriter title + body) — appears **ABOVE** the answer list, only after a tile is tapped — `animated_text.dart:58-156` (card is the first child of the Column; `SizedBox(height: 32)` then the answer list).
3. The 4 image-answer tiles (vertical list) — `animated_text.dart:157-240`.
4. CONTINUE button pinned to bottom (after selection).

> Note: the reveal card sits at the **top** of the scroll column, the answer tiles below it. (Container max width 500 on phone — template `:75-89`.)

---

# Screen idx-13 — Damage-Practices Pitch

**Template:** `pitch_body_templates/pitch_body_simple_detailed_text_images/pitch_body_simple_detailed_text_images_widget.dart`
**Instantiation:** `home_page_widget.dart:730-1044`

## Props passed (and which render)

| Prop | Value source | Rendered? |
|------|--------------|-----------|
| `title` (`o7lj8r75`) | empty string (`internationalization.dart:316`) | **Hidden** — title block wrapped in `responsiveVisibility(...all false)`, template `:125-162`, so it never shows. |
| `description` | conditional, `home_page_widget.dart:737-794` | **Yes** — template `:163-218` |
| `claim` | conditional 5×5, `home_page_widget.dart:795-1011` | **Yes** — template `:219-263` |
| `conclusion` (`6beos8zn`) | `That's why nothing has worked so far.` | **Yes** — template `:264-305` |
| `valueProp` (`xgrtm968`) | accent line | **Yes** — template `:322-372` (after divider) |
| `value1`–`value4` (`runyv089`,`67s8av9p`,`wrw01rih`,`6atwdsko`) | all empty strings | **NOT rendered** — these props exist on the widget but are never referenced in `build()`. |
| `image` | defaulted (`Dont%20Know%20Hair.webp`) | **NOT used** — `widget.image` is never referenced in `build()`. |

## 1. Text blocks in render order (verbatim)

### Block A — `description` (conditional on `hairDamageActivity`)
Source: `home_page_widget.dart:737-794`. Rendered at template `:163-218` (Inter normal, fontSize 16, left-aligned, lineHeight 1.25).

Fixed prefix (always): `With the right routine it's fine to `

Then **one** of three suffixes:
- If `hairDamageActivity` includes any of `damageAction_heat` **OR** `damageAction_dye` **OR** `damageAction_hairstyles` (`:739-767`):
  → `to style, curl or color your hair. `
- Else if `hairDamageActivity` includes `damageAction_swimming` **OR** `damageAction_sun` (`:769-789`):
  → `live an active lifestyle.`
- Else (`:791-792`):
  → `style your hair any way you like and do the activities you enjoy.`

So the full sentence is e.g.: `With the right routine it's fine to to style, curl or color your hair. ` (the literal source has the duplicated "to to" in the heat/dye/hairstyles branch — `:738` ends with "to" and `:768` begins with "to style").

### Block B — `claim` (conditional 5 × 5 on `currentRoutine` × `hairConcern`)
Source: `home_page_widget.dart:795-1011`. Rendered at template `:219-263` (Inter `FontWeight.w300` for the text span, normal base, fontSize 16, left-aligned, lineHeight 1.25).

Structure: `But if you are still struggling with` + `<CONCERN phrase>` + `<ROUTINE tail>` + `, you're missing important haircare knowledge. `

**CONCERN phrase** (inner conditional, identical in every routine branch — `:804-838`, `:847-882`, `:891-926`, `:935-970`, `:973-1008`):
| `hairConcern` answerId | phrase (verbatim, leading space included) |
|---|---|
| `concern_hairloss` | ` hair loss and thinning` |
| `concern_splitends` | ` split ends and dryness` |
| `concern_scalp` | ` dandruff and scalp irritation` |
| `concern_damage` | ` damaged hair and breakage` |
| (else / none of above) | ` mixed hair issues` |

**ROUTINE tail** (outer conditional on `currentRoutine`):
| `currentRoutine` answerId | tail (verbatim, follows the concern phrase) | source |
|---|---|---|
| `routine_complex` | ` despite all the treatments, specialists and products you've tried, you're missing important haircare knowledge. ` | `:799-839` |
| `routine_basic` | ` while only relying on using shampoo & conditioner, you're missing important haircare knowledge. ` | `:840-883` |
| `routine_intermediete` *(sic)* | ` despite making time for hair masks and other treatments, you're missing important haircare knowledge. ` | `:884-927` |
| `routine_natural` | ` despite using organic products and home remedies, you're missing important haircare knowledge. ` | `:928-971` |
| (else / default) | ` despite what you've already tried, you're missing important haircare knowledge. ` | `:972-1009` |

→ This is the full 5 routines × 5 concerns = 25-combination matrix. (`quiz-flow.md` was not present to cross-cite; the matrix is fully reproduced above from source.)

Example rendered claim (`routine_basic` + `concern_hairloss`): `But if you are still struggling with hair loss and thinning while only relying on using shampoo & conditioner, you're missing important haircare knowledge. `

### Block C — `conclusion` (FIXED)
Source: `home_page_widget.dart:1027-1029`, i18n key `6beos8zn`, English at `internationalization.dart:349`. Rendered at template `:264-305` (Inter **`FontWeight.w500`** / semi-bold, fontSize 16, lineHeight 1.25).

> **That's why nothing has worked so far.**

(de: `Deshalb hat bisher nichts funktioniert.` · es: `Es por eso que nada ha funcionado hasta ahora.`)

### Block D — `valueProp` accent line (FIXED, after divider)
Source: `home_page_widget.dart:1012-1014`, i18n key `xgrtm968`, English at `internationalization.dart:321-322`. Rendered at template `:322-372`, in the `secondary` theme color (accent), fontSize 16, lineHeight 1.25.

> **Here is what you can achieve in 14 days of following the right routine for your hair:**

(de: `Folgendes können Sie in 14 Tagen erreichen, wenn Sie die richtige Routine für Ihr Haar befolgen:` · es: `Esto es lo que puedes lograr en 14 días siguiendo la rutina adecuada para tu cabello:`)

> ⚠️ Despite the accent line saying "Here is what you can achieve…", the `value1`–`value4` bullet props that would list those achievements are all **empty strings** and are **never rendered** by this template. So no bullet list follows the accent line in code; the carousel of images follows instead.

## 2. Divider / visual separators

Source: template `:306-376`. A `Container` (padding top 20, bottom 30) holding:
- A **`Divider`**, `thickness: 2.0`, color = theme `alternate` — template `:318-321`.
- Immediately below the divider: the `valueProp` accent line (Block D).

## 3. "Testimonial" — actually an auto-play image CAROUSEL (conditional on `hairConcern`)

> **IMPORTANT FINDING:** In **this** idx-13 template there is **no** structured testimonial card with a star rating, a typed quote, or a reviewer name. Instead there is a 5-image auto-playing `CarouselSlider` (template `:377-637`). The named "Melissa Klinefelter" review with 5 stars and the "Fully recommend this routine…" quote lives in a **different** component, `components/manual_carusell_widget.dart` (quote at `:170-198`, name at `:200-206`, `RatingBar` 5×`Icons.star_rounded` color `0xFFFFC207` at `:149-165`). That `ManualCarusell` component is **NOT** instantiated by idx-13 (no reference to it in `pages/` or `pitch_body_templates/`). The closest analogue inside the idx-13 carousel is the **5th** image, a flat "text-only recommended testimonial" image.

The carousel (`CarouselSlider`, `:396-631`): height = 30% of screen, `viewportFraction: 0.74`, `enlargeCenterPage: true`, **autoPlay: true** (interval 3100 ms, 800 ms animation), `enableInfiniteScroll: true`. It has **5 items**:

**Item 1 — before/after image (CONDITIONAL on `hairConcern`)** — template `:398-458`, radius 8, `BoxFit.contain`:
| `hairConcern` | image URL |
|---|---|
| `concern_hairloss` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/kerry-before-after.webp` |
| `concern_splitends` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Split_Ends_Testimonial_3.webp` |
| `concern_scalp` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Dandruff_Testimonial_3.webp` |
| `concern_damage` | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Pauline-before_after_LD.webp` |
| (default) | `https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/anna-before-after-smaller.webp` |

**Item 2 — testimonial image (CONDITIONAL on `hairConcern`)** — template `:459-527`, 300×200, radius 8:
| `hairConcern` | image URL |
|---|---|
| `concern_hairloss` | `https://pub.hairqare.co/heather-menopause-shedding.webp` |
| `concern_splitends` | `https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7635d9a4fcb363d5d162_Split%20Ends%20%20Testimonial%204.webp` |
| `concern_scalp` | `https://pub.hairqare.co/amanda-worth-time-money.webp` |
| `concern_damage` | `https://pub.hairqare.co/patsy-scalp-any-hair-problem.webp` |
| (default) | `https://pub.hairqare.co/sarah-deisel-hairloss.webp` |

**Item 3 — testimonial image (CONDITIONAL on `hairConcern`)** — template `:528-588`, 300×200, radius 8:
| `hairConcern` | image URL |
|---|---|
| `concern_hairloss` | `https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe766f521064e5a70c318e_Hair%20loss%20Testimonial%203.webp` |
| `concern_splitends` | `https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe7635420a4e34119c551b_Split%20Ends%20%20Testimonial%201.webp` |
| `concern_scalp` | `https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe76ce81f8b661564e2394_Dandruff%20%20Testimonial%202.webp` |
| `concern_damage` | `https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe769f85dca920b329cf16_Damage%20%20Testimonial%201.webp` |
| (default) | `https://cdn.prod.website-files.com/62cbaa353a301eb715aa33d0/66fe75efe655a39ef2c53565_Other%20issue%20Testimonial%201.webp` |

**Item 4 — FIXED image** — template `:589-598`, 300×200, radius 4:
`https://pub.hairqare.co/easy-unlearn-garbage.webp`

**Item 5 — FIXED "text-only recommended testimonial" image** — template `:599-608`, 200×200, radius 8:
`https://assets.hairqare.co/text-only-recommended-testimonial.webp`

> So the testimonial content (review image, the "Fully recommend… Worth every penny!" quote, "Melissa Klinefelter", and the 5-star rating) is **conditional/baked into images**, not live text widgets, on idx-13. The 5-star + text quote + name card is only the separate `ManualCarusell` component, which is **not** used here.

### Reference: the `ManualCarusell` testimonial (NOT on idx-13, for context only)
- Quote (verbatim, `internationalization.dart:759`, key `kyv3grhb`): `Fully recommend this routine to every woman out there! The knowledge you learn from this course sets you up to healthier and better hair! The community is with you every step of the way, the videos are full of information, and the workbook helps you put things into practice. I enjoyed my experience and the change I've noticed in my hair. Worth every penny!`
- Reviewer name (`internationalization.dart:766`, key `1dec8sii`): `Melissa Klinefelter`
- Rating: 5 stars, `Icons.star_rounded`, color `0xFFFFC207` (`manual_carusell_widget.dart:149-165`). No date shown.

## 4. Continue button

Source: template `:642-653` → `FooterButtonWidget` → `CommonButtonWidget`.
- Pinned to bottom (`AlignmentDirectional(0.0, 1.0)`), always visible (no selection gate).
- **Label:** `CONTINUE` (`FFAppConstants.continues`, `app_constants.dart:7`).
- **Fill color:** `Color(0xFFFE6903)` (orange) — `footer_button_widget.dart:51`.
- **Text color:** `secondaryBackground` (white). Radius 10.
- On tap fires `trackGAEvent('Continued From Pitch', '', 'Damage Practices Pitch', ...)` then advances the page — `home_page_widget.dart:1030-1043`.

## 5. Layout order (top → bottom)

Overall: `SecondaryBackground` container, max width 500 (phone), top padding 10 (`templateTopPadding`). Scrollable `SingleChildScrollView` (`:121`) with bottom padding 80 to clear the pinned button.

1. *(Title — hidden, all responsiveVisibility false.)*
2. **Description** (Block A — conditional on damage activity). `:163-218`
3. **Claim** (Block B — conditional 5×5 routine×concern). `:219-263`
4. **Conclusion** "That's why nothing has worked so far." (semi-bold). `:264-305`
5. **Divider** (thickness 2, `alternate` color) + **accent line / valueProp** "Here is what you can achieve in 14 days…" (secondary color). `:306-376`
6. *(value1–value4 bullets — empty, not rendered.)*
7. **Auto-play image carousel** (5 items: 3 concern-conditional before/after & testimonial images, then 2 fixed images). `:377-637`
8. **CONTINUE** button pinned at bottom (orange). `:642-653`

---

## Ambiguities / gaps explicitly noted
- `docs/reference/golden/*.png` screenshots and `docs/reference/quiz-flow.md` are **absent** from this workspace; no visual cross-check or quiz-flow cross-cite was possible. All content above is from source code, which is authoritative.
- `value1`–`value4` and `title` props are passed as **empty strings** and `value1`–`value4` / `image` are **never rendered** by the idx-13 template — so the accent line "Here is what you can achieve in 14 days…" is **not** followed by a bullet list in this template's code.
- The "testimonial with 5 stars + quote + Melissa Klinefelter" expected by the task is in a **separate** `ManualCarusell` component **not wired into idx-13**. On idx-13 the testimonial role is filled by an auto-play image carousel; its 5th slide is a flat image `text-only-recommended-testimonial.webp`. No reviewer name/star widget/date is rendered as live text on idx-13.
- The description Block A contains a literal duplicated "to to" in the heat/dye/hairstyles branch (source artifact at `home_page_widget.dart:738` + `:768`).
- `routine_intermediete` is spelled that way in source (sic).
