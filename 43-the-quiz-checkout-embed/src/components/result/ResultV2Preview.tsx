import { useState } from 'react'
import { AspirationalResultDashboard } from './AspirationalResultDashboard'
import { ResultScreen } from '../screens/ResultScreen'
import { CountdownTimer } from '../primitives/CountdownTimer'
import {
  transformationFor,
  testimonialsFor,
  avatarFor,
  ageLabelFor,
  benefitFor,
  goalDescFor,
  concernNounFor,
  staticCarouselSlides,
} from '../../quiz/content/result-content'
import type { AnswerState } from '../../engine/answers'

const AGES    = ['age_18to29', 'age_30to39', 'age_40to49', 'age_50+'] as const
const DREAMS  = ['dream_length', 'dream_health', 'dream_fullness'] as const
const CONCERNS = [
  'concern_hairloss', 'concern_damage',
  'concern_splitends', 'concern_scalp', 'concern_mixed',
] as const
const CONFIDENCES = ['1', '2', '3', '4', '5'] as const

const AGE_LABELS: Record<string, string> = {
  age_18to29: '18–29', age_30to39: '30–39',
  age_40to49: '40–49', 'age_50+': '50+',
}
const DREAM_LABELS: Record<string, string> = {
  dream_length: 'Longer', dream_health: 'Healthier', dream_fullness: 'Fuller',
}
const CONCERN_LABELS: Record<string, string> = {
  concern_hairloss: 'Hair loss', concern_damage: 'Damage',
  concern_splitends: 'Split ends', concern_scalp: 'Scalp', concern_mixed: 'Mixed',
}

function Select({
  label, value, options, onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs text-white">
      <span className="font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded bg-neutral-700 px-1.5 py-0.5 text-xs text-white"
      >
        {options.map((o) => (
          <option key={o} value={o}>{(AGE_LABELS[o] ?? DREAM_LABELS[o] ?? CONCERN_LABELS[o] ?? o)}</option>
        ))}
      </select>
    </label>
  )
}

export function ResultV2Preview() {
  const [age,        setAge]        = useState<string>('age_30to39')
  const [dream,      setDream]      = useState<string>('dream_length')
  const [concern,    setConcern]    = useState<string>('concern_damage')
  const [confidence, setConfidence] = useState<string>('3')

  const answers: AnswerState = {
    age:          [age],
    hairDream:    [dream],
    hairConcern:  [concern],
    confidence:   [confidence],
    hairGoal:     ['goal_betterhair'],
  }

  const transform    = transformationFor(answers)
  const testimonials = testimonialsFor(answers)

  return (
    <div className="min-h-screen bg-neutral-200">
      {/* ── Persona switcher ── */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center gap-4 bg-neutral-900 px-4 py-3">
        <span className="text-xs font-bold text-white">v2 Preview</span>
        <Select label="Age"        value={age}        options={AGES}        onChange={setAge} />
        <Select label="Dream"      value={dream}      options={DREAMS}      onChange={setDream} />
        <Select label="Concern"    value={concern}    options={CONCERNS}    onChange={setConcern} />
        <Select label="Confidence" value={confidence} options={CONFIDENCES} onChange={setConfidence} />
      </div>

      {/* ── Phone frame ── */}
      <div className="flex justify-center py-10">
        <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[36px] border-[8px] border-neutral-900 bg-white shadow-2xl">
          <div className="h-full overflow-y-auto">
            <ResultScreen
              timer={
                <div className="flex w-full items-center justify-between gap-3 text-base font-semibold text-white">
                  <span className="flex items-center gap-2">
                    <span>85% OFF valid for:</span>
                    <span className="tabular-nums">
                      <CountdownTimer secondsLeft={1800} />
                    </span>
                  </span>
                  <button
                    type="button"
                    className="rounded-full bg-cta-orange px-5 py-2 text-sm font-semibold uppercase tracking-[0.7px] text-white"
                  >
                    JOIN
                  </button>
                </div>
              }
            >
              <AspirationalResultDashboard
                name="Sarah"
                percentage={95}
                benefit={benefitFor(answers)}
                goalDesc={goalDescFor(answers)}
                ageLabel={ageLabelFor(answers)}
                concernNoun={concernNounFor(answers)}
                transformationUrls={[transform.hero, transform.timeline]}
                carouselUrls={[...testimonials.carousel, ...staticCarouselSlides]}
                lowerTestimonialUrl={testimonials.lower}
                avatarUrl={avatarFor(answers)}
                seats={6}
                onCta={() => {}}
                dream={dream}
                ageId={age}
                confidence={confidence}
              />
            </ResultScreen>
          </div>
        </div>
      </div>
    </div>
  )
}
