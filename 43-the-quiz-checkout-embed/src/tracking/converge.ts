import type { AnswerState } from '../engine/answers'
export interface ConvergeUser { answers: AnswerState; name: string; firstName: string; lastName: string; email: string }

export function trackConvergeCompletedQuiz(u: ConvergeUser): void {
  try {
    if (typeof window === 'undefined' || typeof window.trackEvent !== 'function') return
    window.trackEvent('Completed Quiz',
      { answers: u.answers, name: u.name, firstName: u.firstName, lastName: u.lastName, email: u.email },
      null, { $email: u.email }, [`urn:email:${u.email}`])
  } catch { /* never break the quiz */ }
}
// NOTE: do NOT fire `Quiz Started`/`Quiz Completed` to Converge — those reach Converge via the GTM relay of the GA dataLayer events. Re-firing here would double-count. (ISSUES #2)
