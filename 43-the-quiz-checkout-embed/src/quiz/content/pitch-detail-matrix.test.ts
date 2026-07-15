import { describe, it, expect } from 'vitest'
import {
  damagePitchBody,
  damagePitchImage,
  holisticValues,
  holisticCarouselImages,
} from './pitch-detail-matrix'

describe('damagePitchBody', () => {
  it('builds the canonical hairloss × thirties sentence verbatim', () => {
    expect(damagePitchBody('concern_hairloss', 'age_30to39')).toBe(
      'Did you know research shows that 96.3% of women, struggling with hair loss and thinning in their thirties, see visibly denser and thicker hair within 14 days of switching to a holistic haircare routine.',
    )
  })

  it('preserves the [sic] split-ends duplicated "see visibly" and "fourties"', () => {
    expect(damagePitchBody('concern_splitends', 'age_40to49')).toBe(
      'Did you know research shows that 92.5% of women, struggling with split ends and dryness in their fourties, see visibly see visibly denser hair and less frizz within 14 days of switching to a holistic haircare routine.',
    )
  })

  it('falls back to the else spans for unknown concern/age', () => {
    expect(damagePitchBody('', '')).toBe(
      'Did you know research shows that over 90% of women, struggling with mixed hair issues regardless of their age, achieve visibly better hair within 14 days of switching to a holistic haircare routine.',
    )
  })
})

describe('damagePitchImage', () => {
  it('hairloss splits by age: young → Aleeyah, older → anna', () => {
    expect(damagePitchImage('concern_hairloss', 'age_18to29')).toContain('Aleeyah_before-after')
    expect(damagePitchImage('concern_hairloss', 'age_30to39')).toContain('Aleeyah_before-after')
    expect(damagePitchImage('concern_hairloss', 'age_40to49')).toContain('anna-before-after')
    expect(damagePitchImage('concern_hairloss', 'age_50+')).toContain('anna-before-after')
  })

  it('non-hairloss concerns are age-independent', () => {
    expect(damagePitchImage('concern_splitends', 'age_30to39')).toContain('P5%20Split%20Ends')
    expect(damagePitchImage('concern_scalp', 'age_50+')).toContain('alina-before-after')
    expect(damagePitchImage('concern_damage', 'age_18to29')).toContain('bella-before-after')
  })

  it('falls back to the claudia default for unknown concern', () => {
    expect(damagePitchImage('', '')).toContain('claudia-large-before-after')
  })
})

describe('holistic fixed content', () => {
  it('has exactly the 4 value labels in grid order (value1 keeps trailing space)', () => {
    expect(holisticValues).toEqual(['Any hair concern ', 'Any age', 'Any hair type', 'Any hair goal'])
  })

  it('has exactly 3 testimonial carousel images', () => {
    expect(holisticCarouselImages).toHaveLength(3)
    expect(holisticCarouselImages[0]).toContain('Pitch%202%20Lindsey')
  })
})
