import { listener, default as CookiecordClient, Module } from 'cookiecord'
import { MessageEmbed, TextChannel } from 'discord.js'
import { botInteractionsChannelId } from '../lib/constants'

export class EtcModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region
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
        type: 'PLAYING',
        name: 'DM to contact admins!',
      },
    })
  }
  //#endregion
}
