import type { QuizSpec, QuestionScreen } from '../../spec/types'
import type { AnswerState } from '../../engine/answers'
import { questionScreens } from './introspect'
import { personaPresets } from './personas'

/**
 * Persona editor: one control per question screen. Single/image/rating use radio
 * buttons (one answerId); multi-select uses checkboxes (many answerIds, plus the
 * none-of-the-above sentinel). Editing updates the AnswerState, which re-renders
 * the live preview and the branch/fallback indicator.
 */
export interface PersonaPanelProps {
  spec: QuizSpec
  persona: AnswerState
  onChange: (next: AnswerState) => void
}

export function PersonaPanel({ spec, persona, onChange }: PersonaPanelProps) {
  const questions = questionScreens(spec)

  const setSingle = (q: QuestionScreen, answerId: string) => {
    onChange({ ...persona, [q.questionId]: [answerId] })
  }
  const toggleMulti = (q: QuestionScreen, answerId: string) => {
    const cur = (persona[q.questionId] ?? []).filter((x) => x !== 'n/a')
    const next = cur.includes(answerId) ? cur.filter((x) => x !== answerId) : [...cur, answerId]
    onChange({ ...persona, [q.questionId]: next })
  }
  const setNone = (q: QuestionScreen, sentinel: string) => {
    const cur = persona[q.questionId] ?? []
    onChange({ ...persona, [q.questionId]: cur.includes(sentinel) ? [] : [sentinel] })
  }
  const clearQuestion = (q: QuestionScreen) => {
    const next = { ...persona }
    delete next[q.questionId]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Presets</span>
        {personaPresets.map((p) => (
          <button
            key={p.id}
            type="button"
            title={p.description}
            onClick={() => onChange({ ...p.answers })}
            className="rounded-full border border-plum/40 bg-violet px-3 py-1 text-xs font-medium text-plum hover:bg-plum hover:text-white"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange({})}
          className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
        >
          Reset persona
        </button>
      </div>

      <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
        {questions.map((q) => {
          const selected = persona[q.questionId] ?? []
          const isMulti = q.type === 'multi'
          return (
            <div key={q.id} className="flex flex-col gap-1.5 p-3">
              <div className="flex items-center justify-between gap-2">
                <code className="text-[11px] font-semibold text-rich-black">{q.questionId}</code>
                <button
                  type="button"
                  onClick={() => clearQuestion(q)}
                  className="text-[10px] uppercase tracking-wide text-gray-400 hover:text-gray-700"
                >
                  clear
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {q.answers.map((a) => (
                  <label key={a.answerId} className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type={isMulti ? 'checkbox' : 'radio'}
                      name={q.questionId}
                      checked={selected.includes(a.answerId)}
                      onChange={() => (isMulti ? toggleMulti(q, a.answerId) : setSingle(q, a.answerId))}
                    />
                    <span className="truncate">
                      <code className="text-[10px] text-plum">{a.answerId}</code>
                      <span className="text-gray-400"> · {a.label}</span>
                    </span>
                  </label>
                ))}
                {q.noneOfTheAbove && (
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={selected.includes(q.noneOfTheAbove.answerId)}
                      onChange={() => setNone(q, q.noneOfTheAbove!.answerId)}
                    />
                    <span>
                      <code className="text-[10px] text-plum">{q.noneOfTheAbove.answerId}</code>
                      <span className="text-gray-400"> · {q.noneOfTheAbove.label}</span>
                    </span>
                  </label>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
