import { describe, it, expect } from 'vitest'
import { validateSpec } from '../spec/validate'
import { hairquizSpec } from './hairquiz.spec'
import { pitchClaim } from './content/pitch-claim-matrix'

describe('hairquizSpec', () => {
  it('passes the spec validator with no errors', () => {
    expect(validateSpec(hairquizSpec)).toEqual([])
  })

  it('has 18 screens, question first and result last', () => {
    expect(hairquizSpec.screens).toHaveLength(18)
    expect(hairquizSpec.screens[0].kind).toBe('question')
    expect(hairquizSpec.screens[hairquizSpec.screens.length - 1].kind).toBe('result')
  })

  it('matches the tracking contract for checkout + webhook', () => {
    expect(hairquizSpec.checkout.base).toBe(
      'https://checkout.hairqare.co/buy/hairqare-challenge-save-85-5/',
    )
    expect(hairquizSpec.checkout.defaultCoupon).toBe('o_df')
    expect(hairquizSpec.webhookUrl).toBe(
      'https://quiz-submissions-worker.dndgroup.workers.dev/api/v1/quiz/submit',
    )
  })

  it('every pitch screen has a non-empty label', () => {
    const pitches = hairquizSpec.screens.filter(s => s.kind === 'pitch')
    expect(pitches).toHaveLength(3)
    for (const p of pitches) {
      expect(p.kind === 'pitch' && p.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('resolves the 5×5 claim cells exactly as quiz-flow.md', () => {
    expect(pitchClaim('routine_complex', 'concern_hairloss')).toBe(
      "But if you are still struggling with hair loss and thinning despite all the treatments, specialists and products you've tried, you're missing important haircare knowledge.",
    )
    expect(pitchClaim('routine_basic', 'concern_splitends')).toBe(
      "But if you are still struggling with split ends and dryness while only relying on using shampoo & conditioner, you're missing important haircare knowledge.",
    )
  })
})
