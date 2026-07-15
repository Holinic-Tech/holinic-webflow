import type { GAEventName } from './events'
export interface GAExtra { questionId?: string; question?: string; selectedAnswer?: string[]; qName?: string; qEmail?: string; [k: string]: unknown }

export function trackGAEvent(event: GAEventName, extra: GAExtra = {}, position = 0): void {
  // GTM's Data Layer Variables PERSIST across pushes: a key you OMIT keeps its
  // previous value. So every event must explicitly (re)set the per-event props,
  // or a later event silently inherits a prior screen's `question_id` /
  // `selected_answer` (the "Continued From Pitch / Viewed Results Page shows the
  // last question's id+answer" bug — see docs/reference/tracking-contract.md).
  //  - question_id / question: ALWAYS set ('' when N/A; a string overwrites/clears).
  //  - selected_answer: the array when there's a real answer, else `null`.
  //    null — NOT [] — because GTM merges arrays by index, so pushing [] leaves a
  //    prior non-empty array in place; null overwrites and actually CLEARS it.
  const params: Record<string, unknown> = {
    event,
    event_category: 'Quiz',
    position,
    question_id: extra.questionId ?? '',
    question: extra.question ?? '',
    selected_answer: extra.selectedAnswer?.length ? extra.selectedAnswer : null,
  }
  if (extra.qName) params.q_name = extra.qName
  if (extra.qEmail) params.q_email = extra.qEmail
  for (const [k, v] of Object.entries(extra)) {
    if (!['questionId', 'question', 'selectedAnswer', 'qName', 'qEmail'].includes(k) && v !== undefined) params[k] = v
  }
  try {
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) window.dataLayer.push(params)
    else if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', event, params)
  } catch { /* analytics must never break the quiz */ }
}
