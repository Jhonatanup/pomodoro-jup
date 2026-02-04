import { useEffect, useState } from 'react'
import { formatDigit } from './FlipClock.utils'
/* Special shout out to liborgabrhel https://codepen.io/liborgabrhel/pen/JyJzjb */
export function FlipClock({
  currentMinutes,
  currentSeconds,
}: {
  currentMinutes: number
  currentSeconds: number
}) {
  const [minutes, setMinutes] = useState(currentMinutes)
  const [seconds, setSeconds] = useState(currentSeconds)
  const [minutesShuffle, setMinutesShuffle] = useState(true)
  const [secondsShuffle, setSecondsShuffle] = useState(true)

  useEffect(() => {
    if (currentMinutes !== minutes) {
      setMinutes(currentMinutes)
      setMinutesShuffle(prevState => !prevState)
    }
    if (currentSeconds !== seconds) {
      setSeconds(currentSeconds)
      setSecondsShuffle(prevState => !prevState)
    }
  }, [currentMinutes, currentSeconds])

  return (
    <div role="timer" className={'flipClock'}>
      <FlipUnitContainer unit={'minutes'} digit={minutes} shuffle={minutesShuffle} />
      <FlipUnitContainer unit={'seconds'} digit={seconds} shuffle={secondsShuffle} />
    </div>
  )
}

const AnimatedCard = ({ animation, digit }: { animation: string; digit: number }) => {
  return (
    <div className={`flipCard ${animation}`}>
      <span>{formatDigit(digit)}</span>
    </div>
  )
}

const StaticCard = ({ position, digit }: { position: string; digit: number }) => {
  return (
    <div className={position}>
      <span>{formatDigit(digit)}</span>
    </div>
  )
}

const FlipUnitContainer = ({
  digit,
  shuffle,
  unit,
}: {
  digit: number
  shuffle: boolean
  unit: string
}) => {
  let currentDigit = digit
  let previousDigit = (digit + 1) % 60

  const digit1 = shuffle ? previousDigit : currentDigit
  const digit2 = !shuffle ? previousDigit : currentDigit

  const animation1 = shuffle ? 'fold' : 'unfold'
  const animation2 = !shuffle ? 'fold' : 'unfold'

  const label = `${unit}: ${formatDigit(currentDigit)}`

  return (
    <div role="group" aria-label={label} className={'flipUnitContainer'}>
      <StaticCard position={'upperCard'} digit={currentDigit} />
      <StaticCard position={'lowerCard'} digit={previousDigit} />
      <AnimatedCard digit={digit1} animation={animation1} />
      <AnimatedCard digit={digit2} animation={animation2} />
    </div>
  )
}
