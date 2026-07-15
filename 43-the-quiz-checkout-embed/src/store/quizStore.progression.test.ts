import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createQuizStore } from './quizStore'
import type { QuizSpec } from '../spec/types'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...a: any[]) => void
    trackEvent?: (...a: any[]) => void
  }
}

// A spec that exercises EVERY screen type the store progresses through:
// single -> rating -> multi -> pitch -> loading -> email -> result
const spec: QuizSpec = {
  id: 'progression-test',
  screens: [
    {
      kind: 'question',
      id: 's_concern',
      type: 'single',
      questionId: 'hairConcern',
      prompt: 'What is your biggest hair concern?',
      answers: [
        { answerId: 'concern_hairloss', label: 'Hair loss' },
        { answerId: 'concern_damage', label: 'Damage' },
      ],
      progression: 'auto',
      cdp: { acField: 50, mpField: 'Hair Concern' },
    },
    {
      kind: 'question',
      id: 's_rating',
      type: 'rating',
      questionId: 'hairConfidence',
      prompt: 'How confident are you in your hair?',
      answers: [
        { answerId: 'rating_1', label: '1' },
        { answerId: 'rating_5', label: '5' },
      ],
      progression: 'auto',
    },
    {
      // single-select with cta progression + a reveal block (idx-10 shape).
      kind: 'question',
      id: 's_spend',
      type: 'single',
      questionId: 'shampooSpending',
      prompt: 'How much do you spend on shampoo?',
      answers: [
        { answerId: 'spend_low', label: 'Less than $10' },
        { answerId: 'spend_high', label: 'More than $50' },
      ],
      progression: 'cta',
      reveal: {
        by: 'shampooSpending',
        cases: {
          spend_low: "Awesome 🤩 you're budget conscious!",
          spend_high: 'Your hair deserves the best ✨',
        },
        default: '',
      },
      cdp: { acField: 7, mpField: 'Spending' },
    },
    {
      kind: 'question',
      id: 's_symptoms',
      type: 'multi',
      questionId: 'hairSymptoms',
      prompt: 'Which symptoms are you noticing?',
      answers: [
        { answerId: 'symptom_shedding', label: 'Shedding' },
        { answerId: 'symptom_dryness', label: 'Dryness' },
        { answerId: 'symptom_itch', label: 'Itch' },
      ],
      progression: 'cta',
      noneOfTheAbove: { label: 'None of the above', answerId: 'n/a' },
      cdp: { acField: 51, mpField: 'Hair Symptoms' },
    },
    {
      kind: 'pitch',
      id: 's_pitch',
      label: 'Concern Pitch',
      headline: "Here's what's going on",
      body: 'Whatever your concern, the challenge helps.',
    },
    {
      kind: 'loading',
      id: 's_loading',
      messages: ['Analyzing…'],
      durationMs: 2000,
    },
    {
      kind: 'email',
      id: 's_email',
      headline: 'Where should we send your plan?',
    },
    { kind: 'result', id: 's_result' },
  ],
  checkout: {
    base: 'https://checkout.hairqare.co/buy/x/',
    couponRules: [
      { when: { questionId: 'hairConcern', containsAny: ['concern_hairloss'] }, coupon: 'c_hl' },
    ],
    defaultCoupon: 'o_df',
  },
  webhookUrl: 'https://example.invalid/api/v1/quiz/submit',
  eventEnrichment: ['hairConcern'],
}

const IDX = {
  single: 0,
  rating: 1,
  spendCta: 2,
  multi: 3,
  pitch: 4,
  loading: 5,
  email: 6,
  result: 7,
} as const

const events = () => window.dataLayer.map((e) => e.event)
const lastEvent = () => window.dataLayer[window.dataLayer.length - 1]

beforeEach(() => {
  ;(window as any).dataLayer = []
  ;(window as any).gtag = undefined
  ;(window as any).trackEvent = undefined
  // never hit the network from submitWebhook
  ;(window as any).fetch = vi.fn(async () => ({ ok: true }) as Response)
})

describe('store progression + tracking — rating', () => {
  it('answer() records, fires Question Answered, advances (single tap)', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.rating)
    s.getState().answer('rating_5')
    expect(s.getState().answers.hairConfidence).toEqual(['rating_5'])
    const ev = lastEvent()
    expect(ev.event).toBe('Question Answered')
    expect(ev.question).toBe('How confident are you in your hair?')
    expect(ev.selected_answer).toEqual(['rating_5'])
    expect(ev.position).toBe(1) // raw screen index (s_rating is screens[1])
    expect(s.getState().index).toBe(IDX.rating + 1)
  })
})

