import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PreviewGallery } from './PreviewGallery'

beforeAll(() => {
  // jsdom has no layout engine; the FitViewport-adjacent components and
  // CountdownTimer don't need it, but stub ResizeObserver defensively.
  ;(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('PreviewGallery', () => {
  it('renders without crashing', () => {
    expect(() => render(<PreviewGallery />)).not.toThrow()
  })

  it('shows the gallery heading and a few component frame labels', () => {
    render(<PreviewGallery />)
    expect(screen.getByText('Component Preview Gallery')).toBeInTheDocument()
    expect(screen.getByText('SingleChoiceScreen')).toBeInTheDocument()
    expect(screen.getByText('MultiSelectScreen')).toBeInTheDocument()
    expect(screen.getByText('ResultScreen')).toBeInTheDocument()
  })

  it('renders representative content from previewed components', () => {
    render(<PreviewGallery />)
    // A prompt from SingleChoiceScreen and the dark timer bar from ResultScreen.
    expect(screen.getByText('What is your biggest hair concern?')).toBeInTheDocument()
    expect(screen.getByText('85% OFF valid for:')).toBeInTheDocument()
  })
})
