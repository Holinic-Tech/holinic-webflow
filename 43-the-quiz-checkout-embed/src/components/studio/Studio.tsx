import { useMemo, useState } from 'react'
import type { QuizSpec } from '../../spec/types'
import type { AnswerState } from '../../engine/answers'
import { auditSpec, type AuditFinding } from '../../spec/audit'
import { canonicalScreenType, screenDependencies } from './introspect'
import { buildClaudeContext } from './claudeContext'
import { StudioPreview } from './StudioPreview'
import { PersonaPanel } from './PersonaPanel'
import { BranchPanel } from './BranchPanel'
import { QcPanel, QcSummaryBadge, LEVEL_STYLE } from './QcPanel'
import { TemplateLibrary } from './TemplateLibrary'

/**
 * The Studio — a marketer's read-only tool to browse every screen, flip any
 * condition/persona, preview exactly what a user would see (with fallbacks
 * flagged), see QC results, and a template library. Mounted at `?studio` in DEV
 * only (see main.tsx) so it is tree-shaken out of production bundles.
 *
 * It reuses the REAL screen components + engine: the center preview is rendered
 * by StudioPreview (ScreenRenderer + FitViewport + the real ResultDashboard), the
 * branch indicator reuses `explainConditional`, and QC reuses `auditSpec`.
 */
export interface StudioProps {
  spec: QuizSpec
}

type Tab = 'flow' | 'library'

export function Studio({ spec }: StudioProps) {
  const [tab, setTab] = useState<Tab>('flow')
  const [selected, setSelected] = useState(0)
  const [persona, setPersona] = useState<AnswerState>({})
  const [copied, setCopied] = useState(false)
  const [showAllFindings, setShowAllFindings] = useState(false)

  const findings = useMemo(() => auditSpec(spec), [spec])
  const screen = spec.screens[selected]

  const copyContext = async () => {
    const text = buildClaudeContext(screen, persona)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Clipboard may be blocked (insecure context / permissions) — fall back to a prompt.
      window.prompt('Copy context for Claude:', text)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="min-h-screen bg-dove text-rich-black">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-neutral-200 bg-white/90 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">
            Quiz Studio <span className="font-mono text-xs font-normal text-gray-400">{spec.id}</span>
          </h1>
          <QcSummaryBadge findings={findings} onClick={() => setShowAllFindings(true)} />
        </div>
        <nav className="flex items-center gap-1 rounded-full bg-neutral-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setTab('flow')}
            data-testid="tab-flow"
            className={`rounded-full px-4 py-1 font-medium ${tab === 'flow' ? 'bg-plum text-white' : 'text-gray-600'}`}
          >
            Flow
          </button>
          <button
            type="button"
            onClick={() => setTab('library')}
            data-testid="tab-library"
            className={`rounded-full px-4 py-1 font-medium ${tab === 'library' ? 'bg-plum text-white' : 'text-gray-600'}`}
          >
            Template library
          </button>
        </nav>
      </header>

      {tab === 'library' ? (
        <main className="p-6">
          <p className="mb-4 max-w-2xl text-sm text-gray-600">
            Every screen TYPE and answer style, captioned with the canonical name a marketer or
            Claude uses. This is the shared vocabulary surface.
          </p>
          <TemplateLibrary />
        </main>
      ) : (
        <main className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
          {/* LEFT — flow list */}
          <aside className="flex max-h-[calc(100vh-120px)] flex-col gap-1 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-2">
            {spec.screens.map((s, i) => {
              const deps = screenDependencies(s)
              return (
                <button
                  key={s.id}
                  type="button"
                  data-testid={`flow-item-${s.id}`}
                  onClick={() => setSelected(i)}
                  className={`flex flex-col gap-0.5 rounded-md border px-2.5 py-2 text-left ${
                    i === selected ? 'border-plum bg-violet' : 'border-transparent hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-gray-400">{i}</span>
                    <code className="text-xs font-semibold">{s.id}</code>
                  </div>
                  <div className="text-[11px] text-plum">{canonicalScreenType(s)}</div>
                  {deps.length > 0 && (
                    <div className="text-[10px] text-gray-400">depends on: {deps.join(', ')}</div>
                  )}
                </button>
              )
            })}
          </aside>

          {/* CENTER — live preview */}
          <section className="flex flex-col items-center gap-3">
            <div className="flex w-full items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  {selected}. <code>{screen.id}</code>
                </h2>
                <p className="text-xs text-gray-500">
                  {canonicalScreenType(screen)}
                  {screen.kind === 'pitch' && ` — "${screen.label}"`}
                </p>
              </div>
              <button
                type="button"
                onClick={copyContext}
                data-testid="copy-context"
                className="rounded-md border border-plum/40 bg-violet px-3 py-1.5 text-xs font-medium text-plum hover:bg-plum hover:text-white"
              >
                {copied ? 'Copied ✓' : 'Copy context for Claude'}
              </button>
            </div>
            <StudioPreview spec={spec} screenIndex={selected} persona={persona} />
          </section>

          {/* RIGHT — persona + branch + QC */}
          <aside className="flex max-h-[calc(100vh-120px)] flex-col gap-5 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Persona</h3>
              <PersonaPanel spec={spec} persona={persona} onChange={setPersona} />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Branches / fallbacks
              </h3>
              <BranchPanel screen={screen} persona={persona} />
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">QC</h3>
              <QcPanel screenId={screen.id} findings={findings} />
            </div>
          </aside>
        </main>
      )}

      {/* ── All-findings overlay ───────────────────────────────────── */}
      {showAllFindings && (() => {
        const order: AuditFinding['level'][] = ['error', 'warn', 'info']
        const sorted = order.flatMap((lvl) => findings.filter((f) => f.level === lvl))
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
            onClick={() => setShowAllFindings(false)}
          >
            <div
              className="flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
                <h2 className="text-sm font-semibold text-rich-black">
                  All QC findings{' '}
                  <span className="font-normal text-gray-400">({findings.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAllFindings(false)}
                  className="rounded px-2 py-0.5 text-gray-400 hover:bg-neutral-100 hover:text-rich-black"
                >
                  ✕
                </button>
              </div>
              {/* Findings list */}
              <div className="flex flex-col gap-1.5 overflow-y-auto p-4">
                {sorted.length === 0 && (
                  <p className="text-xs text-gray-400">No findings. ✓</p>
                )}
                {sorted.map((f, i) => (
                  <div key={i} className={`rounded-md border p-2 text-xs ${LEVEL_STYLE[f.level]}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold uppercase">{f.level}</span>
                      <code className="font-mono text-[10px]">{f.code}</code>
                    </div>
                    <p className="mt-0.5">{f.message}</p>
                    {f.location && (
                      <p className="mt-0.5 text-[10px] opacity-60">{f.location}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
