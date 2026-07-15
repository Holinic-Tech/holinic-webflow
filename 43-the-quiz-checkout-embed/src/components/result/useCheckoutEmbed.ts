import { useCallback, useEffect, useRef, useState } from 'react'
import type { QuizSpec } from '../../spec/types'
import type { AnswerState } from '../../engine/answers'
import { buildEmbedCheckoutUrl, type CheckoutUser } from '../../tracking/checkout'
import { isInAppWebview, parseEmbedMessage, resolveEmbedConfig, type ResolvedEmbedConfig } from '../../tracking/embed'

export type FrameState = 'unmounted' | 'loading' | 'ready' | 'failed'

export interface UseCheckoutEmbedArgs {
  spec: QuizSpec
  /** The result page is visible — preload/intent listeners only run there. */
  active: boolean
  user: CheckoutUser
  answers: AnswerState
  /** Legacy redirect path (spinner overlay + redirectToCheckout). Called on load-timeout fallback. */
  onFallback: () => void
}

export interface CheckoutEmbedApi {
  /** Embed usable in THIS browser context (config on + webview policy passed). */
  enabled: boolean
  mode: 'modal' | 'inline'
  frameState: FrameState
  frameSrc: string | null
  inlineHeight: number
  open: boolean
  /** Store hook: present the embed, or tell the store to redirect instead. */
  openCheckout: () => 'handled' | 'redirect'
  close: () => void
}

const INTENT_EVENTS: Array<keyof WindowEventMap> = ['scroll', 'pointerdown', 'touchstart', 'keydown']

/**
 * Orchestrates the embedded checkout on the result page: mounts the iframe per
 * the preload policy, listens for the child protocol messages, opens the
 * modal / reveals the inline section from the store's onCheckout hook, and
 * falls back to the legacy redirect when the frame never becomes ready within
 * `loadTimeoutMs` of the user opening it. Components stay presentational —
 * everything stateful lives here.
 */
export function useCheckoutEmbed({ spec, active, user, answers, onFallback }: UseCheckoutEmbedArgs): CheckoutEmbedApi {
  const cfg: ResolvedEmbedConfig | null = resolveEmbedConfig(spec.checkout)
  const webviewBlocked =
    !!cfg && cfg.redirectInWebview && typeof navigator !== 'undefined' && isInAppWebview(navigator.userAgent)
  const enabled = !!cfg && !webviewBlocked

  const [frameState, setFrameState] = useState<FrameState>('unmounted')
  const [frameSrc, setFrameSrc] = useState<string | null>(null)
  const [inlineHeight, setInlineHeight] = useState(0)
  const [open, setOpen] = useState(false)

  // Refs mirror state the listeners/timer need without re-subscribing.
  const stateRef = useRef(frameState)
  stateRef.current = frameState
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fellBackRef = useRef(false)

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const mountFrame = useCallback(() => {
    if (!cfg || stateRef.current !== 'unmounted') return
    setFrameSrc(buildEmbedCheckoutUrl(spec.checkout, user, answers))
    setFrameState('loading')
    // The prefill params are frozen at mount time — correct on the result page,
    // where contact + answers are final.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg?.base, spec.checkout, user.email, user.firstName, user.lastName, answers])

  // Child protocol messages (trust = exact origin + source marker).
  useEffect(() => {
    if (!enabled || !cfg) return
    const onMessage = (event: MessageEvent) => {
      const msg = parseEmbedMessage(event, cfg.allowedOrigin)
      if (!msg) return
      if (msg.type === 'ready') {
        clearTimer()
        setFrameState((s) => (s === 'failed' ? s : 'ready'))
      } else if (msg.type === 'resize') {
        setInlineHeight(msg.height)
      }
      // 'purchase' is intentionally log-only in v1: the checkout's own GTM owns
      // all purchase-side events; the parent fires nothing extra.
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [enabled, cfg?.allowedOrigin])

  // Preload policy, active only on the result page.
  useEffect(() => {
    if (!enabled || !active || stateRef.current !== 'unmounted') return
    if (cfg!.preload === 'onResult') {
      mountFrame()
      return
    }
    if (cfg!.preload !== 'onIntent') return
    const onIntent = () => {
      remove()
      mountFrame()
    }
    const remove = () =>
      INTENT_EVENTS.forEach((e) => window.removeEventListener(e, onIntent, true))
    INTENT_EVENTS.forEach((e) =>
      window.addEventListener(e, onIntent, { capture: true, passive: true, once: false }),
    )
    return remove
  }, [enabled, active, cfg?.preload, mountFrame])

  const openCheckout = useCallback((): 'handled' | 'redirect' => {
    if (!enabled || stateRef.current === 'failed' || fellBackRef.current) return 'redirect'
    if (stateRef.current === 'unmounted') mountFrame()
    setOpen(true)
    // The user is now WAITING on the frame: give it loadTimeoutMs to become
    // ready, then close and hand over to the legacy redirect. Cleared by
    // `ready` or by the user closing the sheet themselves.
    if (stateRef.current !== 'ready' && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        if (stateRef.current === 'ready' || fellBackRef.current) return
        fellBackRef.current = true
        setFrameState('failed')
        setOpen(false)
        onFallback()
      }, cfg!.loadTimeoutMs)
    }
    return 'handled'
  }, [enabled, mountFrame, onFallback, cfg?.loadTimeoutMs])

  const close = useCallback(() => {
    clearTimer() // user backed out deliberately — no fallback redirect
    setOpen(false)
  }, [])

  useEffect(() => clearTimer, [])

  return {
    enabled,
    mode: cfg?.mode ?? 'modal',
    frameState,
    frameSrc,
    inlineHeight,
    open,
    openCheckout,
    close,
  }
}
