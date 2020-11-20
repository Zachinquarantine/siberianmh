import {
  command,
  CommonInhibitors,
  default as CookiecordClient,
  Module,
} from 'cookiecord'
import { Message } from 'discord.js'
import { Uwubox } from '../entities/uwubox'

export class UwuboxModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  @command({
    aliases: ['gamebox', 'cakebox'],
    inhibitors: [CommonInhibitors.guildsOnly],
    single: true,
  })
  async uwubox(msg: Message, content: string) {
    if (
      msg.author.bot ||
      !msg.guild ||
      !msg.member ||
      msg.channel.type !== 'text' ||
      !msg.channel.name.includes('bot')
    ) {
      return
    }

    if (!content) {
      return msg.channel.send(
        'You need to choose the item what you want to add, empty is not the item.',
      )
    }

    if (content.length > 50) {
      return msg.channel.send(
        // eslint-disable-next-line
        "This item is so big so you can't store this in my box, please add something smaller.",
      )
    }

    const duplicate = await Uwubox.findOne({ where: { item: content } })

    if (duplicate) {
      if (duplicate.userId === msg.author.id) {
        return msg.channel.send(
          // eslint-disable-next-line
          `You can't add item what's your added yourself.`,
        )
      }

      duplicate.count++
      await duplicate.save()

      return msg.channel.send(
        `Successfully added \`${content}\` to the Uwubox. (${duplicate.count} times)`,
      )
    }

    const box = Uwubox.create({
      item: content,
      userId: msg.member.user.id,
    })

    await box.save()

    return msg.channel.send(`Successfully added \`${content}\` to the Uwubox.`)
  }
}
