import { ISubrepos } from './interfaces'
import * as simpleGit from 'simple-git/promise'
import { ResetMode } from 'simple-git'

export const clone = async (repo: ISubrepos, directory: string) => {
  let git = simpleGit()
  const args = ['clone', repo.url, repo.directory, '--progress']

  if (repo.branch) {
    args.push('-b', repo.branch)
  }

  const cloned = await git.clone(repo.url, repo.directory, ['--progress'])

  if (cloned) {
    console.log('Something goes wrong...')
    console.log(cloned)
  }

  git = simpleGit(`${directory}/${repo.directory}`)
  await git.reset(ResetMode.HARD, [repo.commit])
}
