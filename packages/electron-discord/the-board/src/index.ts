if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
import CookiecordClient from 'cookiecord'
import { Intents } from 'discord.js'

import { MailModule, EtcModule, ModerationModule } from './modules'
import { token } from './lib/constants'

export const client = new CookiecordClient(
  {
    prefix: ['!', 'tb!'],
  },
  {
    ws: { intents: Intents.NON_PRIVILEGED },
    partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL'],
  },
)

for (const mod of [MailModule, EtcModule, ModerationModule]) {
  client.registerModule(mod)
}

client.login(token)
client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`)
})
