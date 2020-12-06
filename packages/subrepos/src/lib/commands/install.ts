import * as findUp from 'find-up'
import * as fs from 'fs-extra'
import * as path from 'path'
import { clone } from '../clone'
import { readLock, writeLock } from '../lock-file'
import { parseYML } from '../parser'

export const install = async () => {
  const subreposFile = (await findUp('subrepos.yml'))!
  const content = parseYML(subreposFile)

  await readLock()

  await writeLock()

  for (const repo of content) {
    if (fs.existsSync(path.join(process.cwd(), repo.directory))) {
      return
    }

    await clone(repo, process.cwd())
  }
}

// TODO: Modify to a new version
// const verifyContent(subrepos: Array<ISubrepos>) {
//   let hasError: boolean = false

//   const log = (subrepo: ISubrepos, message: string) => {
//     if (!subrepo.name) {
//       return console.log(`[${subrepo.name}] ${message}`)
//     }

//     return console.log(message)
//   }

//   subrepos.forEach((subrepo) => {
//     if (!subrepo.commit) {
//       log(subrepo, 'Unable to find required field "commit"')
//       hasError = true
//     }
//     if (!subrepo.directory) {
//       log(subrepo, 'Unable to find required field "directory"')
//       hasError = true
//     }
//     if (!subrepo.url) {
//       log(subrepo, 'Unable to find required field "url"')
//       hasError = true
//     }
//   })

//   if (hasError) {
//     return true
//   }

//   return false
// }
