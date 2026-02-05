import { screen, act } from '@testing-library/react'

export const checkTimerValue = (minutes: string, seconds: string) => {
  expect(screen.getByRole('group', { name: `minutes: ${minutes}` })).toBeInTheDocument()
  expect(screen.getByRole('group', { name: `seconds: ${seconds}` })).toBeInTheDocument()
}

export const advanceTime = (ms: number) => act(() => vi.advanceTimersByTime(ms))
