// FlipClock.utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatDigit } from './FlipClock.utils' // or './utils'

describe('formatDigit', () => {
  it('pads single digits with 0', () => {
    expect(formatDigit(0)).toBe('00')
    expect(formatDigit(7)).toBe('07')
    expect(formatDigit(9)).toBe('09')
  })

  it('does not pad 10+', () => {
    expect(formatDigit(10)).toBe('10')
    expect(formatDigit(59)).toBe('59')
  })
})
