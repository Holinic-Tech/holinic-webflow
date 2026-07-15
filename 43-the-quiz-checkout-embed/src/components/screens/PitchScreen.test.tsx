import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PitchScreen } from './PitchScreen'

describe('PitchScreen', () => {
  it('renders the resolved headline and body', () => {
    render(<PitchScreen headline="Here's what's going on" body="Your hair needs a holistic plan." />)
    expect(screen.getByText("Here's what's going on")).toBeInTheDocument()
    expect(screen.getByText('Your hair needs a holistic plan.')).toBeInTheDocument()
  })

  it('renders the optional image when imageUrl is provided', () => {
    render(<PitchScreen headline="Headline" body="Body" imageUrl="https://example.com/pitch.jpg" />)
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.src).toBe('https://example.com/pitch.jpg')
  })

  it('does not render an image when imageUrl is absent', () => {
    render(<PitchScreen headline="Headline" body="Body" />)
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('does NOT render its own Continue (it is the chrome sticky bottom CTA)', () => {
    render(<PitchScreen headline="Headline" body="Body" />)
    expect(screen.queryByRole('button', { name: /continue/i })).toBeNull()
  })

  it('renders an image block and a checkItems grid (idx-6 / idx-8 blocks)', () => {
    render(
      <PitchScreen
        headline="Headline"
        body=""
        blocks={[
          { kind: 'image', src: 'https://example.com/before-after.webp' },
          { kind: 'text', text: "Don't worry! We got you.", weight: 'semibold' },
          { kind: 'checkItems', items: ['Any hair concern ', 'Any age'], icon: 'https://example.com/check.webp' },
        ]}
      />,
    )
    // alt="" images expose role="presentation", so query by src directly.
    const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
    expect(imgs.some((i) => i.src === 'https://example.com/before-after.webp')).toBe(true)
    expect(screen.getByText("Don't worry! We got you.")).toBeInTheDocument()
    const grid = screen.getByTestId('pitch-check-items')
    expect(grid).toBeInTheDocument()
    // 2 checkmark icons (one per value)
    expect(grid.querySelectorAll('img')).toHaveLength(2)
    expect(screen.getByText('Any hair concern')).toBeInTheDocument()
    expect(screen.getByText('Any age')).toBeInTheDocument()
  })
})
