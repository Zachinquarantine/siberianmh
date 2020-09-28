import { ISubrepos } from './interfaces'
import { ChildProcess } from 'child_process'
import { GitProcess, IGitExecutionOptions } from 'dugite'
import * as byline from 'byline'
import * as ProgressBar from 'progress'

const progressBarOptions: ProgressBar.ProgressBarOptions = {
  complete: '=',
  incomplete: ' ',
  width: 50,
  total: 100,
}

function tryParse(str: string): number | null {
  const value = /(\d+)\%/.exec(str)
  if (value) {
    const percentValue = value[1]
    const percent = parseInt(percentValue, 10)
    if (!isNaN(percent)) {
      return percent
    }
  }

  return null
}

let receivingObjectsBar: ProgressBar | null = null
function setReceivingProgress(percent: number) {
  if (!receivingObjectsBar) {
    receivingObjectsBar = new ProgressBar(
      'Receiving objects [:bar] :percent',
      progressBarOptions,
    )
  }

  receivingObjectsBar.update(percent / 100)
}

let resolvingDeltasBar: ProgressBar | null = null
function setResolvingProgress(percent: number) {
  if (!resolvingDeltasBar) {
    resolvingDeltasBar = new ProgressBar(
      'Resolving deltas [:bar] :percent',
      progressBarOptions,
    )
  }

  resolvingDeltasBar.update(percent / 100)
}

const options: IGitExecutionOptions = {
  processCallback: (process: ChildProcess) => {
    if (!process.stderr) {
      return
    }

    byline(process.stderr).on('data', (chunk: string) => {
      if (chunk.includes('Receiving objects: ')) {
        const percent = tryParse(chunk)
        if (percent) {
          setReceivingProgress(percent)
        }
        return
      }

      if (chunk.includes('Resolving deltas: ')) {
        const percent = tryParse(chunk)
        if (percent) {
          setResolvingProgress(percent)
        }
        return
      }
    })
  },
}

export const clone = async (repo: ISubrepos, directory: string) => {
  const args = ['clone', repo.url, repo.directory, '--progress']

  if (repo.branch) {
    args.push('-b', repo.branch)
  }

  const cloned = await GitProcess.exec(args, directory, options)

  if (cloned.exitCode !== 0) {
    console.log('Something goes wrong...')
    console.log(cloned.stderr)
  }

  await GitProcess.exec(
    ['reset', '--hard', repo.commit],
    `${directory}/${repo.directory}`,
  )
}
