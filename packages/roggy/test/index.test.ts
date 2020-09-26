import { roggy } from '../src'

describe('electron documentation', () => {
  jest.setTimeout(30000)

  test('master', async () => {
    const result = await roggy('master', {
      owner: 'electron',
      repository: 'electron',
    })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((doc) => doc.filename.length > 0)).toBeTruthy()
    expect(result.every((doc) => doc.slug.length > 0)).toBeTruthy()
    // expect(result.every((doc) => doc.markdown_content.length > 0)).toBeTruthy()
  })

  test('master ignore match', async () => {
    const result = await roggy('master', {
      downloadMatch: 'docs/tutorial',
      owner: 'electron',
      repository: 'electron',
    })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((doc) => doc.filename.length > 0)).toBeTruthy()
    expect(result.every((doc) => doc.slug.length > 0)).toBeTruthy()
    expect(result.every((doc) => doc.markdown_content.length > 0)).toBeTruthy()
  })

  test('fetch by version number', async () => {
    const result = await roggy('1.2.0', {
      owner: 'electron',
      repository: 'electron',
    })
    expect(result.every((doc) => doc.filename.length > 0)).toBeTruthy()
  })

  test('fetch by version number with leading v', async () => {
    const result = await roggy('v1.7.0', {
      repository: 'electron',
      owner: 'electron',
    })
    expect(result.every((doc) => doc.filename.length > 0)).toBeTruthy()
  })

  test('fetch by commit SHA', async () => {
    const result = await roggy('76375a83eb3a97e7aed14d37d8bdc858c765e564', {
      owner: 'electron',
      repository: 'electron',
    })
    expect(result.every((doc) => doc.filename.length > 0)).toBeTruthy()
  })

  test('fetch blogs from electron/electronjs.org', async () => {
    const result = await roggy('master', {
      owner: 'electron',
      repository: 'electronjs.org',
      downloadMatch: 'data/blog',
    })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((doc) => doc.filename.length > 0)).toBeTruthy()
    expect(result.every((doc) => doc.slug.length > 0)).toBeTruthy()
    expect(result.every((doc) => doc.markdown_content.length > 0)).toBeTruthy()
  })

  test('downloads blogs into another directory', async () => {
    const result = await roggy('master', {
      owner: 'electron',
      repository: 'electronjs.org',
      downloadMatch: 'data/blog',
      downloadDirectory: require('os').tmpdir(),
    })

    expect(result.length).toBeGreaterThan(0)
    expect(result.every((doc) => doc.filename.length > 0)).toBeTruthy()
    expect(result.every((doc) => doc.slug.length > 0)).toBeTruthy()
    expect(result.every((doc) => doc.markdown_content.length > 0)).toBeTruthy()
    expect(result).toBeInstanceOf(Array)
  })

  test('using then instead of async/await', () => {
    expect.assertions(5)
    return roggy('master', {
      owner: 'electron',
      repository: 'electronjs.org',
      downloadMatch: 'data/blog',
    }).then((docs) => {
      expect(docs.length).toBeGreaterThan(0)
      expect(docs.every((doc) => doc.filename.length > 0)).toBeTruthy()
      expect(docs.every((doc) => doc.slug.length > 0)).toBeTruthy()
      expect(docs.every((doc) => doc.markdown_content.length > 0)).toBeTruthy()
      expect(docs).toBeInstanceOf(Array)
    })
  })
})
