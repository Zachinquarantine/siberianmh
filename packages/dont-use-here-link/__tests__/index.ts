import { verifyLinks } from '../src/index'
import * as path from 'path'

describe('.verifyLinks', () => {
  it('works', async () => {
    const result = await verifyLinks(path.resolve(__dirname, './fixtures/'))
    expect(result).toBeInstanceOf(Array)
  })

  it('works with relative path', async () => {
    const result = await verifyLinks(
      path.resolve(__dirname, './fixtures/text.md'),
    )
    expect(result).toBeInstanceOf(Array)
  })

  it('exists when here not found', async () => {
    const result = await verifyLinks(
      path.resolve(__dirname, './fixtures/text2.md'),
    )
    expect(result).toBe(undefined)
  })
})
