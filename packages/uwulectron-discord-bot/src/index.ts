if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
import CookiecordClient from 'cookiecord'
import { Intents } from 'discord.js'
import * as http from 'http'
import * as express from 'express'

import { connectTypeorm } from './lib/connect-typeorm'
import { token, port } from './lib/constants'

const app = express()
const client = new CookiecordClient(
  {
    prefix: ['!', 'e!', '.'],
  },
  {
    ws: { intents: Intents.NON_PRIVILEGED },
    partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL'],
  },
)

for (const mod of []) {
  client.registerModule(mod)
}

connectTypeorm().then(() => {
  const server = http.createServer(app)

  client.login(token)
  client.on('ready', () => console.log(`Logged in as ${client.user?.tag}`))

  server.listen(port, () => {
    console.log(`app running on http://localhost:${port}`)
  })
})