describe('store progression + tracking — multi', () => {
  it('toggleMulti() updates selection WITHOUT advancing or firing an event', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.multi)
    s.getState().toggleMulti('symptom_shedding')
    s.getState().toggleMulti('symptom_dryness')
    expect(s.getState().answers.hairSymptoms).toEqual(['symptom_shedding', 'symptom_dryness'])
    expect(s.getState().index).toBe(IDX.multi)
    expect(events()).not.toContain('Question Answered')
  })

  it('chooseNoneOfTheAbove() records the sentinel (clearing others), fires Question Answered, AND advances', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.multi)
    s.getState().toggleMulti('symptom_shedding')
    s.getState().chooseNoneOfTheAbove()
    // sentinel recorded, other selections cleared
    expect(s.getState().answers.hairSymptoms).toEqual(['n/a'])
    // single Question Answered fired with ['n/a']…
    const naEvents = events().filter((e) => e === 'Question Answered')
    expect(naEvents.length).toBe(1)
    const ev = lastEvent()
    expect(ev.event).toBe('Question Answered')
    expect(ev.question_id).toBe('hairSymptoms')
    expect(ev.selected_answer).toEqual(['n/a'])
    // …and it advances like a single-select (no Continue needed)
    expect(s.getState().index).toBe(IDX.multi + 1)
  })

  it('continue() fires Question Answered with the selected array then advances', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.multi)
    s.getState().toggleMulti('symptom_shedding')
    s.getState().toggleMulti('symptom_itch')
    s.getState().continue()
    const ev = lastEvent()
    expect(ev.event).toBe('Question Answered')
    expect(ev.question_id).toBe('hairSymptoms')
    expect(ev.question).toBe('Which symptoms are you noticing?')
    expect(ev.selected_answer).toEqual(['symptom_shedding', 'symptom_itch'])
    expect(ev.position).toBe(3) // raw screen index (s_symptoms is screens[3])
    expect(s.getState().index).toBe(IDX.multi + 1)
  })
})

