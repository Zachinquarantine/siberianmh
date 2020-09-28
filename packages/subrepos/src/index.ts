import * as yargs from 'yargs'
import { Manager } from './manager'

const manager = new Manager()

export const run = () => {
  // eslint-disable-next-line
  yargs
    .scriptName('subrepos')
    .usage('$0 <cmd> [args]')
    .command('install', 'Install the subrepositories', () => manager.runFetch())
    .command('outdated', 'Show the outdated subrepositories', () =>
      manager.listOutdated(),
    )
    .command('*', 'Install the subrepositories.', () => manager.runFetch())
    .showHelpOnFail(true)
    .demandCommand(1, '')
    .help().argv
}
