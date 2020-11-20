import {
  command,
  default as CookiecordClient,
  Module,
  CommonInhibitors,
  optional,
} from 'cookiecord'
import { Message, MessageEmbed } from 'discord.js'

export class HelpMessageModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  @command({
    aliases: ['help', 'commands', 'h'],
    inhibitors: [CommonInhibitors.guildsOnly],
    description: 'Sends what you&quotre looking right now',
  })
  async help(msg: Message, @optional cmdTrigger?: string) {
    if (!msg.guild) {
      return
    }

    if (!cmdTrigger) {
      const embed = new MessageEmbed()
        .setAuthor(
          msg.guild.name,
          msg.guild.iconURL({ dynamic: true }) || undefined,
        )
        .setTitle('Bot Usage')
        .setDescription(
          `Hello <@${msg.author.id}>! Here is a list of all commands in me. To get detailed description on any specific command, do \`help <command>\``,
        )
        .addField(
          '**Misc Commands**',
          '`ping` ► View the latency of the bot\n`source ► Drop links to source codes of our bots.`\n`uwubox <item>` ► Add something into Uwubox.',
        )
        .addField(
          '**Help Channel Commands:**',
          '`close` ► Close a __ongoing__ help channel opened by you!',
        )
        .setFooter(
          this.client.user?.username,
          this.client.user?.displayAvatarURL(),
        )
        .setTimestamp()

      return await msg.channel.send({ embed })
    } else {
      const cmd = this.client.commandManager.getByTrigger(cmdTrigger)

      if (!cmd) {
        return msg.channel.send(`:warning: Command \`${cmdTrigger}\` not found`)
      }

      await msg.channel.send(
        `Usage: \`${cmd.triggers.join('|')}${
          cmd.args.length ? ' ' : ''
        }${cmd.args.map((arg) =>
          arg.optional ? `[${arg.type.name}]` : `<${arg.type.name}>`,
        )}\`${cmd.description ? `\nDescription: *${cmd.description}*` : ''}`,
      )
    }
  }
}
