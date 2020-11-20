import {
  command,
  default as CookiecordClient,
  listener,
  Module,
} from 'cookiecord'
import { Message, MessageEmbed, TextChannel } from 'discord.js'
import { botInteractionsChannelId } from '../lib/constants'

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
    this.client.user?.setPresence({
      activity: {
        type: 'WATCHING',
        name: 'The Queen’s Gambit',
      },
    })
  }
  //#endregion
}