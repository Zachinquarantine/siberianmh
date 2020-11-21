if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
import * as http from 'http'
import * as express from 'express'

import {
  AdminModule,
  SettingsModule,
  AutoroleModule,
  EtcModule,
  HelpChanModule,
  HelpMessageModule,
  UnfurlModule,
  UwuboxModule,
  ReminderModule,
  SourceModule,
  ModLogModule,
  InformationModule,
} from './modules'
import { createSettings } from './lib/settings'
import { connectTypeorm } from './lib/connect-typeorm'
import { token, port } from './lib/constants'
import { client } from './lib/discord'
import { apiRoutes } from './api'

const app = express()
app.use('/', apiRoutes)

for (const mod of [
  AdminModule,
  SourceModule,
  SettingsModule,
  ModLogModule,
  InformationModule,
  AutoroleModule,
  EtcModule,
  HelpChanModule,
  HelpMessageModule,
  ReminderModule,
  UnfurlModule,
  UwuboxModule,
]) {
  client.registerModule(mod)
}

connectTypeorm().then(async () => {
  await createSettings()
  const server = http.createServer(app)

  client.login(token)
  client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`)
  })

  server.listen(port, () =>
    console.log(`app running on http://localhost:${port}`),
  )
})
