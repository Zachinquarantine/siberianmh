import * as readline from 'readline'
import * as fs from 'fs'

export interface IVariable {
  readonly fileName: string
  readonly lineNumber: number
  readonly text: string
}

export function listHereLinks(
  path: string,
  searchWord: string,
): Promise<ReadonlyArray<IVariable>> {
  return new Promise<ReadonlyArray<IVariable>>((resolve, reject) => {
    const hereLinks = new Array<IVariable>()

    const lineReader = readline.createInterface({
      input: fs.createReadStream(path),
    })

    let lineNumber = 0

    lineReader.on('line', (line: string) => {
      lineNumber++

      const index = line.indexOf(searchWord, 0)

      if (index > -1) {
        hereLinks.push({
          fileName: path,
          lineNumber,
          text: line,
        })
      }
    })

    lineReader.on('close', () => {
      resolve(hereLinks)
    })

    /* istanbul ignore next */
    lineReader.on('error', (err: Error) => {
      reject(err)
    })
  })
}
