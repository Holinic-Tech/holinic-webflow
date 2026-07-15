import { describe, it, expect, beforeEach, vi } from 'vitest'
import { trackGAEvent } from './track'
import { GA } from './events'

declare global { interface Window { dataLayer: any[]; gtag: (...a: any[]) => void } }

beforeEach(() => { (window as any).dataLayer = []; (window as any).gtag = undefined })

describe('trackGAEvent', () => {
  it('pushes to dataLayer with fixed params (event, event_category, position, selected_answer[])', () => {
    trackGAEvent(GA.QUESTION_ANSWERED, { questionId: 'hairConcern', question: 'Concern?', selectedAnswer: ['concern_hairloss'] }, 3)
    expect(window.dataLayer[0]).toEqual({
      event: 'Question Answered', event_category: 'Quiz', position: 3,
      selected_answer: ['concern_hairloss'], question_id: 'hairConcern', question: 'Concern?',
    })
  })
  it('keeps the TWO-space checkout event string intact', () => {
    expect(GA.GO_TO_CHECKOUT_RESULTS).toBe('Go to  checkout')
    expect(GA.GO_TO_CHECKOUT_TIMER).toBe('Go to checkout')
  })
  it('resets per-event props when omitted (question_id/question "" + selected_answer null) so GTM clears stale values', () => {
    trackGAEvent(GA.QUIZ_VIEWED, {}, 0)
    // null — NOT [] — so GTM overwrites/clears a prior screen's array instead of merging.
    expect(window.dataLayer[0].selected_answer).toBeNull()
    expect(window.dataLayer[0].question_id).toBe('')
    expect(window.dataLayer[0].question).toBe('')
  })
  it('sends selected_answer as the array when a real answer is present', () => {
    trackGAEvent(GA.QUESTION_ANSWERED, { questionId: 'q', selectedAnswer: ['a1'] }, 1)
    expect(window.dataLayer[0].selected_answer).toEqual(['a1'])
    expect(window.dataLayer[0].question_id).toBe('q')
  })
  it('uses gtag fallback only when dataLayer is unavailable', () => {
    ;(window as any).dataLayer = undefined
    const gtag = vi.fn(); (window as any).gtag = gtag
    trackGAEvent(GA.QUIZ_BACK, {}, 2)
    expect(gtag).toHaveBeenCalledWith('event', 'Quiz Back', expect.objectContaining({ event_category: 'Quiz', position: 2 }))
  })
  it('attaches q_name/q_email only when provided', () => {
    trackGAEvent(GA.QUIZ_SUBMITTED, { qName: 'Ann', qEmail: 'a@b.co' }, 18)
    expect(window.dataLayer[0]).toMatchObject({ q_name: 'Ann', q_email: 'a@b.co' })
  })
})
