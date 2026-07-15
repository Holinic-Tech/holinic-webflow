import { describe, it, expect } from 'vitest'
import { recordSingle, toggleMulti, recordNoneOfTheAbove, emptyAnswers } from './answers'

describe('answer state', () => {
  it('records a single answer (replacing)', () => {
    const a = recordSingle(emptyAnswers(), 'hairConcern', 'concern_hairloss')
    expect(a.hairConcern).toEqual(['concern_hairloss'])
  })
  it('toggles multi-select answers', () => {
    let a = toggleMulti(emptyAnswers(), 'hairMyth', 'myth_a')
    a = toggleMulti(a, 'hairMyth', 'myth_b')
    a = toggleMulti(a, 'hairMyth', 'myth_a') // off
    expect(a.hairMyth).toEqual(['myth_b'])
  })
  it('none-of-the-above clears other picks and records the sentinel', () => {
    let a = toggleMulti(emptyAnswers(), 'hairMyth', 'myth_a')
    a = recordNoneOfTheAbove(a, 'hairMyth', 'n/a')
    expect(a.hairMyth).toEqual(['n/a'])
  })
})
