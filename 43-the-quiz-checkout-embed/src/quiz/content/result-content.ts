import type { AnswerId } from '../../spec/types'
import type { AnswerState } from '../../engine/answers'

/**
 * Result / dashboard content maps — typed exports sourced VERBATIM from
 * `docs/reference/dashboard-spec.md` (the Phase 0 ground-truth extraction of the
 * FlutterFlow result/dashboard screen). Every map cites the dashboard-spec.md
 * section it came from.
 *
 * These are pure DATA + pure accessor helpers — no React, no store. The accessors
 * take an `AnswerState` and resolve content using the same `answers[questionId]?.[0]`
 * first-pick lookup the engine's `resolveConditional` uses, so an unanswered or
 * unhandled answer (e.g. `concern_mixed`) falls through to the documented `else`
 * default.
 *
 * Where the source had placeholder / hardcoded / legacy-mismatched assets, the
 * value is reproduced as-is and flagged `// FLAG Phase 4` (see dashboard-spec.md
 * "Phase-4 flags").
 */

// ---------------------------------------------------------------------------
// Generic keyed-lookup resolver (mirrors resolveConditional's `by`/`cases`
// first-pick semantics, kept pure & local so this module has no engine logic).
// ---------------------------------------------------------------------------

interface KeyedMap<T> {
  by: string
  cases: Record<AnswerId, T>
  default: T
}

function resolveKeyed<T>(map: KeyedMap<T>, answers: AnswerState): T {
  const picked = answers[map.by]?.[0]
  if (picked !== undefined && picked in map.cases) return map.cases[picked]
  return map.default
}

// ---------------------------------------------------------------------------
// §2a — Match-card benefit line, by `hairGoal` answerId
//   dashboard_widget.dart:360-392 (dashboard-spec.md §2a)
// ---------------------------------------------------------------------------

const BENEFIT_BOTH =
  '9 out of 10 women with this score said their shedding stopped, and their hair looked and felt better after the challenge.'

export const benefitByGoal: KeyedMap<string> = {
  by: 'hairGoal',
  cases: {
    goal_hairloss:
      '9 out of 10 women with this score said their shedding stopped, and they started seeing new baby hairs after the challenge.',
    // Trailing space is byte-for-byte from source (dashboard-spec.md §2a).
    goal_betterhair:
      '9 out of 10 women with this score said their hair felt softer, healthier, and looked better after the challenge. ',
    goal_both: BENEFIT_BOTH,
  },
  default: BENEFIT_BOTH, // else / fallback = same as goal_both (dashboard-spec.md §2a)
}

export function benefitFor(answers: AnswerState): string {
  return resolveKeyed(benefitByGoal, answers)
}

// ---------------------------------------------------------------------------
// §2d — "My Goal:" description, by `hairConcern` answerId
//   dashboard_widget.dart:689-743 (dashboard-spec.md §2d)
// ---------------------------------------------------------------------------

export const goalDescByConcern: KeyedMap<string> = {
  by: 'hairConcern',
  cases: {
    concern_hairloss:
      'Denser hair and noticeable regrowth that fills in sparse areas, so I can have peace of mind and feel beautiful again .',
    concern_splitends:
      'Smoother, frizz-free hair that makes me feel confident and put-together every day.',
    concern_scalp:
      'A calm, itch and flake free scalp that allows me to go through my day without constant distraction or embarrassment from scratching.',
    concern_damage:
      'Stronger, more resilient hair that I can style daily without guilt or worry about damage.',
  },
  default:
    'Healthy, problem-free hair that behaves exactly how I want it to, letting me enjoy my hair without constantly battling different problems.',
}

export function goalDescFor(answers: AnswerState): string {
  return resolveKeyed(goalDescByConcern, answers)
}

// ---------------------------------------------------------------------------
// §2e + §2f — Transformation timeline images, by `hairConcern` answerId
//   Hero (top) image: dashboard_widget.dart:828-872 (§2e)
//   Graph (timeline) image: dashboard_widget.dart:888-925 (§2f)
//   base path is shared (dashboard-spec.md §2e).
// FLAG Phase 4: these are hardcoded legacy CDN assets transcribed from source.
// ---------------------------------------------------------------------------

const TRANSFORM_BASE =
  'https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/'

