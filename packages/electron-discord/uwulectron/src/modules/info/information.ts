import {
  command,
  default as CookiecordClient,
  Module,
  optional,
} from 'cookiecord'
import { Message, MessageEmbed, User } from 'discord.js'

export class InformationModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  @command({ aliases: ['user-info'] })
  public async user(msg: Message, @optional user: User) {
    if (!user) {
      user = msg.author
    }

    const embed = new MessageEmbed()
      .setTitle(user.tag)
      .addField('User information', `Profile: <@${user.id}>\nID: ${user.id}`)
      .setThumbnail(user.avatarURL({ dynamic: false }) || '')

    return msg.channel.send({ embed })
  }
}
