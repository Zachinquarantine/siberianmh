import * as yargs from 'yargs'
import { listOutdated } from './lib/commands/outdated'
import { install } from './lib/commands/install'

export const run = () => {
  // eslint-disable-next-line
  yargs
    .scriptName('subrepos')
    .usage('$0 <cmd> [args]')
    .command('install', 'Install the subrepositories', () => install())
    .command('outdated', 'Show the outdated subrepositories', () =>
      listOutdated(),
    )
    .command('*', 'Install the subrepositories.', () => install())
    .showHelpOnFail(true)
    .demandCommand(1, '')
    .help().argv
}
