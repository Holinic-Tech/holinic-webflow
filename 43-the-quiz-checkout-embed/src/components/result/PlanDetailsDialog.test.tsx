import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { PlanDetailsDialog } from './PlanDetailsDialog'
import { planData, personalPlan } from '../../quiz/content/plans'

const baseProps = {
  open: true,
  plan: planData,
  personalPlan,
  onClose: () => {},
  onCheckout: () => {},
}

describe('PlanDetailsDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<PlanDetailsDialog {...baseProps} open={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the plan title and price when open', () => {
    render(<PlanDetailsDialog {...baseProps} />)
    expect(screen.getByText(planData.title)).toBeInTheDocument()
    expect(screen.getByText(/\$37/)).toBeInTheDocument()
  })

  it('renders every personalPlan bonus line-item', () => {
    render(<PlanDetailsDialog {...baseProps} />)
    for (const item of personalPlan) {
      expect(screen.getByText(item.title)).toBeInTheDocument()
    }
  })

  it('fires onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(<PlanDetailsDialog {...baseProps} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fires onCheckout when the checkout button is clicked', () => {
    const onCheckout = vi.fn()
    render(<PlanDetailsDialog {...baseProps} onCheckout={onCheckout} />)
    fireEvent.click(screen.getByRole('button', { name: /start now/i }))
    expect(onCheckout).toHaveBeenCalledTimes(1)
  })
})
