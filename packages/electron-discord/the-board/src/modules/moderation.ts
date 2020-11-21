import {
  default as CookiecordClient,
  Module,
  command,
  // optional,
} from 'cookiecord'
import { Message, MessageEmbed } from 'discord.js'
import { __dev__ } from '../lib/constants'
import { isTrustedMember } from '../lib/inhibitors'
// import { __dev__ } from '../lib/constants'

export class ModerationModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Commands
  @command({ single: true, inhibitors: [isTrustedMember] })
  public async kick(msg: Message, args: string) {
    const splitArgs = args.split(' ').filter((x) => x.trim().length !== 0)
    if (splitArgs.length === 0) {
      return await msg.channel.send(
        ':warning: syntax !kick <@userID> [?reason]',
      )
    }

    const userId = splitArgs.shift()

    if (!userId) {
      return await msg.channel.send(':warning: invalid syntax')
    }

    const reason = splitArgs.join(' ') || 'Unspecified'
    const member = msg.mentions.members?.first()

    if (!member) {
      return msg.channel.send(
        'Unable to find specified user, please verify syntax',
      )
    }

    if (member.hasPermission('MANAGE_MESSAGES')) {
      return msg.channel.send(
        // eslint-disable-next-line
        "Well you can't kick Admins, but it is be a good option",
      )
    }

    if (!__dev__) {
      member.kick(reason)
    }

    const embed = new MessageEmbed()
      .setAuthor(
        `${member.user.tag} has been kicked`,
        member.user.avatarURL({ dynamic: false }) || undefined,
      )
      .setDescription(`**Reason:**: ${reason}`)

    return msg.channel.send({ embed })
  }

  // TODO: Add ability to give ban by days
  @command({
    single: true,
    inhibitors: [isTrustedMember],
    description: 'syntax !ban <@userID> [?reason]',
  })
  public async ban(msg: Message, args: string) {
    const splitArgs = args.split(' ').filter((x) => x.trim().length !== 0)
    if (splitArgs.length === 0) {
      return await msg.channel.send(':warning: syntax !ban <@userID> [?reason]')
    }

    const userId = splitArgs.shift()

    if (!userId) {
      return await msg.channel.send(':warning: invalid syntax')
    }

    const reason = splitArgs.join(' ') || 'Unspecified'
    const member = msg.mentions.members?.first()

    if (!member) {
      return msg.channel.send(
        'Unable to find specified user, please verify syntax',
      )
    }

    if (member.hasPermission('MANAGE_MESSAGES')) {
      return msg.channel.send(
        // eslint-disable-next-line
        "Well you can't ban Admins, but it is be a good option",
      )
    }

    if (!__dev__) {
      member.ban({
        reason: reason,
      })
    }

    const embed = new MessageEmbed()
      .setAuthor(
        `${member.user.tag} has been banned`,
        member.user.avatarURL({ dynamic: false }) || undefined,
      )
      .setDescription(`**Reason:**: ${reason}, Days: null`)

    return msg.channel.send({ embed })
  }
  //#endregion
}
