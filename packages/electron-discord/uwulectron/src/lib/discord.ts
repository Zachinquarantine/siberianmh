import CookiecordClient from 'cookiecord'
import { Intents } from 'discord.js'

export const client = new CookiecordClient(
  {
    prefix: ['!', 'e!', '.'],
  },
  {
    ws: { intents: Intents.NON_PRIVILEGED },
    partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL'],
    http: {
      version: 8,
    },
  },
)
