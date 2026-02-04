import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Controls } from './Controls'

describe('Controls', () => {
  it('shows Pause button when running', () => {
    render(<Controls isRunning togglePause={vi.fn()} handleReset={vi.fn()} />)

    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('shows Play button when paused', () => {
    render(<Controls isRunning={false} togglePause={vi.fn()} handleReset={vi.fn()} />)

    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
  })

  it('calls togglePause when clicked', async () => {
    const user = userEvent.setup()
    const togglePause = vi.fn()

    render(<Controls isRunning togglePause={togglePause} handleReset={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /pause/i }))

    expect(togglePause).toHaveBeenCalledTimes(1)
  })

  it('calls handleReset when clicked', async () => {
    const user = userEvent.setup()
    const handleReset = vi.fn()

    render(<Controls isRunning togglePause={vi.fn()} handleReset={handleReset} />)

    await user.click(screen.getByRole('button', { name: /reset/i }))

    expect(handleReset).toHaveBeenCalledTimes(1)
  })
})
