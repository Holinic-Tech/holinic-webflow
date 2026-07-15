import { describe, it, expect } from 'vitest'
import type { AnswerState } from '../../engine/answers'
import {
  benefitByGoal,
  benefitFor,
  goalDescByConcern,
  goalDescFor,
  transformationByConcern,
  transformationFor,
  testimonialsByConcern,
  testimonialsFor,
  staticCarouselSlides,
  avatarByAge,
  avatarFor,
} from './result-content'

const ans = (q: string, a: string): AnswerState => ({ [q]: [a] })

describe('benefitFor — match-card benefit by hairGoal (dashboard-spec.md §2a)', () => {
  it('resolves each goal answerId to its benefit line', () => {
    expect(benefitFor(ans('hairGoal', 'goal_hairloss'))).toContain('new baby hairs')
    expect(benefitFor(ans('hairGoal', 'goal_betterhair'))).toContain('softer, healthier')
    expect(benefitFor(ans('hairGoal', 'goal_both'))).toBe(benefitByGoal.cases['goal_both'])
  })

  it('preserves the byte-for-byte trailing space on goal_betterhair', () => {
    expect(benefitFor(ans('hairGoal', 'goal_betterhair')).endsWith('challenge. ')).toBe(true)
  })

  it('falls back to default (= goal_both) for unknown / unanswered', () => {
    expect(benefitFor({})).toBe(benefitByGoal.default)
    expect(benefitFor(ans('hairGoal', 'goal_unknown'))).toBe(benefitByGoal.default)
    expect(benefitByGoal.default).toBe(benefitByGoal.cases['goal_both'])
  })
})

describe('goalDescFor — "My Goal:" description by hairConcern (§2d)', () => {
  it('resolves each concern answerId', () => {
    expect(goalDescFor(ans('hairConcern', 'concern_hairloss'))).toContain('Denser hair')
    expect(goalDescFor(ans('hairConcern', 'concern_splitends'))).toContain('Smoother, frizz-free')
    expect(goalDescFor(ans('hairConcern', 'concern_scalp'))).toContain('calm, itch and flake free scalp')
    expect(goalDescFor(ans('hairConcern', 'concern_damage'))).toContain('Stronger, more resilient')
  })

  it('falls back to default for concern_mixed / unanswered', () => {
    expect(goalDescFor(ans('hairConcern', 'concern_mixed'))).toBe(goalDescByConcern.default)
    expect(goalDescFor({})).toBe(goalDescByConcern.default)
    expect(goalDescByConcern.default).toContain('Healthy, problem-free hair')
  })
})

describe('transformationFor — timeline images by hairConcern (§2e + §2f)', () => {
  it('resolves hero + timeline image pair per concern', () => {
    const hl = transformationFor(ans('hairConcern', 'concern_hairloss'))
    expect(hl.hero).toContain('RP%20Hairloss.webp')
    expect(hl.timeline).toContain('RP%20hairloss%20timeline.webp')

    const sc = transformationFor(ans('hairConcern', 'concern_scalp'))
    expect(sc.hero).toContain('RP%20Dandruff.webp')
    expect(sc.timeline).toContain('RP%20dandruff%20timeline.webp')
  })

  it('uses the shared assets.hairqare.co base path', () => {
    expect(transformationFor(ans('hairConcern', 'concern_damage')).hero).toMatch(
      /^https:\/\/assets\.hairqare\.co\/cdn-cgi\/image\//,
    )
  })

  it('falls back to the "Others" pair for concern_mixed / unanswered', () => {
    expect(transformationFor(ans('hairConcern', 'concern_mixed'))).toEqual(transformationByConcern.default)
    expect(transformationFor({})).toEqual(transformationByConcern.default)
    expect(transformationByConcern.default.hero).toContain('RP%20Others.webp')
    expect(transformationByConcern.default.timeline).toContain('RP%20others%20timeline.webp')
  })
})

describe('testimonialsFor — before/after images by hairConcern (§2h + §2i)', () => {
  it('resolves 3 carousel slides + lower image per concern', () => {
    const hl = testimonialsFor(ans('hairConcern', 'concern_hairloss'))
    expect(hl.carousel).toHaveLength(3)
    expect(hl.carousel[0]).toContain('ji-woo-before-after.webp')
    expect(hl.lower).toContain('marisol-before-after.webp')
  })

  it('models the explicit concern_mixed case from §2h', () => {
    const mixed = testimonialsFor(ans('hairConcern', 'concern_mixed'))
    expect(mixed.carousel[0]).toContain('alina-before-after-front.webp')
    expect(mixed.lower).toContain('Other_issues_Testimonial_Result_Page_1.webp')
  })

  it('falls back to default (= mixed slides) for unknown / unanswered', () => {
    expect(testimonialsFor({})).toEqual(testimonialsByConcern.default)
    expect(testimonialsFor(ans('hairConcern', 'concern_other'))).toEqual(testimonialsByConcern.default)
  })

  it('exposes the 4 static carousel slides shown after the conditional ones', () => {
    expect(staticCarouselSlides).toHaveLength(4)
    expect(staticCarouselSlides[0]).toContain('3_BH.webp')
    expect(staticCarouselSlides[3]).toContain('8_HL.webp')
  })
})

describe('avatarFor — avatar SVG by age (§2b)', () => {
  it('resolves each age bracket to its (legacy-mismatched) svg', () => {
    expect(avatarFor(ans('age', 'age_18to29'))).toContain('Under%2018.svg')
    expect(avatarFor(ans('age', 'age_30to39'))).toContain('25-34.svg')
    expect(avatarFor(ans('age', 'age_40to49'))).toContain('35-44.svg')
    expect(avatarFor(ans('age', 'age_50+'))).toContain('45%2B.svg')
  })

  it('falls back to the Under 18 svg for unknown / unanswered', () => {
    expect(avatarFor({})).toBe(avatarByAge.default)
    expect(avatarFor(ans('age', 'age_99'))).toBe(avatarByAge.default)
    expect(avatarByAge.default).toBe(avatarByAge.cases['age_18to29'])
  })
})

describe('accessors are pure (do not mutate the answer state)', () => {
  it('leaves the input AnswerState untouched', () => {
    const state: AnswerState = { hairConcern: ['concern_damage'], age: ['age_40to49'], hairGoal: ['goal_both'] }
    const snapshot = JSON.stringify(state)
    benefitFor(state)
    goalDescFor(state)
    transformationFor(state)
    testimonialsFor(state)
    avatarFor(state)
    expect(JSON.stringify(state)).toBe(snapshot)
  })
})
