import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MultiSelectScreen } from './MultiSelectScreen'

const answers = [{ answerId: 'm1', label: 'Heat' }, { answerId: 'm2', label: 'Bleach' }]

describe('MultiSelectScreen', () => {
  it('renders the resolved prompt and every option', () => {
    render(<MultiSelectScreen prompt="Pick" answers={answers} selected={[]} onToggle={()=>{}} />)
    expect(screen.getByText('Pick')).toBeInTheDocument()
    expect(screen.getByText('Heat')).toBeInTheDocument()
    expect(screen.getByText('Bleach')).toBeInTheDocument()
  })

  it('tapping an option calls onToggle with the answerId', () => {
    const onToggle = vi.fn()
    render(<MultiSelectScreen prompt="Pick" answers={answers} selected={[]} onToggle={onToggle} />)
    fireEvent.click(screen.getByText('Heat'))
    expect(onToggle).toHaveBeenCalledWith('m1')
  })

  it('marks selected options with aria-pressed', () => {
    render(<MultiSelectScreen prompt="Pick" answers={answers} selected={['m1']} onToggle={()=>{}} />)
    expect(screen.getByText('Heat').closest('button')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Bleach').closest('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('does NOT render its own Continue (it is the chrome sticky bottom CTA)', () => {
    render(<MultiSelectScreen prompt="Pick" answers={answers} selected={['m1']} onToggle={()=>{}} />)
    expect(screen.queryByRole('button', { name: /continue/i })).toBeNull()
  })

  it('None of the above calls onNone', () => {
    const onNone = vi.fn()
    render(<MultiSelectScreen prompt="Pick" answers={answers} selected={[]} noneLabel="None of the above" onToggle={()=>{}} onNone={onNone} />)
    fireEvent.click(screen.getByText('None of the above')); expect(onNone).toHaveBeenCalled()
  })

  it('does not render a None-of-the-above button when noneLabel is absent', () => {
    render(<MultiSelectScreen prompt="Pick" answers={answers} selected={[]} onToggle={()=>{}} />)
    expect(screen.queryByText('None of the above')).toBeNull()
  })
})
