import { renderHook, act } from '@testing-library/react'
import { usePomodoro, durations } from './usePomodoro'
import { vi, it, beforeEach, afterEach, describe } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

describe('usePomodoro', () => {
  const createInitialState = (overrides = {}) => ({
    mode: 'pomodoro' as const,
    completedPomodoros: 0,
    timeLeft: durations.pomodoro,
    isRunning: false,
    lastEndedSession: null,
    ...overrides,
  })

  describe('initialization', () => {
    it('should start with provided initial state', () => {
      const initialState = createInitialState()
      const { result } = renderHook(() => usePomodoro(initialState))

      expect(result.current.state.mode).toBe('pomodoro')
      expect(result.current.state.completedPomodoros).toBe(0)
      expect(result.current.state.timeLeft).toBe(durations.pomodoro)
      expect(result.current.state.isRunning).toBe(false)
    })
  })

  describe('timer behavior', () => {
    it('should countdown when running', () => {
      const { result } = renderHook(() => usePomodoro(createInitialState({ timeLeft: 10 })))

      // Start the timer
      act(() => {
        result.current.dispatch({ type: 'toggle_pause' })
      })

      expect(result.current.state.isRunning).toBe(true)

      // Advance time and verify countdown
      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(result.current.state.timeLeft).toBe(7)
    })

    it('should pause and resume correctly', () => {
      const { result } = renderHook(() => usePomodoro(createInitialState({ timeLeft: 10 })))

      // Start
      act(() => {
        result.current.dispatch({ type: 'toggle_pause' })
      })
      act(() => {
        vi.advanceTimersByTime(2000)
      })
      expect(result.current.state.timeLeft).toBe(8)

      // Pause
      act(() => {
        result.current.dispatch({ type: 'toggle_pause' })
      })

      expect(result.current.state.isRunning).toBe(false)

      // Time should not advance while paused
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(result.current.state.timeLeft).toBe(8)

      // Resume
      act(() => {
        result.current.dispatch({ type: 'toggle_pause' })
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.state.timeLeft).toBe(6)
    })

    it('should reset timer to current mode duration', () => {
      const { result } = renderHook(() =>
        usePomodoro(createInitialState({ timeLeft: 100, isRunning: true }))
      )

      act(() => {
        result.current.dispatch({ type: 'reset_session' })
      })

      expect(result.current.state.timeLeft).toBe(durations.pomodoro)
      expect(result.current.state.isRunning).toBe(false)
    })
  })

  describe('mode switching', () => {
    it('should switch to short break mode', () => {
      const { result } = renderHook(() => usePomodoro(createInitialState()))

      act(() => {
        result.current.dispatch({ type: 'mode_switch', payload: 'shortBreak' })
      })

      expect(result.current.state.mode).toBe('shortBreak')
      expect(result.current.state.timeLeft).toBe(durations.shortBreak)
      expect(result.current.state.isRunning).toBe(false)
    })

    it('should switch to long break mode', () => {
      const { result } = renderHook(() => usePomodoro(createInitialState()))

      act(() => {
        result.current.dispatch({ type: 'mode_switch', payload: 'longBreak' })
      })

      expect(result.current.state.mode).toBe('longBreak')
      expect(result.current.state.timeLeft).toBe(durations.longBreak)
    })

    it('should stop timer when switching modes', () => {
      const { result } = renderHook(() => usePomodoro(createInitialState({ isRunning: true })))

      act(() => {
        result.current.dispatch({ type: 'mode_switch', payload: 'shortBreak' })
      })

      expect(result.current.state.isRunning).toBe(false)
    })
  })

  describe('pomodoro session completion', () => {
    it('should complete a pomodoro and transition to short break', () => {
      const { result } = renderHook(() =>
        usePomodoro(createInitialState({ timeLeft: 2, isRunning: true }))
      )

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.state.mode).toBe('shortBreak')
      expect(result.current.state.completedPomodoros).toBe(1)
      expect(result.current.state.lastEndedSession).toBe('pomodoro')
      expect(result.current.state.isRunning).toBe(false)
    })

    it('should transition to long break after 4th pomodoro', () => {
      const { result } = renderHook(() =>
        usePomodoro(
          createInitialState({
            completedPomodoros: 3,
            timeLeft: 1,
            isRunning: true,
          })
        )
      )

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.state.mode).toBe('longBreak')
      expect(result.current.state.completedPomodoros).toBe(4)
      expect(result.current.state.timeLeft).toBe(durations.longBreak)
    })

    it('should transition to short break after 1st, 2nd, and 3rd pomodoros', () => {
      const testCases = [0, 1, 2]

      testCases.forEach(completedCount => {
        const { result } = renderHook(() =>
          usePomodoro(
            createInitialState({
              completedPomodoros: completedCount,
              timeLeft: 1,
              isRunning: true,
            })
          )
        )

        act(() => {
          vi.advanceTimersByTime(1000)
        })

        expect(result.current.state.mode).toBe('shortBreak')
        expect(result.current.state.completedPomodoros).toBe(completedCount + 1)
      })
    })
  })

  describe('break completion', () => {
    it('should complete a break and return to pomodoro mode', () => {
      const { result } = renderHook(() =>
        usePomodoro(
          createInitialState({
            mode: 'shortBreak',
            completedPomodoros: 2,
            timeLeft: 1,
            isRunning: true,
          })
        )
      )

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.state.mode).toBe('pomodoro')
      expect(result.current.state.timeLeft).toBe(durations.pomodoro)
      expect(result.current.state.lastEndedSession).toBe('break')
      expect(result.current.state.completedPomodoros).toBe(2) // Maintains count
      expect(result.current.state.isRunning).toBe(false)
    })

    it('should return to pomodoro after long break', () => {
      const { result } = renderHook(() =>
        usePomodoro(
          createInitialState({
            mode: 'longBreak',
            completedPomodoros: 4,
            timeLeft: 1,
            isRunning: true,
          })
        )
      )

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.state.mode).toBe('pomodoro')
      expect(result.current.state.completedPomodoros).toBe(4)
    })
  })

  describe('full workflow', () => {
    it('should complete a full cycle: pomodoro -> break -> pomodoro', () => {
      const { result } = renderHook(() => usePomodoro(createInitialState({ timeLeft: 2 })))

      // Complete pomodoro
      act(() => {
        result.current.dispatch({ type: 'toggle_pause' })
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.state.mode).toBe('shortBreak')
      expect(result.current.state.completedPomodoros).toBe(1)

      // Start and complete break
      act(() => {
        result.current.dispatch({ type: 'toggle_pause' })
      })

      act(() => {
        vi.advanceTimersByTime(result.current.state.timeLeft * 1000)
      })

      expect(result.current.state.mode).toBe('pomodoro')
      expect(result.current.state.completedPomodoros).toBe(1)
      expect(result.current.state.timeLeft).toBe(durations.pomodoro)
    })

    it('should complete 4 pomodoros and trigger long break', () => {
      const { result } = renderHook(() => usePomodoro(createInitialState({ timeLeft: 1 })))

      // Complete 3 pomodoros with breaks
      for (let i = 0; i < 3; i++) {
        // Complete pomodoro
        act(() => {
          result.current.dispatch({ type: 'toggle_pause' })
        })

        act(() => {
          vi.advanceTimersByTime(result.current.state.timeLeft * 1000)
        })

        expect(result.current.state.mode).toBe('shortBreak')

        // Complete break
        act(() => {
          result.current.dispatch({ type: 'toggle_pause' })
        })

        act(() => {
          vi.advanceTimersByTime(result.current.state.timeLeft * 1000)
        })

        expect(result.current.state.mode).toBe('pomodoro')
      }

      expect(result.current.state.completedPomodoros).toBe(3)

      // Complete 4th pomodoro
      act(() => {
        result.current.dispatch({ type: 'toggle_pause' })
      })

      act(() => {
        vi.advanceTimersByTime(result.current.state.timeLeft * 1000)
      })

      // Should now be in long break
      expect(result.current.state.mode).toBe('longBreak')
      expect(result.current.state.completedPomodoros).toBe(4)
    })
  })

  describe('edge cases', () => {
    it('should handle manual mode switch during active session', () => {
      const { result } = renderHook(() =>
        usePomodoro(createInitialState({ timeLeft: 100, isRunning: true }))
      )

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      act(() => {
        result.current.dispatch({ type: 'mode_switch', payload: 'shortBreak' })
      })

      expect(result.current.state.mode).toBe('shortBreak')
      expect(result.current.state.timeLeft).toBe(durations.shortBreak)
      expect(result.current.state.completedPomodoros).toBe(0) // Not counted as complete
      expect(result.current.state.isRunning).toBe(false)
    })

    it('should clean up interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      const { unmount } = renderHook(() =>
        usePomodoro(createInitialState({ timeLeft: 10, isRunning: true }))
      )

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })
  })
})
