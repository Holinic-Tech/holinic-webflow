import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { IntroLoader } from './IntroLoader'

describe('IntroLoader', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('renders the original title and all four value cards', () => {
    render(<IntroLoader onDone={vi.fn()} />)
    expect(
      screen.getByText('Find out if the Haircare Challenge is right for you ✨'),
    ).toBeInTheDocument()
    expect(screen.getByText('🚫 No more hidden harmful ingredients.')).toBeInTheDocument()
    expect(
      screen.getByText('🌱 Reduced hair loss and new baby hair growth.'),
    ).toBeInTheDocument()
    expect(screen.getByText("🔬 Split ends that don't come back.")).toBeInTheDocument()
    expect(screen.getByText('💛 The best of science, made easy at home.')).toBeInTheDocument()
    expect(screen.getByText('Personal space loading')).toBeInTheDocument()
  })

  it('reveals cards one at a time and finishes after ~5s', () => {
    const onDone = vi.fn()
    render(<IntroLoader onDone={onDone} />)

    // No card shown initially (matchMedia is unmocked in jsdom → not reduced).
    const cards = () => screen.queryAllByText(/./, { selector: '[data-intro-card="shown"]' })
    expect(cards()).toHaveLength(0)

    act(() => {
      vi.advanceTimersByTime(1250)
    })
    expect(cards()).toHaveLength(1)
    act(() => {
      vi.advanceTimersByTime(1250 * 3)
    })
    expect(cards()).toHaveLength(4)

    // After the full duration (1250 × 4) onDone fires exactly once.
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
