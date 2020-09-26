import { findMeValue } from '../index'

describe('findMeValue()', () => {
  it('works', () => {
    const result = findMeValue('// Module Version: v1.0.0', 'Module Version')
    expect(result).toContain('v1.0.0')
    expect(result).toMatchSnapshot()
  })

  it('return null, if nothing finded', () => {
    const result = findMeValue('Anything', 'Module Naming')
    expect(result).toBe(null)
    expect(result).toMatchSnapshot()
  })

  it('throw error', () => {
    // @ts-ignore
    expect(() => findMeValue()).toThrowErrorMatchingSnapshot()
  })
})
