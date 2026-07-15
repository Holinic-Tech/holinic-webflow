import type { Screen } from '../spec/types'
import type { AnswerState } from '../engine/answers'
import { resolveConditional } from '../engine/conditions'
import { pitchClaim } from '../quiz/content/pitch-claim-matrix'
import { damagePitchBody, damagePitchImage, damagePracticesConclusion } from '../quiz/content/pitch-detail-matrix'
import { SingleChoiceScreen } from './screens/SingleChoiceScreen'
import { StartCoverScreen } from './screens/StartCoverScreen'
import { ImageChoiceScreen } from './screens/ImageChoiceScreen'
import { MultiSelectScreen } from './screens/MultiSelectScreen'
import { RatingScreen } from './screens/RatingScreen'
import { PitchScreen, type ResolvedPitchBlock } from './screens/PitchScreen'
import { LoadingScreen } from './screens/LoadingScreen'
import { EmailCaptureScreen } from './screens/EmailCaptureScreen'
import { ResultScreen } from './screens/ResultScreen'

export interface ScreenRendererProps {
  screen: Screen
  answers: AnswerState
  onAnswer: (answerId: string) => void
  /** "None of the above" tap on a multi-select — records `['n/a']` AND advances. */
  onNone?: () => void
  onContinue: () => void
  /** Only meaningful on the start cover CTA layout — advances without recording any answer. */
  onStartQuiz?: () => void
  /** Only meaningful on the start cover — opens the skip-quiz confirmation modal. */
  onSkip?: () => void
  /**
   * Email-capture controlled form state (lifted to QuizApp so the STICKY bottom
   * CTA can read validity + submit). Only meaningful on the email screen.
   */
  emailName?: string
  emailValue?: string
  onEmailNameChange?: (value: string) => void
  onEmailValueChange?: (value: string) => void
  onSubmitEmail?: () => void
}

/**
 * Resolves any ConditionalText (prompt/headline/body) against the current
 * answers via the engine, maps screen.kind+type to a presentational
 * component, and passes resolved props + callbacks down. For Phase 1 only
 * `question`+`single` has a real component; everything else renders a simple
 * labeled placeholder.
 */
export function ScreenRenderer({
  screen,
  answers,
  onAnswer,
  onNone = () => {},
  onContinue,
  onStartQuiz,
  onSkip,
  emailName = '',
  emailValue = '',
  onEmailNameChange = () => {},
  onEmailValueChange = () => {},
  onSubmitEmail = () => onContinue(),
}: ScreenRendererProps) {
  // Two screens FILL the bounded column (`h-full`) instead of the `min-h-[100dvh]`
  // box the FitViewport scaler measures against:
  //  - the idx-0 start COVER, full-bleed so its background covers edge-to-edge;
  //  - flex-fit pitch screens (a testimonial carousel), where the carousel must
  //    flex to the room left above the CTA — a `min-h-[100dvh]` floor would stop
  //    it shrinking (see QuizApp's isFlexFitPitch branch + PitchScreen).
  const isCover = screen.kind === 'question' && Boolean(screen.cover)
  const isFlexFitPitch =
    screen.kind === 'pitch' && (screen.blocks?.some((b) => b.kind === 'carousel') ?? false)
  const fillsColumn = isCover || isFlexFitPitch
  return (
    <div className={fillsColumn ? 'flex h-full flex-col' : 'flex min-h-[100dvh] flex-col'}>
      {renderBody(screen, answers, onAnswer, onNone, onContinue, {
        emailName,
        emailValue,
        onEmailNameChange,
        onEmailValueChange,
        onSubmitEmail,
      }, onSkip, onStartQuiz)}
    </div>
  )
}

interface EmailProps {
  emailName: string
  emailValue: string
  onEmailNameChange: (value: string) => void
  onEmailValueChange: (value: string) => void
  onSubmitEmail: () => void
}

