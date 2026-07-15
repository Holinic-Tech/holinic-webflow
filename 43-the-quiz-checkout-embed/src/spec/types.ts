export type AnswerId = string
export type QuestionId = string

/** Per-answer reveal block (idx-10 shampoo): a bold title line + body text. */
export interface AnswerReveal { title: string; body: string }

export interface Answer { answerId: AnswerId; label: string; imageUrl?: string; reveal?: AnswerReveal; description?: string }

/** A condition over a multi-select answer array (recovers Flutter's dropped combination logic). */
export interface AnswerSetCondition {
  questionId: QuestionId
  containsAll?: AnswerId[]
  containsAny?: AnswerId[]
}

/** Static string, single-answer keyed lookup, or set-logic rules. Resolved by the engine. */
export type ConditionalText =
  | string
  | { by: QuestionId; cases: Record<AnswerId, string>; default: string }
  | { rules: Array<{ when: AnswerSetCondition; text: string }>; default: string }

export type Progression = 'auto' | 'cta'

export interface CdpMapping { acField?: number; mpField?: string }

export interface QuestionScreen {
  kind: 'question'
  id: string
  type: 'single' | 'image' | 'multi' | 'rating'
  questionId: QuestionId
  prompt: ConditionalText
  answers: Answer[]
  progression: Progression
  /** Optional secondary instruction shown BELOW the prompt (e.g. "Select one", "Select all that apply"). */
  subtitle?: ConditionalText
  /** Optional line shown ABOVE the prompt (idx-9 diet "What we eat affects…"). */
  beforeTitle?: ConditionalText
  /**
   * Image-answer layout hint (only meaningful for `type: 'image'`):
   *  - `tile` — large 2-col grid, image on top with a label strip (idx-1 hair type).
   *  - `row`  — compact left-image + right-label row (idx-2/3/7/9). Default.
   */
  imageLayout?: 'tile' | 'row'
  reveal?: ConditionalText
  /** Multi-select "None of the above": clears other picks, records this answerId (e.g. 'n/a'). */
  noneOfTheAbove?: { label: string; answerId: AnswerId }
  /**
   * Start-cover presentation (idx-0 only). When present, the question renders as
   * the full-bleed goal cover (background image + white logo + headline + goal
   * instruction + goal buttons) instead of the standard question layout. The
   * `prompt` is the white headline; the first two answers render as side-by-side
   * white cards, the third as a checkbox+underlined-label row. Additive: any
   * question WITHOUT `cover` is unaffected.
   */
  cover?: {
    backgroundUrl: string
    logoUrl: string
    /** "Start by selecting your goal:" line shown above the goal buttons (legacy layout). */
    instruction?: string
    /** Small uppercase eyebrow line above the headline (CTA layout). */
    eyebrow?: string
    /** Sub-headline shown under the main headline (CTA layout). */
    subhead?: string
    /** When present, renders a single CTA button instead of goal-choice tiles. */
    ctaLabel?: string
  }
  /**
   * Rating-screen extras (only meaningful for `type: 'rating'`):
   *  - `ratingSubInstruction` — the "How much do you relate…" line ABOVE the prompt.
   *  - `ratingAnchors` — the two scale anchor labels shown below the 1–5 buttons.
   * Additive: ratings without these fall back to defaults.
   */
  ratingSubInstruction?: string
  ratingAnchors?: { low: string; high: string }
  cdp?: CdpMapping
  /** Optional chrome overrides; defaults derived by kind in navigation.ts */
  chrome?: Partial<ScreenChrome>
}

/**
 * A multi-block pitch body (idx-13 Damage-Practices Pitch). Additive: when
 * `PitchScreen.blocks` is present the renderer composes these in order INSTEAD of
 * the simple headline/body; pitches without `blocks` keep the old behavior.
 *  - `text`: a resolved `ConditionalText` paragraph; `weight` picks the styling
 *    (normal body / semibold conclusion / plum accent line).
 *  - `divider`: a horizontal rule separator.
 *  - `carousel`: a horizontal image strip; each image is a `ConditionalText`
 *    resolving to a URL (keyed e.g. by `hairConcern`).
 */
