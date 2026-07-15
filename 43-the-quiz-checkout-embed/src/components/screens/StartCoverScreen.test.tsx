import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StartCoverScreen } from './StartCoverScreen'

const answers = [
  { answerId: 'goal_hairloss', label: 'I want to stop my hair loss' },
  { answerId: 'goal_betterhair', label: 'I want longer, better looking hair' },
  { answerId: 'goal_both', label: 'I want both' },
]

function renderCover(onSelect = vi.fn()) {
  render(
    <StartCoverScreen
      headline="See if the Challenge is a fit for you and your hair profile"
      instruction="Start by selecting your goal:"
      backgroundUrl="https://example.com/bg.webp"
      logoUrl="https://example.com/logo.webp"
      answers={answers}
      onSelect={onSelect}
    />,
  )
  return onSelect
}

describe('StartCoverScreen', () => {
  it('renders the headline', () => {
    renderCover()
    expect(
      screen.getByText('See if the Challenge is a fit for you and your hair profile'),
    ).toBeInTheDocument()
  })

  it('renders all three goal options as buttons', () => {
    renderCover()
    expect(screen.getByRole('button', { name: 'I want to stop my hair loss' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'I want longer, better looking hair' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'I want both' })).toBeInTheDocument()
  })

  it('emits the answerId on tap (including the checkbox-row third option)', () => {
    const onSelect = renderCover()
    fireEvent.click(screen.getByRole('button', { name: 'I want both' }))
    expect(onSelect).toHaveBeenCalledWith('goal_both')
  })
})