describe('store progression + tracking — single + cta reveal (idx-10 shape)', () => {
  it('answer() records WITHOUT firing Question Answered or advancing', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.spendCta)
    s.getState().answer('spend_low')
    // answer recorded so the reveal + Continue can show…
    expect(s.getState().answers.shampooSpending).toEqual(['spend_low'])
    // …but NO Question Answered fired and the screen did NOT advance.
    expect(events()).not.toContain('Question Answered')
    expect(s.getState().index).toBe(IDX.spendCta)
  })

  it('continue() then fires Question Answered (selected answer) and advances', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.spendCta)
    s.getState().answer('spend_high')
    s.getState().continue()
    const ev = lastEvent()
    expect(ev.event).toBe('Question Answered')
    expect(ev.question_id).toBe('shampooSpending')
    expect(ev.question).toBe('How much do you spend on shampoo?')
    expect(ev.selected_answer).toEqual(['spend_high'])
    expect(ev.position).toBe(2) // raw screen index (s_spend is screens[2])
    expect(s.getState().index).toBe(IDX.spendCta + 1)
  })

  it('re-tapping a different answer updates the recorded answer (single-select)', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.spendCta)
    s.getState().answer('spend_low')
    s.getState().answer('spend_high')
    expect(s.getState().answers.shampooSpending).toEqual(['spend_high'])
    expect(events()).not.toContain('Question Answered')
  })

  // Toby's requirement: going BACK to a question and changing the answer must
  // (1) re-fire the event with ONLY the new answer and (2) feed ONLY the new
  // answer to personalisation + the payload — never blindly append to the array.
  it('back-navigation + re-answer REPLACES the answer (no blind append), re-fires with ONLY the new answer, and feeds only the new answer downstream', () => {
    const s = createQuizStore(spec)
    // First pass: answer the enriched single-select hairConcern (idx 0) -> advances.
    s.getState().answer('concern_hairloss')
    expect(s.getState().answers.hairConcern).toEqual(['concern_hairloss'])

    // Go BACK to the question and pick a DIFFERENT answer.
    ;(window as any).dataLayer = [] // capture only the re-answer phase
    s.getState().back()
    expect(s.getState().index).toBe(IDX.single)
    s.getState().answer('concern_damage')

    // 1) REPLACE, not append: the answer state holds ONLY the new answer.
    expect(s.getState().answers.hairConcern).toEqual(['concern_damage'])

    // 2) Question Answered re-fires carrying ONLY the new answer.
    const reAnswered = window.dataLayer.filter((e) => e.event === 'Question Answered')
    expect(reAnswered).toHaveLength(1)
    expect(reAnswered[0].selected_answer).toEqual(['concern_damage'])
    expect(reAnswered[0].question_id).toBe('hairConcern')

    // 3) Downstream uses ONLY the new answer: the FB-enrichment attribute (which
    //    rides the same answer state the webhook payload + conditions read) carries
    //    the NEW value, not the old one.
    expect(reAnswered[0].hairConcern).toBe('concern_damage')

    // Quiz Started does NOT re-fire (it already fired on the first answer).
    expect(window.dataLayer.filter((e) => e.event === 'Quiz Started')).toHaveLength(0)
  })

  it('fires Quiz Started ONCE before the first Question Answered even when the first answered question is cta', () => {
    const s = createQuizStore(spec)
    // Jump straight to the cta screen as the FIRST answered question.
    s.getState().goTo(IDX.spendCta)
    s.getState().answer('spend_low')
    // tapping a cta answer does NOT fire Quiz Started/Question Answered yet
    expect(events()).not.toContain('Quiz Started')
    s.getState().continue()
    const names = events()
    const startedIdx = names.indexOf('Quiz Started')
    const answeredIdx = names.indexOf('Question Answered')
    expect(startedIdx).toBeGreaterThanOrEqual(0)
    expect(startedIdx).toBeLessThan(answeredIdx)
  })

  it('viewed() CLEARS a prior cta-single selection so the reveal starts EMPTY on (re)arrival', () => {
    // Regression for the shampoo reveal bug: after selecting + continuing, then
    // navigating BACK into the cta-single screen, the reveal/selection must NOT
    // already be showing. viewed() (fired on every navigation INTO a screen)
    // clears the recorded answer for a cta-single so it starts empty again.
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.spendCta)
    s.getState().answer('spend_low')
    s.getState().continue() // -> records, fires Question Answered, advances to multi
    expect(s.getState().answers.shampooSpending).toEqual(['spend_low'])

    // Navigate back INTO the cta-single and fire viewed() (as QuizApp does).
    s.getState().back()
    expect(s.getState().index).toBe(IDX.spendCta)
    s.getState().viewed()
    // The selection is cleared → SingleChoiceScreen renders no reveal/selected,
    // and the sticky Continue (derived from this answer) is hidden.
    expect(s.getState().answers.shampooSpending ?? []).toEqual([])
  })

  it('viewed() does NOT clear a multi-select selection (only cta-single reveals reset)', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.multi)
    s.getState().toggleMulti('symptom_shedding')
    s.getState().viewed()
    expect(s.getState().answers.hairSymptoms).toEqual(['symptom_shedding'])
  })
})

describe('store progression + tracking — pitch', () => {
  it('continue() fires Continued From Pitch with question = label then advances', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.pitch)
    s.getState().continue()
    const ev = lastEvent()
    expect(ev.event).toBe('Continued From Pitch')
    expect(ev.question).toBe('Concern Pitch')
    expect(s.getState().index).toBe(IDX.pitch + 1)
  })
})

describe('store progression + tracking — loading', () => {
  it('loadingDone() advances with NO event', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.loading)
    s.getState().loadingDone()
    expect(window.dataLayer.length).toBe(0)
    expect(s.getState().index).toBe(IDX.loading + 1)
  })
})

describe('store progression + tracking — email', () => {
  it('submitEmail() stores contact, fires Quiz Submitted, calls webhook + converge, advances to result', async () => {
    const fetchMock = vi.fn(async (..._a: any[]) => ({ ok: true }) as Response)
    ;(window as any).fetch = fetchMock
    const trackEvent = vi.fn()
    ;(window as any).trackEvent = trackEvent

    const s = createQuizStore(spec)
    s.getState().goTo(IDX.email)
    await s.getState().submitEmail({ name: 'Ann Marie Smith', email: 'ann@example.com' })

    // contact stored, name split on FIRST space
    expect(s.getState().contact).toEqual({
      name: 'Ann Marie Smith',
      firstName: 'Ann',
      lastName: 'Marie Smith',
      email: 'ann@example.com',
    })

    // GA Quiz Submitted with q_name / q_email
    const ev = window.dataLayer.find((e) => e.event === 'Quiz Submitted')
    expect(ev).toBeTruthy()
    expect(ev.q_name).toBe('Ann Marie Smith')
    expect(ev.q_email).toBe('ann@example.com')

    // webhook POSTed
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe(spec.webhookUrl)

    // converge Completed Quiz fired
    expect(trackEvent).toHaveBeenCalledWith(
      'Completed Quiz',
      expect.objectContaining({ email: 'ann@example.com', firstName: 'Ann', lastName: 'Marie Smith' }),
      null,
      { $email: 'ann@example.com' },
      ['urn:email:ann@example.com'],
    )

    // advanced to result
    expect(s.getState().index).toBe(IDX.result)
  })

  it('splits a single-word name into firstName with empty lastName', async () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.email)
    await s.getState().submitEmail({ name: 'Cher', email: 'cher@example.com' })
    expect(s.getState().contact).toMatchObject({ firstName: 'Cher', lastName: '' })
  })
})

