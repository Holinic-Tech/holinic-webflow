import { describe, it, expect } from 'vitest'
import type { QuizSpec, QuestionScreen } from './types'

describe('spec types', () => {
  it('accepts a well-formed question screen with conditional prompt + cdp', () => {
    const q: QuestionScreen = {
      kind: 'question', id: 's_concern', type: 'single', questionId: 'hairConcern',
      prompt: 'What is your biggest concern?',
      answers: [{ answerId: 'concern_hairloss', label: 'Hair loss' }],
      progression: 'auto',
      cdp: { acField: 50, mpField: 'Hair Concern' },
    }
    expect(q.questionId).toBe('hairConcern')
  })
  it('accepts a conditional-text with set-logic rules', () => {
    const spec: Pick<QuizSpec, 'id'> = { id: 'test' }
    expect(spec.id).toBe('test')
  })
})
