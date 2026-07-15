import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CountdownTimer } from './CountdownTimer'

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('CountdownTimer', () => {
  it('renders the initial time as mm:ss', () => {
    render(<CountdownTimer secondsLeft={90} />)
    expect(screen.getByText('01:30')).toBeInTheDocument()
  })

  it('pads single-digit minutes and seconds', () => {
    render(<CountdownTimer secondsLeft={5} />)
    expect(screen.getByText('00:05')).toBeInTheDocument()
  })

  it('decrements once per second', () => {
    vi.useFakeTimers()
    render(<CountdownTimer secondsLeft={90} />)
    expect(screen.getByText('01:30')).toBeInTheDocument()
    advance(1000)
    expect(screen.getByText('01:29')).toBeInTheDocument()
    advance(2000)
    expect(screen.getByText('01:27')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('calls onExpire exactly once when it reaches 0 and stops', () => {
    vi.useFakeTimers()
    const onExpire = vi.fn()
    render(<CountdownTimer secondsLeft={2} onExpire={onExpire} />)
    expect(screen.getByText('00:02')).toBeInTheDocument()
    advance(1000)
    expect(screen.getByText('00:01')).toBeInTheDocument()
    expect(onExpire).not.toHaveBeenCalled()
    advance(1000)
    expect(screen.getByText('00:00')).toBeInTheDocument()
    expect(onExpire).toHaveBeenCalledTimes(1)
    // stopped: further time does not re-fire
    advance(5000)
    expect(onExpire).toHaveBeenCalledTimes(1)
    expect(screen.getByText('00:00')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('clears its interval on unmount (onExpire not called)', () => {
    vi.useFakeTimers()
    const onExpire = vi.fn()
    const { unmount } = render(<CountdownTimer secondsLeft={2} onExpire={onExpire} />)
    unmount()
    vi.advanceTimersByTime(5000)
    expect(onExpire).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
