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
  FiddleModule,
  HelpChanModule,
  HelpMessageModule,
  UnfurlModule,
  UwuboxModule,
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
  SettingsModule,
  AutoroleModule,
  FiddleModule,
  EtcModule,
  HelpChanModule,
  HelpMessageModule,
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
    client.user?.setPresence({
      status: 'idle',
      activity: {
        name: 'twitter @electronpuppy',
        type: 'WATCHING',
        url: 'https://twitter.com/electronpuppy',
      },
    })

    console.log(`Logged in as ${client.user?.tag}`)
  })

  server.listen(port, () =>
    console.log(`app running on http://localhost:${port}`),
  )
})
