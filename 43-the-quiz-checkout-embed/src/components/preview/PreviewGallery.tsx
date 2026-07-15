import { useState, type ReactNode } from 'react'
import { SingleChoiceScreen } from '../screens/SingleChoiceScreen'
import { StartCoverScreen } from '../screens/StartCoverScreen'
import { ImageChoiceScreen } from '../screens/ImageChoiceScreen'
import { MultiSelectScreen } from '../screens/MultiSelectScreen'
import { RatingScreen } from '../screens/RatingScreen'
import { PitchScreen } from '../screens/PitchScreen'
import { LoadingScreen } from '../screens/LoadingScreen'
import { EmailCaptureScreen } from '../screens/EmailCaptureScreen'
import { ResultScreen } from '../screens/ResultScreen'
import { ResultDashboard } from '../result/ResultDashboard'
import { PlanDetailsDialog } from '../result/PlanDetailsDialog'
import { CountdownTimer } from '../primitives/CountdownTimer'
import { SkipModal } from '../primitives/SkipModal'
import { CheckoutModal } from '../result/CheckoutModal'
import { CheckoutEmbedFrame } from '../result/CheckoutEmbedFrame'
import { AutoCarousel } from '../primitives/AutoCarousel'
import { ProgressHeader } from '../layout/ProgressHeader'
import { planData, personalPlan } from '../../quiz/content/plans'

/**
 * Isolated preview surface: renders ONE instance of every screen component and
 * primitive with representative sample props, each inside a labeled mobile-width
 * frame (~390px). Mounted by `main.tsx` when `location.search.includes('preview')`
 * so `/?preview` shows this gallery while the default route shows the quiz.
 *
 * This is the design-workflow surface and the manual visual-regression check.
 * It uses only presentational components with local sample data — it never reads
 * the spec, the store, or fires tracking.
 */

const noop = () => {}

/** A single labeled, fixed-mobile-width frame around a previewed component. */
function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</h2>
      <div
        className="relative h-[560px] w-[390px] overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm"
        style={{ contain: 'layout paint' }}
      >
        <div className="flex h-full w-full flex-col">{children}</div>
      </div>
    </section>
  )
}

const singleAnswers = [
  { answerId: 'concern_hairloss', label: 'Hair loss / thinning' },
  { answerId: 'concern_damage', label: 'Damage / breakage' },
  { answerId: 'concern_dryness', label: 'Dryness / frizz' },
]

const imageAnswers = [
  {
    answerId: 'tex_straight',
    label: 'Straight',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"/>',
  },
  {
    answerId: 'tex_curly',
    label: 'Curly',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"/>',
  },
]

const multiAnswers = [
  { answerId: 'symptom_shedding', label: 'More shedding than usual' },
  { answerId: 'symptom_dryness', label: 'Dryness' },
  { answerId: 'symptom_itch', label: 'Itchy scalp' },
]

const ratingAnswers = [
  { answerId: 'r1', label: '1' },
  { answerId: 'r2', label: '2' },
  { answerId: 'r3', label: '3' },
  { answerId: 'r4', label: '4' },
  { answerId: 'r5', label: '5' },
]

/** MultiSelect is stateful in isolation so the preview reflects real toggling. */
function MultiSelectPreview() {
  const [selected, setSelected] = useState<string[]>(['symptom_dryness'])
  return (
    <MultiSelectScreen
      prompt="Which symptoms are you noticing?"
      answers={multiAnswers}
      selected={selected}
      noneLabel="None of the above"
      onToggle={(id) =>
        setSelected((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        )
      }
      onNone={() => setSelected([])}
    />
  )
}

/** Email is controlled in isolation so the preview reflects real typing. */
function EmailCapturePreview() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  return (
    <EmailCaptureScreen
      headline="Your results are ready!"
      title="Your results are ready!"
      subhead="On the next screen, you'll see if the Challenge can help you achieve your hair goal."
      concernLine="Probability to fix your hair loss in 14 days:"
      name={name}
      email={email}
      onNameChange={setName}
      onEmailChange={setEmail}
      onSubmit={noop}
    />
  )
}

