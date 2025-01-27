import { command, default as CookiecordClient, listener } from 'cookiecord'
import { Message, MessageEmbed, TextChannel } from 'discord.js'
import {
  botInteractionsChannelId,
  colors,
} from 'siberianmh/packages/electron-discord/common/src'
import { ExtendedModule } from '../lib/extended-module'

export class EtcModule extends ExtendedModule {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Commands
  @command()
  async ping(msg: Message) {
    await msg.channel.send('pong')
  }

  @command({ aliases: ['dwnload', 'dowload'] })
  public async download(msg: Message) {
    const embed = new MessageEmbed()
      .setColor(colors.softRed)
      .setDescription('[Click Me!](https://electronjs.org/releases)')

    return await msg.channel.send({ embed })
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

  @listener({ event: 'ready' })
  public async onConnect() {
    if (process.env.NODE_ENV === 'development') {
      return
    }

    const channel = (await this.client.channels.fetch(
      botInteractionsChannelId,
    )) as TextChannel

    const embed = new MessageEmbed()
      .setAuthor(
        this.client.user?.username,
        this.client.user?.avatarURL({ dynamic: false }) || undefined,
      )
      .setDescription('Connected!')

    return channel.send({ embed })
  }

  @listener({ event: 'ready' })
  public async setPresence() {
    await this.client.user?.setPresence({
      activity: {
        type: 'PLAYING',
        name: 'Tell Me Why',
      },
    })
  }
  //#endregion
}
