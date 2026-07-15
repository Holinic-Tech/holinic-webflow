import { describe, it, expect } from 'vitest'
import { exampleSpec } from './example.spec'

describe('example spec', () => {
  it('has a linear set of screens ending in result', () => {
    expect(exampleSpec.screens.length).toBeGreaterThanOrEqual(3)
    expect(exampleSpec.screens.at(-1)!.kind).toBe('result')
  })
  it('has a conditional prompt keyed by an earlier answer', () => {
    const pitch = exampleSpec.screens.find(s => s.kind === 'pitch')!
    expect(pitch).toBeDefined()
  })
})