export function PreviewGallery() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Component Preview Gallery</h1>
      <div className="flex flex-row flex-wrap items-start gap-8">
        <Frame label="SingleChoiceScreen">
          <SingleChoiceScreen
            prompt="What is your biggest hair concern?"
            answers={singleAnswers}
            onSelect={noop}
          />
        </Frame>

        <Frame label="ImageChoiceScreen">
          <ImageChoiceScreen
            prompt="What's your hair texture?"
            answers={imageAnswers}
            onSelect={noop}
            layout="row"
          />
        </Frame>

        <Frame label="MultiSelectScreen">
          <MultiSelectPreview />
        </Frame>

        <Frame label="RatingScreen">
          <RatingScreen
            prompt="My reflection in the mirror affects my mood and self-esteem."
            answers={ratingAnswers}
            onSelect={noop}
            anchors={{ low: 'Not at all', high: 'Totally' }}
          />
        </Frame>

        <Frame label="StartCoverScreen">
          <StartCoverScreen
            headline="See if the Challenge is a fit for you and your hair profile"
            instruction="Start by selecting your goal:"
            backgroundUrl="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='3'/>"
            logoUrl="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='4' height='1'/>"
            answers={[
              { answerId: 'goal_hairloss', label: 'I want to stop my hair loss' },
              { answerId: 'goal_betterhair', label: 'I want longer, better looking hair' },
              { answerId: 'goal_both', label: 'I want both' },
            ]}
            onSelect={noop}
          />
        </Frame>

        <Frame label="PitchScreen">
          <PitchScreen
            headline="Here's what's going on"
            body="Your shedding points to a scalp environment that needs rebalancing — our challenge targets exactly that."
          />
        </Frame>

        <Frame label="LoadingScreen">
          <LoadingScreen
            messages={['Checking your hair condition']}
            title="The only haircare program you'll ever need"
            checkpoints={[
              'Checking your hair condition',
              'Analysing your routine',
              'Checking your challenge-fit',
            ]}
            durationMs={60000}
            onDone={noop}
          />
        </Frame>

        <Frame label="AutoCarousel">
          <AutoCarousel
            images={[
              'https://assets.hairqare.co/Less%20than%20%2410.webp',
              'https://assets.hairqare.co/%2410%20-%20%2420.webp',
              'https://assets.hairqare.co/%2420-%2450.webp',
            ]}
          />
        </Frame>

        <Frame label="EmailCaptureScreen">
          <EmailCapturePreview />
        </Frame>

        <Frame label="ResultScreen">
          <ResultScreen
            timer={
              <div className="flex w-full items-center justify-between gap-3 text-sm font-semibold text-white">
                <span className="flex items-center gap-2">
                  <span>85% OFF valid for:</span>
                  <CountdownTimer secondsLeft={599} />
                </span>
                <button
                  type="button"
                  onClick={noop}
                  className="rounded-full bg-cta-orange px-5 py-1.5 text-xs font-semibold uppercase tracking-[0.7px] text-white"
                >
                  JOIN
                </button>
              </div>
            }
          >
            <ResultDashboard
              name="Sarah"
              percentage={95}
              benefit="9 out of 10 women with this score said their shedding stopped, and they started seeing new baby hairs after the challenge."
              goalDesc="Denser hair and noticeable regrowth that fills in sparse areas, so I can have peace of mind and feel beautiful again."
              ageLabel="In my 30s"
              concernNoun="hair loss"
              transformationUrls={[
                'https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/RP%20Hairloss.webp',
                'https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/RP%20hairloss%20timeline.webp',
              ]}
              carouselUrls={[
                'https://pub.hairqare.co/cdn-cgi/image/width=450,quality=85,format=auto/ji-woo-before-after.webp',
                'https://pub.hairqare.co/cdn-cgi/image/width=450,quality=85,format=auto/Hair_Loss_2_Testimonial.webp',
                'https://pub.hairqare.co/cdn-cgi/image/width=450,quality=85,format=auto/Hair_Loss_3_Testimonial.webp',
              ]}
              lowerTestimonialUrl="https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/marisol-before-after.webp"
              avatarUrl="https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66b3705002a6a9516930e533_25-34.svg"
              seats={6}
              onCta={noop}
            />
          </ResultScreen>
        </Frame>

        <Frame label="PlanDetailsDialog (open)">
          <PlanDetailsDialog
            open
            plan={planData}
            personalPlan={personalPlan}
            onClose={noop}
            onCheckout={noop}
          />
        </Frame>

        <Frame label="CountdownTimer">
          <div className="flex h-full items-center justify-center text-3xl">
            <CountdownTimer secondsLeft={125} />
          </div>
        </Frame>

        <Frame label="SkipModal (open)">
          <SkipModal open onConfirm={noop} onDismiss={noop} />
        </Frame>

        <Frame label="ProgressHeader">
          <ProgressHeader showBack showProgress current={3} total={8} onBack={noop} />
        </Frame>

        <Frame label="CheckoutModal (open, loading skeleton)">
          <CheckoutModal open onClose={noop} contained>
            <CheckoutEmbedFrame src="about:blank" mode="modal" ready={false} />
          </CheckoutModal>
        </Frame>

        <Frame label="CheckoutEmbedFrame (inline, ready)">
          <div className="p-4">
            <CheckoutEmbedFrame src="about:blank" mode="inline" ready height={560} />
          </div>
        </Frame>
      </div>
    </div>
  )
}
