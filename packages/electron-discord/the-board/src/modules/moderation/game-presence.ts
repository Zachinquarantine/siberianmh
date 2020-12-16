import { guild } from '@edis/constants'
import { default as CookiecordClient, listener } from 'cookiecord'
import { MessageEmbed, Presence, TextChannel } from 'discord.js'
import { ExtendedModule } from '../../lib/extended-module'

export class GamePresenceModule extends ExtendedModule {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  @listener({ event: 'presenceUpdate' })
  public async onPresenceUpdate(_old_presence: Presence, presence: Presence) {
    let triggered = false

    presence.activities.map((activity) => {
      if (activity.name === 'ROBLOX' || activity.name === 'Electron') {
        triggered = true
      }
    })

    if (!triggered) {
      return
    }

    const embed = new MessageEmbed()
      .setAuthor(
        `${presence.user?.username} is playing ${presence.activities[0].name}`,
        presence.user?.avatarURL({ dynamic: false }) || undefined,
      )
      .setDescription('Please review this user if you think the user is bad.')
      .setTimestamp()

    const channel = (await this.client.channels.fetch(
      guild.channels.mod_log,
    )) as TextChannel

    await channel.send({ embed })
    return await channel.send('/cc <@145300108567773184>', {
      allowedMentions: { users: ['145300108567773184'] },
    })
  }
}
