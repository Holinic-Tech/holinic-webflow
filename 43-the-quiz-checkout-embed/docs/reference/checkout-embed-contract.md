# Embedded-checkout contract (43-the-quiz-checkout-embed)

This clone embeds the live FunnelKit checkout (`checkout.hairqare.co/buy/…`) in a
same-site iframe on the result page instead of redirecting. Everything server-side
(Stripe/PayPal, account creation/SSO, FB CAPI, Converge, bumps, upsells) runs
unchanged because the checkout still runs on its own origin. The WordPress/Cloudflare
counterpart lives in the `pricing-by-country` repo under `embed/` (bridge plugin +
frame-ancestors Transform Rule + deploy checklist).

## Spec config

`spec.checkout.embed` (see `CheckoutEmbedConfig` in `src/spec/types.ts`):

| Key | Default | Meaning |
|---|---|---|
| `enabled` | — | `false`/absent = byte-identical legacy redirect build |
| `mode` | `modal` | `modal` = full-screen sheet (iframe is the only scroller); `inline` = in-flow section auto-sized by resize messages |
| `base` | `checkout.base` | iframe document URL |
| `preload` | `onIntent` | `onIntent` = mount hidden on first scroll/tap on the result page; `onResult` = at result mount (fires checkout pixels for ALL result viewers — re-baselines funnel metrics); `none` = on CTA click |
| `loadTimeoutMs` | `8000` | opened-but-not-ready wait before the redirect fallback |
| `allowedOrigin` | `https://checkout.hairqare.co` | postMessage trust origin |
| `redirectInWebview` | `false` | IG/FB in-app webviews are ~45% of traffic and the PRIMARY target — flip to `true` only if in-webview testing fails |

## postMessage protocol (v1)

Child (any funnel page on checkout.hairqare.co, script = bridge plugin) → parent.
Parent accepts only `event.origin === allowedOrigin && data.source === 'hairqare-checkout'`
(`parseEmbedMessage` in `src/tracking/embed.ts`):

```
{ source:'hairqare-checkout', v:1, type:'ready' }                 → skeleton off, fallback timer cleared
{ source:'hairqare-checkout', v:1, type:'resize', height:<px> }   → inline frame height (modal ignores)
{ source:'hairqare-checkout', v:1, type:'purchase' }              → v1: NOTHING fires (checkout's GTM owns purchase events)
```

No parent→child messages in v1.

## URLs

- `buildEmbedCheckoutUrl` (src/tracking/checkout.ts) = the redirect URL's exact params
  (billing prefill, `aero-coupons`, `__cvg_uid/sid`) **plus `hq_embed=1`** — the flag
  the bridge plugin uses to mark the Woo session embedded (first-test policy hides
  PayPal for embedded sessions only).
- The result page's Speculation-Rules/prefetch warms this exact URL when the embed is
  enabled, so the hidden iframe loads from cache.

## Tracking invariants (unchanged — sacred)

- All three CTAs fire their GA events byte-identically BEFORE the embed decision:
  `'Go to  checkout'` (TWO spaces, dashboard + plan dialog), `'Go to checkout'`
  (ONE space, timer). The store hook (`CreateQuizStoreOptions.onCheckout`) only
  replaces the *redirect*, never the event.
- `confirmSkip` (mid-quiz skip) always redirects — the embed exists only on the
  result page.
- The parent fires NO new analytics events for embed lifecycle in v1.

## Fallback chain

1. `embed.enabled: false` → legacy build (one-line rollback).
2. `redirectInWebview: true` + IG/FB webview UA → legacy redirect for those users.
3. Opened but no `ready` within `loadTimeoutMs` → sheet closes, spinner overlay +
   legacy redirect (same UX as today). A user closing the sheet themselves does NOT
   trigger the fallback.

## Known-risk checklist (manual, on the deployed clone)

- IG + FB in-app webviews: modal renders, Stripe fields usable, purchase completes
  (FIRST gate — before judging the embed).
- iOS Safari: Apple Pay via `allow="payment"`; PayPal only after re-enabling it on
  the WP side with a verified redirect-mode flow.
- Purchase → /offer/ upsell → thank-you stays inside the frame without blanking
  (proves the frame-ancestors rule covers the whole flow).
