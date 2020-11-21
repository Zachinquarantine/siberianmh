import { default as CookiecordClient, listener, Module } from 'cookiecord'
import {
  CategoryChannel,
  GuildChannel,
  MessageEmbed,
  TextChannel,
  VoiceChannel,
} from 'discord.js'
import * as constants from '../../lib/constants'

/**
 * Logging for server events and staff actions.
 */
export class ModLogModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  /**
   * Generate log embed and send to logging channel.
   */
  private async sendLogMessage(
    iconURL?: string,
    colour?: number,
    title?: string,
    text?: string,
    thumbnail?: string,
    channel_id: string = constants.guild.channels.mod_log,
    content?: string,
    footer?: string,
  ) {
    const embed = new MessageEmbed({
      description: text,
    })

    if (title && iconURL) {
      embed.setAuthor(title, iconURL)
    }

    embed.color = colour

    if (footer) {
      embed.setFooter(footer)
    }

    if (thumbnail) {
      embed.setThumbnail(thumbnail)
    }

    const channel = (await this.client.channels.fetch(
      channel_id,
    )) as TextChannel

    await channel.send(content, {
      embed: embed,
    })
  }

  /**
   * Log channel create event to mod log.
   */
  @listener({ event: 'channelCreate' })
  public async onGuildChannelCreate(channel: GuildChannel) {
    if (channel.guild.id !== constants.guild.id) {
      return
    }

    let title = ''
    let message = ''

    if (channel instanceof CategoryChannel) {
      title = 'Category created'
      message = `${channel.name} (\`${channel.id}\`)`
    } else if (channel instanceof VoiceChannel) {
      title = 'Voice channel created'
      message = `${channel.name} (\`${channel.id}\`)`
    } else {
      title = 'Text channel created'
      message = `${channel.name} (\`${channel.id}\`)`
    }

    return await this.sendLogMessage(
      constants.icons.hashGreen,
      constants.colors.softGreen,
      title,
      message,
    )
  }

  /**
   * Log channel delete event to mod log.
   */
  @listener({ event: 'channelDelete' })
  public async onGuildChannelDelete(channel: GuildChannel) {
    if (channel.guild.id !== constants.guild.id) {
      return
    }

    let title = ''
    let message = ''

    if (channel instanceof CategoryChannel) {
      title = 'Category deleted'
    } else if (channel instanceof VoiceChannel) {
      title = 'Voice channel deleted'
    } else {
      title = 'Text channel deleted'
    }

    message = `${channel.name} (\`${channel.id}\`)`

    return await this.sendLogMessage(
      constants.icons.hashRed,
      constants.colors.softRed,
      title,
      message,
    )
  }
}
