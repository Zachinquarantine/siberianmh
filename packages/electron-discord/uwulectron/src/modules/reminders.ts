// https://github.com/typescript-community/community-bot/blob/master/src/modules/reminders.ts

import { default as CookiecordClient, command, listener } from 'cookiecord'
import parse from 'parse-duration'
import * as prettyMs from 'pretty-ms'
import { Reminder } from '../entities/reminder'
import { setTimeout } from 'timers'
import { Message } from 'discord.js'
import { ExtendedModule } from '../lib/extended-module'

export class ReminderModule extends ExtendedModule {
  public constructor(client: CookiecordClient) {
    super(client)
  }

  //#region Listeners
  @listener({ event: 'ready' })
  async loadPrevReminders() {
    const reminders = await Reminder.find()

    for (const rem of reminders) {
      setTimeout(
        () =>
          this.sendReminder(rem).catch((err) => {
            console.log(err)
          }),
        rem.date - Date.now(),
      )
    }
  }
  //#endregion

  //#region Commands
  @command({
    single: true,
    description: 'Get me to remind you about anything in the future',
  })
  async remind(msg: Message, args: string) {
    const splitArgs = args.split(' ').filter((x) => x.trim().length !== 0)
    if (splitArgs.length === 0) {
      return await msg.channel.send(
        ':warning: syntax: !remind <duration> [message]',
      )
    }
    const maxDur = parse('10yr')
    const dur = parse(splitArgs.shift()!) // TS doesn't know about the length check
    if (!dur || !maxDur || dur > maxDur) {
      return await msg.channel.send(':warning: invalid duration!')
    }

    const message = splitArgs.join(' ')
    const reminder = Reminder.create({
      userID: msg.author.id,
      date: Date.now() + dur,
      message: splitArgs.join(' '),
    })

    await reminder.save()

    if (splitArgs.length === 0) {
      await msg.channel.send(`:ok_hand: set a reminder for ${prettyMs(dur)}.`)
    } else {
      await msg.channel.send(
        `:ok_hand: set a reminder for ${prettyMs(
          dur,
        )} to remind you about "${message}".`,
      )
    }

    // set the timeout, bot will take all the reminders from the DB on init if interrupted while a reminder is still pending
    setTimeout(
      () =>
        this.sendReminder(reminder).catch((err) => {
          console.log(err)
        }),
      dur,
    )
  }
  //#endregion

  private async sendReminder(rem: Reminder) {
    const user = await this.client.users.fetch(rem.userID)
    try {
      if (rem.message.length === 0) {
        user.send(':clock1: hey! you asked me to remind you.')
      } else {
        user.send(
          `:clock1: hey! you asked me to remind you about"${rem.message}"`,
        )
      }
    } catch {}

    await rem.remove()
  }
}
