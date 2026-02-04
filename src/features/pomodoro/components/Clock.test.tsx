import { describe, it, expect } from 'vitest'
import { formatTime } from './Clock'

describe('formatTime', () => {
  it('converts seconds into minutes and remaining seconds', () => {
    expect(formatTime(65)).toEqual({
      currentMinutes: 1,
      currentSeconds: 5,
    })
  })

  it('handles exact minutes', () => {
    expect(formatTime(120)).toEqual({
      currentMinutes: 2,
      currentSeconds: 0,
    })
  })

  it('handles values under one minute', () => {
    expect(formatTime(45)).toEqual({
      currentMinutes: 0,
      currentSeconds: 45,
    })
  })

  it('handles zero correctly', () => {
    expect(formatTime(0)).toEqual({
      currentMinutes: 0,
      currentSeconds: 0,
    })
  })

  it('handles large values', () => {
    expect(formatTime(3599)).toEqual({
      currentMinutes: 59,
      currentSeconds: 59,
    })
  })
})
