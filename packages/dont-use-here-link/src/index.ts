import * as path from 'path'
import * as glob from 'glob'
import { listHereLinks, IVariable } from './validate-file'

/**
 * Interface for standard options
 *
 * @interface IOptions
 */
export interface IOptions {
  /**
   * Word what need to search.
   * @default `[here]`
   */
  readonly searchWord: string
}

const matchesReporter = (
  globOrFile: string | Array<string>,
  hereLinks: Array<IVariable>,
) => {
  const matches = hereLinks.filter((v) => v.fileName === globOrFile)

  if (matches.length > 0) {
    console.log(`In file: ${globOrFile}`)

    matches.forEach((v) => console.log(` - Line ${v.lineNumber}: '${v.text}'`))
  }
}

export async function verifyLinks(
  globRoot: string,
  opts?: IOptions,
): Promise<void | Array<IVariable>> {
  const defaults: IOptions = {
    searchWord: '[here]',
  }

  opts = Object.assign(defaults, opts)

  console.log(
    'Checking all markdown files to ensure [here] not used for links…',
  )

  const hereLinks = new Array<IVariable>()

  if (globRoot.endsWith('.md')) {
    console.log(`   Checking file: ${globRoot}…`)
    const result = await listHereLinks(globRoot, opts.searchWord)
    hereLinks.push(...result)
  }

  const root = path.dirname(globRoot)

  const allFiles = path.join(globRoot, '*.md')
  const files = glob.sync(allFiles)

  for (const file of files) {
    const relativePath = path.relative(root, file)
    console.log(`  Checking file: ${relativePath}…`)
    const result = await listHereLinks(file, opts.searchWord)
    hereLinks.push(...result)
  }

  if (hereLinks.length > 0) {
    console.log('[here] links were found.')

    if (globRoot.endsWith('.md')) {
      matchesReporter(globRoot, hereLinks)
    }

    console.log(
      'Look for the source of these markdown files and looks to not use [here] as link.',
    )

    return hereLinks
  }

  return
}
