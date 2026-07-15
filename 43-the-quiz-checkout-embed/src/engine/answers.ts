import type { QuestionId, AnswerId } from '../spec/types'
export type AnswerState = Record<QuestionId, AnswerId[]>
export const emptyAnswers = (): AnswerState => ({})

export function recordSingle(s: AnswerState, q: QuestionId, a: AnswerId): AnswerState {
  return { ...s, [q]: [a] }
}
export function toggleMulti(s: AnswerState, q: QuestionId, a: AnswerId): AnswerState {
  const cur = (s[q] ?? []).filter(x => x !== 'n/a')
  const next = cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a]
  return { ...s, [q]: next }
}
export function recordNoneOfTheAbove(s: AnswerState, q: QuestionId, sentinel: AnswerId): AnswerState {
  return { ...s, [q]: [sentinel] }
}
