import { default as CookiecordClient, listener, Module } from 'cookiecord'
import { Message, MessageEmbed, TextChannel } from 'discord.js'
import { ELECTRON_BLUE } from '../lib/constants'
import { getBotSettings } from '../lib/settings'

const DSRegex = /https:\/\/discord(app)?.com\/channels\/([\d]{18})\/([\d]{18})\/([\d]{18})/gm

export class UnfurlModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  private UNFURL_EMBED = (msg: Message, origMessage: Message) =>
    new MessageEmbed()
      .setDescription(`${msg.content}\n**[[original message](${msg.url})]**`)
      .setAuthor(
        `${msg.author.username} in #${(msg.channel as TextChannel).name}`,
        msg.author.avatarURL({ dynamic: true }) || undefined,
      )
      .setColor(ELECTRON_BLUE)
      .setFooter(
        `quoted by ${origMessage.author.tag}`,
        msg.author.avatarURL({ dynamic: true }) || undefined,
      )

  //#region Listeners
  @listener({ event: 'message' })
  public async maybeNeedUnfuring(msg: Message) {
    let parsed: string[] | null = null

    while ((parsed = DSRegex.exec(msg.content))) {
      if (!(await getBotSettings())?.enable_unfurling) {
        return
      }

      const server = parsed[2]
      const channel = parsed[3]
      const message = parsed[4]

      if (msg.guild!.id === server) {
        const fetchGuildChannels = (await this.client.guilds.fetch(server))
          .channels

        const findChannel = fetchGuildChannels
          .valueOf()
          .find((c) => c.id === channel && c.type === 'text') as TextChannel

        if (!findChannel) {
          return
        }

        const fetchedMessaged = (
          await findChannel.messages.fetch({
            around: message,
            limit: 1,
          })
        ).first()

        if (!fetchedMessaged) {
          return
        }

        return msg.channel.send({
          embed: this.UNFURL_EMBED(fetchedMessaged, msg),
        })
      }
    }
  }
  //#endregion
}
