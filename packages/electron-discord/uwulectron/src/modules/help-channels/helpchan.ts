import {
  command,
  default as CookiecordClient,
  listener,
  optional,
} from 'cookiecord'
import {
  ChannelData,
  Collection,
  Guild,
  GuildChannel,
  GuildMember,
  Message,
  MessageEmbed,
  TextChannel,
} from 'discord.js'
import { HelpUser } from '../../entities/help-user'
import {
  dormantChannelTimeout,
  dormantChannelLoop,
  categories,
  askHelpChannelId,
  askCooldownRoleId,
  GREEN_BRIGHT,
  RED,
  isTrustedMember,
  guild,
} from 'siberianmh/packages/electron-discord/common/src'
import { ExtendedModule } from '../../lib/extended-module'
import { helpMessage } from './help-message'

/**
 * Manage the help channel system of the guild.
 *
 * The system is based on a 3 category system:
 *
 * **Available Category:**
 *
 *  - Contains channels which are ready to be taken by someone who needs help.
 *
 * **In Use Category:**
 *
 *  - Contains all channels which are taken by someone who needing help
 *  - When a channel becomes dormant, and embed with `DORMANT_EMBED` will be sent.
 *
 * **Dormant Category:**
 *
 *  - Contains channels which aren't in use
 *  - Channels are used to refill the Available category.
 *
 * Help channels are should be named after the chemical elements.
 */
export class HelpChanModule extends ExtendedModule {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  private CHANNEL_PREFIX = 'help-'

  private AVAILABLE_EMBED = new MessageEmbed()
    .setColor(GREEN_BRIGHT)
    .setTitle('✅ Available help channel')
    .setDescription(
      '**Send your question here to claim the channel**\n' +
        'This channel will be dedicated to answering your question only. Well try to answer and help you solve the issue.\n\n' +
        '**Keep in mind:**\n' +
        "• It's always ok to just ask your question. You don't need permission.\n" +
        '• Explain what you expect to happen and what actually happens.\n' +
        '• Include a code sample and error message, if you got any.\n\n' +
        "Try to write the best question you can by providing a detailed description and telling us what you've tried already",
    )
    .setFooter(
      `Closes when you send !close or after ${
        dormantChannelTimeout / 60 / 60
      } hours of inactivity`,
    )

  private DORMANT_EMBED = new MessageEmbed()
    .setColor(RED)
    .setTitle('❌ Dormant help channel')
    .setDescription(
      'This help channel has been marked as **dormant** due by closing. ' +
        'It is no longer possible to send messages to this channel until ' +
        'it becomes available again.\n\n' +
        'If your question does not answer yet, you can ask them in another help ' +
        'channel from the **❓ Help: Available** category by simply asking again.\n\n' +
        'Consider rephrasing your question to maximize the chance of getting a good answer.',
    )

  private HELP_CHANNEL_STATUS_EMBED = (
    msg: Message,
    availableChannels: Collection<string, GuildChannel> | undefined,
    ongoingChannels: HelpUser[],
    dormantChannels: Collection<string, GuildChannel> | undefined,
  ) =>
    new MessageEmbed()
      .setAuthor(
        msg.guild?.name,
        msg.guild?.iconURL({ dynamic: true }) || undefined,
      )
      .setTitle('Help Channels Status')
      .addField(
        'Available',
        availableChannels && availableChannels.size >= 1
          ? availableChannels.map((channel) => `<#${channel.id}>`)
          : '**All channels is on Ongoing state**',
      )
      .addField(
        'Ongoing',
        ongoingChannels.length >= 1
          ? ongoingChannels.map(
              (channel) =>
                `<#${channel.channelId}> - Owner <@${channel.userId}>`,
            )
          : '**No Channels in Ongoing Category**',
      )
      .addField(
        'Dormant',
        dormantChannels && dormantChannels.size >= 1
          ? dormantChannels.map((channel) => `<#${channel.id}>`)
          : '**All channels is on Available state**',
      )
      .addField(
        'Locked Channels',
        this.busyChannels.size >= 1
          ? Array.from(this.busyChannels).map(
              (channel) =>
                `<#${channel}> is locked please use !helpchan unlock #channel-name`,
            )
          : 'No channels is locked',
      )
      .setFooter(
        this.client.user?.username,
        this.client.user?.displayAvatarURL(),
      )
      .setTimestamp()

  // a lock to eliminate race conditions
  private busyChannels: Set<string> = new Set()

  //#region Listeners
  @listener({ event: 'ready' })
  async startDormantLoop() {
    setInterval(() => {
      this.checkDormantPossibilities()
    }, dormantChannelLoop)

    await this.syncHowToGetHelp()
  }

