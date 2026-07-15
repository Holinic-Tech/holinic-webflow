import {
  PERFECT_FIT_SUBHEAD,
  MATCH_SCORE_LABEL,
  MATCH_SCORE_OUTSTANDING,
  MY_GOAL_LABEL,
  TRANSFORMATION_TIMELINE_LABEL,
  NO_MORE_FRUSTRATION,
  BENEFIT_ROWS,
  SOCIAL_PROOF,
  RATING_IMAGE,
  TEN_MIN,
  DAYS_IMAGE,
  RESULTS_BADGES,
  VALUE_POINTS,
  LUCIA_IMAGE,
  WRITTEN_TESTIMONIAL,
  REFUND_GUARANTEE,
  seatsRemainingText,
  CTA_JOIN,
  CTA_START,
} from '../../quiz/content/result-content'
import { AutoCarousel } from '../primitives/AutoCarousel'
import { cdnImg } from '../../lib/img'

/**
 * Presentational result dashboard — the full scrolling content of the result
 * screen (full-content-all-screens.md § idx 19, sections S1–S22, in render
 * order). It renders ALREADY-RESOLVED personalized content (name, match %,
 * benefit line by goal, goal description + age label + avatar by age,
 * concern-conditional transformation + testimonial images, concern noun) plus
 * all-static sections (social proof, Trustpilot, benefit list, value card,
 * written testimonial, refund guarantee) and three primary CTAs — all wired to
 * the same `onCta` (the two-space `Go to  checkout` checkout action).
 *
 * It knows NOTHING about the spec, store, answers, or `resolveConditional` — the
 * parent resolves all conditional content via the result-content accessors and
 * wires the callbacks to the store's checkout / plan-dialog actions.
 */
export interface ResultDashboardProps {
  name: string
  percentage: number
  /** Match-card line by `hairGoal` (result-content `benefitFor`). */
  benefit: string
  /** "My Goal" description by `hairConcern` (`goalDescFor`). */
  goalDesc: string
  /** Age label, e.g. "In my 30s" (`ageLabelFor`). */
  ageLabel: string
  /** "say goodbye to your {X}" noun by `hairConcern` (`concernNounFor`). */
  concernNoun: string
  /** [hero, timeline] images by `hairConcern` (`transformationFor`). */
  transformationUrls: string[]
  /** 3 concern carousel slides + 4 static slides (the before/after carousel). */
  carouselUrls: string[]
  /** Lower concern-conditional testimonial image (`testimonialsFor(...).lower`). */
  lowerTestimonialUrl: string
  avatarUrl: string
  /** Scarcity seats count (randomInteger(3,9)). */
  seats: number
  onCta: () => void
}

function highlight(text: string) {
  return <span className="font-semibold text-tangerine-deep">{text}</span>
}

