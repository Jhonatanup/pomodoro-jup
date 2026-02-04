import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FlipClock } from './FlipClock'

describe('FlipClock', () => {
  it('renders a timer with minutes and seconds', () => {
    render(<FlipClock currentMinutes={1} currentSeconds={9} />)

    const timer = screen.getByRole('timer')
    expect(timer).toBeInTheDocument()

    expect(screen.getByRole('group', { name: /minutes: 01/i })).toBeInTheDocument()

    expect(screen.getByRole('group', { name: /seconds: 09/i })).toBeInTheDocument()
  })

  it('updates seconds when props change', () => {
    const { rerender } = render(<FlipClock currentMinutes={1} currentSeconds={9} />)

    rerender(<FlipClock currentMinutes={1} currentSeconds={8} />)

    expect(screen.getByRole('group', { name: /minutes: 01/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /seconds: 08/i })).toBeInTheDocument()
  })

  it('updates minutes when props change', () => {
    const { rerender } = render(<FlipClock currentMinutes={1} currentSeconds={9} />)

    rerender(<FlipClock currentMinutes={2} currentSeconds={8} />)

    expect(screen.getByRole('group', { name: /minutes: 02/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /seconds: 08/i })).toBeInTheDocument()
  })
})
