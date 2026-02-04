import { Pause, Play, RotateCcw } from 'lucide-react'

interface ControlsProps {
  isRunning: boolean
  togglePause: VoidFunction
  handleReset: VoidFunction
}

export function Controls({ isRunning, togglePause, handleReset }: ControlsProps) {
  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={togglePause}
        className="flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label={isRunning ? 'Pause' : 'Play'}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {isRunning ? (
          <Pause className="w-6 h-6 text-white" />
        ) : (
          <Play className="w-6 h-6 text-white ml-1" />
        )}
      </button>

      <button
        onClick={handleReset}
        className="flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Reset"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <RotateCcw className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  )
}
