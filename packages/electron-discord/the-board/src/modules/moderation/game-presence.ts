import { default as CookiecordClient, listener } from 'cookiecord'
import { MessageEmbed, Presence } from 'discord.js'
import { ExtendedModule } from '../../lib/extended-module'

export class GamePresenceModule extends ExtendedModule {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  @listener({ event: 'presenceUpdate' })
  public async onPresenceUpdate(_old_presence: Presence, presence: Presence) {
    let triggered = false

    presence.activities.forEach((activity) => {
      if (activity.name.toLowerCase().includes('spotify')) {
        triggered = false
      }

      if (activity.name === 'Electron') {
        triggered = true
      }
    })

    if (!triggered) {
      return
    }

    const embed = new MessageEmbed()
      .setAuthor(
        `${presence.user?.tag} (${presence.user?.id}) is playing in bad games`,
        presence.user?.avatarURL({ dynamic: false }) || undefined,
      )
      .setDescription(
        `Games:
          ${presence.activities
            .map(
              (activity) =>
                `- ${activity.name} (${activity.state} ${activity.details}) (${activity.type})`,
            )
            .join('\n')}`,
      )
      .setTimestamp()

    const user = await this.client.users.fetch('145300108567773184')
    await user.send({ embed })
  }
}
