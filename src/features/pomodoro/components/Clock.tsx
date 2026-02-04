import { FlipClock } from './FlipClock/FlipClock'

interface ClockProps {
  timeLeft: number
}

export const formatTime = (seconds: number) => {
  const currentMinutes = Math.floor(seconds / 60)
  const currentSeconds = seconds % 60

  return { currentMinutes, currentSeconds }
}

export function Clock({ timeLeft }: ClockProps) {
  const { currentMinutes, currentSeconds } = formatTime(timeLeft)

  return <FlipClock currentMinutes={currentMinutes} currentSeconds={currentSeconds} />
}
