if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

import * as Sentry from '@sentry/node'
import {
  AdminModule,
  AutoroleModule,
  EtcModule,
  HelpChanModule,
  HelpMessageModule,
  UnfurlModule,
  ReminderModule,
  SourceModule,
  InformationModule,
} from './modules'
import { connectTypeorm } from './lib/connect-typeorm'
import { token, __dev__ } from 'siberianmh/packages/electron-discord/common/src'
import { client } from './lib/discord'

if (!__dev__) {
  Sentry.init({
    dsn:
      'https://a22da8923d5f4ea7875fa8518335410b@o102026.ingest.sentry.io/5474186',
    tracesSampleRate: 1.0,
  })
}

for (const mod of [
  AdminModule,
  SourceModule,
  InformationModule,
  AutoroleModule,
  EtcModule,
  HelpChanModule,
  HelpMessageModule,
  ReminderModule,
  UnfurlModule,
]) {
  client.registerModule(mod)
}

connectTypeorm().then(async () => {
  await client.login(token)
  client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`)
  })
})
