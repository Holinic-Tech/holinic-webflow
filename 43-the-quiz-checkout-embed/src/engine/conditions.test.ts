import { describe, it, expect } from 'vitest'
import { resolveConditional, explainConditional } from './conditions'
import type { ConditionalText } from '../spec/types'
import type { AnswerState } from './answers'

const answers: AnswerState = {
  hairConcern: ['concern_hairloss'],
  hairDamageActivity: ['damage_uv', 'damage_swimming'],
}

describe('resolveConditional', () => {
  it('returns a plain string unchanged', () => {
    expect(resolveConditional('hello', answers)).toBe('hello')
  })
  it('resolves a by/cases lookup', () => {
    const t = { by: 'hairConcern', cases: { concern_hairloss: 'hair fall', concern_scalp: 'scalp' }, default: 'issues' }
    expect(resolveConditional(t, answers)).toBe('hair fall')
  })
  it('falls back to default when the keyed answer is absent', () => {
    const t = { by: 'diet', cases: { diet_vegan: 'vegan' }, default: 'any diet' }
    expect(resolveConditional(t, answers)).toBe('any diet')
  })
  it('resolves set-logic containsAll (UV + swimming)', () => {
    const t = { rules: [
      { when: { questionId: 'hairDamageActivity', containsAll: ['damage_uv', 'damage_swimming'] }, text: 'active lifestyle' },
      { when: { questionId: 'hairDamageActivity', containsAll: ['damage_uv', 'damage_tightstyles'] }, text: 'tight styles' },
    ], default: 'generic' }
    expect(resolveConditional(t, answers)).toBe('active lifestyle')
  })
  it('resolves containsAny and first-match wins', () => {
    const t = { rules: [
      { when: { questionId: 'hairDamageActivity', containsAny: ['damage_heat'] }, text: 'heat' },
      { when: { questionId: 'hairDamageActivity', containsAny: ['damage_uv'] }, text: 'uv' },
    ], default: 'generic' }
    expect(resolveConditional(t, answers)).toBe('uv')
  })
})

describe('explainConditional', () => {
  const cases: ConditionalText[] = [
    'hello',
    { by: 'hairConcern', cases: { concern_hairloss: 'hair fall', concern_scalp: 'scalp' }, default: 'issues' },
    { by: 'diet', cases: { diet_vegan: 'vegan' }, default: 'any diet' },
    { rules: [
      { when: { questionId: 'hairDamageActivity', containsAll: ['damage_uv', 'damage_swimming'] }, text: 'active lifestyle' },
      { when: { questionId: 'hairDamageActivity', containsAll: ['damage_uv', 'damage_tightstyles'] }, text: 'tight styles' },
    ], default: 'generic' },
    { rules: [
      { when: { questionId: 'hairDamageActivity', containsAny: ['damage_heat'] }, text: 'heat' },
      { when: { questionId: 'hairDamageActivity', containsAny: ['damage_uv'] }, text: 'uv' },
    ], default: 'generic' },
    // every rule misses -> default
    { rules: [
      { when: { questionId: 'diet', containsAny: ['diet_vegan'] }, text: 'vegan' },
    ], default: 'fallback' },
  ]

  it('value is byte-identical to resolveConditional for every input', () => {
    for (const t of cases) {
      expect(explainConditional(t, answers).value).toBe(resolveConditional(t, answers))
    }
  })

  it('reports static for a plain string', () => {
    expect(explainConditional('hi', answers).branch).toEqual({ kind: 'static' })
  })

  it('reports the matched case key for a by/cases hit', () => {
    const t = { by: 'hairConcern', cases: { concern_hairloss: 'hair fall' }, default: 'issues' }
    expect(explainConditional(t, answers).branch).toEqual({ kind: 'case', key: 'concern_hairloss' })
  })

  it('reports default (FALLBACK) when no case matches', () => {
    const t = { by: 'diet', cases: { diet_vegan: 'vegan' }, default: 'any diet' }
    expect(explainConditional(t, answers).branch).toEqual({ kind: 'default' })
  })

  it('reports the winning rule index (first match wins)', () => {
    const t = { rules: [
      { when: { questionId: 'hairDamageActivity', containsAny: ['damage_heat'] }, text: 'heat' },
      { when: { questionId: 'hairDamageActivity', containsAny: ['damage_uv'] }, text: 'uv' },
    ], default: 'generic' }
    expect(explainConditional(t, answers).branch).toEqual({ kind: 'rule', index: 1 })
  })

  it('reports default when no rule matches', () => {
    const t = { rules: [
      { when: { questionId: 'diet', containsAny: ['diet_vegan'] }, text: 'vegan' },
    ], default: 'fallback' }
    expect(explainConditional(t, answers).branch).toEqual({ kind: 'default' })
  })
})