describe('store progression + tracking — skip dialog', () => {
  it('openSkip() fires Opened Skip Dialog', () => {
    const s = createQuizStore(spec)
    s.getState().openSkip()
    expect(lastEvent().event).toBe('Opened Skip Dialog')
  })

  it('dismissSkip() fires Closed Skip Dialog', () => {
    const s = createQuizStore(spec)
    s.getState().dismissSkip()
    expect(lastEvent().event).toBe('Closed Skip Dialog')
  })

  it('confirmSkip() fires SkipQuiz then redirects to checkout', () => {
    const hrefSet = vi.fn((_v: string) => {})
    const original = window.location
    // replace location so redirectToCheckout does not navigate for real
    delete (window as any).location
    ;(window as any).location = { search: '', set href(v: string) { hrefSet(v) } }

    const s = createQuizStore(spec)
    s.getState().answer('concern_hairloss') // pick so coupon resolves
    s.getState().confirmSkip()

    expect(window.dataLayer.some((e) => e.event === 'SkipQuiz')).toBe(true)
    expect(hrefSet).toHaveBeenCalledTimes(1)
    expect(hrefSet.mock.calls[0][0]).toContain(spec.checkout.base)
    expect(hrefSet.mock.calls[0][0]).toContain('aero-coupons=c_hl')

    ;(window as any).location = original
  })
})

describe('store progression + tracking — plan details + checkout entry points', () => {
  // Replace window.location so the checkout actions don't navigate for real.
  function withStubbedLocation(run: (hrefSet: ReturnType<typeof vi.fn>) => void) {
    const hrefSet = vi.fn((_v: string) => {})
    const original = window.location
    delete (window as any).location
    ;(window as any).location = { search: '', set href(v: string) { hrefSet(v) } }
    try {
      run(hrefSet)
    } finally {
      ;(window as any).location = original
    }
  }

  it('openPlanDetails() fires Opened Plan Details', () => {
    const s = createQuizStore(spec)
    s.getState().openPlanDetails()
    expect(lastEvent().event).toBe('Opened Plan Details')
  })

  it('closePlanDetails() fires Closed Plan Details', () => {
    const s = createQuizStore(spec)
    s.getState().closePlanDetails()
    expect(lastEvent().event).toBe('Closed Plan Details')
  })

  it('checkoutFromResults() fires the TWO-space "Go to  checkout" then redirects', () => {
    withStubbedLocation((hrefSet) => {
      const s = createQuizStore(spec)
      s.getState().answer('concern_hairloss')
      s.getState().checkoutFromResults()
      expect(lastEvent().event).toBe('Go to  checkout') // TWO spaces
      expect(lastEvent().event).not.toBe('Go to checkout')
      expect(hrefSet).toHaveBeenCalledTimes(1)
      expect(hrefSet.mock.calls[0][0]).toContain('aero-coupons=c_hl')
    })
  })

  it('checkoutFromPlanDialog() fires the TWO-space "Go to  checkout" then redirects', () => {
    withStubbedLocation((hrefSet) => {
      const s = createQuizStore(spec)
      s.getState().checkoutFromPlanDialog()
      expect(lastEvent().event).toBe('Go to  checkout') // TWO spaces
      expect(hrefSet).toHaveBeenCalledTimes(1)
    })
  })

  it('checkoutFromTimer() fires the ONE-space "Go to checkout" then redirects', () => {
    withStubbedLocation((hrefSet) => {
      const s = createQuizStore(spec)
      s.getState().checkoutFromTimer()
      expect(lastEvent().event).toBe('Go to checkout') // ONE space
      expect(lastEvent().event).not.toBe('Go to  checkout')
      expect(hrefSet).toHaveBeenCalledTimes(1)
    })
  })

  it('the two checkout strings differ ONLY by a space (byte-for-byte distinction holds)', () => {
    withStubbedLocation(() => {
      const s = createQuizStore(spec)
      s.getState().checkoutFromResults()
      const resultsEvent = lastEvent().event
      s.getState().checkoutFromTimer()
      const timerEvent = lastEvent().event
      expect(resultsEvent).toBe('Go to  checkout')
      expect(timerEvent).toBe('Go to checkout')
      expect(resultsEvent.length).toBe(timerEvent.length + 1)
      expect(resultsEvent.replace('  ', ' ')).toBe(timerEvent)
    })
  })
})

