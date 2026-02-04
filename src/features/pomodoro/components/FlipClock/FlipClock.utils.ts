export const formatDigit = (digit: number): string => {
  if (digit >= 10) {
    return `${digit}`
  }

  return `0${digit}`
}
