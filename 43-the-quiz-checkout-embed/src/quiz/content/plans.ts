/**
 * Plan / pricing data — typed exports sourced VERBATIM from
 * `docs/reference/dashboard-spec.md` §4 (the FlutterFlow `FFAppState().PlanData`
 * and `personalPlan` structs). Pure DATA — no React, no store.
 *
 * NOTE (dashboard-spec.md §4): the FlutterFlow field names do NOT match their
 * display use — `perDayActualPrice` ("300") is rendered as the struck-through
 * price and `discountedPerDayPrice` ("85") as the "% OFF" number. Values are
 * replicated as-is; do not "fix" the semantics. Prices are strings in source.
 */

/** A single plan card (mirrors FlutterFlow `PlanStruct`). dashboard-spec.md §4. */
export interface PlanData {
  title: string
  /** Original price (string in source). */
  actualPrice: string
  /** Sale price (string in source). */
  discountedPrice: string
  /** Source name; rendered as the struck-through price. */
  perDayActualPrice: string
  /** Source name; rendered as the "% OFF" number. */
  discountedPerDayPrice: string
  /** "true"/"false" string in source. */
  isPopularPlan: string
}

/**
 * The 14-Day Challenge plan: $300 → $37, "85% OFF".
 * `FFAppState().PlanData` (app_state.dart:484-487) — dashboard-spec.md §4.
 */
export const planData: PlanData = {
  title: '14 Day Challenge',
  actualPrice: '300',
  discountedPrice: '37',
  perDayActualPrice: '300',
  discountedPerDayPrice: '85',
  isPopularPlan: 'true',
}

/** One bonus line-item in the plan-details dialog (FlutterFlow personalPlan struct). */
export interface PersonalPlanItem {
  title: string
  /** Anchor "value" price. Strings in source; the last item omits it (undefined). */
  price?: string
}

/**
 * The 9 bonus line-items shown in the plan-details dialog.
 * `personalPlan` (app_state.dart:517-536) — dashboard-spec.md §4. The final
 * "Certificate of Completion" item has no price in source.
 */
export const personalPlan: PersonalPlanItem[] = [
  { title: '14 Day Haircare Journal & Templates', price: '29' },
  { title: 'DIY Luxury Shampoo Workshop', price: '39' },
  { title: 'Haircare Ingredients No-No List', price: '35' },
  { title: 'Total Hair Wellness Handbook', price: '29' },
  { title: 'Silicones & Sulfates Smart Usage Manual', price: '29' },
  { title: '30 Day Hair Mindfulness Experience', price: '15' },
  { title: 'Exclusive Members-Only Community', price: '20' },
  { title: 'Haircare Product Analyzer', price: '5' },
  { title: 'Certificate of Completion' },
]
