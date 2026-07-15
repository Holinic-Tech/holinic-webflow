import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SingleChoiceScreen } from './SingleChoiceScreen'

const answers = [
  { answerId: 'a1', label: 'Less than $10' },
  { answerId: 'a2', label: 'More than $50' },
]

describe('SingleChoiceScreen — auto progression (default)', () => {
  it('renders the prompt and every option', () => {
    render(<SingleChoiceScreen prompt="Pick" answers={answers} onSelect={() => {}} />)
    expect(screen.getByText('Pick')).toBeInTheDocument()
    expect(screen.getByText('Less than $10')).toBeInTheDocument()
    expect(screen.getByText('More than $50')).toBeInTheDocument()
  })

  it('tapping an option calls onSelect with the answerId (after register-then-advance)', async () => {
    const onSelect = vi.fn()
    render(<SingleChoiceScreen prompt="Pick" answers={answers} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Less than $10'))
    // Auto screens flash a "registered" state, then advance after a short delay.
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith('a1'))
  })

  it('does NOT render a reveal or Continue button (auto advances on tap)', () => {
    render(<SingleChoiceScreen prompt="Pick" answers={answers} onSelect={() => {}} />)
    expect(screen.queryByRole('button', { name: /continue/i })).toBeNull()
  })
})

describe('SingleChoiceScreen — cta progression (reveal + Continue)', () => {
  it('before a selection: shows NO reveal text and NO Continue', () => {
    render(
      <SingleChoiceScreen
        prompt="Pick"
        answers={answers}
        onSelect={() => {}}
        progression="cta"
        reveal="Awesome 🤩"
        selected={[]}
      />,
    )
    expect(screen.queryByText('Awesome 🤩')).toBeNull()
    expect(screen.queryByRole('button', { name: /continue/i })).toBeNull()
  })

  it('after a selection: shows the resolved reveal text (Continue is the chrome sticky CTA, not here)', () => {
    render(
      <SingleChoiceScreen
        prompt="Pick"
        answers={answers}
        onSelect={() => {}}
        progression="cta"
        reveal="Awesome 🤩 you're budget conscious!"
        selected={['a1']}
      />,
    )
    expect(screen.getByText("Awesome 🤩 you're budget conscious!")).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /continue/i })).toBeNull()
  })

  it('tapping an option still calls onSelect (record) — it does not advance itself', () => {
    const onSelect = vi.fn()
    render(
      <SingleChoiceScreen
        prompt="Pick"
        answers={answers}
        onSelect={onSelect}
        progression="cta"
        reveal="Awesome"
        selected={[]}
      />,
    )
    fireEvent.click(screen.getByText('More than $50'))
    expect(onSelect).toHaveBeenCalledWith('a2')
  })
})
