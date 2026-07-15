import { describe, it, expect } from 'vitest'
import { computeScale } from './fit'

describe('computeScale', () => {
  it('returns 1 when content fits', () => { expect(computeScale(400, 800)).toBe(1) })
  it('scales down proportionally when content overflows', () => { expect(computeScale(1000, 800)).toBe(0.8) })
  it('never scales below the floor', () => { expect(computeScale(4000, 800, 0.6)).toBe(0.6) })
  it('returns 1 for non-positive measurements (not yet measured)', () => {
    expect(computeScale(0, 800)).toBe(1); expect(computeScale(500, 0)).toBe(1)
  })
})
