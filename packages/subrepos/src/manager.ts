import * as fs from 'fs-extra'
import * as yaml from 'js-yaml'
import * as path from 'path'
import axios from 'axios'
import * as Table from 'cli-table3'
import { clone } from './lib/clone'
import { ISubrepos } from './lib/interfaces'

export class Manager {
  private subreposFile = path.resolve('subrepos.yml')

  public runFetch() {
    this.verifySubreposExists()
    const content = this.parseYML(this.subreposFile)

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

  public async listOutdated() {
    this.verifySubreposExists()
    const content = this.parseYML(this.subreposFile)
    const outdatedTable = new Table({
      head: ['Repository', 'Current', 'Latest'],
    })

    for (const repo of content) {
      let repository: string
      const [, , url, owner, repoName] = repo.url.split('/')
      repository = repoName
      if (repoName.endsWith('.git')) {
        repository = repoName.slice(0, -4)
      }

      if (url === 'github.com') {
        const { data } = await axios.get(
          `https://api.github.com/repos/${owner}/${repository}/commits/HEAD`,
        )

        if (data.sha !== repo.commit) {
          outdatedTable.push([repo.name ?? repo.url, repo.commit, data.sha])
        }
      }
    }

    return console.log(outdatedTable.toString())
  }

  private parseYML(file: string): Array<ISubrepos> {
    const content = fs.readFileSync(file, { encoding: 'utf-8' })
    const parsed = yaml.safeLoad(content)

    if (typeof parsed !== 'object') {
      console.log('Something goes wrong.')
      return this.forceExit()
    }

    return parsed as Array<ISubrepos>
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

  private verifySubreposExists() {
    if (!fs.existsSync(this.subreposFile)) {
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
