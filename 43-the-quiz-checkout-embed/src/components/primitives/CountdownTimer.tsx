import { useEffect, useRef, useState } from 'react'

/**
 * Presentational countdown timer. Counts DOWN once per second from the initial
 * `secondsLeft` using its own internal interval, rendering the remaining time as
 * `mm:ss`. When it reaches 0 it calls `onExpire` exactly once and stops. The
 * interval is cleared on unmount. It knows NOTHING about the spec, answers, or
 * progression — the parent decides what expiry does.
 */
export interface CountdownTimerProps {
  secondsLeft: number
  onExpire?: () => void
}

function formatMmSs(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds)
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(minutes)}:${pad(seconds)}`
}

export function CountdownTimer({ secondsLeft, onExpire }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(secondsLeft)

  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire
  const expiredRef = useRef(false)

  useEffect(() => {
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true
        onExpireRef.current?.()
      }
      return
    }
    const id = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [remaining])

  return (
    <span className="font-mono tabular-nums" aria-live="polite">
      {formatMmSs(remaining)}
    </span>
  )
}
