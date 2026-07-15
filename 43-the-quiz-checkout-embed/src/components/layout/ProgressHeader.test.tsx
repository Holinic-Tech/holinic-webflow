import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProgressHeader } from './ProgressHeader'

describe('ProgressHeader', () => {
  it('always renders the centered HAIRQARE logo image', () => {
    render(<ProgressHeader showBack={false} showProgress={false} current={0} total={4} onBack={() => {}} />)
    const logo = screen.getByAltText('Hairqare')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/brand/hairqare-logo.webp')
  })

  it('renders the progress bar as SEGMENTS (segmented, not a single fill)', () => {
    render(<ProgressHeader showBack showProgress current={3} total={6} onBack={() => {}} />)
    const bar = screen.getByRole('progressbar')
    // 6 equal segments; half filled (plum) at current 3 / total 6.
    expect(bar.children).toHaveLength(6)
    const filled = Array.from(bar.children).filter((c) => c.className.includes('bg-plum'))
    expect(filled).toHaveLength(3)
  })

  it('renders a back button only when showBack is true', () => {
    const { rerender } = render(
      <ProgressHeader showBack={false} showProgress current={1} total={4} onBack={() => {}} />,
    )
    expect(screen.queryByRole('button', { name: /back/i })).toBeNull()
    rerender(<ProgressHeader showBack showProgress current={1} total={4} onBack={() => {}} />)
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('calls onBack when the back button is tapped', () => {
    const onBack = vi.fn()
    render(<ProgressHeader showBack showProgress current={2} total={4} onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('renders a progressbar reflecting current/total only when showProgress', () => {
    const { rerender } = render(
      <ProgressHeader showBack showProgress={false} current={2} total={4} onBack={() => {}} />,
    )
    expect(screen.queryByRole('progressbar')).toBeNull()
    rerender(<ProgressHeader showBack showProgress current={2} total={4} onBack={() => {}} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '2')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '4')
  })
})
