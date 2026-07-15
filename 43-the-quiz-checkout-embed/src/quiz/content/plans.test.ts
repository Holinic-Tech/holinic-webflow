import { describe, it, expect } from 'vitest'
import { planData, personalPlan } from './plans'

describe('planData — 14-Day Challenge (dashboard-spec.md §4)', () => {
  it('matches the FFAppState().PlanData struct values', () => {
    expect(planData).toEqual({
      title: '14 Day Challenge',
      actualPrice: '300',
      discountedPrice: '37',
      perDayActualPrice: '300',
      discountedPerDayPrice: '85',
      isPopularPlan: 'true',
    })
  })

  it('encodes the $300 -> $37, 85% off pricing as strings', () => {
    expect(planData.actualPrice).toBe('300')
    expect(planData.discountedPrice).toBe('37')
    // perDayActualPrice is rendered as the strike price; discountedPerDayPrice as "% OFF".
    expect(planData.perDayActualPrice).toBe('300')
    expect(planData.discountedPerDayPrice).toBe('85')
  })
})

describe('personalPlan — 9 bonus line-items (§4)', () => {
  it('has exactly 9 items in source order', () => {
    expect(personalPlan).toHaveLength(9)
    expect(personalPlan.map(p => p.title)).toEqual([
      '14 Day Haircare Journal & Templates',
      'DIY Luxury Shampoo Workshop',
      'Haircare Ingredients No-No List',
      'Total Hair Wellness Handbook',
      'Silicones & Sulfates Smart Usage Manual',
      '30 Day Hair Mindfulness Experience',
      'Exclusive Members-Only Community',
      'Haircare Product Analyzer',
      'Certificate of Completion',
    ])
  })

  it('carries the documented anchor prices; the certificate has no price', () => {
    expect(personalPlan.map(p => p.price)).toEqual([
      '29', '39', '35', '29', '29', '15', '20', '5', undefined,
    ])
    expect(personalPlan[8].price).toBeUndefined()
  })
})
