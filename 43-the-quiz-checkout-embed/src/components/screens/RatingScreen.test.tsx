import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { RatingScreen } from './RatingScreen'

const answers = [
  { answerId: 'r1', label: '1' },
  { answerId: 'r2', label: '2' },
  { answerId: 'r3', label: '3' },
]

describe('RatingScreen', () => {
  it('renders the resolved prompt', () => {
    render(<RatingScreen prompt="How important is this?" answers={answers} onSelect={() => {}} />)
    expect(screen.getByText('How important is this?')).toBeInTheDocument()
  })

  it('renders the fixed sub-instruction above the statement', () => {
    render(<RatingScreen prompt="How important is this?" answers={answers} onSelect={() => {}} />)
    expect(
      screen.getByText('How much do you relate to the following statement?'),
    ).toBeInTheDocument()
  })

  it('renders every scale option as a button', () => {
    render(<RatingScreen prompt="Pick" answers={answers} onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  })

  it('calls onSelect with the answerId on a single tap (after register-then-advance)', async () => {
    const onSelect = vi.fn()
    render(<RatingScreen prompt="Pick" answers={answers} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: '3' }))
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith('r3'))
  })

  it('renders the two scale anchor labels when provided', () => {
    render(
      <RatingScreen
        prompt="Pick"
        answers={answers}
        onSelect={() => {}}
        anchors={{ low: 'Not at all', high: 'Totally' }}
      />,
    )
    expect(screen.getByText('Not at all')).toBeInTheDocument()
    expect(screen.getByText('Totally')).toBeInTheDocument()
  })
})