export function ResultDashboard({
  name,
  percentage,
  benefit,
  goalDesc,
  ageLabel,
  concernNoun,
  transformationUrls,
  carouselUrls,
  lowerTestimonialUrl,
  avatarUrl,
  seats,
  onCta,
}: ResultDashboardProps) {
  const [hero, timeline] = transformationUrls

  return (
    <div className="flex flex-col gap-7">
      {/* S1–S2 — Congrats header + perfect-fit subhead */}
      <header className="text-center">
        <h1 className="font-display text-2xl font-semibold leading-tight text-rich-black">
          Congratulations, {name}!
        </h1>
        <p className="mt-2 text-base text-rich-black">{PERFECT_FIT_SUBHEAD}</p>
      </header>

      {/* S3 — Matching-score card (tangerine→periwinkle gradient) */}
      <section className="rounded-3xl bg-gradient-to-br from-violet to-periwinkle/60 p-5 text-center shadow-card">
        <p className="text-sm font-semibold text-plum">{MATCH_SCORE_LABEL}</p>
        <div className="my-3 h-7 w-full overflow-hidden rounded-full bg-white/70 p-1">
          <div
            className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-tangerine to-almond-warm pr-3 text-xs font-bold text-rich-black"
            style={{ width: `${percentage}%` }}
          >
            {percentage}%
          </div>
        </div>
        <p className="text-sm font-semibold text-rich-black">{MATCH_SCORE_OUTSTANDING}</p>
        <p className="mt-3 text-sm text-rich-black/80">{benefit}</p>
      </section>

      {/* S4 — Profile / "My Goal" / transformation timeline card */}
      <section className="rounded-3xl bg-gradient-to-br from-violet to-periwinkle/70 p-5">
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <img
              src={cdnImg(avatarUrl, 160)}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-20 w-20 rounded-full bg-white object-cover"
            />
            <span className="mt-2 text-center text-base font-semibold text-rich-black">{name}</span>
            <span className="text-sm text-shadow">{ageLabel}</span>
          </div>
          <div className="flex-1 border-l border-plum/30 pl-4">
            <p className="text-base font-semibold text-plum">{MY_GOAL_LABEL}</p>
            <p className="mt-1 text-sm text-rich-black">{goalDesc}</p>
          </div>
        </div>
        <p className="mt-5 text-lg font-semibold text-rich-black">{TRANSFORMATION_TIMELINE_LABEL}</p>
        {/* Two SEPARATE images DESIGNED TO STACK as ONE continuous graphic with NO
            gap so the before/after strip sits flush on top of the timeline graphic
            (matches 19-dashboard-live.png). Only the UPPER image's TOP corners are
            rounded (`rounded-t-2xl`); its bottom + the entire lower image stay
            SQUARE so the two still read as one seamless card. */}
        <div className="mt-3 flex flex-col overflow-hidden">
          {hero && (
            <img
              src={cdnImg(hero, 820)}
              alt=""
              loading="eager"
              decoding="async"
              className="block w-full rounded-t-2xl"
            />
          )}
          {timeline && (
            <img
              src={cdnImg(timeline, 820)}
              alt=""
              loading="lazy"
              decoding="async"
              className="-mt-px block w-full"
            />
          )}
        </div>
      </section>

      {/* S5 — "You deserve this" */}
      <p className="text-center text-xl font-bold text-tangerine-deep">
        You deserve this, {name}!
      </p>

      {/* S6 — Join line (concern noun) */}
      <p className="text-center text-2xl font-bold leading-snug text-rich-black">
        Join the 14-Day Haircare Challenge  and  say goodbye to your {concernNoun} permanently
        with a routine that works.
      </p>

      {/* S7 — italic line */}
      <p className="text-center text-base italic text-rich-black">{NO_MORE_FRUSTRATION}</p>

      {/* S8 — three ✅ benefit rows */}
      <ul className="flex flex-col gap-4">
        {BENEFIT_ROWS.map((row) => (
          <li key={row} className="flex gap-3 text-sm text-rich-black">
            <span aria-hidden className="select-none text-lg leading-none">
              ✅
            </span>
            <span>{row}</span>
          </li>
        ))}
      </ul>

      {/* S9 — CTA #1 */}
      <button type="button" onClick={onCta} className="btn-primary">
        {CTA_JOIN}
      </button>

      {/* S10 — 200k social proof */}
      <p className="text-center text-2xl font-bold leading-snug text-rich-black">
        {highlight(SOCIAL_PROOF.highlightLead)}
        {SOCIAL_PROOF.plain}
        {highlight(SOCIAL_PROOF.highlightTail)}
      </p>

      {/* S11 — Trustpilot / rating image */}
      <img
        src={cdnImg(RATING_IMAGE, 820)}
        alt="Rated 4.8/5.0 on Trustpilot, with 200,000+ Challengers"
        loading="lazy"
        decoding="async"
        className="w-full rounded-2xl"
      />

      {/* S12 — before/after carousel (concern slides 1-3 + 4 static). Auto-
          progresses (~3s) and preserves each slide's NATURAL aspect ratio so the
          mixed-dimension before/after photos are never cropped or squeezed. */}
      <AutoCarousel images={carouselUrls.map((u) => cdnImg(u, 820))} natural intervalMs={3000} testId="result-carousel" />

      {/* S13 — CTA #2 */}
      <button type="button" onClick={onCta} className="btn-primary">
        {CTA_START}
      </button>

      {/* S14 — "10 min a day" rich text */}
      <p className="text-center text-lg leading-snug text-rich-black">
        {TEN_MIN.lead}
        <br />
        <span className="text-2xl font-bold">{TEN_MIN.emphasis}</span>
        <br />
        {TEN_MIN.tail}
      </p>

      {/* S15 — Days graphic */}
      <img
        src={cdnImg(DAYS_IMAGE, 820)}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full rounded-2xl"
      />

      {/* S16 — 100% Results / 0% Hassle badges */}
      <div className="flex justify-center gap-6">
        {RESULTS_BADGES.map((b) => (
          <div key={b.label} className="rounded-2xl bg-violet px-6 py-3 text-center">
            <p className="text-xl font-bold text-plum">{b.value}</p>
            <p className="text-xl font-bold text-plum">{b.label}</p>
          </div>
        ))}
      </div>

      {/* S17 — 3-point value card */}
      <section className="flex flex-col gap-5 rounded-3xl border border-neutral-100 p-5 shadow-card">
        {VALUE_POINTS.map((p, i) => (
          <div key={i} className="flex items-start gap-4">
            <span
              aria-hidden
              className="mt-0.5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-violet text-lg"
            >
              {['🔬', '🥗', '💰'][i]}
            </span>
            <p className="text-sm text-rich-black">
              {p.lead}
              <span className="font-semibold">{p.bold}</span>
              {p.tail}
            </p>
          </div>
        ))}
      </section>

      {/* Written Trustpilot-style testimonial card */}
      <section className="rounded-2xl border border-neutral-100 p-5 shadow-card">
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
      </section>

      {/* S18 — fixed lower testimonial image */}
      <img
        src={cdnImg(LUCIA_IMAGE, 820)}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full rounded-2xl"
      />

      {/* S19 — concern-conditional lower testimonial image */}
      <img
        src={cdnImg(lowerTestimonialUrl, 820)}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full rounded-2xl"
      />

      {/* S20 — scarcity / seats */}
      <p className="text-center text-base text-rich-black">{seatsRemainingText(seats)}</p>

      {/* S21 — CTA #3 */}
      <button type="button" onClick={onCta} className="btn-primary">
        {CTA_START}
      </button>

      {/* S22 — refund guarantee footer */}
      <p className="text-center text-sm font-semibold text-periwinkle">{REFUND_GUARANTEE}</p>
    </div>
  )
}
