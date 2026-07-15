import { useEffect, useRef, useState } from 'react'

/**
 * Presentational pre-result loading screen (idx-17). Renders a big title, a
 * rotating illustration carousel, an animated progress bar, and a list of
 * ✅ checkpoints that fade/reveal in sequence, then calls `onDone` exactly once
 * after `durationMs` via a setTimeout cleared on unmount. It knows NOTHING about
 * the spec, answers, or progression — the parent decides what "done" advances to.
 *
 * Back-compat: when `title`/`checkpoints`/`carouselImages` are absent it falls
 * back to rendering `messages` as a simple checklist (legacy callers / preview).
 */
export interface LoadingScreenProps {
  messages: string[]
  durationMs: number
  onDone: () => void
  title?: string
  carouselImages?: string[]
  checkpoints?: string[]
}

export function LoadingScreen({
  messages,
  durationMs,
  onDone,
  title,
  carouselImages,
  checkpoints,
}: LoadingScreenProps) {
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const lines = checkpoints && checkpoints.length > 0 ? checkpoints : messages
  const images = carouselImages ?? []

  // Rotate the carousel illustration (fast, like the live ~1.2s autoplay).
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setSlide((s) => (s + 1) % images.length), 1200)
    return () => clearInterval(id)
  }, [images.length])

  // Reveal the checkpoints one-by-one across the duration.
  const [revealed, setRevealed] = useState(1)
  useEffect(() => {
    if (lines.length <= 1) return
    const step = Math.max(400, Math.floor(durationMs / lines.length))
    const id = setInterval(() => setRevealed((n) => Math.min(n + 1, lines.length)), step)
    return () => clearInterval(id)
  }, [lines.length, durationMs])

  useEffect(() => {
    const id = setTimeout(() => onDoneRef.current(), durationMs)
    return () => clearTimeout(id)
  }, [durationMs])

  return (
    <div className="flex flex-1 flex-col gap-6 px-5 pb-8 pt-2 text-center">
      {title && (
        <h1 className="text-[28px] font-medium leading-tight text-rich-black">{title}</h1>
      )}

      {images.length > 0 && (
        <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl bg-dove">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500"
              style={{ opacity: i === slide ? 1 : 0 }}
            />
          ))}
        </div>
      )}

      <div
        data-loading-bar
        className="h-3 w-full overflow-hidden rounded-full border border-tangerine/60 bg-violet p-0.5"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-tangerine to-almond-warm"
          style={{ animation: `loading-bar ${durationMs}ms linear forwards` }}
        />
      </div>
      <style>{`@keyframes loading-bar { from { width: 0% } to { width: 100% } }`}</style>

      <ul className="flex flex-col gap-3">
        {lines.map((m, i) => (
          <li
            key={i}
            className="flex items-center justify-center gap-2 text-base text-rich-black transition-opacity duration-500"
            style={{ opacity: i < revealed ? 1 : 0.25 }}
          >
            <span aria-hidden className="text-lg leading-none">
              ✅
            </span>
            {m}
          </li>
        ))}
      </ul>
    </div>
  )
}
