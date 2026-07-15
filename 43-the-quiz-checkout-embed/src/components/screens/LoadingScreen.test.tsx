import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { LoadingScreen } from './LoadingScreen'

describe('LoadingScreen', () => {
  it('renders the messages', () => {
    render(<LoadingScreen messages={['Checking…', 'Analyzing…']} durationMs={3000} onDone={() => {}} />)
    expect(screen.getByText('Checking…')).toBeInTheDocument()
    expect(screen.getByText('Analyzing…')).toBeInTheDocument()
  })

  it('calls onDone exactly once after durationMs', () => {
    vi.useFakeTimers()
    const onDone = vi.fn()
    render(<LoadingScreen messages={['Checking…']} durationMs={3000} onDone={onDone} />)
    expect(onDone).not.toHaveBeenCalled()
    vi.advanceTimersByTime(2999)
    expect(onDone).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onDone).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(5000)
    expect(onDone).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('renders the title + checkpoints (preferred over messages) and a carousel', () => {
    const { container } = render(
      <LoadingScreen
        messages={['legacy']}
        durationMs={3000}
        onDone={() => {}}
        title="The only haircare program you'll ever need"
        checkpoints={['Checking your hair condition', 'Analysing your routine']}
        carouselImages={['https://example.com/a.webp', 'https://example.com/b.webp']}
      />,
    )
    expect(screen.getByText("The only haircare program you'll ever need")).toBeInTheDocument()
    expect(screen.getByText('Checking your hair condition')).toBeInTheDocument()
    expect(screen.getByText('Analysing your routine')).toBeInTheDocument()
    // legacy `messages` is NOT used when checkpoints are present
    expect(screen.queryByText('legacy')).not.toBeInTheDocument()
    expect(container.querySelectorAll('img').length).toBe(2)
  })

  it('clears its timer on unmount (onDone not called)', () => {
    vi.useFakeTimers()
    const onDone = vi.fn()
    const { unmount } = render(
      <LoadingScreen messages={['Checking…']} durationMs={3000} onDone={onDone} />,
    )
    unmount()
    vi.advanceTimersByTime(5000)
    expect(onDone).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
