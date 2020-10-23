import {
  command,
  default as CookiecordClient,
  listener,
  Module,
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
import { HelpUser } from '../entities/help-user'
import {
  ELECTRON_BLUE,
  dormantChannelTimeout,
  dormantChannelLoop,
  categories,
  askHelpChannelId,
} from '../lib/constants'
import { isTrustedMember } from '../lib/inhibitors'

export class HelpChanModule extends Module {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  private CHANNEL_PREFIX = 'help-'

  private AVAILABLE_EMBED = new MessageEmbed()
    .setColor(ELECTRON_BLUE)
    .setDescription(
      'This help channel is now **available**, which means that ' +
        'you can claim it by typing your question into it. ' +
        'Once claimed, the channel will move into the **Help: Ongoing** category, and ' +
        `will be yours until it has been inactive for ${
          dormantChannelTimeout / 60 / 60
        } hours or is closed ` +
        'manually with `!close`. When that happens, it will be set to **available** and moved into the **Help: Available** category.\n\n',
    )

  private HELP_CHANNEL_STATUS_EMBED = (
    msg: Message,
    availableChannels: Collection<string, GuildChannel>,
    ongoingChannels: HelpUser[],
  ) =>
    new MessageEmbed()
      .setAuthor(
        msg.guild?.name,
        msg.guild?.iconURL({ dynamic: true }) || undefined,
      )
      .setTitle('Help Channels Status')
      .addField(
        'Available',
        availableChannels.size >= 1
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

    this.busyChannels.add(msg.channel.id)

    await msg.pin()
    await this.addCooldown(msg.member, msg.channel)
    await this.moveChannel(msg.channel, categories.ongoing)

    this.busyChannels.delete(msg.channel.id)
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
    aliases: ['resolve', 'done', 'close'],
    description: 'Marks __ongoing__ help channel as resolved',
  })
  async resolved(msg: Message) {
    if (!msg.guild || this.busyChannels.has(msg.channel.id)) {
      return
    }

    // @ts-expect-error
    if (msg.channel.parentID !== categories.ongoing) {
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

  @command({
    inhibitors: [isTrustedMember],
  })
  async helpchan(
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

        return msg.channel.send({
          embed: this.HELP_CHANNEL_STATUS_EMBED(msg, available!, ongoing!),
        })
      }

      // Create help channel
      case 'create': {
        const [channelName] = args

        if (args.length > 1) {
          return msg.reply(`⚠ Expected 1 argument, but got ${args.length}`)
        }

        const created = await this.createHelpChannel(msg.guild!, channelName)
        return msg.channel.send(`Successfully created <#${created.id}> channel`)
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

  @command({ inhibitors: [isTrustedMember] })
  public async claim(
    msg: Message,
    member: GuildMember,
    @optional limit: number = 10,
  ) {
    const helpUser = await HelpUser.findOne({
      where: { userId: member.id },
    })
    if (helpUser) {
      return await msg.channel.send(
        `${member.displayName} already has an open help channel: <#${helpUser.channelId}>`,
      )
    }

    const channelMessage = await msg.channel.messages.fetch({ limit: 50 })
    const questionMessages = channelMessage.filter(
      (questionMsg) =>
        questionMsg.author.id === member.id && questionMsg.id !== msg.id,
    )

    const msgContent = questionMessages
      .array()
      .slice(0, limit)
      .map((msg) => msg.content)
      .reverse()
      .join('\n')
      .slice(0, 2000)

    console.log(msgContent)

    const claimedChannel = msg.guild?.channels.cache.find(
      (channel) =>
        channel.type === 'text' &&
        channel.parentID === categories.ask &&
        channel.name.startsWith(this.CHANNEL_PREFIX) &&
        !this.busyChannels.has(channel.id),
    ) as TextChannel | undefined

    if (!claimedChannel) {
      return await msg.channel.send(
        ':warning: failed to claim a help channel, no available channel.',
      )
    }

    this.busyChannels.add(claimedChannel.id)
    const toPin = await claimedChannel.send({
      embed: new MessageEmbed()
        .setAuthor(member.displayName, member.user.displayAvatarURL())
        .setDescription(msgContent),
    })
    await toPin.pin()
    await this.addCooldown(member, claimedChannel)
    await this.moveChannel(claimedChannel, categories.ongoing)
    await claimedChannel.send(
      `${member.user} this channel has been claimed for your question. Please review <#${askHelpChannelId}> for how to get help.`,
    )

    this.busyChannels.delete(claimedChannel.id)
    await msg.channel.send(`👌 successfully claimed ${claimedChannel}`)
  }
  //#endregion

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

  private async addCooldown(member: GuildMember, channel: TextChannel) {
    const helpUser = new HelpUser()
    helpUser.userId = member.user.id
    helpUser.channelId = channel.id
    await helpUser.save()
  }

  private async markChannelAsDormant(channel: TextChannel) {
    this.busyChannels.add(channel.id)

    const pinned = await channel.messages.fetchPinned()
    await Promise.all(pinned.map((msg) => msg.unpin()))

    await HelpUser.delete({ channelId: channel.id })

    await this.moveChannel(channel, categories.ask)
    await channel.send({ embed: this.AVAILABLE_EMBED })

    this.busyChannels.delete(channel.id)
  }

  private async createHelpChannel(guild: Guild, channelName: string) {
    const chan = await guild.channels.create(`help-${channelName}`, {
      type: 'text',
      topic:
        'You can claim your own help channel in the Help: Available category.',
      reason: 'maintain help channel goal',
      parent: categories.ask,
    })

    // Channel should already be in ask, but sync the permissions.
    await this.moveChannel(chan, categories.ask)
    await chan.send({ embed: this.AVAILABLE_EMBED })

    return chan
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
}