/** Resolved transformation-timeline image pair for a concern. */
export interface TransformationImages {
  /** Top hero image (§2e). */
  hero: string
  /** Timeline graph image (§2f). */
  timeline: string
}

export const transformationByConcern: KeyedMap<TransformationImages> = {
  by: 'hairConcern',
  cases: {
    concern_hairloss: {
      hero: TRANSFORM_BASE + 'RP%20Hairloss.webp',
      timeline: TRANSFORM_BASE + 'RP%20hairloss%20timeline.webp',
    },
    concern_splitends: {
      hero: TRANSFORM_BASE + 'RP%20Split%20ends.webp',
      timeline: TRANSFORM_BASE + 'RP%20Split%20ends%20timeline.webp',
    },
    concern_scalp: {
      hero: TRANSFORM_BASE + 'RP%20Dandruff.webp',
      timeline: TRANSFORM_BASE + 'RP%20dandruff%20timeline.webp',
    },
    concern_damage: {
      hero: TRANSFORM_BASE + 'RP%20Damage.webp',
      timeline: TRANSFORM_BASE + 'RP%20damage%20timeline.webp',
    },
  },
  default: {
    hero: TRANSFORM_BASE + 'RP%20Others.webp',
    timeline: TRANSFORM_BASE + 'RP%20others%20timeline.webp',
  },
}

export function transformationFor(answers: AnswerState): TransformationImages {
  return resolveKeyed(transformationByConcern, answers)
}

// ---------------------------------------------------------------------------
// §2h + §2i — Before/after testimonial images, by `hairConcern` answerId
//   Carousel slides 1-3 are concern-conditional (slides 4-7 are static — §2h);
//   plus the lower result-page testimonial image (§2i).
//   These branches uniquely include an explicit `concern_mixed` case in source
//   (dashboard-spec.md §2h) — modeled as its own case here.
// FLAG Phase 4: hardcoded legacy CDN assets transcribed from source.
// ---------------------------------------------------------------------------

const CAROUSEL_BASE =
  'https://pub.hairqare.co/cdn-cgi/image/width=450,quality=85,format=auto/'
const LOWER_BASE =
  'https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/'

/** The 4 static carousel slides shown after the 3 concern-conditional ones (§2h). */
export const staticCarouselSlides: string[] = [
  CAROUSEL_BASE + '3_BH.webp',
  CAROUSEL_BASE + 'Better_Hair_4.webp',
  CAROUSEL_BASE + '4_BH.webp',
  CAROUSEL_BASE + '8_HL.webp',
]

/** Resolved testimonial images for a concern. */
export interface TestimonialImages {
  /** Concern-conditional carousel slides 1-3 (§2h). */
  carousel: [string, string, string]
  /** Lower result-page testimonial image (§2i). */
  lower: string
}

export const testimonialsByConcern: KeyedMap<TestimonialImages> = {
  by: 'hairConcern',
  cases: {
    concern_hairloss: {
      carousel: [
        CAROUSEL_BASE + 'ji-woo-before-after.webp',
        CAROUSEL_BASE + 'Hair_Loss_2_Testimonial.webp',
        CAROUSEL_BASE + 'Hair_Loss_3_Testimonial.webp',
      ],
      lower: LOWER_BASE + 'marisol-before-after.webp',
    },
    concern_splitends: {
      carousel: [
        CAROUSEL_BASE + 'bella-before-after.webp',
        CAROUSEL_BASE + 'Split_ends_frizz_dryness_2_testimonial.webp',
        CAROUSEL_BASE + 'Split_ends_frizz_dryness_3_testimonial.webp',
      ],
      lower: LOWER_BASE + 'Frizzy_hair_Testimonial_Result_Page_2.webp',
    },
    concern_scalp: {
      carousel: [
        CAROUSEL_BASE + 'Irritation_or_dandruff_1_Testimonial.webp',
        CAROUSEL_BASE + 'Irritation_or_dandruff_2_Testimonial.webp',
        CAROUSEL_BASE + 'Irritation_or_dandruff_3_Testimonial.webp',
      ],
      lower: LOWER_BASE + 'Dandruff_Testimonial_Result_Page_1.webp',
    },
    concern_damage: {
      carousel: [
        CAROUSEL_BASE + 'Damage_Hair_1_Testimonial.webp',
        CAROUSEL_BASE + 'anna-before-after-smaller.webp',
        CAROUSEL_BASE + 'Damage_Hair_3_Testimonial.webp',
      ],
      lower: LOWER_BASE + 'Color_Damage_Testimonial_Result_Page_1.webp',
    },
    // §2h carries an explicit concern_mixed case identical to the else slides.
    concern_mixed: {
      carousel: [
        CAROUSEL_BASE + 'alina-before-after-front.webp',
        CAROUSEL_BASE + 'ariadna-before-after.webp',
        CAROUSEL_BASE + 'Others_3_testimonial.webp',
      ],
      lower: LOWER_BASE + 'Other_issues_Testimonial_Result_Page_1.webp',
    },
  },
  default: {
    carousel: [
      CAROUSEL_BASE + 'alina-before-after-front.webp',
      CAROUSEL_BASE + 'ariadna-before-after.webp',
      CAROUSEL_BASE + 'Others_3_testimonial.webp',
    ],
    lower: LOWER_BASE + 'Other_issues_Testimonial_Result_Page_1.webp',
  },
}

