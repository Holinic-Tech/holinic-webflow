import { createStore } from 'zustand/vanilla'
import type { QuizSpec, Screen } from '../spec/types'
import {
  type AnswerState,
  emptyAnswers,
  recordSingle,
  toggleMulti as toggleMultiState,
  recordNoneOfTheAbove,
} from '../engine/answers'
import { resolveConditional } from '../engine/conditions'
import { trackGAEvent } from '../tracking/track'
import { GA } from '../tracking/events'
import { submitWebhook } from '../tracking/webhook'
import { trackConvergeCompletedQuiz } from '../tracking/converge'
import { redirectToCheckout } from '../tracking/checkout'

/** Captured contact for the email step; `name` is split on the FIRST space (contract). */
export interface QuizContact {
  name: string
  firstName: string
  lastName: string
  email: string
}

export interface QuizState {
  spec: QuizSpec
  index: number
  answers: AnswerState
  contact: QuizContact | null
  /** Match % shown on the dashboard. Seeded ONCE on store creation (dashboard-spec.md §3). */
  resultPercentage: number
  /** Whether the start-screen "skip the quiz" confirmation modal is open. */
  skipOpen: boolean
  /**
   * Whether the GA `Quiz Started` event has fired yet. Guards the once-only
   * `Quiz Started`, which fires together with — and immediately BEFORE — the
   * FIRST `Question Answered` of the quiz (tracking-contract.md:102).
   */
  quizStarted: boolean
  goTo: (index: number) => void
  answer: (answerId: string) => void
  toggleMulti: (answerId: string) => void
  chooseNoneOfTheAbove: () => void
  continue: () => void
  loadingDone: () => void
  submitEmail: (input: { name: string; email: string }) => Promise<void>
  openSkip: () => void
  dismissSkip: () => void
  confirmSkip: () => void
  openPlanDetails: () => void
  closePlanDetails: () => void
  checkoutFromResults: () => void
  checkoutFromTimer: () => void
  checkoutFromPlanDialog: () => void
  /**
   * Advance past the start cover without recording any answer or firing
   * `Question Answered`. The cover CTA is not a question — it has no goal data
   * to record, and the old `hairGoal` field from haircare-v1 must not bleed
   * into this quiz's Mixpanel stream.
   */
  startQuiz: () => void
  back: () => void
  viewed: () => void
}

/**
 * Default result-screen config used when the spec's `result` screen omits its
 * optional `result` block. Mirrors the FlutterFlow defaults (dashboard-spec.md
 * §3, §5): 30-min floating timer, match-% rolled in [92, 97].
 */
export const DEFAULT_RESULT_CONFIG = {
  ctaLabel: 'JOIN THE CHALLENGE',
  timerSeconds: 1800,
  percentageRange: [92, 97] as [number, number],
}

/** Resolve the result-screen config from the spec, falling back to defaults. */
export function resolveResultConfig(spec: QuizSpec) {
  const screen = spec.screens.find((s) => s.kind === 'result')
  const cfg = screen?.kind === 'result' ? screen.result : undefined
  return { ...DEFAULT_RESULT_CONFIG, ...cfg }
}

/** Inclusive random integer in [min, max]. */
function randomIntInclusive(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

/** Options for {@link createQuizStore}; `seedPercentage` makes the match-% deterministic in tests. */
export interface CreateQuizStoreOptions {
  /** Override the random match-% seed (otherwise rolled once from `result.percentageRange`). */
  seedPercentage?: number
  /**
   * Embedded-checkout hook for the THREE result-page checkout actions. Called
   * AFTER the GA event fires (event strings/params are untouched either way):
   * return 'handled' to suppress the redirect (the embed presented the
   * checkout), 'redirect' to fall through to it. Absent = legacy redirect.
   * `confirmSkip` (mid-quiz) deliberately bypasses this — the embed exists
   * only on the result page.
   */
  onCheckout?: () => 'handled' | 'redirect'
}

/** Webhook secret from the build env; empty string in tests where it is unset. */
const WEBHOOK_SECRET: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WEBHOOK_SECRET) || ''