export type PitchBlock =
  | { kind: 'text'; text: ConditionalText; weight?: 'normal' | 'semibold' | 'accent'; align?: 'center' }
  | { kind: 'divider' }
  | { kind: 'spacer' }
  /** Hero heading + subtitle pair — renders headline large, sub smaller below it. */
  | { kind: 'heroText'; headline: string; sub: string }
  /** Proof card with a title and stat pairs (value + label). */
  | { kind: 'statCard'; title: string; stats: Array<{ value: string; label: string }> }
  | { kind: 'carousel'; images: ConditionalText[] }
  /**
   * The idx-13 "claim" paragraph — a 5×5 sentence keyed on BOTH `currentRoutine`
   * AND `hairConcern`. Because a single `ConditionalText` keys on only ONE
   * questionId, this 2-dimensional claim is resolved by the renderer from the two
   * named answers (`pitchClaim()` in pitch-claim-matrix.ts).
   */
  | { kind: 'claim'; routineQuestionId: QuestionId; concernQuestionId: QuestionId; weight?: 'normal' | 'semibold' | 'accent' }
  /** A single image whose `src` is a `ConditionalText` resolving to a URL. */
  | { kind: 'image'; src: ConditionalText }
  /**
   * idx-6 before/after IMAGE keyed on BOTH `hairConcern` AND `age` (2-dimensional,
   * like `claim`). Resolved by the renderer via `damagePitchImage()`.
   */
  | { kind: 'damageImage'; concernQuestionId: QuestionId; ageQuestionId: QuestionId }
  /**
   * idx-6 RichText BODY keyed on BOTH `hairConcern` AND `age` (2-dimensional).
   * Resolved by the renderer via `damagePitchBody()`.
   */
  | { kind: 'damageBody'; concernQuestionId: QuestionId; ageQuestionId: QuestionId; weight?: 'normal' | 'semibold' | 'accent' }
  /**
   * idx-8 "Proven Results for:" checkmark grid — a list of `text` rows each
   * preceded by the same checkmark `icon` image. Rendered as a 2-column grid.
   */
  | { kind: 'checkItems'; items: string[]; icon: string }
  /** Dynamic closing line: "So even if [concern], here's what's possible for your dream [dream] hair:" */
  | { kind: 'damagePracticesConclusion'; concernQuestionId: QuestionId; dreamQuestionId: QuestionId }

export interface PitchScreen {
  kind: 'pitch'
  id: string
  /** label sent as `question` on the `Continued From Pitch` event, e.g. 'Damage Pitch' */
  label: string
  headline: ConditionalText
  body: ConditionalText
  imageUrl?: string
  /** Optional additive multi-block body (idx-13). When set, renders blocks in order. */
  blocks?: PitchBlock[]
  chrome?: Partial<ScreenChrome>
}

export interface LoadingScreen {
  kind: 'loading'
  id: string
  messages: string[]
  durationMs: number
  /** Big title above the carousel (idx-17 "The only haircare program you'll ever need"). */
  title?: string
  /** 4-image rotating carousel shown under the title (idx-17). */
  carouselImages?: string[]
  /** Animated ✅ checkpoint lines under the progress bar (idx-17). Falls back to `messages`. */
  checkpoints?: string[]
  chrome?: Partial<ScreenChrome>
}
export interface EmailCaptureScreen {
  kind: 'email'
  id: string
  /** Back-compat: legacy single conditional line. New screens use `concernLine`. */
  headline: ConditionalText
  /** Big page headline (idx-18 "Your results are ready!"). */
  title?: string
  /** Sub-headline under the title. */
  subhead?: string
  /** Conditional "Probability to fix your … in 14 days:" line (keyed on hairConcern). */
  concernLine?: ConditionalText
  /** Card header inside the gradient form card ("Enter your details to unlock your results 🔐"). */
  cardHeader?: string
  /** Grey privacy line under the card. */
  privacy?: string
  /** Submit-button label inside the card (idx-18 "Submit"). */
  submitLabel?: string
  chrome?: Partial<ScreenChrome>
}

