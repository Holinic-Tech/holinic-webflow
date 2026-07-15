import { describe, it, expect, beforeEach, vi } from 'vitest'
import { trackConvergeCompletedQuiz } from './converge'
declare global { interface Window { trackEvent?: (...a: any[]) => void } }
beforeEach(() => { (window as any).trackEvent = undefined })

describe('client Converge', () => {
  it('calls trackEvent("Completed Quiz", props, null, {$email}, [urn:email])', () => {
    const te = vi.fn(); (window as any).trackEvent = te
    trackConvergeCompletedQuiz({ answers: { hairConcern: ['concern_hairloss'] }, name: 'Ann Lee', firstName: 'Ann', lastName: 'Lee', email: 'a@b.co' })
    expect(te).toHaveBeenCalledWith('Completed Quiz',
      expect.objectContaining({ name: 'Ann Lee', firstName: 'Ann', lastName: 'Lee', email: 'a@b.co' }),
      null, { $email: 'a@b.co' }, ['urn:email:a@b.co'])
  })
  it('is a no-op when trackEvent is absent (does not throw)', () => {
    expect(() => trackConvergeCompletedQuiz({ answers: {}, name: '', firstName: '', lastName: '', email: '' })).not.toThrow()
  })
})
