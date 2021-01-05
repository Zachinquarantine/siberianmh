import { default as CookiecordClient, command } from 'cookiecord'
import { Message, TextChannel } from 'discord.js'
import { isTrustedMember } from 'siberianmh/packages/electron-discord/common/src'
import { ExtendedModule } from '../../lib/extended-module'
import * as humanizeDuration from 'humanize-duration'

export class SlowmodeModule extends ExtendedModule {
  // private SLOWMODE_MAX_DELAY = 21_600 * 1000

  public constructor(client: CookiecordClient) {
    super(client)
  }

  @command({ aliases: ['sm'], inhibitors: [isTrustedMember], single: true })
  public async slowmode(msg: Message, args: string) {
    const splitArgs = args.split(' ').filter((x) => x.trim().length !== 0)
    if (splitArgs.length === 0) {
      return await msg.channel.send(':warning: Invalid syntax')
    }

    switch (splitArgs[0]) {
      case 'get':
        return this.getSlowmode(msg, (splitArgs[1] as unknown) as TextChannel)
    }
  }

  private async getSlowmode(msg: Message, channel?: TextChannel) {
    let chan = channel
    if (!chan) {
      chan = msg.channel as TextChannel
    }

    const humanized = humanizeDuration(chan.rateLimitPerUser * 1000)

    return await msg.channel.send(
      `The slowmode delay for <#${chan.id}> is ${humanized}`,
    )
  }
}
