export const findMeValue = (text: string, key: string): string | null => {
  if (typeof text !== 'string' || typeof key !== 'string') {
    throw new TypeError('Expected a string')
  }

  const regex = new RegExp(`${key}.(.*)$`, 'm')
  const match = regex.exec(text)
  if (match) {
    return match[1]
  } else {
    return null
  }
}
