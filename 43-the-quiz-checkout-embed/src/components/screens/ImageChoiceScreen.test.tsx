import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImageChoiceScreen } from './ImageChoiceScreen'

const answers = [
  { answerId: 'i1', label: 'Straight', imageUrl: 'https://img/straight.png' },
  { answerId: 'i2', label: 'Wavy', imageUrl: 'https://img/wavy.png' },
]

describe('ImageChoiceScreen', () => {
  it('renders the resolved prompt', () => {
    render(<ImageChoiceScreen prompt="What is your hair type?" answers={answers} onSelect={() => {}} />)
    expect(screen.getByText('What is your hair type?')).toBeInTheDocument()
  })

  it('renders each answer label and image (tile layout)', () => {
    const { container } = render(<ImageChoiceScreen prompt="Pick" answers={answers} onSelect={() => {}} layout="tile" />)
    expect(screen.getByText('Straight')).toBeInTheDocument()
    expect(screen.getByText('Wavy')).toBeInTheDocument()
    const imgs = container.querySelectorAll('img')
    expect(imgs).toHaveLength(2)
    expect((imgs[0] as HTMLImageElement).src).toBe('https://img/straight.png')
  })

  it('row layout renders the image (decorative) and label', () => {
    const { container } = render(<ImageChoiceScreen prompt="Pick" answers={answers} onSelect={() => {}} layout="row" />)
    expect(screen.getByText('Straight')).toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(2)
  })

  it('calls onSelect with the answerId when a card is tapped (after register-then-advance)', async () => {
    const onSelect = vi.fn()
    render(<ImageChoiceScreen prompt="Pick" answers={answers} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Wavy'))
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith('i2'))
  })

  it('renders an optional beforeTitle and subtitle', () => {
    render(
      <ImageChoiceScreen
        prompt="Pick"
        answers={answers}
        onSelect={() => {}}
        beforeTitle="Diet affects hair"
        subtitle="Select one"
      />,
    )
    expect(screen.getByText('Diet affects hair')).toBeInTheDocument()
    expect(screen.getByText('Select one')).toBeInTheDocument()
  })

  it('supports both layouts without breaking rendering', () => {
    const { rerender } = render(<ImageChoiceScreen prompt="Pick" answers={answers} onSelect={() => {}} layout="tile" />)
    expect(screen.getByText('Straight')).toBeInTheDocument()
    rerender(<ImageChoiceScreen prompt="Pick" answers={answers} onSelect={() => {}} layout="row" />)
    expect(screen.getByText('Straight')).toBeInTheDocument()
  })
})
