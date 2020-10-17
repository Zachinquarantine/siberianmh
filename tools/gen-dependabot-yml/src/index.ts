import * as path from 'path'
import * as fs from 'fs'
import { initialPath, getDirectories } from '@sib-tools/utils'
import { defaultData } from './data'
import * as yaml from 'js-yaml'

async function main() {
  const dockerFolders = getDirectories('services/docker')
  const final: any = defaultData

  for (const dockerFolder of dockerFolders) {
    const updateObject = {
      'package-ecosystem': 'docker',
      directory: `/services/docker/${dockerFolder}`,
      schedule: {
        interval: 'daily',
        time: '03:00',
      },
      'open-pull-requests-limit': 999,
    }

    final.updates.push(updateObject)
  }

  const yamled = yaml.safeDump(final)
  fs.writeFileSync(path.resolve(initialPath, '.github/dependabot.yml'), yamled)
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
