import { default as CookiecordClient, listener, Module } from 'cookiecord'
import { Message, MessageEmbed } from 'discord.js'
import { ELECTRON_BLUE } from '../lib/constants'
import { generateFiddleRunURL, GIST_REGEX } from '../lib/fiddle'

export class FiddleModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  private editedFiddleRunnerLink = new Map<string, Message>()

  //#region Listeners
  @listener({ event: 'message' })
  public async readyToUseURL(msg: Message) {
    const exec = GIST_REGEX.exec(msg.content)
    if (msg.author.bot || !exec || !exec[0]) {
      return
    }

    const fiddleRunURL = generateFiddleRunURL(exec[1])

    const embed = new MessageEmbed()
      .setColor(ELECTRON_BLUE)
      .setTitle('Electron Fiddle Launch Link')
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setURL(fiddleRunURL)

    if (exec[0] === msg.content) {
      // Message only contained the link
      msg.delete()
      await msg.channel.send({ embed })
    } else {
      // Message also contained other characters
      const botMsg = await msg.channel.send(
        `${msg.author} Here's a Fiddle runner URL of your gist. You can remove the full link from your message.`,
        { embed },
      )
      this.editedFiddleRunnerLink.set(msg.id, botMsg)
    }
  }

  @listener({ event: 'messageUpdate' })
  async onReadyToUseFix(_oldMsg: Message, msg: Message) {
    if (msg.partial) {
      await msg.fetch()
    }
    const exec = GIST_REGEX.exec(msg.content)
    if (msg.author.bot || !this.editedFiddleRunnerLink.has(msg.id) || exec) {
      return
    }
    const botMsg = this.editedFiddleRunnerLink.get(msg.id)
    await botMsg?.edit('')
    this.editedFiddleRunnerLink.delete(msg.id)
  }

  @listener({ event: 'messageDelete' })
  async onReadyToUseDelete(oldMsg: Message) {
    if (oldMsg.partial) {
      await oldMsg.fetch()
    }
    const exec = GIST_REGEX.exec(oldMsg.content)
    if (
      oldMsg.author.bot ||
      !this.editedFiddleRunnerLink.has(oldMsg.id) ||
      exec
    ) {
      return
    }
    const botMsg = this.editedFiddleRunnerLink.get(oldMsg.id)
    await botMsg?.edit('')
    this.editedFiddleRunnerLink.delete(oldMsg.id)
  }
  //#endregion
}