  @listener({ event: 'message' })
  async onNewQuestion(msg: Message) {
    if (
      msg.author.bot ||
      !msg.guild ||
      !msg.member ||
      msg.channel.type !== 'text' ||
      !msg.channel.parentID ||
      msg.channel.parentID !== categories.ask ||
      !msg.channel.name.startsWith(this.CHANNEL_PREFIX) ||
      this.busyChannels.has(msg.channel.id)
    ) {
      return
    }

    await this.claimChannel(msg)
  }

  @listener({ event: 'messageDelete' })
  async onQuestionRemoved(msg: Message) {
    if (
      !msg.guild ||
      !msg.member ||
      msg.channel.type !== 'text' ||
      !msg.channel.parentID ||
      msg.channel.parentID !== categories.ongoing ||
      !msg.channel.name.startsWith(this.CHANNEL_PREFIX) ||
      this.busyChannels.has(msg.channel.id)
    ) {
      return
    }

    const channel = await HelpUser.findOne({
      where: { channelId: msg.channel.id },
    })

    if (msg.id === channel.messageId) {
      return this.markChannelAsDormant(msg.channel)
    }

    return
  }

  @listener({ event: 'message' })
  async onNewSystemPinMessage(msg: Message) {
    if (
      msg.type !== 'PINS_ADD' ||
      msg.channel.type !== 'text' ||
      !(
        msg.channel.parentID === categories.ask ||
        msg.channel.parentID === categories.ongoing
      )
    ) {
      return
    }
    await msg.delete({ reason: 'Pin system message' })
  }
  //#endregion

  //#region Commands
  @command({
    aliases: ['resolve', 'done', 'close', 'dormant'],
    description: 'Marks __ongoing__ help channel as resolved',
  })
  async resolved(msg: Message) {
    if (!msg.guild || this.busyChannels.has(msg.channel.id)) {
      return
    }

    if ((msg.channel as TextChannel).parentID !== categories.ongoing) {
      return await msg.channel.send(
        ':warning: you can only run this in ongoing help channels.',
      )
    }

    const owner = await HelpUser.findOne({ channelId: msg.channel.id })

    if (
      (owner && owner.userId === msg.author.id) ||
      msg.member?.hasPermission('MANAGE_MESSAGES')
    ) {
      await this.markChannelAsDormant(msg.channel as TextChannel)
    } else {
      return await msg.channel.send(
        ':warning: you have to be the asker to close the channel.',
      )
    }
  }

  // #region Admin/Mod team commands
  @command({
    inhibitors: [isTrustedMember],
  })
  public async helpchan(
    msg: Message,
    subcommand: string,
    @optional ...args: string[]
  ) {
    switch (subcommand) {
      // List the status of help channels
      case 'status': {
        const available = msg.guild?.channels.cache
          .filter((channel) => channel.parentID === categories.ask)
          .filter((channel) => channel.name.startsWith(this.CHANNEL_PREFIX))

        const ongoing = await HelpUser.find()

        const dormant = msg.guild?.channels.cache
          .filter((channel) => channel.parentID === categories.dormant)
          .filter((channel) => channel.name.startsWith(this.CHANNEL_PREFIX))

        return msg.channel.send({
          embed: this.HELP_CHANNEL_STATUS_EMBED(
            msg,
            available,
            ongoing,
            dormant,
          ),
        })
      }

      // Create help channel
      case 'create': {
        const [channelName] = args

        if (args.length > 1) {
          return msg.channel.send(
            `⚠ Expected 1 argument, but got ${args.length}\nDEBUG DATA: ${args}`,
          )
        }

        const created = await this.createHelpChannel(msg.guild!, channelName)
        return msg.channel.send(`Successfully created <#${created.id}> channel`)
      }

      case 'update': {
        await this.updateHelpChannels(msg.guild!)
        return msg.channel.send('Successfully updated all help channels')
      }

      case 'ensureask': {
        await this.ensureAskChannels(msg.guild!)
        await this.syncHowToGetHelp(msg.guild)
        return msg.channel.send(
          '(Deprecated: Use !helpchan sync) Help Channels successfully rolled.',
        )
      }

      case 'sync': {
        await this.ensureAskChannels(msg.guild)
        await this.syncHowToGetHelp(msg.guild)
        return msg.channel.send('Help Channel System successfully synced')
      }

      // Get the help
      case 'help': {
        return msg.channel.send(
          'Available commands: `status`, `create`, and how this not be strage `help`.',
        )
      }

      // Default response
      default:
        return msg.channel.send(
          'Well this command is not right, the right commands is: `status`, `create`',
        )
    }
  }

