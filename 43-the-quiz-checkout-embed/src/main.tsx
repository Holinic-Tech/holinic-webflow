import { StrictMode, Suspense, lazy, useState, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QuizApp } from './components/QuizApp.tsx'
import { IntroLoader } from './components/IntroLoader.tsx'
import { PreviewGallery } from './components/preview/PreviewGallery.tsx'
import { hairquizSpec } from './quiz/hairquiz.spec.ts'

// `/?preview` mounts the isolated component gallery; the default route mounts
// the live quiz (the REAL production spec).
const isPreview = location.search.includes('preview')

// `/?result-v2` mounts the aspirational result page preview with a persona
// switcher — for review and comparison with the control, before swapping in.
const isResultV2 = location.search.includes('result-v2')

// `/?studio` mounts the marketer Studio — but ONLY in DEV. Gating the dynamic
// import on `import.meta.env.DEV` means the Studio (and everything it pulls in
// that the quiz doesn't already use) is tree-shaken OUT of the production bundle.
const isStudio = import.meta.env.DEV && location.search.includes('studio')

/**
 * App root: shows the INTRO OVERLAY preloader (reproducing the original
 * `preloader4.js`) on mount, then reveals the quiz once it calls `onDone`. The
 * intro auto-finishes instantly under reduced motion (the e2e harness), so the
 * golden walk goes straight to the quiz. The intro is a pure overlay — no
 * tracking, no spec/flow change.
 */
function Root() {
  const [introDone, setIntroDone] = useState(false)
  return (
    <>
      <QuizApp spec={hairquizSpec} />
      {!introDone && <IntroLoader onDone={() => setIntroDone(true)} />}
    </>
  )
}

// DEV-only lazy Studio. `import.meta.env.DEV` is a static `false` in a production
// build, so this `lazy(() => import(...))` branch is dead code there and Rollup
// drops the chunk entirely — the Studio never ships to users.
const Studio = import.meta.env.DEV
  ? lazy(() => import('./components/studio/Studio.tsx').then((m) => ({ default: m.Studio })))
  : (null as unknown as React.ComponentType<{ spec: typeof hairquizSpec }>)

// Lazy-load the v2 preview — it only runs when explicitly requested.
const ResultV2Preview = lazy(() =>
  import('./components/result/ResultV2Preview.tsx').then((m) => ({ default: m.ResultV2Preview })),
)

let tree: ReactNode
if (isStudio) {
  tree = (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading Studio…</div>}>
      <Studio spec={hairquizSpec} />
    </Suspense>
  )
} else if (isResultV2) {
  tree = (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
      <ResultV2Preview />
    </Suspense>
  )
} else if (isPreview) {
  tree = <PreviewGallery />
} else {
  tree = <Root />
}

createRoot(document.getElementById('root')!).render(<StrictMode>{tree}</StrictMode>)
