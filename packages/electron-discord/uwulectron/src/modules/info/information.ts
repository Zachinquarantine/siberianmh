import { command, default as CookiecordClient, optional } from 'cookiecord'
import { DateTime } from 'luxon'
import * as constants from 'siberianmh/packages/electron-discord/common/src'
import { Message, MessageEmbed, User } from 'discord.js'
import { ExtendedModule } from '../../lib/extended-module'

export class InformationModule extends ExtendedModule {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  /**
   * Returns an embed full of server information.
   */
  @command({ aliases: ['server_info', 'server-info', 'guild', 'guild_info'] })
  public async serverInfo(msg: Message) {
    const created = DateTime.fromJSDate(msg.guild!.createdAt).toRelative()
    const features = msg.guild?.features.join(', ') ?? 'No features'
    const region = msg.guild?.region

    const roles = msg.guild?.roles.valueOf().size
    const member_count = msg.guild?.memberCount

    const eInvite = await this.client.fetchInvite(constants.guild.invite)
    const onlinePresence = eInvite.presenceCount
    const offlinePresence = eInvite.memberCount - onlinePresence

    const embed = new MessageEmbed()
      .setDescription(
        `
**Server information**
Created: ${created}
Voice region: ${region}
Features: ${features}

**Member counts**
Members: ${member_count}
Roles: ${roles}

**Member statuses**
Online: ${onlinePresence}
Offline: ${offlinePresence}
`,
      )
      .setThumbnail(msg.guild?.iconURL({ dynamic: false }) || '')

    return msg.channel.send({ embed })
  }

  /**
   * Creates an embed containing information on the `user`.
   */
  @command({ aliases: ['user-info'] })
  public async user(msg: Message, @optional user: User) {
    if (!user) {
      user = msg.author
    } else if (
      user !== msg.author &&
      !msg.member!.hasPermission('MANAGE_MESSAGES')
    ) {
      return await msg.channel.send(
        'You may not use this command on users other than yourself.',
      )
    }

    const created = DateTime.fromJSDate(user.createdAt).toRelative()

    const userInformation = {
      name: 'User Information',
      value: `Created: ${created}\nProfile: <@${user.id}>\nID: ${user.id}`,
    }

    const embed = new MessageEmbed()
      .setTitle(user.tag)
      .addField(userInformation.name, userInformation.value)
      .setThumbnail(user.avatarURL({ dynamic: false }) || '')

    return msg.channel.send({ embed })
  }
}
