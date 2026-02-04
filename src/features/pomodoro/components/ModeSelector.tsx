import type { IMode } from '../types'

interface ModeSelectorProps {
  activeMode: IMode
  handleModeChange: (newMode: IMode) => void
}

const MODES = ['pomodoro', 'shortBreak', 'longBreak'] as const

export default function ModeSelector({ activeMode, handleModeChange }: ModeSelectorProps) {
  return (
    <div
      className="flex gap-2 mb-8 p-1.5 rounded-2xl"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {MODES.map(mode => (
        <button
          key={mode}
          onClick={() => handleModeChange(mode)}
          aria-pressed={activeMode === mode}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-30 ${
            activeMode === mode ? 'text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
          }`}
          style={
            activeMode === mode
              ? {
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }
              : {}
          }
        >
          {mode === 'pomodoro' ? 'Focus' : mode === 'shortBreak' ? 'Short' : 'Long'}
        </button>
      ))}
    </div>
  )
}
