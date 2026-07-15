import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, domAnimation, LazyMotion, m } from 'framer-motion'
import { useStore } from 'zustand'
import type { QuizSpec } from '../spec/types'
import { createQuizStore, resolveResultConfig } from '../store/quizStore'
import { deriveChrome, questionPosition, totalQuestions } from '../engine/navigation'
import { ScreenRenderer } from './ScreenRenderer'
import { FitViewport } from './layout/FitViewport'
import { ProgressHeader } from './layout/ProgressHeader'
import { BottomCtaBar } from './layout/BottomCtaBar'
import { isEmailFormValid } from './screens/EmailCaptureScreen'
import { ResultScreen } from './screens/ResultScreen'
import { AspirationalResultDashboard } from './result/AspirationalResultDashboard'
import { PlanDetailsDialog } from './result/PlanDetailsDialog'
import { CountdownTimer } from './primitives/CountdownTimer'
import { SkipModal } from './primitives/SkipModal'
import { CheckoutModal } from './result/CheckoutModal'
import { CheckoutEmbedFrame } from './result/CheckoutEmbedFrame'
import { useCheckoutEmbed } from './result/useCheckoutEmbed'
import { buildCheckoutUrl, buildEmbedCheckoutUrl, redirectToCheckout } from '../tracking/checkout'
import { planData, personalPlan } from '../quiz/content/plans'
import {
  benefitFor,
  goalDescFor,
  transformationFor,
  testimonialsFor,
  avatarFor,
  ageLabelFor,
  concernNounFor,
  staticCarouselSlides,
} from '../quiz/content/result-content'

export interface QuizAppProps {
  spec: QuizSpec
}

/**
 * DESKTOP treatment (md:+ only, ≥768px): the quiz is centered as a phone-width
 * card column (~full window height) on the soft brand field — mobile is
 * byte-for-byte unaffected (all `md:*`). NOTE: the screens use mobile flex-grow
 * spacers, so on a taller container the extra height becomes whitespace rather
 * than larger elements; genuinely enlarging elements on desktop needs the screens
 * to expose an intrinsic (non-stretched) height so a scaler can fill the space —
 * tracked as a follow-up.
 */
/**
 * App shell: owns the store, renders the current screen via ScreenRenderer,
 * fires `viewed()` on every screen change, and wires answer/continue/back.
 *
 * Chrome (back + progress) is DERIVED via `deriveChrome` + `questionPosition`/
 * `totalQuestions` and rendered by the presentational `ProgressHeader`. Every
 * screen kind EXCEPT `result` is wrapped in `<FitViewport>` (scale-to-fit, no
 * scroll); `result` renders in a scrollable container instead.
 */
