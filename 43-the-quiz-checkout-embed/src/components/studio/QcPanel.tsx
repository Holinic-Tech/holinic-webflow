import type { AuditFinding } from '../../spec/audit'

/**
 * QC panel: the audit findings whose `location` mentions the selected screen's
 * id, grouped by level. The total error/warn counts across the WHOLE spec are
 * shown by {@link QcSummaryBadge} in the Studio header.
 */
export interface QcPanelProps {
  screenId: string
  findings: AuditFinding[]
}

export const LEVEL_STYLE: Record<AuditFinding['level'], string> = {
  error: 'border-red-300 bg-red-50 text-red-700',
  warn: 'border-amber-300 bg-amber-50 text-amber-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
}

export function QcPanel({ screenId, findings }: QcPanelProps) {
  // `location` looks like: screen 's_damage_pitch' › body
  const mine = findings.filter((f) => f.location?.includes(`'${screenId}'`))
  if (mine.length === 0) {
    return <p className="text-xs text-gray-400">No QC findings for this screen. ✓</p>
  }
  const order: AuditFinding['level'][] = ['error', 'warn', 'info']
  return (
    <div className="flex flex-col gap-1.5">
      {order.flatMap((level) =>
        mine
          .filter((f) => f.level === level)
          .map((f, i) => (
            <div key={`${level}:${i}`} className={`rounded-md border p-2 text-xs ${LEVEL_STYLE[level]}`}>
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase">{level}</span>
                <code className="font-mono text-[10px]">{f.code}</code>
              </div>
              <p className="mt-0.5">{f.message}</p>
              {f.location && <p className="mt-0.5 text-[10px] opacity-70">{f.location}</p>}
            </div>
          )),
      )}
    </div>
  )
}

/** Top-level count badge of total errors / warns across the spec. Clickable when `onClick` is provided. */
export function QcSummaryBadge({
  findings,
  onClick,
}: {
  findings: AuditFinding[]
  onClick?: () => void
}) {
  const errors = findings.filter((f) => f.level === 'error').length
  const warns = findings.filter((f) => f.level === 'warn').length
  const inner = (
    <>
      <span className={`rounded px-2 py-0.5 ${errors ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        {errors} errors
      </span>
      <span className={`rounded px-2 py-0.5 ${warns ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
        {warns} warns
      </span>
    </>
  )
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 rounded p-0.5 text-xs font-semibold hover:ring-2 hover:ring-plum/30"
        title="View all QC findings"
      >
        {inner}
      </button>
    )
  }
  return <div className="flex items-center gap-2 text-xs font-semibold">{inner}</div>
}
