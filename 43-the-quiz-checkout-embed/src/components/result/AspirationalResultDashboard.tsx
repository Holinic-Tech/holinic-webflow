import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cdnImg } from '../../lib/img'
import { AutoCarousel } from '../primitives/AutoCarousel'
import type { ResultDashboardProps } from './ResultDashboard'
import {
  mindsetFor,
  heroSupportLine,
  dreamScoreLabel,
  goalCardCopy,
  futureSelfHeadline,
  futureSelfFeelLine,
  futureSelfClosingLine,
  offerHeadline,
  timeline14DayLabel,
} from '../../quiz/content/aspirational-result-content'
import {
  CTA_JOIN,
  CTA_START,
  RATING_IMAGE,
  TEN_MIN,
  DAYS_IMAGE,
  RESULTS_BADGES,
  LUCIA_IMAGE,
  WRITTEN_TESTIMONIAL,
  REFUND_GUARANTEE,
  seatsRemainingText,
} from '../../quiz/content/result-content'

const DREAM_IMAGE: Record<string, string> = {
  dream_length:   'https://pub.hairqare.co/quiz40/Long-Hair-1.webp',
  dream_health:   'https://pub.hairqare.co/quiz40/Healthier-and-shiner-hair.webp',
  dream_fullness: 'https://pub.hairqare.co/quiz40/Thick-and-fuller-hair.webp',
}
const DREAM_IMAGE_FALLBACK = 'https://pub.hairqare.co/quiz40/Thick-and-fuller-hair.webp'

function dreamImage(dream: string): string {
  return DREAM_IMAGE[dream] ?? DREAM_IMAGE_FALLBACK
}

const OFFER_CHECKS = [
  "Understand exactly why your hair isn't where you want it yet",
  'A simple, personalised routine that fits your real life',
  'Make your own gentle shampoo and conditioner, for pennies',
]

const BENEFITS = [
  { icon: '🔬', text: 'Science-based, reviewed by haircare experts' },
  { icon: '🥗', text: 'A nutrient-rich plan to support healthier, stronger hair' },
  { icon: '💰', text: "Save thousands on products and salon visits you won't need anymore" },
]

const TIMELINE_STATIC = [
  { day: 'Day 1',  label: 'Start your routine' },
  { day: 'Day 5',  label: 'Softer, smoother to the touch' },
  { day: 'Day 7',  label: 'More shine, less breakage' },
]

/** Fades each section up when it first scrolls into view. */
function FadeSection({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-[400ms] ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
    >
      {children}
    </div>
  )
}

export interface AspirationalResultDashboardProps extends ResultDashboardProps {
  /** hairDream answerId */
  dream: string
  /** age answerId — drives the mindset */
  ageId: string
  /** confidence answerId ("1"–"5") */
  confidence: string
}