  @command({ inhibitors: [isTrustedMember], aliases: ['take'] })
  public async claim(
    msg: Message,
    @optional member: GuildMember,
    // @optional limit: number = 10,
  ) {
    if (msg.reference && msg.reference.messageID) {
      return this.claimViaReply(msg)
    }

    return await this.claimBase(msg, member)
  }

  @command({
    inhibitors: [isTrustedMember],
  })
  public async removelock(msg: Message) {
    if (this.busyChannels.has(msg.channel.id)) {
      this.busyChannels.delete(msg.channel.id)
      return await msg.channel.send('')
    }
    return await msg.channel.send('Channel is not locked')
  }
  //#endregion

  //#endregion

  private async claimViaReply(origMessage: Message) {
    const msg = await origMessage.channel.messages.fetch(
      origMessage.reference.messageID,
    )

    return await this.claimBase(msg, msg.member, true)
  }

  private async claimBase(
    msg: Message,
    member: GuildMember,
    replyClaim: boolean = false,
  ) {
    if (msg.author.bot) {
      return await msg.channel.send(
        `:warning:: I cannot open help channel for ${member.displayName} because he is a turtle.`,
      )
    }

    const helpUser = await HelpUser.findOne({
      where: { userId: member.id },
    })

    if (helpUser) {
      return await msg.channel.send(
        `${member.displayName} already has <#${helpUser.channelId}>`,
      )
    }

    const claimedChannel = msg.guild?.channels.cache.find(
      (channel) =>
        channel.type === 'text' &&
        channel.parentID === categories.ask &&
        channel.name.startsWith(this.CHANNEL_PREFIX) &&
        !this.busyChannels.has(channel.id),
    ) as TextChannel | undefined

    if (!claimedChannel) {
      return await msg.channel.send(
        ':warning: failed to claim a help channel, no available channel found.',
      )
    }

    let msgContent = ''
    if (replyClaim) {
      msgContent = msg.cleanContent
    } else {
      const channelMessage = await msg.channel.messages.fetch({ limit: 50 })
      const questionMessages = channelMessage.filter(
        (questionMsg) =>
          questionMsg.author.id === member.id && questionMsg.id !== msg.id,
      )

      msgContent = questionMessages
        .array()
        .slice(0, 10) // TODO: return the limit
        .map((msg) => msg.cleanContent)
        .reverse()
        .join('\n')
        .slice(0, 2000)
    }
    this.busyChannels.add(claimedChannel.id)
    const toPin = await claimedChannel.send({
      embed: new MessageEmbed()
        .setAuthor(member.displayName, member.user.displayAvatarURL())
        .setDescription(msgContent),
    })

    await toPin.pin()
    await this.addCooldown(member, claimedChannel, toPin)
    await this.moveChannel(claimedChannel, categories.ongoing)
    await claimedChannel.send(
      `${member.user} this channel has been claimed for your question. Please review <#${askHelpChannelId}> for how to get help`,
    )

    await msg.channel.send(`:ok:: Successfully claimed ${claimedChannel}`)
    this.busyChannels.delete(claimedChannel.id)
    await this.ensureAskChannels(msg.guild!)
    await this.syncHowToGetHelp(msg.guild)
  }

  private async addCooldown(
    member: GuildMember,
    channel: TextChannel,
    msg: Message,
  ) {
    await member.roles.add(askCooldownRoleId)
    const helpUser = HelpUser.create({
      userId: member.user.id,
      channelId: channel.id,
      messageId: msg.id,
    })
    await helpUser.save()
  }

  private async markChannelAsDormant(channel: TextChannel) {
    this.busyChannels.add(channel.id)

    const pinned = await channel.messages.fetchPinned()
    await Promise.all(pinned.map((msg) => msg.unpin()))

    const helpUser = await HelpUser.findOne({
      channelId: channel.id,
    })

    try {
      const member = await channel.guild.members.fetch({
        user: helpUser!.userId,
      })

      await member.roles.remove(askCooldownRoleId)
    } catch {}

    await HelpUser.delete({ channelId: channel.id })
    await this.moveChannel(channel, categories.dormant)

    await channel.send({ embed: this.DORMANT_EMBED })

    await this.ensureAskChannels(channel.guild)
    await this.syncHowToGetHelp(channel.guild)
    this.busyChannels.delete(channel.id)
  }

