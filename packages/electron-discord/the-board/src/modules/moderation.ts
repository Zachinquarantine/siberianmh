import {
  default as CookiecordClient,
  Module,
  // command,
  // optional,
} from 'cookiecord'
// import { GuildMember, Message, MessageEmbed } from 'discord.js'
// import { isTrustedMember } from '../lib/inhibitors'
// import { __dev__ } from '../lib/constants'

export class ModerationModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Commands
  // @command({ single: true, inhibitors: [isTrustedMember] })
  // public async kick(
  //   msg: Message,
  //   member: GuildMember,
  //   @optional reason?: string,
  // ) {
  //   if (member.hasPermission('MANAGE_MESSAGES')) {
  //     return msg.channel.send('Well, this is not possible, sorry.')
  //   }

  //   if (!__dev__) {
  //     await member.kick(reason)
  //   }

  //   const embed = new MessageEmbed()
  //     .setAuthor(
  //       `${member.user.tag} has been kicked`,
  //       member.user.avatarURL({ dynamic: false }) || undefined,
  //     )
  //     .setDescription(`**Reason:** ${reason}`)

  //   return msg.channel.send({ embed })
  // }

  // @command({ single: true, inhibitors: [isTrustedMember] })
  // public async ban(msg: Message, args: string) {
  //   if (member.hasPermission('MANAGE_MESSAGES')) {
  //     return msg.channel.send('Well, this is not possible, sorry.')
  //   }

  //   if (!__dev__) {
  //     await member.ban({
  //       days: days,
  //       reason: reason,
  //     })
  //   }

  //   const embed = new MessageEmbed()
  //     .setAuthor(
  //       `${member.user.tag} has been banned`,
  //       member.user.avatarURL({ dynamic: false }) || undefined,
  //     )
  //     .setDescription(`**Reason:** ${reason}, **Days:** ${days}`)

  //   return msg.channel.send({ embed })
  // }
  //#endregion
}