export function AspirationalResultDashboard({
  name,
  percentage,
  ageLabel,
  transformationUrls,
  carouselUrls,
  lowerTestimonialUrl,
  avatarUrl,
  seats,
  onCta,
  dream,
  ageId,
  confidence,
}: AspirationalResultDashboardProps) {
  const [_hero, timeline] = transformationUrls
  const pct = Math.min(percentage, 96)
  const mindset = mindsetFor(ageId)

  // Score bar animates from 0 → pct on mount
  const [barWidth, setBarWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(pct), 150)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <div className="flex flex-col gap-8">

      {/* ── S1  SCORE REVEAL ─────────────────────────────────────────── */}
      <FadeSection>
        <header className="text-center">
          <h1 className="font-display text-2xl font-semibold leading-tight text-rich-black">
            Congratulations, {name} 🎉
          </h1>
          <p className="mt-1 text-base text-rich-black">
            You're a perfect fit for the Challenge.
          </p>
        </header>

        {/* Score card */}
        <div className="mt-5 rounded-2xl bg-gradient-to-br from-violet to-periwinkle/60 px-5 py-5">
          <p className="text-sm font-semibold text-plum">{dreamScoreLabel(dream)}</p>
          <div className="my-3 h-2.5 w-full overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9B8BEE] via-[#F4A06A] to-[#F26C21]"
              style={{ width: `${barWidth}%`, transition: 'width 0.8s ease-out' }}
            />
          </div>
          <p className="text-right text-3xl font-bold text-[#F26C21]">{pct}%</p>
          <p className="mt-1 text-center text-sm font-semibold text-rich-black">
            That's an outstanding match.
          </p>
        </div>

        {/* HIT #1 — mindset support line */}
        <p className="mt-4 text-center text-sm leading-relaxed text-shadow">
          {heroSupportLine(name, mindset)}
        </p>
      </FadeSection>

      {/* ── S2  GOAL CARD ─────────────────────────────────────────────── */}
      <FadeSection className="rounded-3xl bg-[#F7F6FC] p-5">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <img
              src={cdnImg(avatarUrl, 160)}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-20 w-20 rounded-full bg-white object-cover"
            />
            <span className="mt-2 text-center text-sm font-semibold text-rich-black">{name}</span>
            <span className="text-xs text-shadow">{ageLabel}</span>
          </div>
          <div className="flex flex-1 flex-col justify-center border-l border-plum/20 pl-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-plum">My dream:</p>
            <p className="mt-1 text-sm leading-relaxed text-rich-black">{goalCardCopy(dream)}</p>
          </div>
        </div>
      </FadeSection>

      {/* ── S3  FUTURE SELF (NEW) ──────────────────────────────────────── */}
      <FadeSection className="rounded-3xl bg-[#F7F6FC] p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-plum">In 14 days</p>
        {/* HIT #2 — mindset headline */}
        <h2 className="mt-2 text-xl font-semibold leading-snug text-rich-black">
          {futureSelfHeadline(dream)}
        </h2>
        <img
          src={cdnImg(dreamImage(dream), 820)}
          alt=""
          loading="lazy"
          decoding="async"
          className="mt-4 w-full rounded-2xl object-cover"
        />
        {/* KNOW / FEEL / BECOME graphic */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: '💡', label: 'KNOW',   body: 'exactly what your hair needs' },
            { icon: '✨', label: 'FEEL',   body: futureSelfFeelLine(dream) },
            { icon: '🌟', label: 'BECOME', body: 'the woman who wears it down' },
          ].map(({ icon, label, body }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white/80 p-3 text-center"
            >
              <span className="text-base">{icon}</span>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-plum">{label}</p>
              <p className="text-[11px] leading-snug text-rich-black">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm italic leading-relaxed text-shadow">
          {futureSelfClosingLine(confidence)}
        </p>
      </FadeSection>

      {/* ── S4  TIMELINE ──────────────────────────────────────────────── */}
      <FadeSection>
        <h2 className="text-xl font-semibold text-rich-black">Your 14 days, day by day</h2>
        {timeline && (
          <img
            src={cdnImg(timeline, 820)}
            alt=""
            loading="lazy"
            decoding="async"
            className="mt-4 w-full rounded-2xl"
          />
        )}
        <ol className="mt-5 flex flex-col gap-3">
          {[...TIMELINE_STATIC, { day: 'Day 14', label: timeline14DayLabel(dream) }].map(
            ({ day, label }, i) => {
              const isLast = i === 3
              return (
                <li key={day} className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isLast
                        ? 'bg-[#F26C21] text-white'
                        : 'bg-[#F7F6FC] text-plum'
                    }`}
                  >
                    {day.replace('Day ', '')}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-shadow">{day}: </span>
                    <span className={`text-sm text-rich-black ${isLast ? 'font-semibold' : ''}`}>
                      {label}
                    </span>
                  </div>
                </li>
              )
            },
          )}
        </ol>
      </FadeSection>

      {/* ── S5  BRIDGE ────────────────────────────────────────────────── */}
      <FadeSection>
        <p className="text-center text-xl font-semibold text-[#F26C21]">
          You're ready for this, {name}.
        </p>
      </FadeSection>

      {/* ── S6  OFFER ─────────────────────────────────────────────────── */}
      <FadeSection className="rounded-3xl bg-[#F7F6FC] p-5">
        {/* HIT #3 — dream offer headline */}
        <h2 className="text-xl font-semibold leading-snug text-rich-black">
          {offerHeadline(dream)}
        </h2>
        <p className="mt-2 text-sm text-shadow">The knowledge, not just another fix.</p>
        <ul className="mt-4 flex flex-col gap-3">
          {OFFER_CHECKS.map((row) => (
            <li key={row} className="flex gap-3 text-sm text-rich-black">
              <span aria-hidden className="select-none font-semibold text-[#34b24a]">✓</span>
              <span>{row}</span>
            </li>
          ))}
        </ul>
      </FadeSection>

      {/* ── S7  CTA 1 ─────────────────────────────────────────────────── */}
      <button type="button" onClick={onCta} className="btn-primary">
        {CTA_JOIN}
      </button>

      {/* ── S8  SOCIAL PROOF ──────────────────────────────────────────── */}
      <FadeSection>
        <p className="text-center text-lg font-semibold leading-snug text-rich-black">
          250,000 women in 149 countries have joined.{' '}
          <span className="font-bold">
            92% of finishers said it changed how they see their hair.
          </span>
        </p>
        <img
          src={cdnImg(RATING_IMAGE, 820)}
          alt="Rated 4.8/5.0 on Trustpilot, with 200,000+ Challengers"
          loading="lazy"
          decoding="async"
          className="mt-4 w-full rounded-2xl"
        />
      </FadeSection>

      {/* ── S9  BEFORE/AFTER CAROUSEL ─────────────────────────────────── */}
      <FadeSection>
        <AutoCarousel
          images={carouselUrls.map((u) => cdnImg(u, 820))}
          natural
          intervalMs={3000}
          testId="result-v2-carousel"
        />
      </FadeSection>

      {/* ── S10  CTA 2 ────────────────────────────────────────────────── */}
      <button type="button" onClick={onCta} className="btn-primary">
        {CTA_START}
      </button>

      {/* ── S11  CURRICULUM (clone from control) ──────────────────────── */}
      <FadeSection className="rounded-3xl bg-[#F7F6FC] p-5">
        <p className="text-center text-lg leading-snug text-rich-black">
          {TEN_MIN.lead}
          <br />
          <span className="text-2xl font-bold">{TEN_MIN.emphasis}</span>
          <br />
          {TEN_MIN.tail}
        </p>
        <img
          src={cdnImg(DAYS_IMAGE, 820)}
          alt=""
          loading="lazy"
          decoding="async"
          className="mt-4 w-full rounded-2xl"
        />
        <div className="mt-4 flex justify-center gap-6">
          {RESULTS_BADGES.map((b) => (
            <div key={b.label} className="rounded-2xl bg-white px-6 py-3 text-center">
              <p className="text-xl font-bold text-plum">{b.value}</p>
              <p className="text-xl font-bold text-plum">{b.label}</p>
            </div>
          ))}
        </div>
      </FadeSection>

      {/* ── S12  BENEFITS (1 line reauthored) ────────────────────────── */}
      <FadeSection className="flex flex-col gap-5 rounded-3xl border border-neutral-100 p-5 shadow-card">
        {BENEFITS.map((p, i) => (
          <div key={i} className="flex items-start gap-4">
            <span
              aria-hidden
              className="mt-0.5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-violet text-lg"
            >
              {p.icon}
            </span>
            <p className="self-center text-sm text-rich-black">{p.text}</p>
          </div>
        ))}
      </FadeSection>

      {/* ── S13  WRITTEN TESTIMONIAL (clone from control) ────────────── */}
      <FadeSection className="rounded-2xl border border-neutral-100 p-5 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet text-sm font-semibold text-plum">
            {WRITTEN_TESTIMONIAL.initials}
          </span>
          <div className="text-sm">
            <p className="font-semibold text-rich-black">{WRITTEN_TESTIMONIAL.name}</p>
            <p className="text-shadow">
              {WRITTEN_TESTIMONIAL.reviews} · {WRITTEN_TESTIMONIAL.location}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span aria-hidden className="text-sm tracking-tight text-[#00b67a]">
            ★★★★★
          </span>
          <span className="text-xs text-shadow">✓ {WRITTEN_TESTIMONIAL.verified}</span>
        </div>
        <p className="mt-3 text-sm font-semibold text-rich-black">{WRITTEN_TESTIMONIAL.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-rich-black/90">{WRITTEN_TESTIMONIAL.body}</p>
      </FadeSection>

      {/* ── S13b  LUCIA IMAGE (fixed testimonial) ─────────────────────── */}
      <img
        src={cdnImg(LUCIA_IMAGE, 820)}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full rounded-2xl"
      />

      {/* ── S13c  LOWER TESTIMONIAL (concern-conditional) ─────────────── */}
      <img
        src={cdnImg(lowerTestimonialUrl, 820)}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full rounded-2xl"
      />

      {/* ── S14  CLOSE ────────────────────────────────────────────────── */}
      <FadeSection>
        <p className="text-center text-base text-rich-black">{seatsRemainingText(seats)}</p>
      </FadeSection>

      <button type="button" onClick={onCta} className="btn-primary">
        {CTA_START}
      </button>

      <p className="text-center text-sm font-semibold text-periwinkle">{REFUND_GUARANTEE}</p>

    </div>
  )
}
