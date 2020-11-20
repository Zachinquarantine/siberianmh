import { command, default as CookiecordClient, Module } from 'cookiecord'
import { Message, MessageEmbed } from 'discord.js'
import { urls } from '../../lib/constants'

export class SourceModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Commands
  @command()
  public async source(msg: Message) {
    const embed = new MessageEmbed()
      // eslint-disable-next-line
      .setTitle("Bot's GitHub Repository")
      .addField(
        'Uwulectron Repository',
        `[Go to GitHub](${urls.github_bot_repo})`,
      )
      .addField(
        'The Board Repository',
        `[Go to GitHub](${urls.github_the_board_repository})`,
      )
      .setThumbnail('https://avatars0.githubusercontent.com/u/30377152')

    return msg.channel.send({ embed })
  }
  //#endregion
}
