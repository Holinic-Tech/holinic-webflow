import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ScreenRenderer } from './ScreenRenderer'
import type { QuestionScreen } from '../spec/types'

const q: QuestionScreen = {
  kind: 'question', id: 's1', type: 'single', questionId: 'hairConcern',
  prompt: { by: 'hairConcern', cases: { concern_hairloss: 'Hair fall?' }, default: 'Your concern?' },
  answers: [{ answerId: 'concern_hairloss', label: 'Hair loss' }, { answerId: 'concern_scalp', label: 'Scalp' }],
  progression: 'auto',
}

describe('ScreenRenderer', () => {
  it('renders the RESOLVED prompt (engine resolves; component just displays)', () => {
    render(<ScreenRenderer screen={q} answers={{}} onAnswer={() => {}} onContinue={() => {}} />)
    expect(screen.getByText('Your concern?')).toBeInTheDocument() // default since no prior answer
  })
  it('calls onAnswer with the answerId when an option is tapped (after register-then-advance)', async () => {
    const onAnswer = vi.fn()
    render(<ScreenRenderer screen={q} answers={{}} onAnswer={onAnswer} onContinue={() => {}} />)
    fireEvent.click(screen.getByText('Hair loss'))
    await waitFor(() => expect(onAnswer).toHaveBeenCalledWith('concern_hairloss'))
  })
})
