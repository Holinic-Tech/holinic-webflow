import { AutoCarousel } from '../primitives/AutoCarousel'
import { cdnImg } from '../../lib/img'

/**
 * Presentational pitch / interstitial screen. Renders an already-resolved
 * headline + body (and an optional image). The CONTINUE control is the chrome's
 * STICKY bottom CTA bar (owned by QuizApp), NOT rendered here. It knows
 * NOTHING about conditions, the spec, or answer state — the ConditionalText
 * for headline/body/blocks is resolved upstream by ScreenRenderer.
 *
 * Two modes:
 *  - simple (default): centered headline + body + Continue (idx 6, 8).
 *  - blocks: a top→bottom stack of resolved text paragraphs, dividers, and an
 *    image carousel (idx-13 Damage-Practices Pitch). When `blocks` is present it
 *    replaces the simple headline/body layout.
 */

/** A pitch block with its ConditionalText already resolved to final strings. */
export type ResolvedPitchBlock =
  | { kind: 'text'; text: string; weight?: 'normal' | 'semibold' | 'accent'; align?: 'center' }
  | { kind: 'divider' }
  | { kind: 'spacer' }
  | { kind: 'heroText'; headline: string; sub: string }
  | { kind: 'statCard'; title: string; stats: Array<{ value: string; label: string }> }
  | { kind: 'carousel'; images: string[] }
  | { kind: 'image'; src: string }
  | { kind: 'checkItems'; items: string[]; icon: string }

export interface PitchScreenProps {
  headline: string
  body: string
  imageUrl?: string
  blocks?: ResolvedPitchBlock[]
}

// Per-block WEIGHT + colour only. The font SIZE is chosen at render time from how
// much room the pitch has (`roomy` below): short image-pitches read large; the
// carousel-dense pitches stay compact so the auto-scaler doesn't shrink them.
const WEIGHT_CLASS: Record<'normal' | 'semibold' | 'accent', string> = {
  normal: 'font-normal text-shadow',
  semibold: 'font-semibold text-tangerine-deep',
  accent: 'font-normal text-plum',
}

/**
 * Renders a text string with `**word**` markers as bold spans and `\n` as <br/>.
 * - semibold (orange) context: bold = font-extrabold, same colour
 * - normal/accent (grey/plum) context: bold = font-semibold text-rich-black
 */
