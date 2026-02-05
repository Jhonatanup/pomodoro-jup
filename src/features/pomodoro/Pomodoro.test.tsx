import { render, screen, act, fireEvent } from '@testing-library/react'
import { it, vi, describe, beforeEach, afterEach, expect } from 'vitest'
import Pomodoro from './Pomodoro'
import { advanceTime, checkTimerValue } from './test-utils/pomodoro-helpers'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('Feature: Pomodoro Timer', () => {
  describe('Scenario: Starting a focus session', () => {
    it('Given the timer is not running, When the user starts a Pomodoro, Then the timer should count down from 25 minutes and session should be marked as "focus" mode', async () => {
      render(<Pomodoro />)

      // Given: Timer is not running
      const startButton = screen.getByRole('button', { name: /play/i })
      const timer = screen.getByRole('timer')
      expect(timer).toBeInTheDocument()

      expect(screen.getByRole('group', { name: /minutes: 25/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /seconds: 00/i })).toBeInTheDocument()

      fireEvent.click(startButton)

      // Then: Timer should count down from 25 minutes
      act(() => {
        advanceTime(1000)
      })

      expect(screen.getByRole('group', { name: /minutes: 24/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /seconds: 59/i })).toBeInTheDocument()

      // And: Session should be marked as "focus" mode
      expect(screen.getByRole('button', { name: /focus/i })).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Scenario: Completing a focus session', () => {
    it('Given a Pomodoro timer is running, When the timer reaches 00:00, Then the app should notify the user, automatically transition to break mode, and increment completed Pomodoro count', async () => {
      render(<Pomodoro />)

      // Given: Pomodoro timer is running
      const startButton = screen.getByRole('button', { name: /play/i })
      fireEvent.click(startButton)

      expect(screen.getByRole('button', { name: /focus/i })).toHaveAttribute('aria-pressed', 'true')
      const value = screen.getByLabelText(/sessions today/i)
      expect(value).toHaveTextContent('0')

      // When: Timer reaches 00:00 (advance 25 minutes = 1500 seconds)
      act(() => {
        advanceTime(25 * 60 * 1000)
      })

      expect(screen.getByRole('alert')).toHaveTextContent(/session complete/i)

      // And: Automatically transition to break mode
      expect(screen.getByRole('button', { name: /short/i })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('group', { name: /minutes: 05/i })).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /seconds: 00/i })).toBeInTheDocument()

      // And: Increment the completed Pomodoro count
      expect(value).toHaveTextContent('1')
    })

    it('Given a Pomodoro timer is running, When the timer reaches 00:00, Then the app should notify the user, and the notification should disappear after 5s', async () => {
      render(<Pomodoro />)

      // Given: Pomodoro timer is running
      const startButton = screen.getByRole('button', { name: /play/i })
      fireEvent.click(startButton)

      expect(screen.getByRole('button', { name: /focus/i })).toHaveAttribute('aria-pressed', 'true')
      const value = screen.getByLabelText(/sessions today/i)
      expect(value).toHaveTextContent('0')

      // When: Timer reaches 00:00 (advance 25 minutes = 1500 seconds)
      act(() => {
        advanceTime(25 * 60 * 1000)
      })

      expect(screen.getByRole('alert')).toHaveTextContent(/session complete/i)

      act(() => {
        advanceTime(5000)
      })

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Scenario: Pausing a session', () => {
    it('Given a timer is actively running, When the user pauses the timer, Then the countdown should stop and the remaining time should be preserved', async () => {
      render(<Pomodoro />)

      // Given: Timer is actively running
      const startButton = screen.getByRole('button', { name: /play/i })
      fireEvent.click(startButton)

      // Advance timer by 5 seconds
      act(() => {
        advanceTime(5000)
      })

      checkTimerValue('24', '55')

      // When: User pauses the timer
      const pauseButton = screen.getByRole('button', { name: /pause/i })
      fireEvent.click(pauseButton)

      // Then: Countdown should stop
      // Advance timer by another 5 seconds
      act(() => {
        advanceTime(5000)
      })

      // And: Remaining time should be preserved
      checkTimerValue('24', '55')
    })
  })

  describe('Scenario: Resetting the timer', () => {
    it('Given a timer is running or paused, When the user resets the timer, Then the timer should return to initial state and any progress should be discarded', async () => {
      render(<Pomodoro />)

      // Given: Timer is running
      const startButton = screen.getByRole('button', { name: /play/i })
      fireEvent.click(startButton)

      // Advance timer by 10 seconds
      act(() => {
        advanceTime(10000)
      })

      checkTimerValue('24', '50')

      // When: User resets the timer
      const resetButton = screen.getByRole('button', { name: /reset/i })
      fireEvent.click(resetButton)

      // Then: Timer should return to initial state
      checkTimerValue('25', '00')

      // And: Any progress should be discarded (timer should not be running)
      act(() => {
        advanceTime(5000)
      })
      checkTimerValue('25', '00') // Should not have changed
    })

    it('Given a timer is paused, When the user resets the timer, Then the timer should return to initial state', async () => {
      render(<Pomodoro />)

      // Given: Timer is paused
      const startButton = screen.getByRole('button', { name: /play/i })
      fireEvent.click(startButton)

      act(() => {
        advanceTime(8000)
      })

      const pauseButton = screen.getByRole('button', { name: /pause/i })
      fireEvent.click(pauseButton)

      checkTimerValue('24', '52')

      // When: User resets the timer
      const resetButton = screen.getByRole('button', { name: /reset/i })
      fireEvent.click(resetButton)

      // Then: Timer should return to initial state
      checkTimerValue('25', '00')
    })
  })
  describe('Scenario: Completing a break session', () => {
    it('Given a Break timer is running, When the timer reaches 00:00, Then the app should notify the user', () => {
      render(<Pomodoro />)
      fireEvent.click(screen.getByRole('button', { name: /short/i }))
      checkTimerValue('05', '00')
      fireEvent.click(screen.getByRole('button', { name: /play/i }))
      act(() => {
        advanceTime(5 * 60 * 1000)
      })

      expect(screen.getByRole('alert')).toHaveTextContent(/break complete/i)
    })
  })

  describe('Scenario: Completing 4 pomodoros triggers long break', () => {
    it('Given the user completes 4 focus sessions, When the 4th session ends, Then the app should transition to a long break instead of a short break', () => {
      render(<Pomodoro />)

      // Complete first 3 pomodoros and their breaks
      for (let i = 1; i <= 3; i++) {
        // Given: Starting a pomodoro session
        fireEvent.click(screen.getByRole('button', { name: /play/i }))

        // When: Session completes
        act(() => {
          advanceTime(25 * 60 * 1000)
        })

        // Then: Should transition to short break
        expect(screen.getByRole('alert')).toHaveTextContent(/session complete/i)
        expect(screen.getByRole('button', { name: /short/i })).toHaveAttribute(
          'aria-pressed',
          'true'
        )
        checkTimerValue('05', '00')
        expect(screen.getByLabelText(/sessions today/i)).toHaveTextContent(String(i))

        // Complete the short break
        fireEvent.click(screen.getByRole('button', { name: /play/i }))
        act(() => {
          advanceTime(5 * 60 * 1000)
        })

        expect(screen.getByRole('alert')).toHaveTextContent(/break complete/i)
        expect(screen.getByRole('button', { name: /focus/i })).toHaveAttribute(
          'aria-pressed',
          'true'
        )
        checkTimerValue('25', '00')
      }

      // Complete 4th pomodoro
      fireEvent.click(screen.getByRole('button', { name: /play/i }))

      act(() => {
        advanceTime(25 * 60 * 1000)
      })

      // Then: Should transition to LONG break (not short)
      expect(screen.getByRole('alert')).toHaveTextContent(/session complete/i)
      expect(screen.getByRole('button', { name: /long/i })).toHaveAttribute('aria-pressed', 'true')
      checkTimerValue('15', '00')
      expect(screen.getByLabelText(/sessions today/i)).toHaveTextContent('4')

      // And: After long break, should return to pomodoro
      fireEvent.click(screen.getByRole('button', { name: /play/i }))
      act(() => {
        advanceTime(15 * 60 * 1000)
      })

      expect(screen.getByRole('alert')).toHaveTextContent(/break complete/i)
      expect(screen.getByRole('button', { name: /focus/i })).toHaveAttribute('aria-pressed', 'true')
      checkTimerValue('25', '00')
      expect(screen.getByLabelText(/sessions today/i)).toHaveTextContent('4')
    })
  })
})
