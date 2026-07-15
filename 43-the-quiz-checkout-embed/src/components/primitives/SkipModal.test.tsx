import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SkipModal } from './SkipModal'

describe('SkipModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <SkipModal open={false} onConfirm={() => {}} onDismiss={() => {}} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the skip-dialog copy', () => {
    render(<SkipModal open onConfirm={() => {}} onDismiss={() => {}} />)
    expect(
      screen.getByText(/Skip if you have previously completed it/),
    ).toBeInTheDocument()
  })

  it('calls onConfirm when the SKIP QUIZ button is clicked', () => {
    const onConfirm = vi.fn()
    const onDismiss = vi.fn()
    render(<SkipModal open onConfirm={onConfirm} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: 'SKIP QUIZ' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('calls onDismiss when the BACK TO QUIZ button is clicked', () => {
    const onConfirm = vi.fn()
    const onDismiss = vi.fn()
    render(<SkipModal open onConfirm={onConfirm} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: 'BACK TO QUIZ' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onDismiss when the backdrop is clicked', () => {
    const onConfirm = vi.fn()
    const onDismiss = vi.fn()
    render(<SkipModal open onConfirm={onConfirm} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