function InlineBold({ text, weight }: { text: string; weight: 'normal' | 'semibold' | 'accent' }) {
  if (!text.includes('**') && !text.includes('\n')) return <>{text}</>
  const parts = text.split(/(\*\*[^*]+\*\*|\n)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part === '\n') return <br key={i} />
        if (part.startsWith('**') && part.endsWith('**')) {
          const inner = part.slice(2, -2)
          return (
            <strong
              key={i}
              className={weight === 'semibold' ? 'font-extrabold' : 'font-semibold text-rich-black'}
            >
              {inner}
            </strong>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export function PitchScreen({ headline, body, imageUrl, blocks }: PitchScreenProps) {
  if (blocks && blocks.length > 0) {
    const hasCarousel = blocks.some((b) => b.kind === 'carousel')
    // A pitch with an image but NO carousel (e.g. the Damage pitch) has short
    // content and lots of vertical room, so its body text reads LARGER. Carousel
    // pitches are already viewport-full — anything bigger would make FitViewport
    // shrink the whole screen — so they keep the compact size.
    const roomy = blocks.some((b) => b.kind === 'image') && !hasCarousel
    const textSize = roomy
      ? 'text-2xl leading-[1.35] md:text-3xl md:leading-[1.4]'
      : 'text-xl leading-[1.3] md:text-2xl md:leading-[1.45]'
    return (
      // Height-bounded flex column (see QuizApp's isFlexFitPitch branch): the
      // copy + trust-bar keep their natural size; the carousel block (flex-1)
      // absorbs the remaining space. pb-3 leaves a small gap above the Continue bar.
      <div className="flex flex-1 flex-col gap-2 px-5 pt-4 pb-3">
        {blocks.map((block, i) => {
          if (block.kind === 'divider') {
            return <hr key={i} className="my-1 border-t border-neutral-200" />
          }
          if (block.kind === 'spacer') {
            return <div key={i} className="h-1" />
          }
          if (block.kind === 'heroText') {
            return (
              <div key={i} className="text-center">
                <h2 className="text-2xl font-bold leading-tight text-rich-black">
                  {block.headline}
                </h2>
                <p className="mt-1 text-lg leading-snug text-shadow">{block.sub}</p>
              </div>
            )
          }
          if (block.kind === 'statCard') {
            return (
              <div key={i} className="rounded-2xl bg-plum px-5 py-4 text-center">
                <p className="text-sm font-semibold text-white">
                  {block.title}
                </p>
                <div className="mt-3 flex items-center justify-center">
                  {block.stats.flatMap((s, j) => [
                    ...(j > 0
                      ? [<div key={`d${j}`} className="mx-5 h-8 w-px bg-white/30" />]
                      : []),
                    <div key={j} className="flex flex-col items-center gap-1">
                      <span className="text-3xl font-bold text-white">{s.value}</span>
                      <span className="text-xs text-white/60">{s.label}</span>
                    </div>,
                  ])}
                </div>
              </div>
            )
          }
          if (block.kind === 'carousel') {
            return <PitchCarousel key={i} images={block.images.map((u) => cdnImg(u, 820))} />
          }
          if (block.kind === 'image') {
            return (
              <img
                key={i}
                src={cdnImg(block.src, 820)}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full rounded-lg object-contain"
              />
            )
          }
          if (block.kind === 'checkItems') {
            return <PitchCheckItems key={i} items={block.items} icon={block.icon} />
          }
          return (
            <p
              key={i}
              className={`${textSize} ${WEIGHT_CLASS[block.weight ?? 'normal']}${block.align === 'center' ? ' text-center' : ''}`}
            >
              <InlineBold text={block.text} weight={block.weight ?? 'normal'} />
            </p>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-7 px-5 py-8 text-center">
      {imageUrl && (
        <img
          src={cdnImg(imageUrl, 820)}
          alt={headline}
          className="mx-auto max-h-80 w-full rounded-3xl object-cover shadow-soft"
        />
      )}
      <h1 className="text-3xl font-medium leading-tight text-rich-black md:text-4xl">{headline}</h1>
      <p className="text-2xl leading-relaxed text-shadow md:text-2xl">{body}</p>
    </div>
  )
}

/**
 * Minimal faithful image carousel: a horizontal scroll-snap strip with the
 * center slide enlarged and neighbors peeking (~0.74 viewport fraction). Images
 * are `object-fit: contain`, rounded. CSS-only (no JS autoplay) — keeps the
 * no-scroll/fit invariant simple.
 */
/**
 * idx-8 "Proven Results for:" 2-column checkmark grid. Each item is a green
 * checkmark image + its value text (e.g. "Any hair concern"). Two columns,
 * filling left→right then wrapping (col1 top, col2 top, col1 bottom, col2 bottom)
 * — matching the live grid order.
 */
function PitchCheckItems({ items, icon }: { items: string[]; icon: string }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3" data-testid="pitch-check-items">
      {items.map((text, i) => (
        <div key={i} className="flex items-center gap-2">
          <img
            src={icon}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-6 w-6 shrink-0 object-contain"
          />
          <span className="text-lg leading-tight text-rich-black md:text-xl">{text}</span>
        </div>
      ))}
    </div>
  )
}

function PitchCarousel({ images }: { images: string[] }) {
  // Auto-playing cross-fade carousel (object-contain — never cropped). On a
  // flex-fit pitch this is the ONLY flexible element: `flex-1` makes the frame
  // FILL the room left below the copy/trust-bar; `min-h-0` lets it shrink on a
  // short screen; `max-h` caps it so it can't balloon to an oversized testimonial
  // on a tall/desktop screen (it just leaves comfortable whitespace instead).
  // Keeps the `pitch-carousel` testid for e2e.
  return (
    <AutoCarousel
      images={images}
      testId="pitch-carousel"
      className="min-h-0 w-full flex-1 max-h-[440px]"
    />
  )
}