  private async createHelpChannel(guild: Guild, channelName: string) {
    const chan = await guild.channels.create(`help-${channelName}`, {
      type: 'text',
      topic:
        'This is Electron help channel. You can claim your own help channel in the Help: Available category.',
      reason: 'Maintain help channel goal',
      parent: categories.ask,
    })

    // Channel should already be in ask, but sync the permissions.
    await this.moveChannel(chan, categories.ask)
    await chan.send({ embed: this.AVAILABLE_EMBED })

    return chan
  }

  private async updateHelpChannels(guild: Guild) {
    const helpChannels = guild.channels.cache.filter((channel) =>
      channel.name.startsWith(this.CHANNEL_PREFIX),
    )

    for (const channel of helpChannels.array()) {
      await channel.edit(
        {
          topic:
            'This is Electron help channel. You can claim your own help channel in the Help: Available category.',
        },
        'Maintain help channel goal',
      )
    }
  }

  private async moveChannel(channel: TextChannel, category: string) {
    const parent = channel.guild.channels.resolve(category)
    if (parent === null) {
      return
    }
    const data: ChannelData = {
      parentID: parent.id,
      permissionOverwrites: parent.permissionOverwrites,
    }
    await channel.edit(data)
  }

  private async claimChannel(msg: Message) {
    this.busyChannels.add(msg.channel.id)

    await msg.pin()
    await this.addCooldown(msg.member!, msg.channel as TextChannel, msg)
    await this.moveChannel(msg.channel as TextChannel, categories.ongoing)
    await this.ensureAskChannels(msg.guild!)
    await this.syncHowToGetHelp(msg.guild)

    this.busyChannels.delete(msg.channel.id)
  }

  private async ensureAskChannels(guild: Guild): Promise<void | Message> {
    const askChannels = guild.channels.cache
      .filter((channel) => channel.parentID === categories.ask)
      .filter((channel) => channel.name.startsWith(this.CHANNEL_PREFIX))

    if (askChannels.size >= 2) {
      return
    }

    const dormantChannels = guild.channels.cache.filter(
      (channel) => channel.parentID === categories.dormant,
    )

    if (dormantChannels.size < 1) {
      // Just ignore the case where we don't have dormant
      return
    }

    const dormant = guild.channels.cache.find(
      (x) => x.parentID === categories.dormant,
    ) as TextChannel

    if (dormant) {
      await this.moveChannel(dormant, categories.ask)

      let lastMessage = dormant.messages.cache
        .array()
        .reverse()
        .find((m) => m.author.id === this.client.user?.id)

      if (!lastMessage) {
        lastMessage = (await dormant.messages.fetch({ limit: 1 }))
          .array()
          .find((m) => m.author.id === this.client.user?.id)
      }

      if (lastMessage) {
        // If there is a last message (the dormant message) by the bot, just edit it
        return await lastMessage.edit({ embed: this.AVAILABLE_EMBED })
      } else {
        // Otherwise, just send a new message
        return await dormant.send({ embed: this.AVAILABLE_EMBED })
      }
    }

    await this.ensureAskChannels(guild)
    return await this.syncHowToGetHelp(guild)
  }

  private async checkDormantPossibilities() {
    const ongoingChannels = this.client.channels.cache.filter((channel) => {
      if (channel.type === 'dm') {
        return false
      }

      return (channel as TextChannel).parentID === categories.ongoing
    })

    for (const channel of ongoingChannels.array()) {
      const messages = await (channel as TextChannel).messages.fetch()

      const diff = (Date.now() - messages.array()[0].createdAt.getTime()) / 1000

      if (diff > dormantChannelTimeout) {
        await this.markChannelAsDormant(channel as TextChannel)
      }
    }
  }

  private async syncHowToGetHelp(msgGuild?: Guild) {
    let availHelpChannels = null

    if (msgGuild) {
      availHelpChannels = msgGuild.channels.cache
        .filter((channel) => channel.parentID === categories.ask)
        .filter((channel) => channel.name.startsWith(this.CHANNEL_PREFIX))
    } else {
      availHelpChannels = await this.client.guilds
        .fetch(guild.id)
        .then((guild) =>
          guild.channels.cache
            .filter((channel) => channel.parentID === categories.ask)
            .filter((channel) => channel.name.startsWith(this.CHANNEL_PREFIX)),
        )
    }

    const helpChannel = (await this.client.channels.fetch(
      askHelpChannelId,
    )) as TextChannel
    const lastMessage = (await helpChannel.messages.fetch()).last()

    if (!lastMessage) {
      await helpChannel.send(helpMessage(availHelpChannels))
    } else {
      await lastMessage.edit(helpMessage(availHelpChannels))
    }
  }
}
