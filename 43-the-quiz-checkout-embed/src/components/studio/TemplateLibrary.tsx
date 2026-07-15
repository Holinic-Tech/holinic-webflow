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
import { CountdownTimer } from '../primitives/CountdownTimer'

/**
 * Template library — the shared-vocabulary surface. One labelled frame per screen
 * TYPE and answer style, each captioned with the CANONICAL name a marketer /
 * Claude would use ("single-choice", "image-tile question", "multi-select",
 * "rating", "pitch (blocks)", "pitch (image)", "loading", "email",
 * "result/dashboard", "start cover"). Reuses the REAL screen components with
 * representative sample props (evolved from the original PreviewGallery).
 */

const noop = () => {}

function Frame({ name, hint, children }: { name: string; hint: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <div>
        <h3 className="font-mono text-sm font-semibold text-plum">{name}</h3>
        <p className="text-[11px] text-gray-500">{hint}</p>
      </div>
      <div
        className="relative h-[560px] w-[360px] overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm"
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
  { answerId: 'tex_straight', label: 'Straight', imageUrl: 'https://assets.hairqare.co/Straight%20Hair%20.webp' },
  { answerId: 'tex_curly', label: 'Curly', imageUrl: 'https://assets.hairqare.co/Curly%20Hair.webp' },
]
const multiAnswers = [
  { answerId: 'symptom_shedding', label: 'More shedding than usual' },
  { answerId: 'symptom_dryness', label: 'Dryness' },
  { answerId: 'symptom_itch', label: 'Itchy scalp' },
]
const ratingAnswers = ['1', '2', '3', '4', '5'].map((n) => ({ answerId: n, label: n }))

function MultiSelectPreview() {
  const [selected, setSelected] = useState<string[]>(['symptom_dryness'])
  return (
    <MultiSelectScreen
      prompt="Which symptoms are you noticing?"
      answers={multiAnswers}
      selected={selected}
      noneLabel="None of the above"
      onToggle={(id) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
      onNone={() => setSelected([])}
    />
  )
}

export function TemplateLibrary() {
  return (
    <div className="flex flex-row flex-wrap items-start gap-8">
      <Frame name="start cover" hint="QuestionScreen with cover{} — full-bleed goal picker (idx 0).">
        <StartCoverScreen
          headline="See if the Challenge is a fit for you and your hair profile"
          instruction="Start by selecting your goal:"
          backgroundUrl="https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/sarah-quiz-start-cover.webp"
          logoUrl="https://assets.hairqare.co/Hairqare_white_logo_1.webp"
          answers={[
            { answerId: 'goal_hairloss', label: 'I want to stop my hair loss' },
            { answerId: 'goal_betterhair', label: 'I want longer, better looking hair' },
            { answerId: 'goal_both', label: 'I want both' },
          ]}
          onSelect={noop}
        />
      </Frame>

      <Frame name="single-choice" hint="question + type:'single' — text options, advances on tap.">
        <SingleChoiceScreen prompt="What is your biggest hair concern?" answers={singleAnswers} onSelect={noop} />
      </Frame>

      <Frame name="image-tile question" hint="question + type:'image' — image options (tile/row layout).">
        <ImageChoiceScreen prompt="What's your hair texture?" answers={imageAnswers} onSelect={noop} layout="row" />
      </Frame>

      <Frame name="multi-select" hint="question + type:'multi' — checkboxes + None, advance via Continue.">
        <MultiSelectPreview />
      </Frame>

      <Frame name="rating" hint="question + type:'rating' — 1–5 scale with anchor labels.">
        <RatingScreen
          prompt="My reflection in the mirror affects my mood and self-esteem."
          answers={ratingAnswers}
          onSelect={noop}
          anchors={{ low: 'Not at all', high: 'Totally' }}
        />
      </Frame>

      <Frame name="pitch (blocks)" hint="kind:'pitch' — headline + body / text blocks (no media).">
        <PitchScreen
          headline="Here's what's going on"
          body="Your shedding points to a scalp environment that needs rebalancing — our challenge targets exactly that."
        />
      </Frame>

      <Frame name="pitch (image)" hint="kind:'pitch' with image/carousel/damageImage blocks.">
        <PitchScreen
          headline="Don't worry! We got you."
          body=""
          blocks={[
            { kind: 'image', src: 'https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/RP%20Hairloss.webp' },
            { kind: 'text', text: "Here's the good news: this is reversible.", weight: 'semibold' },
          ]}
        />
      </Frame>

      <Frame name="loading" hint="kind:'loading' — timed progress + checkpoints, auto-advances.">
        <LoadingScreen
          messages={['Checking your hair condition']}
          title="The only haircare program you'll ever need"
          checkpoints={['Checking your hair condition', 'Analysing your routine', 'Checking your challenge-fit']}
          durationMs={60000}
          onDone={noop}
        />
      </Frame>

      <Frame name="email" hint="kind:'email' — contact capture (name + email), conditional concern line.">
        <EmailCaptureScreen
          headline="Your results are ready!"
          title="Your results are ready!"
          subhead="On the next screen, you'll see if the Challenge can help you achieve your hair goal."
          concernLine="Probability to fix your hair loss in 14 days:"
          name=""
          email=""
          onNameChange={noop}
          onEmailChange={noop}
          onSubmit={noop}
        />
      </Frame>

      <Frame name="result/dashboard" hint="kind:'result' — the ONE scrollable screen; match %, timeline, testimonials.">
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
            benefit="9 out of 10 women with this score said their shedding stopped after the challenge."
            goalDesc="Denser hair and noticeable regrowth that fills in sparse areas."
            ageLabel="In my 30s"
            concernNoun="hair loss"
            transformationUrls={[
              'https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/RP%20Hairloss.webp',
              'https://assets.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/RP%20hairloss%20timeline.webp',
            ]}
            carouselUrls={['https://pub.hairqare.co/cdn-cgi/image/width=450,quality=85,format=auto/ji-woo-before-after.webp']}
            lowerTestimonialUrl="https://pub.hairqare.co/cdn-cgi/image/width=750,quality=85,format=auto/marisol-before-after.webp"
            avatarUrl="https://uploads-ssl.webflow.com/62cbaa353a301eb715aa33d0/66b3705002a6a9516930e533_25-34.svg"
            seats={6}
            onCta={noop}
          />
        </ResultScreen>
      </Frame>
    </div>
  )
}
