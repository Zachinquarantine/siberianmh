import { listener, default as CookiecordClient } from 'cookiecord'
import { ExtendedModule } from '../lib/extended-module'
import { MessageEmbed, TextChannel } from 'discord.js'
import { botInteractionsChannelId } from '@edis/common'

export class EtcModule extends ExtendedModule {
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
