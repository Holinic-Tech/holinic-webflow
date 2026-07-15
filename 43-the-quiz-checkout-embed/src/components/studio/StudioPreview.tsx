import { useMemo, useState } from 'react'
import { useStore } from 'zustand'
import type { QuizSpec, Screen } from '../../spec/types'
import type { AnswerState } from '../../engine/answers'
import { createQuizStore } from '../../store/quizStore'
import { ScreenRenderer } from '../ScreenRenderer'
import { FitViewport } from '../layout/FitViewport'
import { ProgressHeader } from '../layout/ProgressHeader'
import { BottomCtaBar } from '../layout/BottomCtaBar'
import { deriveChrome, questionPosition, totalQuestions } from '../../engine/navigation'
import { ResultScreen } from '../screens/ResultScreen'
import { AspirationalResultDashboard } from '../result/AspirationalResultDashboard'
import { CountdownTimer } from '../primitives/CountdownTimer'
import { SkipModal } from '../primitives/SkipModal'
import { resolveResultConfig } from '../../store/quizStore'
import {
  benefitFor,
  goalDescFor,
  transformationFor,
  testimonialsFor,
  avatarFor,
  ageLabelFor,
  concernNounFor,
  staticCarouselSlides,
} from '../../quiz/content/result-content'

/**
 * Faithful single-screen preview for the Studio. It renders the SELECTED screen
 * exactly as the live quiz does — using the REAL ScreenRenderer + FitViewport +
 * ProgressHeader (and the real ResultDashboard for the result screen) — resolved
 * against the supplied `persona` AnswerState.
 *
 * It is interactive in a sandboxed way: a private quiz store is created so the
 * real components (multi-select toggles, the shampoo reveal, email form) behave
 * like the quiz, but answers are SEEDED from the persona and navigation is pinned
 * to the chosen `screenIndex` (taps don't walk the flow — the Studio drives the
 * screen choice). No tracking matters here; the store's events are best-effort and
 * harmless in dev. This is the same wiring QuizApp uses, so the preview is faithful.
 */
export interface StudioPreviewProps {
  spec: QuizSpec
  screenIndex: number
  persona: AnswerState
}

export function StudioPreview({ spec, screenIndex, persona }: StudioPreviewProps) {
  const screen = spec.screens[screenIndex]
  return (
    // 390px phone frame — the e2e mobile target width. The inner column is the
    // real quiz column treatment (clipped, full-height) so FitViewport measures
    // against a true phone viewport.
    <div className="relative h-[740px] w-[390px] shrink-0 overflow-hidden rounded-[28px] border-[6px] border-neutral-800 bg-white shadow-soft">
      <PreviewBody key={`${screen.id}:${JSON.stringify(persona)}`} spec={spec} screenIndex={screenIndex} persona={persona} />
    </div>
  )
}

/**
 * Keyed on screen+persona so a fresh store is built whenever either changes —
 * this re-seeds the answers and resets transient component state (reveal cards,
 * email fields) to a clean, faithful render of the chosen screen.
 */
function PreviewBody({ spec, screenIndex, persona }: StudioPreviewProps) {
  // A private store seeded with the persona, pinned to the selected screen.
  const store = useMemo(() => {
    const s = createQuizStore(spec, { seedPercentage: 95 })
    s.setState({ index: screenIndex, answers: { ...persona } })
    return s
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, screenIndex])

  const index = useStore(store, (s) => s.index)
  const answers = useStore(store, (s) => s.answers)
  const screen = spec.screens[index]
  const chrome = deriveChrome(spec, index)

  const { answer, chooseNoneOfTheAbove, continue: onContinue, startQuiz } = store.getState()

  const [emailName, setEmailName] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [skipOpen, setSkipOpen] = useState(false)

  if (screen.kind === 'result') {
    return <ResultPreview spec={spec} answers={answers} />
  }

  const isStart = index === 0
  const body = (
    <ScreenRenderer
      screen={screen}
      answers={answers}
      onAnswer={(id) => answer(id)}
      onNone={() => chooseNoneOfTheAbove()}
      onContinue={() => onContinue()}
      onStartQuiz={() => startQuiz()}
      onSkip={() => setSkipOpen(true)}
      emailName={emailName}
      emailValue={emailValue}
      onEmailNameChange={setEmailName}
      onEmailValueChange={setEmailValue}
    />
  )

  const cta = deriveCta(screen, answers, onContinue)

  return (
    <div className="flex h-full w-full flex-col">
      {chrome.header && (
        <ProgressHeader
          showBack={chrome.back}
          showProgress={chrome.progress}
          current={questionPosition(spec, index)}
          total={totalQuestions(spec)}
          onBack={() => {}}
        />
      )}
      <div className="relative min-h-0 flex-1">
        {isStart ? <div className="h-full w-full">{body}</div> : <FitViewport>{body}</FitViewport>}
      </div>
      {cta && <BottomCtaBar label={cta.label} enabled={cta.enabled} onClick={cta.onClick} />}
      <SkipModal open={skipOpen} onConfirm={() => setSkipOpen(false)} onDismiss={() => setSkipOpen(false)} contained />
    </div>
  )
}

/** Mirror of QuizApp.deriveCta — keeps the sticky CTA faithful in the preview. */
function deriveCta(
  screen: Screen,
  answers: AnswerState,
  onContinue: () => void,
): { label: string; enabled: boolean; onClick: () => void } | null {
  switch (screen.kind) {
    case 'pitch':
      return { label: 'Continue', enabled: true, onClick: () => onContinue() }
    case 'email':
      return null
    case 'question': {
      const selected = answers[screen.questionId] ?? []
      if (screen.type === 'multi')
        return { label: 'Continue', enabled: selected.length > 0, onClick: () => onContinue() }
      if (screen.type === 'single' && screen.progression === 'cta')
        return selected.length > 0 ? { label: 'Continue', enabled: true, onClick: () => onContinue() } : null
      return null
    }
    default:
      return null
  }
}

/** Aspirational v2 result preview — replaces the control in the Studio. */
function ResultPreview({ spec, answers }: { spec: QuizSpec; answers: AnswerState }) {
  const cfg = resolveResultConfig(spec)
  const transform = transformationFor(answers)
  const testimonials = testimonialsFor(answers)
  return (
    <div className="h-full overflow-y-auto">
      <ResultScreen
        timer={
          <div className="flex w-full items-center justify-between gap-3 text-base font-semibold text-white">
            <span className="flex items-center gap-2">
              <span>85% OFF valid for:</span>
              <span className="tabular-nums text-white">
                <CountdownTimer secondsLeft={cfg.timerSeconds} />
              </span>
            </span>
            <button
              type="button"
              className="rounded-full bg-cta-orange px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.7px] text-white"
            >
              JOIN
            </button>
          </div>
        }
      >
        <AspirationalResultDashboard
          name="there"
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
          dream={(answers.hairDream ?? [])[0] ?? 'dream_length'}
          ageId={(answers.age ?? [])[0] ?? 'age_30to39'}
          confidence={(answers.confidence ?? [])[0] ?? '3'}
        />
      </ResultScreen>
    </div>
  )
}
