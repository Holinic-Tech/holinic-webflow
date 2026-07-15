# CDP & Coupon Maps (authoritative)

> Phase 0 golden reference. Every claim cites a Flutter source file:line. Must be preserved byte-for-byte by the rebuild.

These two maps are load-bearing for the submission webhook (Table A — which AC/MP fields each answer populates) and the checkout redirect (Table B — which coupon tag is appended).

---

## Table A — `questionId` → CDP field mapping

Source: `FFAppState()._cdpMapping` in `Flutter Quiz Raw/QuizV2-flutterflow/lib/app_state.dart:1016-1047`. Each entry is a `FieldMappingTableStruct` with `questionId`, `acField` (AC custom-field numeric id, used to build `field_<acField>` in the webhook), and `mpField` (Mixpanel property name).

- `acField` is included in the webhook only when present and `> 0` (`webhook_call_quiz_profile.dart:44-47`). `professionalReferral` has **no** `acField`, so it never produces an AC `field_*` key.
- `mpField` value is the answer string for single-answer questions, or the answer-id array for multi-select (`webhook_call_quiz_profile.dart:49-55`).
- The webhook key in `activeCampaign` is literally `field_<acField>` (e.g. `field_48` for `hairGoal`).

| questionId | acField (int) | webhook AC key | mpField (string) | Source line |
|---|---|---|---|---|
| `hairGoal` | 48 | `field_48` | `Hair Goal` | `app_state.dart:1018` |
| `hairType` | 20 | `field_20` | `Hair Type` | `app_state.dart:1020` |
| `age` | 6 | `field_6` | `Age Cohort` | `app_state.dart:1022` |
| `hairConcern` | 8 | `field_8` | `Hair Concern Type` | `app_state.dart:1024` |
| `knowledgeState` | 50 | `field_50` | `Hair Current Issues` | `app_state.dart:1026` |
| `mindsetState` | 56 | `field_56` | `Hairqare Knowledge` | `app_state.dart:1028` |
| `diet` | 34 | `field_34` | `Diet` | `app_state.dart:1030` |
| `shampooSpending` | 7 | `field_7` | `Spending` | `app_state.dart:1032` |
| `hairMyth` | 35 | `field_35` | `hairMyth` | `app_state.dart:1034` |
| `hairDamageActivity` | 51 | `field_51` | `hairDamageActivity` | `app_state.dart:1036` |
| `professionalReferral` | _(none)_ | _(none — no AC field)_ | `professionalReferral` | `app_state.dart:1038` |
| `confidence` | 53 | `field_53` | `Emotions Mirror` | `app_state.dart:1040` |
| `comparison` | 54 | `field_54` | `Emotions Comparison` | `app_state.dart:1042` |
| `currentRoutine` | 18 | `field_18` | `Haircare Background` | `app_state.dart:1044` |
| `hairqare` | 56 | `field_56` | `mindsetState` | `app_state.dart:1046` |

> Notes / quirks (preserve exactly):
> - `mindsetState` and `hairqare` BOTH map to `acField` 56 (`field_56`). If both answered, the later one in `qaPairs` overwrites the AC field; their `mpField`s differ (`Hairqare Knowledge` vs `mindsetState`).
> - `hairqare`'s `mpField` is the string `mindsetState` (not "Hairqare Knowledge") — i.e. the MP property name and the AC field id are crossed vs `mindsetState`. This is the live behavior and must be replicated.
> - Worker-side `ActiveCampaignFieldsSchema` (`QuizSubmissions/src/schemas/webhook.schema.ts:15-30`) explicitly lists `field_6,7,8,18,20,34,35,48,50,51,53,54,56,73` and is `.passthrough()`. `field_73` (`diagnosisFD`) is accepted server-side but is NOT produced by this `cdpMapping`.

---

## Table B — `answerId` → coupon tag (`aero-coupons`)

Source: the coupon block in `redirect_to_checkout.dart:55-91`. Evaluated as an **ordered if/else-if chain** on the user's `hairConcern` then `diet` answers (via the local `hasAnswer(questionId, [...])` helper, `:60-69`). First match wins; the tag is appended as `aero-coupons=<tag>` (`:84-87`).

| Order | Condition (answerId present) | Coupon tag | Source line |
|---|---|---|---|
| 1 | `hairConcern` contains `concern_hairloss` | `c_hl` | `redirect_to_checkout.dart:71-72` |
| 2 | `hairConcern` contains `concern_damage` **OR** `concern_splitends` | `c_dh` | `redirect_to_checkout.dart:73-75` |
| 3 | `hairConcern` contains `concern_scalp` | `c_si` | `redirect_to_checkout.dart:76-77` |
| 4 | `diet` contains `diet_custom` **OR** `diet_balanced` | `d_bc` | `redirect_to_checkout.dart:78-79` |
| 5 | _none of the above (default `else`)_ | `o_df` | `redirect_to_checkout.dart:80-81` |

- **Error fallback:** if anything in the coupon block throws (e.g. `quizProfile` access fails), the `catch` appends `aero-coupons=o_df` (`redirect_to_checkout.dart:88-91`).
- The chain is strictly priority-ordered: `hairConcern` always wins over `diet`. A user with `concern_hairloss` AND `diet_balanced` gets `c_hl`, not `d_bc`.

> Coupon-tag legend (inferred from tag names, not in source): `c_hl` = concern hair-loss, `c_dh` = concern damage/split-ends, `c_si` = concern scalp/irritation, `d_bc` = diet balanced/custom, `o_df` = other/default.
