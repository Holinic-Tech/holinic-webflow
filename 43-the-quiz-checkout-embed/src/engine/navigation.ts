import type { QuizSpec, Screen, ScreenChrome } from '../spec/types'

/** Default chrome derived from screen KIND + position — never from hardcoded index literals. */
function defaultChrome(spec: QuizSpec, index: number): ScreenChrome {
  const s: Screen = spec.screens[index]
  const isFirst = index === 0
  switch (s.kind) {
    case 'result': return { header: false, back: false, progress: false }
    case 'email': return { header: true, back: false, progress: false }
    case 'loading': return { header: true, back: false, progress: false }
    case 'pitch': return { header: true, back: false, progress: true }
    case 'question': return { header: !isFirst, back: !isFirst, progress: !isFirst }
  }
}
export function deriveChrome(spec: QuizSpec, index: number): ScreenChrome {
  const base = defaultChrome(spec, index)
  return { ...base, ...(spec.screens[index].chrome ?? {}) }
}
export const totalQuestions = (spec: QuizSpec): number => spec.screens.filter(s => s.kind === 'question').length
export function questionPosition(spec: QuizSpec, index: number): number {
  return spec.screens.slice(0, index + 1).filter(s => s.kind === 'question').length
}
