if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
import CookiecordClient from 'cookiecord'
import { Intents } from 'discord.js'
import * as Sentry from '@sentry/node'
import { token, __dev__ } from 'siberianmh/packages/electron-discord/common/src'

import {
  MailModule,
  EtcModule,
  ModLogModule,
  BansModerationModule,
  GamePresenceModule,
  SlowmodeModule,
} from './modules'

if (!__dev__) {
  Sentry.init({
    dsn:
      'https://a22da8923d5f4ea7875fa8518335410b@o102026.ingest.sentry.io/5474186',
    tracesSampleRate: 1.0,
  })
}

export const client = new CookiecordClient(
  {
    prefix: ['!', 'tb!'],
  },
  {
    ws: { intents: Intents.ALL },
    partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL'],
  },
)

for (const mod of [
  MailModule,
  EtcModule,
  BansModerationModule,
  ModLogModule,
  GamePresenceModule,
  SlowmodeModule,
]) {
  client.registerModule(mod)
}

client.login(token)
client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
})
