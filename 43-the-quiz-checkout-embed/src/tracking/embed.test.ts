import { describe, it, expect } from 'vitest'
import { parseEmbedMessage, resolveEmbedConfig, isInAppWebview, EMBED_MESSAGE_SOURCE, EMBED_DEFAULTS } from './embed'
import type { CheckoutConfig } from '../spec/types'

const ORIGIN = 'https://checkout.hairqare.co'
const msg = (data: unknown, origin = ORIGIN) => ({ origin, data })

describe('parseEmbedMessage', () => {
  it('accepts ready/purchase/resize from the exact origin with the source marker', () => {
    expect(parseEmbedMessage(msg({ source: EMBED_MESSAGE_SOURCE, v: 1, type: 'ready' }), ORIGIN)).toEqual({ type: 'ready' })
    expect(parseEmbedMessage(msg({ source: EMBED_MESSAGE_SOURCE, v: 1, type: 'purchase' }), ORIGIN)).toEqual({ type: 'purchase' })
    expect(parseEmbedMessage(msg({ source: EMBED_MESSAGE_SOURCE, v: 1, type: 'resize', height: 812 }), ORIGIN)).toEqual({ type: 'resize', height: 812 })
  })

  it('rejects wrong origin — even a subdomain sibling or http downgrade', () => {
    const data = { source: EMBED_MESSAGE_SOURCE, v: 1, type: 'ready' }
    expect(parseEmbedMessage(msg(data, 'https://evil.example.com'), ORIGIN)).toBeNull()
    expect(parseEmbedMessage(msg(data, 'https://join.hairqare.co'), ORIGIN)).toBeNull()
    expect(parseEmbedMessage(msg(data, 'http://checkout.hairqare.co'), ORIGIN)).toBeNull()
  })

  it('rejects missing/foreign source markers and malformed shapes', () => {
    expect(parseEmbedMessage(msg({ type: 'ready' }), ORIGIN)).toBeNull()
    expect(parseEmbedMessage(msg({ source: 'other-widget', type: 'ready' }), ORIGIN)).toBeNull()
    expect(parseEmbedMessage(msg(null), ORIGIN)).toBeNull()
    expect(parseEmbedMessage(msg('ready'), ORIGIN)).toBeNull()
    expect(parseEmbedMessage(msg({ source: EMBED_MESSAGE_SOURCE, type: 'resize', height: 'tall' }), ORIGIN)).toBeNull()
    expect(parseEmbedMessage(msg({ source: EMBED_MESSAGE_SOURCE, type: 'resize', height: -5 }), ORIGIN)).toBeNull()
    expect(parseEmbedMessage(msg({ source: EMBED_MESSAGE_SOURCE, type: 'navigate' }), ORIGIN)).toBeNull()
  })
})

describe('resolveEmbedConfig', () => {
  const base: CheckoutConfig = { base: 'https://checkout.hairqare.co/buy/x/', couponRules: [], defaultCoupon: 'o_df' }

  it('returns null when absent or disabled', () => {
    expect(resolveEmbedConfig(base)).toBeNull()
    expect(resolveEmbedConfig({ ...base, embed: { enabled: false } })).toBeNull()
  })

  it('fills defaults (modal, onIntent, 8s, checkout origin, embed-in-webviews)', () => {
    expect(resolveEmbedConfig({ ...base, embed: { enabled: true } })).toEqual({
      mode: 'modal',
      base: base.base,
      preload: EMBED_DEFAULTS.preload,
      loadTimeoutMs: EMBED_DEFAULTS.loadTimeoutMs,
      allowedOrigin: EMBED_DEFAULTS.allowedOrigin,
      redirectInWebview: false,
    })
  })

  it('honors overrides', () => {
    const r = resolveEmbedConfig({
      ...base,
      embed: { enabled: true, mode: 'inline', base: 'https://checkout.hairqare.co/e/', preload: 'none', loadTimeoutMs: 3000, redirectInWebview: true },
    })
    expect(r).toMatchObject({ mode: 'inline', base: 'https://checkout.hairqare.co/e/', preload: 'none', loadTimeoutMs: 3000, redirectInWebview: true })
  })
})

describe('isInAppWebview', () => {
  it('detects IG/FB-family webviews', () => {
    expect(isInAppWebview('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 320.0.0.0')).toBe(true)
    expect(isInAppWebview('Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 [FB_IAB/FB4A;FBAV/450.0.0.0;]')).toBe(true)
    expect(isInAppWebview('Mozilla/5.0 [FBAN/FBIOS;FBAV/450.0]')).toBe(true)
  })

  it('passes real browsers through', () => {
    expect(isInAppWebview('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1')).toBe(false)
    expect(isInAppWebview('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36')).toBe(false)
  })
})
