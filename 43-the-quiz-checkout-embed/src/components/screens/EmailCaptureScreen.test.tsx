import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { EmailCaptureScreen, isEmailFormValid } from './EmailCaptureScreen'

const noop = () => {}

function renderEmail(props: Partial<React.ComponentProps<typeof EmailCaptureScreen>> = {}) {
  return render(
    <EmailCaptureScreen
      headline="Where should we send your plan?"
      name=""
      email=""
      onNameChange={noop}
      onEmailChange={noop}
      onSubmit={noop}
      {...props}
    />,
  )
}

describe('EmailCaptureScreen (controlled)', () => {
  it('renders the resolved headline', () => {
    renderEmail()
    expect(screen.getByText('Where should we send your plan?')).toBeInTheDocument()
  })

  it('renders controlled values from props', () => {
    renderEmail({ name: 'Jane', email: 'jane@example.com' })
    expect(screen.getByLabelText(/name/i)).toHaveValue('Jane')
    expect(screen.getByLabelText(/email/i)).toHaveValue('jane@example.com')
  })

  it('reports name edits via onNameChange', () => {
    const onNameChange = vi.fn()
    renderEmail({ onNameChange })
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jo' } })
    expect(onNameChange).toHaveBeenCalledWith('Jo')
  })

  it('reports email edits via onEmailChange', () => {
    const onEmailChange = vi.fn()
    renderEmail({ onEmailChange })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.co' } })
    expect(onEmailChange).toHaveBeenCalledWith('a@b.co')
  })

  it('submits the form (Enter / hidden submit) via onSubmit', () => {
    const onSubmit = vi.fn()
    const { container } = renderEmail({ name: 'Jane', email: 'jane@example.com', onSubmit })
    fireEvent.submit(container.querySelector('form')!)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders the in-card Submit button and fires onSubmit on click', () => {
    const onSubmit = vi.fn()
    renderEmail({ name: 'Jane', email: 'jane@example.com', onSubmit, submitLabel: 'Submit' })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders title, subhead, conditional concern line + lock, and privacy', () => {
    renderEmail({
      title: 'Your results are ready!',
      subhead: 'On the next screen, you will see if the Challenge can help.',
      concernLine: 'Probability to fix your hair loss in 14 days:',
      privacy: 'Your info is 100% secure and never shared with third parties.',
    })
    expect(screen.getByText('Your results are ready!')).toBeInTheDocument()
    expect(
      screen.getByText('On the next screen, you will see if the Challenge can help.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Probability to fix your hair loss in 14 days:/),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Your info is 100% secure and never shared with third parties.'),
    ).toBeInTheDocument()
  })
})

describe('isEmailFormValid', () => {
  it('is false for an empty name', () => {
    expect(isEmailFormValid('', 'jane@example.com')).toBe(false)
    expect(isEmailFormValid('   ', 'jane@example.com')).toBe(false)
  })

  it('is false for an email without @ or without a dot', () => {
    expect(isEmailFormValid('Jane', 'jane.example.com')).toBe(false)
    expect(isEmailFormValid('Jane', 'jane@example')).toBe(false)
  })

  it('is true for a non-empty name + valid email (ignoring surrounding space)', () => {
    expect(isEmailFormValid('  Jane  ', '  jane@example.com  ')).toBe(true)
  })
})
