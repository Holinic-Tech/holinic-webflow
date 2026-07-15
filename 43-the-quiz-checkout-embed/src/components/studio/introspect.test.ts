import { describe, it, expect } from 'vitest'
import { hairquizSpec } from '../../quiz/hairquiz.spec'
import {
  canonicalScreenType,
  screenDependencies,
  explainScreenFields,
  matrixFields,
  branchLabel,
} from './introspect'
import { buildClaudeContext } from './claudeContext'
import type { Screen } from '../../spec/types'

const byId = (id: string): Screen => hairquizSpec.screens.find((s) => s.id === id)!

describe('canonicalScreenType', () => {
  it('names each kind with the shared vocabulary', () => {
    expect(canonicalScreenType(byId('s_goal'))).toBe('start cover')
    expect(canonicalScreenType(byId('s_concern'))).toBe('image-tile question')
    expect(canonicalScreenType(byId('s_routine'))).toBe('single-choice')
    expect(canonicalScreenType(byId('s_myths'))).toBe('multi-select')
    expect(canonicalScreenType(byId('s_confidence'))).toBe('rating')
    expect(canonicalScreenType(byId('s_holistic_pitch'))).toBe('pitch (image)') // has a carousel
    expect(canonicalScreenType(byId('s_loading'))).toBe('loading')
    expect(canonicalScreenType(byId('s_email'))).toBe('email')
    expect(canonicalScreenType(byId('s_result'))).toBe('result/dashboard')
  })
})

describe('screenDependencies', () => {
  it('derives the questionIds a screen depends on (conditionals + matrix)', () => {
    // The damage pitch image is keyed on hairConcern × age; text blocks add hairDream.
    expect(screenDependencies(byId('s_damage_pitch')).sort()).toEqual(['age', 'hairConcern', 'hairDream'])
    // The concern prompt is keyed on hairDream.
    expect(screenDependencies(byId('s_concern'))).toEqual(['hairDream'])
    // A plain static question depends on nothing.
    expect(screenDependencies(byId('s_hairtype'))).toEqual([])
  })
})

describe('explainScreenFields + branchLabel', () => {
  it('flags FALLBACK when the persona misses every case', () => {
    const fields = explainScreenFields(byId('s_concern'), {})
    const prompt = fields.find((f) => f.field === 'prompt')!
    expect(prompt.branch.kind).toBe('default')
    expect(branchLabel(prompt.branch)).toBe('FALLBACK')
  })
  it('reports the matched case for a tailored persona', () => {
    const fields = explainScreenFields(byId('s_concern'), { hairDream: ['dream_length'] })
    const prompt = fields.find((f) => f.field === 'prompt')!
    expect(prompt.branch).toEqual({ kind: 'case', key: 'dream_length' })
  })
})

describe('matrixFields', () => {
  it('surfaces 2D-matrix pitch blocks with their key questions', () => {
    const m = matrixFields(byId('s_damage_pitch'))
    expect(m.some((x) => x.kind === 'damageImage')).toBe(true)
  })
})

describe('buildClaudeContext', () => {
  it('builds a compact, paste-ready context string', () => {
    const ctx = buildClaudeContext(byId('s_damage_pitch'), {
      hairConcern: ['concern_hairloss'],
      age: ['age_50+'],
    })
    expect(ctx).toContain('Screen s_damage_pitch')
    expect(ctx).toContain('hairConcern=concern_hairloss')
    expect(ctx).toContain('age=age_50+')
  })
})
