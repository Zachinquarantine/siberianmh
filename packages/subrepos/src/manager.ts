import * as fs from 'fs-extra'
import * as path from 'path'
import * as findUp from 'find-up'
import { clone } from './lib/clone'
import { ISubrepos } from './lib/interfaces'
import { parseYML } from './lib/parser'

export class Manager {
  public async runFetch() {
    const subreposFile = (await findUp('subrepos.yml'))!
    const content = parseYML(subreposFile)

    if (this.verifyContent(content)) {
      return this.forceExit()
    }

    return content.map((repo) => {
      if (fs.existsSync(path.join(process.cwd(), repo.directory))) {
        return
      }

      return clone(repo, process.cwd())
    })
  }

  private verifyContent(subrepos: Array<ISubrepos>) {
    let hasError: boolean = false

    const log = (subrepo: ISubrepos, message: string) => {
      if (!subrepo.name) {
        return console.log(`[${subrepo.name}] ${message}`)
      }

      return console.log(message)
    }

    subrepos.forEach((subrepo) => {
      if (!subrepo.commit) {
        log(subrepo, 'Unable to find required field "commit"')
        hasError = true
      }
      if (!subrepo.directory) {
        log(subrepo, 'Unable to find required field "directory"')
        hasError = true
      }
      if (!subrepo.url) {
        log(subrepo, 'Unable to find required field "url"')
        hasError = true
      }
    })

    if (hasError) {
      return true
    }

    return false
  }

  private verifySubreposExists(subreposFile: string) {
    if (!fs.existsSync(subreposFile)) {
      console.log(
        '[Subrepos] Unable to find the subrepos.yml file in root directory',
      )
      return this.forceExit()
    }

    return
  }

  private forceExit() {
    return process.exit(1)
  }
}