export function QuizApp({ spec }: QuizAppProps) {
  // Embedded-checkout hook indirection: the store is created once, but the
  // embed API materializes after the hooks below run — the ref bridges them.
  // With no embed (or before the ref is set) the store keeps the legacy
  // redirect, so behavior is unchanged whenever the embed is off.
  const embedOpenRef = useRef<(() => 'handled' | 'redirect') | null>(null)
  const store = useMemo(
    () =>
      createQuizStore(spec, {
        onCheckout: () => (embedOpenRef.current ? embedOpenRef.current() : 'redirect'),
      }),
    [spec],
  )
  const index = useStore(store, (s) => s.index)
  const answers = useStore(store, (s) => s.answers)
  const contact = useStore(store, (s) => s.contact)
  const resultPercentage = useStore(store, (s) => s.resultPercentage)
  const skipOpen = useStore(store, (s) => s.skipOpen)
  const screen = spec.screens[index]
  const chrome = deriveChrome(spec, index)

  const {
    answer,
    startQuiz,
    chooseNoneOfTheAbove,
    continue: onContinue,
    back,
    submitEmail,
    openSkip,
    dismissSkip,
    confirmSkip,
  } = store.getState()

  // The first screen (idx 0) carries a "skip the quiz" affordance: a text link
  // that opens the confirmation modal. The modal itself is rendered at this
  // shell level (which owns the store) so the screen components stay purely
  // presentational.
  const isStart = index === 0

  // Plan-details dialog visibility is local UI state; open/close ALSO fire the
  // store's GA actions (Opened/Closed Plan Details).
  const [planOpen, setPlanOpen] = useState(false)

  // Email-capture form state is lifted here so the STICKY bottom CONTINUE bar
  // (chrome-owned, outside FitViewport) can read validity + submit. Reset when
  // the visible screen changes off the email step.
  const [emailName, setEmailName] = useState('')
  const [emailValue, setEmailValue] = useState('')

  // §S20 scarcity — "Only {N} seats remaining" = randomInteger(3,9), seeded once.
  const [seats] = useState(() => 3 + Math.floor(Math.random() * 7))

  // Tapping a checkout CTA fires the GA event then sets `window.location.href` to
  // the checkout host — a full cross-document navigation that can take a beat
  // (DNS/TLS/page-load on checkout.hairqare.co). Flip on a blocking spinner overlay
  // the instant it's tapped so the delay reads as "working", not a broken button.
  // It stays up until the new document replaces this one. Wraps all 3 checkout
  // entry points (results CTA, floating timer, plan dialog).
  const [redirecting, setRedirecting] = useState(false)

  const isResult = screen.kind === 'result'

  // Embedded checkout (result page only). When enabled, the store's checkout
  // actions route through `embed.openCheckout()` (via embedOpenRef): 'handled'
  // opens the modal / reveals the inline frame; 'redirect' (webview policy,
  // failed frame) falls through to the legacy redirect below. The load-timeout
  // fallback lands on the same spinner + redirect as the legacy path.
  const embed = useCheckoutEmbed({
    spec,
    active: isResult,
    user: contact ?? {},
    answers,
    onFallback: () => {
      setRedirecting(true)
      redirectToCheckout(spec.checkout, store.getState().contact ?? {}, store.getState().answers)
    },
  })
  useEffect(() => {
    embedOpenRef.current = embed.enabled ? embed.openCheckout : null
  }, [embed.enabled, embed.openCheckout])

  // Tapping a checkout CTA fires the GA event; the store then either hands off
  // to the embed ('handled' — no overlay, the modal/inline frame presents) or
  // performs the legacy `window.location.href` redirect. The blocking spinner
  // overlay should cover exactly the redirect case, so it flips on only when
  // the embed is NOT taking over.
  const goToCheckout = (checkout: () => void) => {
    if (!embed.enabled || embed.frameState === 'failed') setRedirecting(true)
    checkout()
  }
  const emailValid = isEmailFormValid(emailName, emailValue)
  const submitEmailForm = () => {
    if (!emailValid) return
    void submitEmail({ name: emailName.trim(), email: emailValue.trim() })
  }

  // Fire the view event whenever the visible screen changes.
  useEffect(() => {
    store.getState().viewed()
  }, [index, store])

  // Pitch screens that carry a testimonial CAROUSEL lay out differently: instead
  // of the uniform scale-to-fit (which would shrink the copy + the social-proof
  // bar), the text/trust-bar keep their natural size and ONLY the carousel flexes
  // to fill the room left above the Continue button. See QuizApp's render branch
  // + PitchScreen's flex-fit. (Non-carousel pitches stay on FitViewport.)
  const isFlexFitPitch =
    screen.kind === 'pitch' && (screen.blocks?.some((b) => b.kind === 'carousel') ?? false)

  // Speed up the checkout redirect: once the user is on the RESULT page, every
  // checkout URL param (email, coupon, cvg ids) is already known, so PREFETCH the
  // exact checkout URL. join.hairqare.co ↔ checkout.hairqare.co are same-site, so
  // the Speculation Rules prefetch warms the document with credentials; on click
  // the navigation is served from cache. (Prefetch, not prerender, so the checkout
  // page's own analytics don't fire before the user actually gets there.)
  useEffect(() => {
    if (!isResult || typeof document === 'undefined') return
    let url: string
    try {
      // With the embed on, warm the EXACT document the iframe will load (URL
      // must match byte-for-byte for the prefetch cache to hit); otherwise the
      // legacy redirect URL as before.
      url = embed.enabled
        ? buildEmbedCheckoutUrl(spec.checkout, contact ?? {}, answers)
        : buildCheckoutUrl(spec.checkout, contact ?? {}, answers)
    } catch {
      return
    }
    const s = document.createElement('script')
    s.type = 'speculationrules'
    s.textContent = JSON.stringify({ prefetch: [{ source: 'list', urls: [url] }] })
    document.head.appendChild(s)
    // Fallback for browsers without the Speculation Rules API.
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    document.head.appendChild(link)
    return () => {
      s.remove()
      link.remove()
    }
  }, [isResult, spec.checkout, contact, answers, embed.enabled])

  const body = isResult ? (
    renderResult()
  ) : (
    <ScreenRenderer
      screen={screen}
      answers={answers}
      onAnswer={(answerId) => answer(answerId)}
      onStartQuiz={() => startQuiz()}
      onNone={() => chooseNoneOfTheAbove()}
      onContinue={() => onContinue()}
      onSkip={() => openSkip()}
      emailName={emailName}
      emailValue={emailValue}
      onEmailNameChange={setEmailName}
      onEmailValueChange={setEmailValue}
      onSubmitEmail={submitEmailForm}
    />
  )

  // The STICKY bottom CONTINUE bar is owned by the chrome (outside FitViewport),
  // so it's pinned to the viewport bottom and never scaled. Which screens get a
  // CTA — and its enabled state / handler — is DERIVED from screen kind + type +
  // progression + answers (never magic indexes):
  //   • pitch                     → always CONTINUE → continue()
  //   • question/multi            → CONTINUE, enabled when ≥1 selected → continue()
  //   • question/single 'cta'     → CONTINUE once a selection exists → continue()
  //   • email                     → CONTINUE, enabled when valid → submit
  //   • auto single/image/rating, loading, result → NO bottom CTA
  const cta = deriveCta()

  function deriveCta(): { label: string; enabled: boolean; onClick: () => void } | null {
    switch (screen.kind) {
      case 'pitch':
        return { label: 'Continue', enabled: true, onClick: () => onContinue() }
      case 'email':
        // idx-18 renders its own Submit button inside the gradient card (matching
        // the golden) — no sticky bottom CTA on this screen.
        return null
      case 'question': {
        const selected = answers[screen.questionId] ?? []
        if (screen.type === 'multi') {
          return { label: 'Continue', enabled: selected.length > 0, onClick: () => onContinue() }
        }
        if (screen.type === 'single' && screen.progression === 'cta') {
          // Only surfaces once a selection exists (the reveal state).
          return selected.length > 0
            ? { label: 'Continue', enabled: true, onClick: () => onContinue() }
            : null
        }
        return null
      }
      default:
        return null
    }
  }

  function renderResult() {
    const cfg = resolveResultConfig(spec)
    const transform = transformationFor(answers)
    const testimonials = testimonialsFor(answers)
    const actions = store.getState()

    const closePlan = () => {
      actions.closePlanDetails()
      setPlanOpen(false)
    }

    // Inline mode: the frame renders as an in-flow section above the sticky
    // timer, auto-sized by the child's resize messages (ONE scroller stays).
    const embedSlot =
      embed.enabled && embed.mode === 'inline' && embed.frameSrc ? (
        <CheckoutEmbedFrame
          src={embed.frameSrc}
          mode="inline"
          ready={embed.frameState === 'ready'}
          height={embed.inlineHeight}
        />
      ) : undefined

    return (
      <ResultScreen
        embedSlot={embedSlot}
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
              onClick={() => goToCheckout(actions.checkoutFromTimer)}
              className="rounded-full bg-cta-orange px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.7px] text-white transition-colors hover:bg-cta-orange-deep"
            >
              JOIN
            </button>
          </div>
        }
      >
        <AspirationalResultDashboard
          name={contact?.firstName || contact?.name || 'there'}
          percentage={resultPercentage}
          benefit={benefitFor(answers)}
          goalDesc={goalDescFor(answers)}
          ageLabel={ageLabelFor(answers)}
          concernNoun={concernNounFor(answers)}
          transformationUrls={[transform.hero, transform.timeline]}
          carouselUrls={[...testimonials.carousel, ...staticCarouselSlides]}
          lowerTestimonialUrl={testimonials.lower}
          avatarUrl={avatarFor(answers)}
          seats={seats}
          onCta={() => goToCheckout(actions.checkoutFromResults)}
          dream={answers.hairDream?.[0] ?? ''}
          ageId={answers.age?.[0] ?? ''}
          confidence={answers.confidence?.[0] ?? ''}
        />
        <PlanDetailsDialog
          open={planOpen}
          plan={planData}
          personalPlan={personalPlan}
          onClose={closePlan}
          onCheckout={() => goToCheckout(actions.checkoutFromPlanDialog)}
        />
      </ResultScreen>
    )
  }

  return (
    // DESKTOP shell (md: and up only — mobile is byte-for-byte unaffected):
    // center the quiz as a constrained, phone-width column on a soft dove field,
    // wrapped in a rounded card with a soft shadow so it reads as an app on a
    // page. At mobile widths this <div> is `display: contents`-equivalent (no
    // box: full-width, no background, no centering) so the quiz behaves exactly
    // as before. The desktop classes (`md:*`) never apply below 768px, so the
    // 375–412px e2e/visual/device viewports render identically to the prior build.
    // LazyMotion + `m.*` defer framer-motion's animation features (~30 kb) out of
    // the initial bundle; `domAnimation` covers the cross-fades/slides used here.
    <LazyMotion features={domAnimation}>
    <div className="md:flex md:min-h-[100dvh] md:items-center md:justify-center md:overflow-hidden md:bg-dove md:bg-gradient-to-b md:from-[#f2f3fb] md:to-dove">
      {/* The quiz column. Mobile: full-bleed, full-viewport-height, clipped (no
          document scroll). DESKTOP: ~full window height at a comfortable 560px
          width (wider than the ~400px content so FitViewport has room to scale it
          UP), centered as a rounded card on the soft field. */}
      <div
        className={`flex w-full flex-col md:mx-auto md:h-[96dvh] md:w-[480px] md:overflow-hidden md:rounded-3xl md:bg-white md:shadow-soft ${
          isResult
            ? 'min-h-[100dvh] md:min-h-0'
            : 'h-[100dvh] overflow-hidden'
        }`}
      >
      {chrome.header && (
        <ProgressHeader
          showBack={chrome.back}
          showProgress={chrome.progress}
          current={questionPosition(spec, index)}
          total={totalQuestions(spec)}
          onBack={() => back()}
        />
      )}
      {isResult ? (
        // The result is the ONE scrollable screen, and this is its SINGLE scroll
        // container (ResultScreen itself no longer owns one — that broke the
        // sticky timer). It's a fixed-height scroller so the timer's
        // `sticky bottom-0` pins to the bottom of the VISIBLE area during scroll:
        //  • Mobile: the full viewport height (`h-[100dvh]`) scrolls INSIDE this box.
        //  • Desktop: fills the capped column (`md:flex-1 md:min-h-0`) and scrolls there.
        <div className="h-[100dvh] overflow-y-auto md:h-auto md:min-h-0 md:flex-1">{body}</div>
      ) : (
        <>
          {/* Scaled content area (flex-1) — FitViewport shrinks the screen body
              to fit the space ABOVE the sticky CTA, never the CTA itself. A
              keyed AnimatePresence cross-fades/slides between screens (rendered
              at final state under reduced motion, so e2e stays deterministic). */}
          <div className="relative min-h-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={index}
                className="h-full w-full"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.26, ease: 'easeOut' }}
              >
                {/* The idx-0 start COVER renders FULL-BLEED (fills the column
                    `h-full`, no scaler) so its background image covers the whole
                    screen/card edge-to-edge with no white margins. Every other
                    screen is scale-to-fit via FitViewport. */}
                {isStart ? (
                  <div className="h-full w-full">{body}</div>
                ) : isFlexFitPitch ? (
                  // Height-bounded flex column so PitchScreen's flex-1 carousel
                  // fills the leftover space; clipped so an extreme small screen
                  // can't scroll.
                  <div className="flex h-full w-full flex-col overflow-hidden">{body}</div>
                ) : (
                  <FitViewport>{body}</FitViewport>
                )}
              </m.div>
            </AnimatePresence>
          </div>
          {/* Sticky bottom CONTINUE bar — pinned below the scaled content. */}
          {cta && (
            <BottomCtaBar label={cta.label} enabled={cta.enabled} onClick={cta.onClick} />
          )}
        </>
      )}
      <SkipModal open={skipOpen} onConfirm={confirmSkip} onDismiss={dismissSkip} />
      </div>
      {/* Embedded checkout sheet (modal mode). Rendered as soon as the frame
          src exists (per the preload policy) and toggled via display so the
          ONE iframe instance persists from hidden preload through open —
          remounting would reload the checkout. */}
      {embed.enabled && embed.mode === 'modal' && embed.frameSrc && (
        <CheckoutModal open={embed.open} onClose={embed.close}>
          <CheckoutEmbedFrame
            src={embed.frameSrc}
            mode="modal"
            ready={embed.frameState === 'ready'}
          />
        </CheckoutModal>
      )}
      {/* Full-screen redirect overlay — shown while the checkout navigation loads
          (see `goToCheckout`). Covers the whole window so the spinner reads as a
          deliberate "taking you to checkout" state on every device. */}
      {redirecting && (
        <output
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-white/85 backdrop-blur-sm"
          aria-live="polite"
        >
          <span
            aria-hidden="true"
            className="h-10 w-10 animate-spin rounded-full border-[3px] border-cta-orange/25 border-t-cta-orange"
          />
          <p className="text-sm font-medium text-rich-black">Taking you to secure checkout…</p>
        </output>
      )}
    </div>
    </LazyMotion>
  )
}