export function testimonialsFor(answers: AnswerState): TestimonialImages {
  return resolveKeyed(testimonialsByConcern, answers)
}

// ---------------------------------------------------------------------------
// §2b — Avatar SVG, by `age` answerId
//   dashboard_widget.dart:471-522 (dashboard-spec.md §2b)
// FLAG Phase 4: legacy asset filenames (Under 18 / 25-34 / 35-44 / 45+) do NOT
//   match the answer brackets (18-29 / 30-39 / 40-49 / 50+) — replicate as-is.
// ---------------------------------------------------------------------------

const AVATAR_BASE = 'https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/'
const AVATAR_UNDER18 = AVATAR_BASE + '66b37050731caef7208325c3_Under%2018.svg'

export const avatarByAge: KeyedMap<string> = {
  by: 'age',
  cases: {
    age_18to29: AVATAR_UNDER18,
    age_30to39: AVATAR_BASE + '66b3705002a6a9516930e533_25-34.svg',
    age_40to49: AVATAR_BASE + '66b3705003f42517011b493e_35-44.svg',
    'age_50+': AVATAR_BASE + '66b370508968423fab443088_45%2B.svg',
  },
  default: AVATAR_UNDER18, // else / fallback = Under 18 svg (dashboard-spec.md §2b)
}

export function avatarFor(answers: AnswerState): string {
  return resolveKeyed(avatarByAge, answers)
}

// ---------------------------------------------------------------------------
// §2c — Age label text, by `age` answerId
//   dashboard_widget.dart:565-609 (full-content S4)
// ---------------------------------------------------------------------------

export const ageLabelByAge: KeyedMap<string> = {
  by: 'age',
  cases: {
    age_18to29: 'In my 20s',
    age_30to39: 'In my 30s',
    age_40to49: 'In my 40s',
    'age_50+': 'Age 50+',
  },
  default: 'Summary',
}

export function ageLabelFor(answers: AnswerState): string {
  return resolveKeyed(ageLabelByAge, answers)
}

// ---------------------------------------------------------------------------
// §2g — "say goodbye to your {X}" noun, by `hairConcern` answerId
//   dashboard_widget.dart:990-1027 (full-content S6)
// ---------------------------------------------------------------------------

export const concernNounByConcern: KeyedMap<string> = {
  by: 'hairConcern',
  cases: {
    concern_hairloss: 'hair loss',
    concern_splitends: 'split-ends',
    concern_scalp: 'scalp issues',
    concern_damage: 'damaged hair',
  },
  default: 'chronic hair problems',
}

export function concernNounFor(answers: AnswerState): string {
  return resolveKeyed(concernNounByConcern, answers)
}

// ---------------------------------------------------------------------------
// Static result-page content (no conditional logic) — verbatim from
// full-content-all-screens.md § idx 19.
// ---------------------------------------------------------------------------

/** §S2 — perfect-fit subheader (i18n qm88njuv). */
export const PERFECT_FIT_SUBHEAD = 'You are a perfect fit for the Haircare Challenge 😍'

/** §S3 — static "outstanding score" line (i18n) + label. */
export const MATCH_SCORE_LABEL = 'Your matching score is'
export const MATCH_SCORE_OUTSTANDING = "That's an outstanding score!"

