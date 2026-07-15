import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ResultDashboard } from './ResultDashboard'
import { REFUND_GUARANTEE } from '../../quiz/content/result-content'

const baseProps = {
  name: 'Sarah',
  percentage: 95,
  benefit: '9 out of 10 women with this score said their shedding stopped.',
  goalDesc: 'Denser hair and noticeable regrowth.',
  ageLabel: 'In my 30s',
  concernNoun: 'hair loss',
  transformationUrls: ['https://cdn/hero.webp', 'https://cdn/timeline.webp'],
  carouselUrls: ['https://cdn/c1.webp', 'https://cdn/c2.webp', 'https://cdn/c3.webp'],
  lowerTestimonialUrl: 'https://cdn/lower.webp',
  avatarUrl: 'https://cdn/avatar.svg',
  seats: 6,
  onCta: () => {},
}

describe('ResultDashboard', () => {
  it('renders the personalized name', () => {
    render(<ResultDashboard {...baseProps} name="Sarah" />)
    expect(screen.getAllByText(/Sarah/).length).toBeGreaterThan(0)
  })

  it('renders the match percentage', () => {
    render(<ResultDashboard {...baseProps} percentage={94} />)
    expect(screen.getByText(/94%/)).toBeInTheDocument()
  })

  it('renders the benefit line and goal description', () => {
    render(<ResultDashboard {...baseProps} />)
    expect(screen.getByText(baseProps.benefit)).toBeInTheDocument()
    expect(screen.getByText(baseProps.goalDesc)).toBeInTheDocument()
  })

  it('renders the age label and concern noun (join line)', () => {
    render(<ResultDashboard {...baseProps} />)
    expect(screen.getByText('In my 30s')).toBeInTheDocument()
    expect(screen.getByText(/say goodbye to your hair loss/)).toBeInTheDocument()
  })

  it('renders the avatar, transformation, carousel and lower testimonial images', () => {
    const { container } = render(<ResultDashboard {...baseProps} />)
    const srcs = Array.from(container.querySelectorAll('img')).map((i) => i.getAttribute('src'))
    expect(srcs).toContain('https://cdn/avatar.svg')
    expect(srcs).toContain('https://cdn/hero.webp')
    expect(srcs).toContain('https://cdn/timeline.webp')
    expect(srcs).toContain('https://cdn/c1.webp')
    expect(srcs).toContain('https://cdn/c2.webp')
    expect(srcs).toContain('https://cdn/c3.webp')
    expect(srcs).toContain('https://cdn/lower.webp')
  })

  it('renders the social proof, scarcity and refund footer', () => {
    render(<ResultDashboard {...baseProps} seats={6} />)
    expect(screen.getByText(/200,000\+ women/)).toBeInTheDocument()
    expect(screen.getByText('Only 6 seats remaining. Hurry Up!')).toBeInTheDocument()
    expect(screen.getByText(REFUND_GUARANTEE)).toBeInTheDocument()
  })

  it('fires onCta when any primary CTA is clicked', () => {
    const onCta = vi.fn()
    render(<ResultDashboard {...baseProps} onCta={onCta} />)
    fireEvent.click(screen.getByRole('button', { name: 'JOIN THE CHALLENGE' }))
    expect(onCta).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getAllByRole('button', { name: 'START MY CHALLENGE' })[0])
    expect(onCta).toHaveBeenCalledTimes(2)
  })
})
