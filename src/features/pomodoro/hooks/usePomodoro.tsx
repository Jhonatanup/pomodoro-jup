import { useReducer, useEffect } from 'react'
import type { IMode } from '../types'
export const durations = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

interface IState {
  mode: IMode
  completedPomodoros: number
  timeLeft: number
  isRunning: boolean
  lastEndedSession: 'pomodoro' | 'break' | null
}
type IReducerAction =
  | { type: 'ended_session' }
  | { type: 'decremented_timer' }
  | { type: 'mode_switch'; payload: IMode }
  | { type: 'toggle_pause' }
  | { type: 'reset_session' }

function reducer(state: IState, action: IReducerAction): IState {
  if (action.type === 'reset_session') {
    return {
      ...state,
      isRunning: false,
      timeLeft: durations[state.mode],
    }
  }

  if (action.type === 'toggle_pause') {
    return {
      ...state,
      isRunning: !state.isRunning,
    }
  }
  if (action.type === 'mode_switch') {
    return {
      ...state,
      mode: action.payload,
      timeLeft: durations[action.payload],
      isRunning: false,
    }
  }
  if (action.type === 'decremented_timer') {
    const nextTime = state.timeLeft - 1

    if (nextTime <= 0) {
      return reducer(state, { type: 'ended_session' })
    }

    return { ...state, timeLeft: nextTime }
  }

  if (action.type === 'ended_session') {
    let newState = { ...state }
    newState.isRunning = false
    if (state.mode === 'pomodoro') {
      const newCompletedPomodoros = state.completedPomodoros + 1
      newState.completedPomodoros = newCompletedPomodoros
      newState.lastEndedSession = 'pomodoro'

      if (newCompletedPomodoros % 4 === 0) {
        newState.mode = 'longBreak'
        newState.timeLeft = durations.longBreak
      } else {
        newState.mode = 'shortBreak'
        newState.timeLeft = durations.shortBreak
      }
    } else {
      newState.mode = 'pomodoro'
      newState.timeLeft = durations.pomodoro
      newState.lastEndedSession = 'break'
    }

    return newState
  }
  return state
}

export function usePomodoro(initialState: IState) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!state.isRunning) return
    let interval = null
    if (state.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'decremented_timer' })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [state.isRunning])

  return { state, dispatch }
}