/** §S4 — "My Goal:" label + timeline label. */
export const MY_GOAL_LABEL = 'My Goal:'
export const TRANSFORMATION_TIMELINE_LABEL = 'Your hair transformation timeline:'

/** §S7 — italic line (leading space verbatim from source). */
export const NO_MORE_FRUSTRATION = ' No more frustration or disappointments!'

/** §S8 — three ✅ benefit rows (dashboard_widget.dart:1073-1279). */
export const BENEFIT_ROWS: string[] = [
  'Target the root causes of your hair issues and stop them from coming back.',
  'Build a personalized, easy-to-follow haircare plan tailored to your unique needs.',
  'Create your own gentle, DIY shampoo & conditioner for lasting results',
]

/** CTA labels (§S9 / §S13 / §S21). */
export const CTA_JOIN = 'JOIN THE CHALLENGE'
export const CTA_START = 'START MY CHALLENGE'

/**
 * §S10 — "200,000+" social-proof rich text. Rendered as 3 spans: the first and
 * last are tangerine-highlighted, the middle is plain (dashboard_widget.dart:1360-1462).
 */
export const SOCIAL_PROOF = {
  highlightLead: '200,000+ women ',
  plain: 'have taken this challenge, and ',
  highlightTail: '92% of finishers said "It has changed their life".',
}

/** §S11 — Trustpilot / rating image. */
export const RATING_IMAGE =
  'https://pub.hairqare.co/quiz40/250000.webp'

/** §S14 — "10 min a day" rich text (3 spans). */
export const TEN_MIN = {
  lead: 'Based on your answers, you just need',
  emphasis: '10 min a day, for 14 days',
  tail: 'to get beautiful and healthy hair that turns heads and boosts your confidence every single day.',
}

/** §S15 — "Days" graphic image. */
export const DAYS_IMAGE =
  'https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/Result%20Page-%20Days%20Images.webp'

/** §S16 — "100% Results / 0% Hassle" badges (i18n rpb2l5tr / 7qu4hw6f). */
export const RESULTS_BADGES: { value: string; label: string }[] = [
  { value: '100%', label: 'Results' },
  { value: '0%', label: 'Hassle' },
]

/**
 * §S17 — 3-point value card. Each row = a local icon + rich text with a leading
 * bold highlight. Icons are the legacy FlutterFlow assets (dashboard_widget.dart:2024-2497);
 * reproduced as the public CDN paths.
 */
export const VALUE_POINTS: { lead?: string; bold: string; tail?: string }[] = [
  { lead: 'Science-based and ', bold: 'reviewed by haircare experts.' },
  {
    bold: 'Get a nutrient-rich meal plan ',
    tail: 'to minimise hair loss and enhance hair thickness.',
  },
  { bold: 'Save thousands ', tail: "on products and salon treatments you won't need anymore." },
]

/** §S18 — fixed lower testimonial image (lucia-busy-short.webp). */
export const LUCIA_IMAGE =
  'https://pub.hairqare.co/cdn-cgi/image/width=400,quality=85,format=auto/lucia-busy-short.webp'

/**
 * Written Trustpilot-style testimonial card shown on the live dashboard between
 * the value card and the lower testimonial image (verbatim from 19-dashboard-live.png).
 */
export const WRITTEN_TESTIMONIAL = {
  initials: 'LU',
  name: 'Lucia',
  reviews: '5 reviews',
  location: 'NL',
  verified: 'Verified',
  title: 'A real game changer to really dive into your (hair) health',
  body:
    'I recently completed the Haircare 14-Day Better Hair Challenge and had such a great experience! Although I have a very busy life as a mum and running a family company, the daily tasks were fun, practical and achievable, which made it easy to stay motivated. I really appreciated the personal approach, where I felt truly heard and supported throughout the challenge by Sarah and her team.',
}

/** §S22 — refund guarantee footer (i18n 6kg20sml). */
export const REFUND_GUARANTEE = '100% Refund guarantee | No Questions Asked'

/** §S20 — scarcity line. `<N>` = randomInteger(3,9), fallback 7. */
export function seatsRemainingText(seats: number): string {
  return `Only ${seats} seats remaining. Hurry Up!`
}