/**
 * Result-screen config (dashboard-spec.md §3, §4, §5). All values are documented
 * behavior of the FlutterFlow result/dashboard screen:
 *  - `ctaLabel` — the JOIN/START challenge button label.
 *  - `timerSeconds` — floating-countdown duration; source `timerSecElapsed`
 *    defaults to 1,800,000 ms ≈ 30 min = 1800 s (dashboard-spec.md §5).
 *  - `percentageRange` — inclusive [min,max] for the random match-% rolled per load
 *    via `randomInteger(92, 97)` (dashboard-spec.md §3).
 */
export interface ResultConfig {
  ctaLabel: string
  timerSeconds: number
  percentageRange: [number, number]
}

export interface ResultScreen { kind: 'result'; id: string; result?: ResultConfig; chrome?: Partial<ScreenChrome> }

export type Screen = QuestionScreen | PitchScreen | LoadingScreen | EmailCaptureScreen | ResultScreen

export interface ScreenChrome { header: boolean; back: boolean; progress: boolean }

export interface CouponRule { when: AnswerSetCondition; coupon: string }

/**
 * Embedded-checkout config (docs/reference/checkout-embed-contract.md). When
 * present + enabled, the result-page CTAs open the checkout in a same-site
 * iframe (modal sheet or inline section) instead of redirecting; the legacy
 * redirect remains the automatic fallback (load timeout, webview policy) and
 * the behavior with `enabled: false` (or the block absent) is byte-identical
 * to the pre-embed quiz.
 */
export interface CheckoutEmbedConfig {
  /** Master switch — false restores the legacy full-page redirect everywhere. */
  enabled: boolean
  /** 'modal' (default): full-screen sheet, iframe is the only scroller. 'inline': in-flow section on the result page, auto-sized via resize messages. */
  mode?: 'modal' | 'inline'
  /** Iframe document URL; defaults to `CheckoutConfig.base` (the live /buy/ page, which the WS-B bridge makes frameable). */
  base?: string
  /** When to mount the hidden iframe: 'onIntent' (default; first scroll/tap on the result page — near-zero wait on click without firing checkout pixels for pure bounces), 'onResult' (result mount), 'none' (on CTA click only). */
  preload?: 'none' | 'onIntent' | 'onResult'
  /** How long an OPENED checkout may stay in the loading state before falling back to the redirect. Default 8000. */
  loadTimeoutMs?: number
  /** Only postMessages from this origin are trusted. Default https://checkout.hairqare.co. */
  allowedOrigin?: string
  /** Force the legacy redirect inside IG/FB in-app webviews. Default FALSE — webviews are ~45% of traffic and the primary embed target; flip per-config if webview testing fails. */
  redirectInWebview?: boolean
}

export interface CheckoutConfig { base: string; couponRules: CouponRule[]; defaultCoupon: string; embed?: CheckoutEmbedConfig }

export interface QuizSpec {
  id: string
  /**
   * Stable identifier for THIS quiz version (e.g. 'long-hair-v1'), emitted as the
   * `quizId` property on the Quiz Viewed event. This is the ONLY sanctioned way to
   * distinguish quiz versions in analytics — question/answer ids are shared
   * vocabulary and must never carry the quiz identifier.
   */
  quizId?: string
  screens: Screen[]
  checkout: CheckoutConfig
  webhookUrl: string
  /** questionIds whose answers attach as properties to client analytics events (for FB targeting) */
  eventEnrichment?: QuestionId[]
}
