import * as path from 'node:path'
import { hairquizSpec } from '../quiz/hairquiz.spec'
import { validateSpec } from './validate'
import { auditSpec, collectImages, type AuditFinding } from './audit'

/**
 * Backs `npm run audit`. Runs the hard `validateSpec` gate THEN the softer
 * `auditSpec` QC layer on the REAL production spec, prints findings grouped by
 * level, and exits 1 if anything is an error (validate errors OR audit `error`).
 *
 * Optional `--images` flag: additionally HEAD-checks each spec image URL for
 * HTTP reachability and reports `warn`/`image-unreachable` on a non-200 (async;
 * only runs with the flag — the default audit stays pure/deterministic).
 */

// ANSI helpers (degrade gracefully when not a TTY).
const useColor = process.stdout.isTTY
const red = (s: string) => (useColor ? `\x1b[31m${s}\x1b[0m` : s)
const yellow = (s: string) => (useColor ? `\x1b[33m${s}\x1b[0m` : s)
const dim = (s: string) => (useColor ? `\x1b[2m${s}\x1b[0m` : s)
const bold = (s: string) => (useColor ? `\x1b[1m${s}\x1b[0m` : s)

function printFinding(f: AuditFinding): void {
  const loc = f.location ? dim(` (${f.location})`) : ''
  console.log(`  - [${f.code}] ${f.message}${loc}`)
}

async function checkImageReachability(): Promise<AuditFinding[]> {
  const images = collectImages(hairquizSpec)
  const out: AuditFinding[] = []
  await Promise.all(
    images.map(async ({ url, location }) => {
      if (!url.startsWith('https://')) return // already an error from checkImages
      try {
        const res = await fetch(url, { method: 'HEAD' })
        if (!res.ok) {
          out.push({
            level: 'warn',
            code: 'image-unreachable',
            message: `HEAD ${url} returned HTTP ${res.status}`,
            location,
          })
        }
      } catch (err) {
        out.push({
          level: 'warn',
          code: 'image-unreachable',
          message: `HEAD ${url} failed: ${err instanceof Error ? err.message : String(err)}`,
          location,
        })
      }
    }),
  )
  return out
}

async function main(): Promise<void> {
  const withImages = process.argv.includes('--images')

  // The quiz folder basename (e.g. `long-hair-v1`) supplies the quiz slug so the
  // audit can reject ids that carry the quiz identifier as a prefix.
  const quizSlug = path.basename(process.cwd())
  const validateErrors = validateSpec(hairquizSpec)
  const findings = auditSpec(hairquizSpec, { quizSlug })

  if (withImages) {
    findings.push(...(await checkImageReachability()))
  }

  // validate errors surface as audit-style error findings for unified output.
  const allErrors: AuditFinding[] = [
    ...validateErrors.map<AuditFinding>(message => ({ level: 'error', code: 'validate', message })),
    ...findings.filter(f => f.level === 'error'),
  ]
  const warns = findings.filter(f => f.level === 'warn')
  const infos = findings.filter(f => f.level === 'info')

  if (allErrors.length > 0) {
    console.log(red(bold(`\nERRORS (${allErrors.length}):`)))
    allErrors.forEach(printFinding)
  }
  if (warns.length > 0) {
    console.log(yellow(bold(`\nWARNINGS (${warns.length}):`)))
    warns.forEach(printFinding)
  }
  if (infos.length > 0) {
    console.log(bold(`\nINFO (${infos.length}):`))
    infos.forEach(printFinding)
  }

  console.log(
    `\naudit: ${allErrors.length} error(s), ${warns.length} warning(s), ${infos.length} info(s)`,
  )

  if (allErrors.length > 0) {
    console.log(red('audit FAILED'))
    process.exit(1)
  }
  console.log('audit passed')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
