import { command, default as CookiecordClient, Module } from 'cookiecord'
import { Message } from 'discord.js'

export class EtcModule extends Module {
  constructor(client: CookiecordClient) {
    super(client)
  }

  @command()
  async ping(msg: Message) {
    await msg.channel.send('pong. :ping_pong:')
  }
}
