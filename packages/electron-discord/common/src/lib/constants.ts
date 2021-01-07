export const ELECTRON_BLUE = '#358397'
export const GREEN_BRIGHT = '#32CD32'
export const RED = '#FF0000'

export const __dev__ = process.env.NODE_ENV === 'development'

// DevGround is just test playground
export const devGround = {
  guildId: '715327188307804341',
  categories: {
    ask: '762718419254116352',
    ongoing: '762718460265889792',
    dormant: '762718080634978325',
  },
  roles: {
    helpCooldown: '774303512443355172',
  },
  botInteractionsChannelId: '771109368803491850',
  askHelpChannelId: '762719468736217168',
}

// Electron, the production
const electron = {
  guildId: '745037351163527189',
  categories: {
    ask: '745038318479081483',
    ongoing: '763429207791239168',
    dormant: '763429965726351392',
  },
  askHelpChannelId: '748284419525312553',
  roles: {
    admin: '745038904532402237',
    maintainer: '745039155498582067',
    member: '745066812424585409',
    helpCooldown: '772835574197256199',
  },
  channels: {
    theBoard: '779407693974732811',
    adminBotInteractions: '771069886696914994',
    botInteractions: '746446369845280929',
    modLog: '764542608256270406',
  },
}

//#region Full list of constants
export const guild = {
  id: __dev__ ? devGround.guildId : electron.guildId,
  invite: 'https://discord.gg/electron',

  channels: {
    mod_log: __dev__
      ? devGround.botInteractionsChannelId
      : electron.channels.modLog,
  },
}

export const colors = {
  softRed: 0xcd6d6d,
  softGreen: 0x68c290,
}

export const icons = {
  crownGreen: 'https://cdn.discordapp.com/emojis/469964154719961088.png',
  crownRed: 'https://cdn.discordapp.com/emojis/469964154879344640.png',

  hashGreen: 'https://cdn.discordapp.com/emojis/469950144918585344.png',
  hashRed: 'https://cdn.discordapp.com/emojis/469950145413251072.png',

  messageDelete: 'https://cdn.discordapp.com/emojis/472472641320648704.png',

  userBan: 'https://cdn.discordapp.com/emojis/469952898026045441.png',
}

export const urls = {
  github_bot_repo:
    'https://github.com/siberianmh/siberianmh/tree/master/packages/electron-discord',
}
//#endregion

export const theBoardChannel = __dev__
  ? devGround.botInteractionsChannelId
  : electron.channels.theBoard
export const categories = __dev__ ? devGround.categories : electron.categories
export const askHelpChannelId = __dev__
  ? devGround.askHelpChannelId
  : electron.askHelpChannelId
export const askCooldownRoleId = __dev__
  ? devGround.roles.helpCooldown
  : electron.roles.helpCooldown
export const botInteractionsChannelId = __dev__
  ? devGround.botInteractionsChannelId
  : electron.channels.adminBotInteractions
export const trustedRoleId = __dev__ ? '' : electron.roles.maintainer

export const dormantChannelTimeout = 36_000
export const dormantChannelLoop = 10000
export const token = process.env.DISCORD_TOKEN
export const sha = process.env.COMMIT_SHA || 'master'
