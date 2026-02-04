import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ModeSelector from './ModeSelector'

describe('ModeSelector', () => {
  it('renders mode labels', () => {
    render(<ModeSelector activeMode="pomodoro" handleModeChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /focus/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /short/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /long/i })).toBeInTheDocument()
  })

  it('calls handleModeChange with correct mode when clicking', async () => {
    const user = userEvent.setup()
    const handleModeChange = vi.fn()

    render(<ModeSelector activeMode="pomodoro" handleModeChange={handleModeChange} />)

    await user.click(screen.getByRole('button', { name: /short/i }))
    expect(handleModeChange).toHaveBeenCalledWith('shortBreak')

    await user.click(screen.getByRole('button', { name: /long/i }))
    expect(handleModeChange).toHaveBeenCalledWith('longBreak')
  })

  it('marks the active mode button as pressed', () => {
    render(<ModeSelector activeMode="shortBreak" handleModeChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: /short/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /focus/i })).toHaveAttribute('aria-pressed', 'false')
  })
})
