if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

import {
  AdminModule,
  SettingsModule,
  AutoroleModule,
  EtcModule,
  HelpChanModule,
  HelpMessageModule,
  UnfurlModule,
  ReminderModule,
  SourceModule,
  InformationModule,
} from './modules'
import { createSettings } from './lib/settings'
import { connectTypeorm } from './lib/connect-typeorm'
import { token } from '@edis/constants'
import { client } from './lib/discord'

for (const mod of [
  AdminModule,
  SourceModule,
  SettingsModule,
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
  await createSettings()

  client.login(token)
  client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`)
  })
})
