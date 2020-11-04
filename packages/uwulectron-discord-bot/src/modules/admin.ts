import { command, default as CookiecordClient, Module } from 'cookiecord'
import { Message, MessageEmbed } from 'discord.js'
import { getBotSettings } from '../lib/settings'
import { ELECTRON_BLUE, sha } from '../lib/constants'
import { isTrustedMember } from '../lib/inhibitors'

export class AdminModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Commands
  @command({ inhibitors: [isTrustedMember] })
  public async admin(msg: Message, subcommand: string) {
    switch (subcommand) {
      // Get the admin stats
      case 'stats': {
        return this.getStats(msg)
      }
      case 'help': {
        return this.getHelp(msg)
      }
      default: {
        return msg.channel.send(
          'inst @thesiberianmh @vhashimotoo tw: @siberianmh @vhashimotoo',
        )
      }
    }
  }
  //#endregion

  private async getStats(msg: Message) {
    const messageEmbed = new MessageEmbed()
      .setAuthor(
        msg.guild?.name,
        msg.guild?.iconURL({ dynamic: true }) || undefined,
      )
      .setColor(ELECTRON_BLUE)
      .setTitle('Something about me and my status')
      .addField(
        'Git Commit',
        `[${sha}](https://github.com/siberianmh/siberianmh/commit/${sha})`,
      )

    return msg.channel.send({ embed: messageEmbed })
  }

  private async getHelp(msg: Message) {
    const messageEmbed = new MessageEmbed()
      .setAuthor(
        msg.guild?.name,
        msg.guild?.iconURL({ dynamic: true }) || undefined,
      )
      .setColor(ELECTRON_BLUE)
      .setTitle('Bot Usage from Admin Side')
      .setDescription(
        `Hello <@${msg.author.id}>! Here is a list of all admin commands. If you would to get default help write \`!help\``,
      )
      .addField(
        '**General Commands**',
        'poll: <message> ► Launch the poll for sended message',
      )
      .addField(
        '**Settings Commands**',
        '`!settings show` ► Show the list of settings and if they status.',
      )
      .addField(
        '**Help Channel Commands:**',
        '`!claim @<username> <limit>` ► Take the user message and post into available help channel\n' +
          '`!helpchan create <name>` ► Create a new help channel\n' +
          '`!helpchan status` ► Show the status of help channels like available and ongoing with owner.\n',
      )
      .setFooter(
        this.client.user?.username,
        this.client.user?.displayAvatarURL(),
      )
      .setTimestamp()

    return msg.channel.send({ embed: messageEmbed })
  }
}

export class SettingsModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Commands
  @command({ inhibitors: [isTrustedMember] })
  public async settings(msg: Message, subcommand: string) {
    switch (subcommand) {
      // Get the all settings
      case 'show': {
        return this.getSettings(msg)
      }
      default: {
        return msg.channel.send(
          'inst @thesiberianmh @vhashimotoo tw: @siberianmh @vhashimotoo',
        )
      }
    }
  }
  //#endregion

  private async getSettings(msg: Message) {
    const db = await getBotSettings()

    if (!db) {
      return msg.reply(
        '🛑 UNABLE TO FIND SETTINGS FOR BOT, PLEASE PING `Hashimoto` FOR FUTURE INVESTIGATION.🛑',
      )
    }

    const embed = new MessageEmbed()
      .setAuthor(
        msg.guild?.name,
        msg.guild?.iconURL({ dynamic: true }) || undefined,
      )
      .setTitle('Settings for Bot')
      .addField(
        '**Unfurling Discord Links** (unfurl)',
        `Enabled: **${db.enable_unfurling}**`,
      )
      .setColor(ELECTRON_BLUE)
      .setTimestamp()

    return msg.channel.send({ embed })
  }
}
