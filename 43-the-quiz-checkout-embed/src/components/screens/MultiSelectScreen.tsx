import type { Answer } from '../../spec/types'
import { cdnImg } from '../../lib/img'

/**
 * Presentational multi-select screen. Receives already-resolved props and the
 * currently-`selected` answerIds, and emits intent via callbacks. It knows
 * NOTHING about conditions, the spec, or answer state — selection is owned by
 * the store; this component only renders it and reports taps.
 *
 * - Each option toggles via `onToggle(answerId)`. When answers carry an
 *   `imageUrl`, each row shows a left periwinkle image square + label + a
 *   checkbox square on the right (idx-11 myths, idx-12 damaging practices).
 * - A "None of the above" button is shown only when `noneLabel` is provided
 *   (plain card, no image/checkbox) and calls `onNone`.
 * - Optional `subtitle` ("Select all that apply") renders below the prompt.
 * - The CONTINUE control is the chrome's STICKY bottom CTA bar (owned by
 *   QuizApp, enabled when ≥1 selected) — NOT rendered here.
 */
export interface MultiSelectScreenProps {
  prompt: string
  answers: Answer[]
  selected: string[]
  noneLabel?: string
  subtitle?: string
  onToggle: (id: string) => void
  onNone?: () => void
}

export function MultiSelectScreen({
  prompt,
  answers,
  selected,
  noneLabel,
  subtitle,
  onToggle,
  onNone,
}: MultiSelectScreenProps) {
  const hasImages = answers.some((a) => a.imageUrl)
  return (
    <div className="flex flex-1 flex-col justify-start gap-5 px-5 pb-8 pt-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-center text-[26px] font-medium leading-tight text-rich-black">{prompt}</h1>
        {subtitle && <p className="text-center text-sm text-shadow">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-3.5">
        {answers.map((a) => {
          const isSelected = selected.includes(a.answerId)
          return (
            <button
              key={a.answerId}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(a.answerId)}
              className={`answer-card flex items-stretch gap-3 overflow-hidden p-0 ${
                isSelected ? 'answer-card--selected' : ''
              }`}
            >
              {hasImages && (
                <span className="flex w-[76px] shrink-0 items-center justify-center self-stretch overflow-hidden rounded-l-xl bg-violet">
                  {a.imageUrl && (
                    <img src={cdnImg(a.imageUrl, 240)} alt="" className="h-full w-full object-cover" />
                  )}
                </span>
              )}
              <span className="flex min-h-[76px] flex-1 items-center py-3 text-left text-lg font-medium text-rich-black">
                {a.label}
              </span>
              <span className="flex items-center pr-4">
                <span
                  aria-hidden
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border text-xs text-white ${
                    isSelected ? 'border-plum bg-plum' : 'border-neutral-200'
                  }`}
                >
                  {isSelected ? '✓' : ''}
                </span>
              </span>
            </button>
          )
        })}
        {noneLabel && (
          <button
            type="button"
            onClick={onNone}
            className="answer-card px-5 py-4 text-left text-shadow"
          >
            {noneLabel}
          </button>
        )}
      </div>
    </div>
  )
}
