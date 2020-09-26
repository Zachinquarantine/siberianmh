import * as fs from 'fs'
import * as path from 'path'
import * as tar from 'tar-fs'
import got from 'got'
import * as dir from 'node-dir'
import assert from 'assert'

/**
 * Options what can be provided into the `roggy` function.
 */
export interface IOptions {
  /**
   * Owner of the repository.
   * NB: Not populating to the repository.
   */
  owner: string
  /**
   * Repository what's should be downloaded.
   */
  repository: string
  /**
   * A directory into what content being downloaded if this `null` it uses system temporary directory.
   */
  downloadDirectory?: string | null
  /**
   * Directory what's a need to be downloaded, the default value for this it's `docs`.
   */
  downloadMatch?: string
}

/**
 * Helper interface of result from `roggy` function.
 */
export interface IResponse {
  /**
   * The slug of filename, without file extension.
   */
  slug: string
  /**
   * The filename with file extension. (path not relative to this directory)
   */
  filename: string
  /**
   * The markdown content of the file.
   */
  markdown_content: string
}

/**
 * @param {string} input The branch, commit, version. (e.g. `v1.0.0`, `master`)
 * @param {IOptions} opts Options, where `owner` and `repository` required fields.
 * @return {Promise<Array<IResponse>>} Arrays of objects
 */
export async function roggy(
  input: string,
  opts: IOptions,
): Promise<Array<IResponse>> {
  assert(typeof input === 'string', 'A valid branch name, SHA, version number')

  const defaults = {
    downloadMatch: 'docs',
    downloadDirectory: null,
  }

  opts = Object.assign(defaults, opts)

  if (fs.existsSync(input)) {
    const docs = await readFromDisk(input)
    return docs
  } else {
    const docs = await download(
      input,
      opts.downloadMatch!,
      opts.owner,
      opts.repository,
      opts.downloadDirectory!,
    )
    return docs
  }
}

async function download(
  version: string,
  downloadMatch: string,
  owner: string,
  repository: string,
  downloadDirectory: string | null,
): Promise<Array<IResponse>> {
  // Prepend `v` to 1.2.3
  if (version.match(/^\d+\.\d+\.\d+$/)) {
    version = `v${version}`
  }

  const tarballUrl = `https://github.com/${owner}/${repository}/archive/${version}.tar.gz`
  let outputDir: string = ''
  const dlDir = downloadDirectory ?? (await import('os')).tmpdir()

  return new Promise(async (resolve) => {
    await got
      .stream(tarballUrl)
      .pipe(require('gunzip-maybe')())
      .pipe(
        tar
          .extract(dlDir, {
            ignore: (name) => {
              return !name.match(downloadMatch)
            },
          })
          .on('entry', async (header) => {
            if (!outputDir) {
              outputDir = path.join(dlDir, header.name.split('/')[0])
            }
          })
          .on('finish', async () => {
            resolve(await readFromDisk(path.join(outputDir, downloadMatch)))
          }),
      )
  })
}

async function readFromDisk(directory: string): Promise<Array<IResponse>> {
  return new Promise((resolve) => {
    const docs: Array<IResponse> = []
    dir.promiseFiles(directory).then((files) => {
      files.forEach(async (file) => {
        const content = fs.readFileSync(file, 'utf-8')

        const doc: IResponse = {
          slug: path.basename(file, '.md'),
          filename: path.relative(directory, file),
          markdown_content: content,
        }

        docs.push(doc)
        resolve(docs)
      })
    })

    return docs
  })
}