function placeholder(label: string, detail?: string) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-8 text-center">
      <div className="text-sm uppercase tracking-wide text-gray-500">{label}</div>
      {detail && <div className="text-lg">{detail}</div>}
    </div>
  )
}

function renderBody(
  screen: Screen,
  answers: AnswerState,
  onAnswer: (answerId: string) => void,
  onNone: () => void,
  onContinue: () => void,
  email: EmailProps,
  onSkip?: () => void,
  onStartQuiz?: () => void,
) {
  switch (screen.kind) {
    case 'question': {
      const prompt = resolveConditional(screen.prompt, answers)
      const subtitle = screen.subtitle ? resolveConditional(screen.subtitle, answers) : undefined
      const beforeTitle = screen.beforeTitle ? resolveConditional(screen.beforeTitle, answers) : undefined
      // idx-0 start cover: a full-bleed goal cover (distinct from question layout).
      if (screen.cover) {
        return (
          <StartCoverScreen
            headline={prompt}
            instruction={screen.cover.instruction}
            backgroundUrl={screen.cover.backgroundUrl}
            logoUrl={screen.cover.logoUrl}
            eyebrow={screen.cover.eyebrow}
            subhead={screen.cover.subhead}
            ctaLabel={screen.cover.ctaLabel}
            onStart={onStartQuiz}
            onSkip={onSkip}
            answers={screen.answers}
            onSelect={onAnswer}
          />
        )
      }
      if (screen.type === 'single') {
        // For `cta` reveal screens (e.g. shampoo-spend idx-10), resolve the
        // optional `reveal` ConditionalText here and pass the recorded selection
        // down; the store records on tap and the user advances via the chrome's
        // STICKY bottom CONTINUE. `auto` single-selects advance on tap.
        // The per-answer reveal CARD (title + body) is read off the selected
        // answer object — no condition resolution needed (the answer IS the key).
        const picked = answers[screen.questionId] ?? []
        const revealCard = screen.answers.find((a) => picked.includes(a.answerId))?.reveal
        return (
          <SingleChoiceScreen
            key={screen.id}
            prompt={prompt}
            answers={screen.answers}
            onSelect={onAnswer}
            progression={screen.progression}
            reveal={screen.reveal ? resolveConditional(screen.reveal, answers) : undefined}
            revealCard={revealCard}
            selected={picked}
            subtitle={subtitle}
            beforeTitle={beforeTitle}
          />
        )
      }
      if (screen.type === 'image') {
        return (
          <ImageChoiceScreen
            key={screen.id}
            prompt={prompt}
            answers={screen.answers}
            onSelect={onAnswer}
            layout={screen.imageLayout}
            subtitle={subtitle}
            beforeTitle={beforeTitle}
          />
        )
      }
      if (screen.type === 'multi') {
        // Selection state is owned by the store; we render it here from the
        // resolved AnswerState for this question. onToggle/onNone map to the
        // answer callbacks and onContinue advances (firing Question Answered).
        return (
          <MultiSelectScreen
            prompt={prompt}
            answers={screen.answers}
            selected={answers[screen.questionId] ?? []}
            noneLabel={screen.noneOfTheAbove?.label}
            subtitle={subtitle}
            onToggle={onAnswer}
            onNone={screen.noneOfTheAbove ? onNone : undefined}
          />
        )
      }
      if (screen.type === 'rating') {
        return (
          <RatingScreen
            key={screen.id}
            prompt={prompt}
            answers={screen.answers}
            onSelect={onAnswer}
            subInstruction={screen.ratingSubInstruction}
            anchors={screen.ratingAnchors}
          />
        )
      }
      return placeholder(`question:${screen.type}`, prompt)
    }
    case 'pitch': {
      // Resolve the optional multi-block body (idx-13): each text block's
      // ConditionalText and each carousel image's ConditionalText is resolved
      // here so the component stays purely presentational.
      const blocks = screen.blocks?.map((b): ResolvedPitchBlock => {
        if (b.kind === 'text')
          return { kind: 'text' as const, text: resolveConditional(b.text, answers), weight: b.weight, align: b.align }
        if (b.kind === 'heroText')
          return { kind: 'heroText' as const, headline: b.headline, sub: b.sub }
        if (b.kind === 'statCard')
          return { kind: 'statCard' as const, title: b.title, stats: b.stats }
        if (b.kind === 'spacer')
          return { kind: 'spacer' as const }
        if (b.kind === 'claim') {
          const routine = (answers[b.routineQuestionId] ?? [])[0] ?? ''
          const concern = (answers[b.concernQuestionId] ?? [])[0] ?? ''
          return { kind: 'text' as const, text: pitchClaim(routine, concern), weight: b.weight }
        }
        if (b.kind === 'damageBody') {
          const concern = (answers[b.concernQuestionId] ?? [])[0] ?? ''
          const age = (answers[b.ageQuestionId] ?? [])[0] ?? ''
          return { kind: 'text' as const, text: damagePitchBody(concern, age), weight: b.weight }
        }
        if (b.kind === 'damagePracticesConclusion') {
          const concern = (answers[b.concernQuestionId] ?? [])[0] ?? ''
          const dream   = (answers[b.dreamQuestionId]   ?? [])[0] ?? ''
          return { kind: 'text' as const, text: damagePracticesConclusion(concern, dream), weight: 'semibold', align: 'center' }
        }
        if (b.kind === 'damageImage') {
          const concern = (answers[b.concernQuestionId] ?? [])[0] ?? ''
          const age = (answers[b.ageQuestionId] ?? [])[0] ?? ''
          return { kind: 'image' as const, src: damagePitchImage(concern, age) }
        }
        if (b.kind === 'image')
          return { kind: 'image' as const, src: resolveConditional(b.src, answers) }
        if (b.kind === 'checkItems')
          return { kind: 'checkItems' as const, items: b.items, icon: b.icon }
        if (b.kind === 'carousel')
          return {
            kind: 'carousel' as const,
            images: b.images.map((img) => resolveConditional(img, answers)),
          }
        return { kind: 'divider' as const }
      })
      return (
        <PitchScreen
          headline={resolveConditional(screen.headline, answers)}
          body={resolveConditional(screen.body, answers)}
          imageUrl={screen.imageUrl}
          blocks={blocks}
        />
      )
    }
    case 'loading':
      return (
        <LoadingScreen
          messages={screen.messages}
          durationMs={screen.durationMs}
          onDone={onContinue}
          title={screen.title}
          carouselImages={screen.carouselImages}
          checkpoints={screen.checkpoints}
        />
      )
    case 'email':
      // The store's submitEmail wires the real submit (webhook + Converge +
      // `Quiz Submitted`) and advances to the result screen on success. The
      // form is controlled by QuizApp so the STICKY bottom CONTINUE can read
      // validity + submit.
      return (
        <EmailCaptureScreen
          headline={resolveConditional(screen.headline, answers)}
          title={screen.title}
          subhead={screen.subhead}
          concernLine={screen.concernLine ? resolveConditional(screen.concernLine, answers) : undefined}
          cardHeader={screen.cardHeader}
          privacy={screen.privacy}
          submitLabel={screen.submitLabel}
          name={email.emailName}
          email={email.emailValue}
          onNameChange={email.onEmailNameChange}
          onEmailChange={email.onEmailValueChange}
          onSubmit={email.onSubmitEmail}
        />
      )
    case 'result':
      // The real dashboard content (percentage, plan details, testimonials,
      // plan dialog) is Phase 3; here it's a slot shell + CTA wired to continue.
      // ResultScreen is the ONE scrollable, non-fit-scaled screen.
      // The live result wires its own CTAs via QuizApp.renderResult; this
      // placeholder shell just renders the scrollable container.
      return <ResultScreen>{placeholder('result')}</ResultScreen>
  }
}
