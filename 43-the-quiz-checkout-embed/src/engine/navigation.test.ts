import { describe, it, expect } from 'vitest'
import { deriveChrome, totalQuestions } from './navigation'
import { exampleSpec } from '../spec/example.spec'

describe('derived navigation', () => {
  it('hides back+progress on the first screen and on result/email', () => {
    const first = deriveChrome(exampleSpec, 0)
    expect(first.back).toBe(false)
    const resultIdx = exampleSpec.screens.findIndex(s => s.kind === 'result')
    expect(deriveChrome(exampleSpec, resultIdx).progress).toBe(false)
  })
  it('progress counts only question screens (denominator derived, not hardcoded)', () => {
    expect(totalQuestions(exampleSpec)).toBe(exampleSpec.screens.filter(s => s.kind === 'question').length)
  })
  it('inserting a screen does NOT change a later screen\'s chrome (no magic indexes)', () => {
    const spec2 = { ...exampleSpec, screens: [exampleSpec.screens[0], { kind: 'pitch', id: 'inserted', label: 'X', headline: 'h', body: 'b' } as any, ...exampleSpec.screens.slice(1)] }
    const resultIdxA = exampleSpec.screens.findIndex(s => s.kind === 'result')
    const resultIdxB = spec2.screens.findIndex(s => s.kind === 'result')
    expect(deriveChrome(spec2, resultIdxB)).toEqual(deriveChrome(exampleSpec, resultIdxA))
  })
})
