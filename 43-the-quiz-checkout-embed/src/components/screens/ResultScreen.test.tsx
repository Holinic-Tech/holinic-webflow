import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ResultScreen } from './ResultScreen'

describe('ResultScreen', () => {
  it('renders its children', () => {
    render(
      <ResultScreen>
        <div>Your hair score is 72%</div>
      </ResultScreen>,
    )
    expect(screen.getByText('Your hair score is 72%')).toBeInTheDocument()
  })

  it('fills its scroll ancestor (min-h-full flow column), not fit-scaled', () => {
    // The result screen no longer owns its own scroll container — the single
    // scroller is the result wrapper in QuizApp — so `position: sticky` on the
    // timer pins to the visible viewport bottom during scroll. Here we assert the
    // screen is a min-h-full flow column (so the sticky bar bottoms out).
    const { container } = render(
      <ResultScreen>
        <div>content</div>
      </ResultScreen>,
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain('min-h-full')
    expect(root.className).toContain('flex-col')
  })

  it('renders an optional sticky DARK timer slot', () => {
    const { container } = render(
      <ResultScreen timer={<div>02:00</div>}>
        <div>content</div>
      </ResultScreen>,
    )
    expect(screen.getByText('02:00')).toBeInTheDocument()
    // The timer bar is dark (near-black) with a sticky-bottom anchor.
    const bar = container.querySelector('.sticky.bottom-0')
    expect(bar).not.toBeNull()
    expect(bar?.className).toContain('bg-rich-black')
  })
})
