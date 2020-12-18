import { default as CookiecordClient, listener } from 'cookiecord'
import { ExtendedModule } from '../../lib/extended-module'
import {
  CategoryChannel,
  Guild,
  GuildChannel,
  Message,
  MessageEmbed,
  Role,
  TextChannel,
  VoiceChannel,
} from 'discord.js'
import * as constants from '@edis/common'
import { formatUser } from '../../lib/messages'

/**
 * Logging for server events and staff actions.
 */
export class ModLogModule extends ExtendedModule {
  private _cachedDeletes: Array<string> = []

  public constructor(client: CookiecordClient) {
    super(client)

    this._cachedDeletes = []
  }

  /**
   * Generate log embed and send to logging channel.
   */
  private async sendLogMessage(
    {
      iconURL,
      colour,
      title,
      text,
    }: { iconURL?: string; colour: number; title?: string; text?: string },
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

    return await this.sendLogMessage({
      iconURL: constants.icons.hashGreen,
      colour: constants.colors.softGreen,
      title: title,
      text: message,
    })
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

    return await this.sendLogMessage({
      iconURL: constants.icons.hashRed,
      colour: constants.colors.softRed,
      title: title,
      text: message,
    })
  }

  /**
   * Log channel update event to mod log.
   *
   *  TODO: Finish this listener
   */
  @listener({ event: 'channelUpdate' })
  public async onGuildChannelUpdate(before: GuildChannel, after: GuildChannel) {
    if (before.guild.id !== constants.guild.id) {
      return
    }

    const helpCategories = [
      constants.categories.ask,
      constants.categories.dormant,
      constants.categories.ongoing,
    ]
    console.log(helpCategories)
    // @ts-expect-error
    if (helpCategories.includes(after.category && after.category.id)) {
      return
    }
  }

  /**
   * Log role create event to mod log.
   */
  @listener({ event: 'roleCreate' })
  public async onGuildRoleCreated(role: Role) {
    if (role.guild.id !== constants.guild.id) {
      return
    }

    return await this.sendLogMessage({
      iconURL: constants.icons.crownGreen,
      colour: constants.colors.softGreen,
      title: 'Role created',
      text: `${role.id}`,
    })
  }

  /**
   * Log role delete event to mod log.
   */
  @listener({ event: 'roleDelete' })
  public async onGuildRoleDelete(role: Role) {
    if (role.guild.id !== constants.guild.id) {
      return
    }

    return await this.sendLogMessage({
      iconURL: constants.icons.crownRed,
      colour: constants.colors.softRed,
      title: 'Role removed',
      text: `${role.name} (\`$${role.id}\`)`,
    })
  }

  /**
   * Log role update event to mod log.
   *
   * TODO: Finish this listener
   */
  @listener({ event: 'roleUpdate' })
  public async onGuildRoleUpdate(before: Role, after: Role) {
    if (before.guild.id !== constants.guild.id) {
      return
    }

    console.log(before)
    console.log(after)
  }

  /**
   * Log guild update event to mod log.
   */
  @listener({ event: 'guildUpdate' })
  public async onGuildUpdate(before: Guild, after: Guild) {
    if (before.id !== constants.guild.id) {
      return
    }

    console.log(before)
    console.log(after)
  }

  /**
   * Log message delete event to message change log.
   */
  @listener({ event: 'messageDelete' })
  public async onMessageDelete(message: Message) {
    const channel = message.channel as TextChannel
    const author = message.author

    // Ignore DMs.
    if (!message.guild) {
      return
    }

    if (message.guild.id !== constants.guild.id) {
      return
    }

    this._cachedDeletes.push(message.id)

    if (author.bot) {
      return
    }

    let response: string = ''

    // @ts-expect-error
    if (channel.category) {
      response = `
**Author:** ${formatUser(author)}\n
**Channel:** #${(channel as any).category}/#${channel.name} (\`${
        channel.id
      }\`)\n
**Message ID:** \`${message.id}\`\n`
    } else {
      response = `
**Author:** ${formatUser(author)}\n
**Channel:** #${channel.name} (\`${channel.id}\`)\n
**Message ID:** \`${message.id}\`\n
`
    }

    if (message.attachments) {
      // Prepend the message metadata with the number of attachments
      response = `**Attachements:** ${message.attachments.size}\n` + response
    }

    // Shorten the message content if necessary.
    const content = message.cleanContent
    // const remainedChars = 2040 - response.length

    response += `${content}`

    return await this.sendLogMessage({
      iconURL: constants.icons.messageDelete,
      colour: constants.colors.softRed,
      title: 'Message deleted',
      text: response,
    })
  }
}
