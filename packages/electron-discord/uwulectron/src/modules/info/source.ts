import { command, default as CookiecordClient } from 'cookiecord'
import { Message, MessageEmbed } from 'discord.js'
import { urls } from '@edis/common'
import { ExtendedModule } from '../../lib/extended-module'

export class SourceModule extends ExtendedModule {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Commands

  /**
   * Display information and a GitHub link to the source code.
   */
  @command({ aliases: ['src'] })
  public async source(msg: Message) {
    const embed = new MessageEmbed()
      .setTitle("Bot's GitHub Repository")
      .addField(
        'Electron Discord Repository',
        `[Go to GitHub](${urls.github_bot_repo})`,
      )
      .setThumbnail('https://avatars0.githubusercontent.com/u/30377152')

    return msg.channel.send({ embed })
  }
  //#endregion
}
