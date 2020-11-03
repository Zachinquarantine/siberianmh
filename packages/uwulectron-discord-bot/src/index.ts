if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
import * as http from 'http'
import * as express from 'express'

import {
  AdminModule,
  AutoroleModule,
  EtcModule,
  FiddleModule,
  HelpChanModule,
  HelpMessageModule,
  UnfurlModule,
  UwuboxModule,
} from './modules'
import { connectTypeorm } from './lib/connect-typeorm'
import { token, port } from './lib/constants'
import { client } from './lib/discord'
import { apiRoutes } from './api'

const app = express()
app.use('/', apiRoutes)

for (const mod of [
  AdminModule,
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

connectTypeorm().then(() => {
  const server = http.createServer(app)

  client.login(token)
  client.on('ready', () => console.log(`Logged in as ${client.user?.tag}`))

  server.listen(port, () =>
    console.log(`app running on http://localhost:${port}`),
  )
})
