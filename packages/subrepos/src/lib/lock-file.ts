import * as fs from 'fs-extra'
import * as yaml from 'js-yaml'
import { sortKeys } from './utils'

interface ILockMetadata {
  [index: string]: {
    commit: string
    directory: string
    url: string
    branch?: string
  }
}

const oldLock: ILockMetadata = Object.create(null)
const newLock: ILockMetadata = Object.create(null)

export function getItem(url: string, commit: string) {
  const item = oldLock[`${url}@${commit}`]

  if (!item) {
    return null
  }

  return item.commit
}

export async function writeLock() {
  await fs.writeFile(
    './subrepos-lock.yml',
    yaml.dump(sortKeys(newLock), { noRefs: true }),
  )
}

export async function readLock() {
  if (await fs.pathExists('./subrepos-lock.yml')) {
    Object.assign(
      oldLock,
      yaml.load(await fs.readFile('./subrepos-lock.yml', 'utf-8')),
    )
  }
}
