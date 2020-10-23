import { default as CookiecordClient, listener, Module } from 'cookiecord'
import { MessageReaction, User } from 'discord.js'
import { Autorole } from '../entities/autorole'

export class AutoroleModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  @listener({ event: 'messageReactionAdd' })
  public async onReactionAdd(reaction: MessageReaction, user: User) {
    if (user.id === this.client.user!.id) {
      return
    }

    if (reaction.partial) {
      await reaction.fetch()
    }

    const autorole = await Autorole.find()
    for (const ar of autorole) {
      const msg = reaction.message
      if (
        ar.emoji !== reaction.emoji.toString() ||
        ar.msg_id !== msg.id ||
        !msg.guild
      ) {
        continue
      }

      if (ar.autoRemove) {
        reaction.users.remove(user)
      }

      const member = await msg.guild.members.fetch({
        user,
      })

      await member.roles.add(ar.role_id)
      if (!reaction.users.cache.has(this.client.user!.id)) {
        await msg.react(reaction.emoji)
      }
    }
  }

  @listener({ event: 'messageReactionRemove' })
  public async onReactionRemove(reaction: MessageReaction, user: User) {
    if (user.id === this.client.user?.id) {
      return
    }
    if (reaction.partial) {
      await reaction.fetch()
    }

    const autorole = await Autorole.find()
    for (const ar of autorole) {
      const msg = reaction.message
      if (
        ar.emoji !== reaction.emoji.toString() ||
        ar.msg_id !== msg.id ||
        ar.autoRemove ||
        !msg.guild
      ) {
        continue
      }

      const member = await msg.guild.members.fetch({
        user,
      })
      await member.roles.remove(ar.role_id)
    }
  }
}
