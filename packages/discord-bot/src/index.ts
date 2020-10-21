import { token } from './env'
import CookiecordClient from 'cookiecord'
import { Intents } from 'discord.js'

import { DoReleaseModule, EtcModule } from './modules'

const client = new CookiecordClient(
  {
    prefix: ['!', 's!'],
  },
  {
    ws: { intents: Intents.NON_PRIVILEGED },
    partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL'],
  },
)

for (const mod of [EtcModule, DoReleaseModule]) {
  client.registerModule(mod)
}

client.login(token)
client.on('ready', () => console.log(`Logged in as ${client.user?.tag}`))
