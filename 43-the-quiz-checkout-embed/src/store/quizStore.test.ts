import { describe, it, expect, beforeEach } from 'vitest'
import { createQuizStore } from './quizStore'
import { exampleSpec } from '../spec/example.spec'
import { hairquizSpec } from '../quiz/hairquiz.spec'

beforeEach(() => { (window as any).dataLayer = [] })

describe('quiz store', () => {
  it('single-select records + fires Question Answered + advances', () => {
    const s = createQuizStore(exampleSpec)
    const firstQ = exampleSpec.screens.findIndex(x => x.kind === 'question')
    s.getState().goTo(firstQ)
    const before = s.getState().index
    s.getState().answer('concern_hairloss')
    expect(window.dataLayer.some((e: any) => e.event === 'Question Answered')).toBe(true)
    expect(s.getState().index).toBe(before + 1)
  })

  it('Quiz Viewed carries the quizId from spec.quizId', () => {
    const s = createQuizStore(hairquizSpec)
    const firstQ = hairquizSpec.screens.findIndex(x => x.kind === 'question')
    s.getState().goTo(firstQ)
    s.getState().viewed()
    const viewed = window.dataLayer.find((e: any) => e.event === 'Quiz Viewed')
    expect(viewed).toBeDefined()
    expect(viewed.quizId).toBe('43-the-quiz-checkout-embed')
  })
})
