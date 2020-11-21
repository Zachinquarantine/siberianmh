import {
  default as CookiecordClient,
  Module,
  listener,
  command,
} from 'cookiecord'
import { Message, MessageEmbed, TextChannel } from 'discord.js'
import { theBoardChannel } from '../lib/constants'

export class MailModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Listeners
  @listener({ event: 'message' })
  public async onNewMail(msg: Message) {
    if (msg.author.bot || msg.channel.type !== 'dm') {
      return
    }

    const channel = (await this.client.channels.fetch(
      theBoardChannel,
    )) as TextChannel

    const embed = new MessageEmbed()
      .setAuthor(
        msg.author.tag,
        msg.author.displayAvatarURL({ dynamic: false }) || undefined,
      )
      .setDescription(
        `${msg.content}\n\nFor respond to this message use \`!reply ${msg.author.id} [message]\``,
      )
      .setFooter(
        `User id: ${msg.author.id}`,
        this.client.user?.avatarURL() || undefined,
      )
      .setTimestamp()

    return channel.send({ embed })
  }
  //#endregion

  //#region Commands
  @command({
    single: true,
  })
  public async reply(msg: Message, args: string) {
    const splitArgs = args.split(' ').filter((x) => x.trim().length !== 0)
    if (splitArgs.length === 0) {
      return await msg.channel.send(
        ':warning: syntax tb!reply <userID> [message]',
      )
    }

    const userId = splitArgs.shift()

    if (!userId) {
      return await msg.channel.send(':warning: invalid syntax')
    }

    const message = splitArgs.join(' ')

    const user = await this.client.users.fetch(userId)
    try {
      return await user.send(message)
    } catch (e) {
      const embed = new MessageEmbed()
        .setTitle('Something goes wrong')
        .setDescription(e)

      return msg.channel.send({ embed })
    }
  }
  //#endregion
}
