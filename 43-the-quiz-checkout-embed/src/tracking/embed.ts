import type { CheckoutConfig, CheckoutEmbedConfig } from '../spec/types'

/**
 * Embedded-checkout protocol (docs/reference/checkout-embed-contract.md).
 * Pure helpers only — no DOM side-effects — so the message contract and the
 * webview policy are unit-testable like the rest of the tracking layer.
 */

/** `source` value every trusted child message must carry. */
export const EMBED_MESSAGE_SOURCE = 'hairqare-checkout'

export type EmbedMessage =
  | { type: 'ready' }
  | { type: 'resize'; height: number }
  | { type: 'purchase' }

export interface ResolvedEmbedConfig {
  mode: 'modal' | 'inline'
  base: string
  preload: 'none' | 'onIntent' | 'onResult'
  loadTimeoutMs: number
  allowedOrigin: string
  redirectInWebview: boolean
}

export const EMBED_DEFAULTS = {
  mode: 'modal',
  preload: 'onIntent',
  loadTimeoutMs: 8000,
  allowedOrigin: 'https://checkout.hairqare.co',
  // Webviews are ~45% of traffic and the primary target; redirect there only
  // if in-webview testing fails (then flip this in the spec).
  redirectInWebview: false,
} as const

/** Normalized embed config, or null when the embed is absent/disabled. */
export function resolveEmbedConfig(cfg: CheckoutConfig): ResolvedEmbedConfig | null {
  const embed: CheckoutEmbedConfig | undefined = cfg.embed
  if (!embed?.enabled) return null
  return {
    mode: embed.mode ?? EMBED_DEFAULTS.mode,
    base: embed.base ?? cfg.base,
    preload: embed.preload ?? EMBED_DEFAULTS.preload,
    loadTimeoutMs: embed.loadTimeoutMs ?? EMBED_DEFAULTS.loadTimeoutMs,
    allowedOrigin: embed.allowedOrigin ?? EMBED_DEFAULTS.allowedOrigin,
    redirectInWebview: embed.redirectInWebview ?? EMBED_DEFAULTS.redirectInWebview,
  }
}

/**
 * Parse a window `message` event into a trusted EmbedMessage, or null.
 * Trust requires BOTH the exact origin match and the protocol `source` marker;
 * anything else (other widgets, devtools, ads) is ignored silently.
 */
export function parseEmbedMessage(
  event: { origin: string; data: unknown },
  allowedOrigin: string,
): EmbedMessage | null {
  if (event.origin !== allowedOrigin) return null
  const d = event.data as Record<string, unknown> | null
  if (!d || typeof d !== 'object' || d.source !== EMBED_MESSAGE_SOURCE) return null
  if (d.type === 'ready') return { type: 'ready' }
  if (d.type === 'purchase') return { type: 'purchase' }
  if (d.type === 'resize' && typeof d.height === 'number' && Number.isFinite(d.height) && d.height > 0) {
    return { type: 'resize', height: d.height }
  }
  return null
}

/**
 * IG/FB-family in-app webview detection (Instagram, Facebook app / FB_IAB,
 * Messenger). Deliberately narrow: these are the webviews our ad traffic
 * actually arrives in; unknown browsers get the embed (with the redirect
 * fallback as the safety net).
 */
export function isInAppWebview(ua: string): boolean {
  return /\bFBAN\b|\bFBAV\b|\bFB_IAB\b|Instagram|MessengerForiOS|\bFBAN\/Messenger/i.test(ua)
}