describe('store — result percentage seed', () => {
  it('seeds resultPercentage ONCE from result.percentageRange (default [92,97])', () => {
    const s = createQuizStore(spec)
    const pct = s.getState().resultPercentage
    expect(pct).toBeGreaterThanOrEqual(92)
    expect(pct).toBeLessThanOrEqual(97)
  })

  it('is overridable for deterministic tests and stays stable across transitions', () => {
    const s = createQuizStore(spec, { seedPercentage: 95 })
    expect(s.getState().resultPercentage).toBe(95)
    s.getState().answer('concern_hairloss')
    s.getState().goTo(IDX.result)
    expect(s.getState().resultPercentage).toBe(95) // not re-rolled
  })
})

describe('store progression — phase-1 behavior preserved', () => {
  it('single-select answer() still auto-advances + fires Question Answered', () => {
    const s = createQuizStore(spec)
    s.getState().answer('concern_hairloss')
    expect(events()).toContain('Question Answered')
    expect(s.getState().index).toBe(1)
  })

  it('viewed() fires Quiz Viewed on a question and Viewed Results Page on result', () => {
    const s = createQuizStore(spec)
    s.getState().viewed()
    expect(lastEvent().event).toBe('Quiz Viewed')
    s.getState().goTo(IDX.result)
    s.getState().viewed()
    expect(lastEvent().event).toBe('Viewed Results Page')
  })
})

describe('store progression + tracking — Quiz Started (GA lifecycle, contract:102)', () => {
  it('fires Quiz Started ONCE, immediately BEFORE the first Question Answered', () => {
    const s = createQuizStore(spec)
    expect(s.getState().quizStarted).toBe(false)

    // Answer the FIRST question (single-select hairConcern at idx 0).
    s.getState().answer('concern_hairloss')

    // Both events fired, Quiz Started first.
    const names = events()
    const startedIdx = names.indexOf('Quiz Started')
    const answeredIdx = names.indexOf('Question Answered')
    expect(startedIdx).toBeGreaterThanOrEqual(0)
    expect(answeredIdx).toBeGreaterThanOrEqual(0)
    expect(startedIdx).toBeLessThan(answeredIdx)

    // Quiz Started carries the first question's id + resolved prompt; no answer (null).
    const started = window.dataLayer[startedIdx]
    expect(started.question_id).toBe('hairConcern')
    expect(started.question).toBe('What is your biggest hair concern?')
    expect(started.selected_answer).toBeNull()
    expect(started.position).toBe(0) // raw screen index (s_concern is screens[0])

    // Guard flipped.
    expect(s.getState().quizStarted).toBe(true)
  })

  it('does NOT fire Quiz Started again on later answers', () => {
    const s = createQuizStore(spec)
    s.getState().answer('concern_hairloss') // first question — fires Quiz Started
    ;(window as any).dataLayer = [] // reset capture for the SECOND answer
    s.getState().answer('rating_5') // idx 1, a later question
    expect(events()).not.toContain('Quiz Started')
    expect(events()).toContain('Question Answered')
  })
})

describe('store progression + tracking — Quiz Completed (GA-only, contract:112)', () => {
  it('viewing the email screen fires Quiz Completed with question = Contact Details Form', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.email)
    s.getState().viewed()
    const ev = lastEvent()
    expect(ev.event).toBe('Quiz Completed')
    expect(ev.question).toBe('Contact Details Form')
    expect(ev.event_category).toBe('Quiz')
  })

  it('the email screen view fires Quiz Completed, NOT Quiz Viewed', () => {
    const s = createQuizStore(spec)
    s.getState().goTo(IDX.email)
    s.getState().viewed()
    expect(events()).toContain('Quiz Completed')
    expect(events()).not.toContain('Quiz Viewed')
  })
})