/** Split a full name into first/last on the FIRST space (matches the contract). */
function splitName(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim()
  const i = trimmed.indexOf(' ')
  if (i === -1) return { firstName: trimmed, lastName: '' }
  return { firstName: trimmed.slice(0, i), lastName: trimmed.slice(i + 1).trim() }
}

export type QuizStore = ReturnType<typeof createQuizStore>

/**
 * Build the FB-targeting enrichment params for answer-bearing GA events. For
 * each `questionId` in `spec.eventEnrichment` that has an answer in `answers`,
 * emit `{ [questionId]: answerIds.join(',') }`. Pure + additive: the key IS the
 * questionId (e.g. `hairConcern: 'concern_hairloss'`), so these are always NEW
 * keys that never collide with the fixed contract params. Spread into the
 * `extra` of the relevant `trackGAEvent` calls; `track.ts` forwards them as-is.
 */
export function enrichmentParams(spec: QuizSpec, answers: AnswerState): Record<string, string> {
  const out: Record<string, string> = {}
  for (const questionId of spec.eventEnrichment ?? []) {
    const ids = answers[questionId]
    if (ids && ids.length > 0) out[questionId] = ids.join(',')
  }
  return out
}

/** Resolved prompt for a question screen — the `question` param sent to GA. */
function resolvedPrompt(screen: Extract<Screen, { kind: 'question' }>, answers: AnswerState): string {
  return resolveConditional(screen.prompt, answers)
}

