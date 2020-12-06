export function sortKeys<T extends Record<string, unknown>>(obj: T) {
  return Object.keys(obj)
    .sort()
    .reduce((total: T, current) => {
      // @ts-expect-error
      total[current] = obj[current]
      return total
    }, Object.create(null))
}
