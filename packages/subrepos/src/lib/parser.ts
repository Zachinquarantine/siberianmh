import { ISubrepos } from './interfaces'
import * as fs from 'fs-extra'
import * as yaml from 'js-yaml'

export const parseYML = (file: string): Array<ISubrepos> => {
  const content = fs.readFileSync(file, { encoding: 'utf-8' })
  const parsed = yaml.load(content)

  if (typeof parsed !== 'object') {
    console.log(
      `[Subrepos] Expected type 'Object' received type '${typeof parsed}'`,
    )
    process.exit(1)
  }

  return parsed as Array<ISubrepos>
}
