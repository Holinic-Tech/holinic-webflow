import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizApp } from './QuizApp'
import { hairquizSpec } from '../quiz/hairquiz.spec'

// jsdom throws on real navigation, so stub `window.location.href` (the sink of
// redirectToCheckout) before any skip-confirm test triggers a redirect.
beforeEach(() => {
  ;(window as any).dataLayer = []
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...window.location, href: '', search: '', assign: vi.fn() },
  })
})

const fired = (event: string) =>
  (window.dataLayer as any[]).some((e) => e.event === event)

describe('QuizApp skip wiring (start screen)', () => {
  it('renders a skip trigger on screen 0', () => {
    render(<QuizApp spec={hairquizSpec} />)
    expect(screen.getByRole('button', { name: /skip the quiz/i })).toBeInTheDocument()
  })

  it('activating the skip trigger fires Opened Skip Dialog and opens the modal', () => {
    render(<QuizApp spec={hairquizSpec} />)
    // Modal not shown until the trigger is activated.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /skip the quiz/i }))

    expect(fired('Opened Skip Dialog')).toBe(true)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('confirming the skip fires SkipQuiz', () => {
    render(<QuizApp spec={hairquizSpec} />)
    fireEvent.click(screen.getByRole('button', { name: /skip the quiz/i }))
    fireEvent.click(screen.getByRole('button', { name: 'SKIP QUIZ' }))
    expect(fired('SkipQuiz')).toBe(true)
  })

  it('dismissing the skip fires Closed Skip Dialog and closes the modal', () => {
    render(<QuizApp spec={hairquizSpec} />)
    fireEvent.click(screen.getByRole('button', { name: /skip the quiz/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'BACK TO QUIZ' }))

    expect(fired('Closed Skip Dialog')).toBe(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
