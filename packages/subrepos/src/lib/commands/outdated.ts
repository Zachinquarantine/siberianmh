import * as findUp from 'find-up'
import * as Table from 'cli-table3'
import axios from 'axios'
import { parseYML } from '../parser'

export const listOutdated = async () => {
  // TODO: Handle possible undefined case
  const subreposFile = (await findUp('subrepos.yml'))!
  const content = parseYML(subreposFile)
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
