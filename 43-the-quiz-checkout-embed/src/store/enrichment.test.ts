import { describe, it, expect, beforeEach } from 'vitest'
import { createQuizStore, enrichmentParams } from './quizStore'
import { hairquizSpec } from '../quiz/hairquiz.spec'
import type { QuizSpec } from '../spec/types'
import type { AnswerState } from '../engine/answers'

// ---------------------------------------------------------------------------
// 1) The pure helper.
// ---------------------------------------------------------------------------
describe('enrichmentParams (pure helper)', () => {
  it('returns { [questionId]: answerIds.join(",") } for each enriched answered question', () => {
    const answers: AnswerState = {
      hairConcern: ['concern_hairloss'],
      age: ['age_30to39'],
    }
    expect(enrichmentParams(hairquizSpec, answers)).toEqual({
      hairConcern: 'concern_hairloss',
      age: 'age_30to39',
    })
  })

  it('joins multi-answer values with a comma', () => {
    const spec: QuizSpec = { ...hairquizSpec, eventEnrichment: ['hairConcern'] }
    expect(enrichmentParams(spec, { hairConcern: ['a', 'b'] })).toEqual({
      hairConcern: 'a,b',
    })
  })

  it('omits enriched questionIds that have no answer yet', () => {
    expect(enrichmentParams(hairquizSpec, { age: ['age_18to29'] })).toEqual({
      age: 'age_18to29',
    })
  })

  it('returns {} when the spec declares no eventEnrichment', () => {
    const spec: QuizSpec = { ...hairquizSpec, eventEnrichment: undefined }
    expect(enrichmentParams(spec, { hairConcern: ['concern_hairloss'] })).toEqual({})
  })

  it('is pure — does not mutate the answers it reads', () => {
    const answers: AnswerState = { hairConcern: ['concern_hairloss'] }
    const snapshot = JSON.stringify(answers)
    enrichmentParams(hairquizSpec, answers)
    expect(JSON.stringify(answers)).toBe(snapshot)
  })

  it('never emits quizStart — the cover screen is not an enriched question', () => {
    const answers: AnswerState = { quizStart: ['quizStart_begin'], hairConcern: ['concern_hairloss'] }
    const result = enrichmentParams(hairquizSpec, answers)
    expect(result.quizStart).toBeUndefined()
    expect(result.hairConcern).toBe('concern_hairloss')
  })
})

// ---------------------------------------------------------------------------
// 2) The store spreads enrichment onto answer-bearing events — additively.
// ---------------------------------------------------------------------------
const events = () => window.dataLayer
const find = (event: string) => events().find((e: any) => e.event === event)

// Find a screen index by its questionId in the live hairquiz spec.
const idxOf = (questionId: string) =>
  hairquizSpec.screens.findIndex(
    (s) => s.kind === 'question' && s.questionId === questionId,
  )

beforeEach(() => {
  ;(window as any).dataLayer = []
})

describe('store event enrichment — additive FB-targeting attributes', () => {
  it('Question Answered carries the enriched answers AND keeps the fixed contract params', () => {
    const s = createQuizStore(hairquizSpec)
    // Answer age (idx 2), then hairConcern (idx 3) in order.
    s.getState().goTo(idxOf('age'))
    s.getState().answer('age_30to39')
    s.getState().goTo(idxOf('hairConcern'))
    s.getState().answer('concern_hairloss')

    const concernAnswered = events().find(
      (e: any) => e.event === 'Question Answered' && e.question_id === 'hairConcern',
    )
    expect(concernAnswered).toBeTruthy()
    // Enrichment keys — only age + hairConcern (hairGoal removed: no goal question in this quiz).
    expect(concernAnswered.age).toBe('age_30to39')
    expect(concernAnswered.hairConcern).toBe('concern_hairloss')
    expect(concernAnswered.quizStart).toBeUndefined()
    // Fixed contract params are UNCHANGED.
    expect(concernAnswered.event).toBe('Question Answered')
    expect(concernAnswered.event_category).toBe('Quiz')
    expect(concernAnswered.selected_answer).toEqual(['concern_hairloss'])
  })

  it('Quiz Submitted carries the enriched answers AND keeps the fixed contract params', async () => {
    ;(window as any).fetch = async () => ({ ok: true })
    const s = createQuizStore(hairquizSpec)
    s.getState().goTo(idxOf('age'))
    s.getState().answer('age_50+')
    s.getState().goTo(idxOf('hairConcern'))
    s.getState().answer('concern_damage')

    const emailIdx = hairquizSpec.screens.findIndex((x) => x.kind === 'email')
    s.getState().goTo(emailIdx)
    await s.getState().submitEmail({ name: 'Test Tester', email: 't@example.com' })

    const submitted = find('Quiz Submitted')
    expect(submitted).toBeTruthy()
    expect(submitted.age).toBe('age_50+')
    expect(submitted.hairConcern).toBe('concern_damage')
    expect(submitted.quizStart).toBeUndefined()
    // Fixed params + the email-specific params untouched.
    expect(submitted.event).toBe('Quiz Submitted')
    expect(submitted.event_category).toBe('Quiz')
    expect(submitted.q_name).toBe('Test Tester')
    expect(submitted.q_email).toBe('t@example.com')
  })

  it('Viewed Results Page carries the enriched answers', () => {
    const s = createQuizStore(hairquizSpec)
    s.getState().goTo(idxOf('hairConcern'))
    s.getState().answer('concern_scalp')

    const resultIdx = hairquizSpec.screens.findIndex((x) => x.kind === 'result')
    s.getState().goTo(resultIdx)
    s.getState().viewed()

    const viewed = find('Viewed Results Page')
    expect(viewed).toBeTruthy()
    expect(viewed.hairConcern).toBe('concern_scalp')
    expect(viewed.quizStart).toBeUndefined()
    expect(viewed.event_category).toBe('Quiz')
  })

  it('checkout events carry the enriched answers (additive, event names unchanged)', () => {
    const hrefSet = (_v: string) => {}
    const original = window.location
    delete (window as any).location
    ;(window as any).location = { search: '', set href(v: string) { hrefSet(v) } }
    try {
      const s = createQuizStore(hairquizSpec)
      s.getState().goTo(idxOf('hairConcern'))
      s.getState().answer('concern_hairloss')

      s.getState().checkoutFromResults()
      const co = find('Go to  checkout') // TWO spaces — unchanged
      expect(co).toBeTruthy()
      expect(co.event).toBe('Go to  checkout')
      expect(co.hairConcern).toBe('concern_hairloss')
      expect(co.quizStart).toBeUndefined()
      expect(co.event_category).toBe('Quiz')
    } finally {
      ;(window as any).location = original
    }
  })

  it('Quiz Viewed fires ONCE on the first screen and stays LEAN — no enrichment keys', () => {
    const s = createQuizStore(hairquizSpec)
    // The store starts at index 0 (the start cover); viewing it fires Quiz Viewed.
    s.getState().viewed()
    const viewed = find('Quiz Viewed')
    expect(viewed).toBeTruthy()
    expect(viewed.position).toBe(0)
    expect(viewed.hairConcern).toBeUndefined()
    expect(viewed.age).toBeUndefined()
    expect(viewed.quizStart).toBeUndefined()
  })

  it('Quiz Viewed does NOT fire again on a later question screen', () => {
    const s = createQuizStore(hairquizSpec)
    s.getState().goTo(idxOf('hairConcern'))
    s.getState().viewed()
    expect(find('Quiz Viewed')).toBeFalsy()
  })
})
