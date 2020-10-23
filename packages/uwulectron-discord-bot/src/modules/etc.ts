import {
  command,
  default as CookiecordClient,
  listener,
  Module,
} from 'cookiecord'
import { Message } from 'discord.js'

export class EtcModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Commands
  @command()
  async ping(msg: Message) {
    await msg.channel.send('pong')
  }
  //#endregion

  //#region Listeners
  @listener({ event: 'message' })
  public async createPoll(msg: Message) {
    if (msg.author.bot || !msg.content.toLowerCase().startsWith('poll:')) {
      return
    }
    await msg.react('✅')
    await msg.react('❌')
    await msg.react('🤷')
  }
  //#endregion
}
