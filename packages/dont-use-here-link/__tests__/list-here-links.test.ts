import { listHereLinks } from '../src/validate-file'
import * as path from 'path'

const fixture = path.join(__dirname, 'fixtures/text.md')
const fixture2 = path.join(__dirname, 'fixtures/text2.md')

describe('.listHereLinks()', () => {
  it('returns error', async () => {
    const result = await listHereLinks(fixture, '[here]')
    expect(result).toEqual([
      {
        fileName: expect.any(String),
        lineNumber: expect.any(Number),
        text: expect.any(String),
      },
    ])
  })

  it('return empty', async () => {
    const result = await listHereLinks(fixture2, '[here]')
    expect(result).toEqual([])
  })

  it('return empty for search word', async () => {
    const result = await listHereLinks(fixture2, '[chromium]')
    expect(result).toEqual([])
  })
})