export function createQuizStore(spec: QuizSpec, options: CreateQuizStoreOptions = {}) {
  const resultCfg = resolveResultConfig(spec)
  // Seed the match-% ONCE on store creation (deterministic when overridden).
  const [pctMin, pctMax] = resultCfg.percentageRange
  const seededPercentage =
    options.seedPercentage ?? randomIntInclusive(pctMin, pctMax)

  return createStore<QuizState>((set, get) => {
    const next = () => {
      const { index } = get()
      set({ index: Math.min(index + 1, spec.screens.length - 1) })
    }

    /**
     * Fire the once-only GA `Quiz Started` for the current question screen,
     * immediately BEFORE its first `Question Answered` (tracking-contract.md:102).
     * No-op after the first call (guarded by `quizStarted`). `screen` is the
     * current question screen; `answers` is the answer state used to resolve the
     * prompt. `selected_answer` is empty (set by trackGAEvent's default).
     */
    const fireQuizStartedOnce = (
      screen: Extract<Screen, { kind: 'question' }>,
      answers: AnswerState,
    ) => {
      const { index, quizStarted } = get()
      if (quizStarted) return
      trackGAEvent(
        GA.QUIZ_STARTED,
        { questionId: screen.questionId, question: resolvedPrompt(screen, answers) },
        index,
      )
      set({ quizStarted: true })
    }

    /**
     * Fire a checkout GA event then present the checkout (the shared tail of
     * all 3 entry points). The GA event ALWAYS fires first, byte-identical to
     * the legacy build; the embed hook only decides what happens next.
     */
    const fireCheckout = (event: typeof GA.GO_TO_CHECKOUT_RESULTS | typeof GA.GO_TO_CHECKOUT_TIMER) => {
      const { spec, index, answers, contact } = get()
      trackGAEvent(event, { ...enrichmentParams(spec, answers) }, index)
      if (options.onCheckout?.() === 'handled') return
      redirectToCheckout(spec.checkout, contact ?? {}, answers)
    }

    return {
      spec,
      index: 0,
      answers: emptyAnswers(),
      contact: null,
      resultPercentage: seededPercentage,
      skipOpen: false,
      quizStarted: false,

      goTo: (index) => set({ index: Math.max(0, Math.min(index, spec.screens.length - 1)) }),

      startQuiz: () => {
        const { index, answers } = get()
        const screen = spec.screens[index]
        if (screen.kind === 'question') fireQuizStartedOnce(screen, answers)
        next()
      },

      answer: (answerId) => {
        const { spec, index, answers } = get()
        const screen = spec.screens[index]
        if (screen.kind !== 'question') return
        // Multi-select only toggles; it advances later via continue() (cta).
        if (screen.type === 'multi') {
          get().toggleMulti(answerId)
          return
        }
        // single / image / rating with `cta` progression (e.g. the shampoo-spend
        // reveal, idx-10): record ONLY so the reveal + Continue can show. No
        // `Question Answered`, no advance — both happen in continue().
        if (screen.progression === 'cta') {
          set({ answers: recordSingle(answers, screen.questionId, answerId) })
          return
        }
        // single / image / rating with `auto`: record, track with the raw
        // screen-index position, advance on tap.
        const nextAnswers = recordSingle(answers, screen.questionId, answerId)
        set({ answers: nextAnswers })
        // `Quiz Started` fires once, immediately BEFORE the first `Question Answered`.
        fireQuizStartedOnce(screen, nextAnswers)
        trackGAEvent(
          GA.QUESTION_ANSWERED,
          {
            questionId: screen.questionId,
            question: resolvedPrompt(screen, nextAnswers),
            selectedAnswer: [answerId],
            ...enrichmentParams(spec, nextAnswers),
          },
          index,
        )
        next()
      },

      toggleMulti: (answerId) => {
        const { spec, index, answers } = get()
        const screen = spec.screens[index]
        if (screen.kind !== 'question') return
        set({ answers: toggleMultiState(answers, screen.questionId, answerId) })
      },

      chooseNoneOfTheAbove: () => {
        const { spec, index, answers } = get()
        const screen = spec.screens[index]
        if (screen.kind !== 'question' || !screen.noneOfTheAbove) return
        // "None of the above" behaves like a single-select: record `['n/a']`
        // (clearing any other selections), fire `Question Answered`, and advance
        // immediately — no Continue needed (matches the Flutter original, where
        // the None tap fired Question Answered AND navigated). Regular option
        // taps still go through toggleMulti + continue().
        const noneId = screen.noneOfTheAbove.answerId
        const nextAnswers = recordNoneOfTheAbove(answers, screen.questionId, noneId)
        set({ answers: nextAnswers })
        // `Quiz Started` fires once, immediately BEFORE the first `Question Answered`.
        fireQuizStartedOnce(screen, nextAnswers)
        trackGAEvent(
          GA.QUESTION_ANSWERED,
          {
            questionId: screen.questionId,
            question: resolvedPrompt(screen, nextAnswers),
            selectedAnswer: [noneId],
            ...enrichmentParams(spec, nextAnswers),
          },
          index,
        )
        next()
      },

      continue: () => {
        const { spec, index, answers } = get()
        const screen = spec.screens[index]
        // Question screens that advance via Continue (cta): multi-select AND
        // single/image/rating reveal screens (e.g. shampoo-spend idx-10). The
        // recorded answer was set by toggleMulti / answer(); fire `Question
        // Answered` with it now, then advance.
        if (screen.kind === 'question' && screen.progression === 'cta') {
          const selected = answers[screen.questionId] ?? []
          // `Quiz Started` fires once, immediately BEFORE the first `Question Answered`.
          fireQuizStartedOnce(screen, answers)
          trackGAEvent(
            GA.QUESTION_ANSWERED,
            {
              questionId: screen.questionId,
              question: resolvedPrompt(screen, answers),
              selectedAnswer: selected,
              ...enrichmentParams(spec, answers),
            },
            index,
          )
        } else if (screen.kind === 'pitch') {
          trackGAEvent(
            GA.CONTINUED_FROM_PITCH,
            { question: screen.label },
            index,
          )
        }
        next()
      },

      // Loading screen finished its timer — advance with no tracking event.
      loadingDone: () => next(),

      submitEmail: async ({ name, email }) => {
        const { spec, answers, index } = get()
        const { firstName, lastName } = splitName(name)
        const contact: QuizContact = { name, firstName, lastName, email }
        set({ contact })

        trackGAEvent(
          GA.QUIZ_SUBMITTED,
          { qName: name, qEmail: email, ...enrichmentParams(spec, answers) },
          index,
        )

        // Best-effort side-effects (never throw): server webhook + Converge.
        await submitWebhook(spec, answers, { name, firstName, lastName, email }, WEBHOOK_SECRET)
        trackConvergeCompletedQuiz({ answers, name, firstName, lastName, email })

        next()
      },

      openSkip: () => {
        const { index } = get()
        trackGAEvent(GA.OPENED_SKIP_DIALOG, {}, index)
        set({ skipOpen: true })
      },

      dismissSkip: () => {
        const { index } = get()
        trackGAEvent(GA.CLOSED_SKIP_DIALOG, {}, index)
        set({ skipOpen: false })
      },

      confirmSkip: () => {
        const { spec, index, answers, contact } = get()
        trackGAEvent(GA.SKIP_QUIZ, {}, index)
        set({ skipOpen: false })
        redirectToCheckout(spec.checkout, contact ?? {}, answers)
      },

      // Plan-details dialog open/close (dashboard-spec.md §4).
      openPlanDetails: () => {
        const { index } = get()
        trackGAEvent(GA.OPENED_PLAN_DETAILS, {}, index)
      },

      closePlanDetails: () => {
        const { index } = get()
        trackGAEvent(GA.CLOSED_PLAN_DETAILS, {}, index)
      },

      // The three DISTINCT checkout entry points (dashboard-spec.md §4/§5):
      //  - dashboard CTA + plan-dialog CTA → TWO-space `Go to  checkout`
      //  - floating timer CTA             → ONE-space `Go to checkout`
      checkoutFromResults: () => fireCheckout(GA.GO_TO_CHECKOUT_RESULTS),
      checkoutFromTimer: () => fireCheckout(GA.GO_TO_CHECKOUT_TIMER),
      checkoutFromPlanDialog: () => fireCheckout(GA.GO_TO_CHECKOUT_RESULTS),

      back: () => {
        const { index } = get()
        trackGAEvent(GA.QUIZ_BACK, {}, index)
        set({ index: Math.max(0, index - 1) })
      },

      viewed: () => {
        const { spec, index, answers } = get()
        const screen = spec.screens[index]
        const position = index
        // A `cta`-progression single-select is a REVEAL screen (e.g. shampoo-spend
        // idx-10): its yellow per-answer reveal card + the sticky Continue both
        // derive from the recorded answer, so they must start EMPTY on every
        // arrival and appear only AFTER the user taps an option on THIS visit.
        // Clearing the recorded answer here (the single chokepoint hit on every
        // navigation INTO the screen, forward OR back) guarantees that. Tracking
        // is unaffected: the answer is re-recorded on tap and `Question Answered`
        // still fires from continue() with the freshly-recorded selection.
        if (
          screen.kind === 'question' &&
          screen.type === 'single' &&
          screen.progression === 'cta' &&
          (answers[screen.questionId]?.length ?? 0) > 0
        ) {
          const cleared = { ...answers }
          delete cleared[screen.questionId]
          set({ answers: cleared })
        }
        if (screen.kind === 'result') {
          // Answer-bearing: enrich for FB targeting on the results view. `question`
          // is set explicitly ('Result Page') so it overwrites the stale value the
          // preceding email screen's `Quiz Completed` left in GTM's dataLayer.
          trackGAEvent(GA.VIEWED_RESULTS_PAGE, { question: 'Result Page', ...enrichmentParams(spec, answers) }, position)
        } else if (screen.kind === 'email') {
          // GA-only `Quiz Completed` on the contact-details form view (NOT the
          // Converge `Completed Quiz`). tracking-contract.md.
          trackGAEvent(GA.QUIZ_COMPLETED, { question: 'Contact Details Form' }, position)
        } else if (index === 0) {
          // `Quiz Viewed` fires EXACTLY ONCE — on the FIRST screen (the start cover),
          // before any interaction. It is the "landing on the quiz" event, NOT a
          // per-screen view. (Flutter fired `Quiz Viewed` on every screen's mount;
          // that double-counted and is intentionally NOT reproduced — every later
          // screen-view is represented by its own `Question Answered`/pitch event.)
          // Quiz identity rides on `quizId` (the sanctioned way to distinguish quiz
          // versions) — never on the shared question/answer ids. Only sent when set.
          trackGAEvent(GA.QUIZ_VIEWED, spec.quizId ? { quizId: spec.quizId } : {}, position)
        }
      },
    }
  })
}
