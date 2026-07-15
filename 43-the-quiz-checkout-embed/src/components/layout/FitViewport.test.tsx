import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FitViewport } from './FitViewport'

beforeAll(() => {
  // jsdom has no layout; stub ResizeObserver
  ;(globalThis as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
})

describe('FitViewport', () => {
  it('renders its children', () => {
    render(<FitViewport><p>hello</p></FitViewport>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })
  it('exposes a measuring inner wrapper with a data-fit-inner hook', () => {
    const { container } = render(<FitViewport><p>x</p></FitViewport>)
    expect(container.querySelector('[data-fit-inner]')).not.toBeNull()
  })
})
