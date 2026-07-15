import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, REGISTER_ADVANCE_MS } from './motion'

/**
 * "Register-then-advance" for auto-advancing single/image/rating screens.
 *
 * On an auto-progression screen a tap used to navigate INSTANTLY, which reads as
 * a jarring jump. This hook delays the advance by {@link REGISTER_ADVANCE_MS} so
 * the tapped option can flash a "registered" (selected) visual state first.
 *
 * Returns `[pendingId, select]`:
 *  - `pendingId` — the answerId currently flashing its registered state (or null).
 *    Components style the option with this (highlight / scale / checkmark).
 *  - `select(id)` — call on tap; it records `pendingId` then fires `onSelect(id)`
 *    after the delay (immediately under reduced motion, so e2e timing is unchanged).
 *
 * Re-taps while a selection is pending are ignored (the first wins). The pending
 * timer is cleared on unmount so a navigated-away screen never fires late.
 */
export function useRegisterThenAdvance(
  onSelect: (id: string) => void,
): [string | null, (id: string) => void] {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const select = (id: string) => {
    if (pendingId !== null) return
    setPendingId(id)
    const fire = () => onSelectRef.current(id)
    if (prefersReducedMotion()) {
      fire()
      return
    }
    timerRef.current = setTimeout(fire, REGISTER_ADVANCE_MS)
  }

  return [pendingId, select]
}
