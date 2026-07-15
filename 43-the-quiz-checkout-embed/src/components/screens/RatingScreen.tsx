import type { Answer } from '../../spec/types'
import { useRegisterThenAdvance } from '../layout/useRegisterThenAdvance'

/**
 * Presentational rating screen. Renders the scale options as a row of numeral
 * buttons; a single tap emits the answerId (the store records it and advances).
 * A sub-instruction sits ABOVE the statement and two anchor labels sit BELOW the
 * scale (e.g. "Not at all" … "Totally"). It knows NOTHING about conditions, the
 * spec, or answer state — resolution happens upstream.
 */
export interface RatingScreenProps {
  prompt: string
  answers: Answer[]
  onSelect: (id: string) => void
  /** Line shown ABOVE the statement. Defaults to the standard relate-instruction. */
  subInstruction?: string
  /** Scale anchor labels under the buttons (left = low, right = high). */
  anchors?: { low: string; high: string }
}

export function RatingScreen({
  prompt,
  answers,
  onSelect,
  subInstruction = 'How much do you relate to the following statement?',
  anchors,
}: RatingScreenProps) {
  // Flash a "registered" state on the tapped numeral, then advance after a delay.
  const [pendingId, advance] = useRegisterThenAdvance(onSelect)
  return (
    <div className="flex flex-1 flex-col justify-start gap-7 px-5 pb-8 pt-6">
      <div className="flex flex-col gap-3">
        <p className="text-center text-base leading-snug text-shadow">{subInstruction}</p>
        <h1 className="text-center text-[26px] font-medium leading-tight text-rich-black">{prompt}</h1>
      </div>
      <div>
        <div className="flex flex-row justify-center gap-2.5">
          {answers.map((a) => (
            <button
              key={a.answerId}
              type="button"
              onClick={() => advance(a.answerId)}
              className={`answer-card flex h-[58px] w-[58px] items-center justify-center p-0 text-xl font-medium text-rich-black ${
                pendingId === a.answerId ? 'answer-card--selected' : ''
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        {anchors && (
          <div className="mt-2 flex justify-between px-1 text-sm text-rich-black">
            <span>{anchors.low}</span>
            <span>{anchors.high}</span>
          </div>
        )}
      </div>
    </div>
  )
}
