import { command, default as CookiecordClient, Module } from 'cookiecord'
import { Message } from 'discord.js'
import { Octokit } from '@octokit/core'
import * as semver from 'semver'

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
})

export class DoReleaseModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  @command({
    aliases: ['do-release'],
  })
  async do_release(msg: Message, moduleName: string, version: string) {
    console.log(moduleName, version)
    const valid = semver.valid(version)

    if (!valid) {
      return msg.reply(`Version ${version} is not valid semver version.`)
    }

    await octokit.request(
      'POST /repos/:owner/:repo/actions/workflows/:workflow_id/dispatches',
      {
        owner: 'siberianmh',
        repo: 'siberianmh',
        workflow_id: 2736479,
        ref: 'master',
        inputs: {
          version: valid,
          package: moduleName,
        },
      },
    )

    await msg.channel.send(
      `Heya <@${msg.author.id}>, I've started the release job for ${moduleName}/${valid}`,
    )
  }
}
