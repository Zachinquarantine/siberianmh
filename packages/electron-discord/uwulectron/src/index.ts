if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

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
import { token } from 'siberianmh/packages/electron-discord/common/src'
import { client } from './lib/discord'

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
