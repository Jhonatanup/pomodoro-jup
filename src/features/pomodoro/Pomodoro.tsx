import { useState, useEffect, useRef } from 'react'
import ModeSelector from './components/ModeSelector'
import type { IMode, INotification } from './types'
import { Clock } from './components/Clock'
import { Controls } from './components/Controls'
import { Notification } from './components/Notification'
import { usePomodoro, durations } from './hooks/usePomodoro'

const PomodoroApp = () => {
  const { state, dispatch } = usePomodoro({
    mode: 'pomodoro',
    completedPomodoros: 0,
    timeLeft: durations.pomodoro,
    isRunning: false,
    lastEndedSession: null,
  })

  const [notification, setNotification] = useState<INotification | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!state.lastEndedSession) return
    const message =
      state.lastEndedSession === 'pomodoro'
        ? 'Focus session complete! Time for a break.'
        : 'Break complete! Ready to focus?'

    handleOpenNotication(message, 'success')
  }, [state.lastEndedSession])

  const handleCloseNotification = () => {
    setNotification(null)
  }

  const handleOpenNotication = (message: string, type: string) => {
    setNotification({ message, type })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      handleCloseNotification()
      timeoutRef.current = null
    }, 5000)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const togglePause = () => {
    dispatch({ type: 'toggle_pause' })
  }

  const handleModeChange = (newMode: IMode) => {
    dispatch({
      type: 'mode_switch',
      payload: newMode,
    })
  }

  const handleReset = () => {
    dispatch({ type: 'reset_session' })
  }

  const getModeLabel = () => {
    switch (state.mode) {
      case 'pomodoro':
        return 'Focus Time'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
      default:
        return ''
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      }}
    >
      {notification && (
        <Notification notification={notification} closeNotification={handleCloseNotification} />
      )}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-linear-to-r from-gray-600 to-gray-800 rounded-3xl blur-xl opacity-20"></div>
        <div
          className="relative rounded-3xl p-10 backdrop-blur-xl shadow-2xl"
          style={{
            background: 'rgba(20, 20, 20, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <ModeSelector activeMode={state.mode} handleModeChange={handleModeChange} />

          <div className="text-center mb-8">
            <div className="text-gray-400 text-sm font-medium mb-4 tracking-wider uppercase">
              {getModeLabel()}
            </div>

            <Clock timeLeft={state.timeLeft} />
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background:
                    i < state.completedPomodoros % 4
                      ? 'rgba(255, 255, 255, 0.8)'
                      : 'rgba(255, 255, 255, 0.15)',
                }}
              />
            ))}
          </div>

          <Controls
            isRunning={state.isRunning}
            togglePause={togglePause}
            handleReset={handleReset}
          />

          <div className="mt-8 text-center">
            <div
              id="sessions-today-label"
              className="text-gray-500 text-xs uppercase tracking-wider mb-1"
            >
              Sessions Today
            </div>
            <div aria-labelledby="sessions-today-label" className="text-white text-2xl font-light">
              {state.completedPomodoros}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PomodoroApp
