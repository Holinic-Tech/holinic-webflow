import type { QuizSpec } from './types'

/**
 * Minimal but representative example spec. It exercises every engine feature
 * that later phase-1 tasks (conditional resolver, navigation, store, webhook,
 * checkout builder, e2e) depend on:
 *
 *  - a single-select question (`progression: 'auto'`) with cdp mapping
 *  - a multi-select question (`progression: 'cta'`) with `noneOfTheAbove`
 *  - a pitch screen whose `body` is a `by`-keyed conditional text
 *  - an email capture screen
 *  - a result screen (always last)
 *  - checkout config with one couponRule + defaultCoupon
 *  - a webhookUrl
 *
 * Screen order is strictly linear so the engine can walk it top-to-bottom:
 *   question -> multi -> pitch -> email -> result
 *
 * ids mirror the real quiz so fixtures stay stable across tasks.
 */
export const exampleSpec: QuizSpec = {
  id: 'example',
  screens: [
    {
      kind: 'question',
      id: 's_concern',
      type: 'single',
      questionId: 'hairConcern',
      prompt: 'What is your biggest hair concern?',
      answers: [
        { answerId: 'concern_hairloss', label: 'Hair loss / thinning' },
        { answerId: 'concern_damage', label: 'Damage / breakage' },
      ],
      progression: 'auto',
      cdp: { acField: 50, mpField: 'Hair Concern' },
    },
    {
      kind: 'question',
      id: 's_symptoms',
      type: 'multi',
      questionId: 'hairSymptoms',
      prompt: 'Which symptoms are you noticing?',
      answers: [
        { answerId: 'symptom_shedding', label: 'More shedding than usual' },
        { answerId: 'symptom_dryness', label: 'Dryness' },
        { answerId: 'symptom_itch', label: 'Itchy scalp' },
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
      body: {
        by: 'hairConcern',
        cases: {
          concern_hairloss:
            'Your shedding points to a scalp environment that needs rebalancing. Our challenge targets exactly that.',
          concern_damage:
            'Breakage usually means your strands need repair and protection. The challenge rebuilds from the inside out.',
        },
        default:
          'Whatever your concern, the challenge gives your hair a fresh, healthy foundation.',
      },
    },
    {
      kind: 'email',
      id: 's_email',
      headline: 'Where should we send your personalized plan?',
    },
    {
      kind: 'result',
      id: 's_result',
    },
  ],
  checkout: {
    base: 'https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/',
    couponRules: [
      {
        when: { questionId: 'hairConcern', containsAny: ['concern_hairloss'] },
        coupon: 'c_hl',
      },
    ],
    defaultCoupon: 'o_df',
  },
  webhookUrl: 'https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit',
  eventEnrichment: ['hairConcern'],
}
