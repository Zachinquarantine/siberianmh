export const ELECTRON_BLUE = '#358397'
export const GREEN_BRIGHT = '#32CD32'
export const RED = '#FF0000'

const __dev__ = process.env.NODE_ENV === 'development'

// DevGround is just test playground
export const devGround = {
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
    adminBotInteractions: '771069886696914994',
    botInteractions: '746446369845280929',
  },
}

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

export const dormantChannelTimeout = 28_800
export const dormantChannelLoop = 10000
export const lockedChannelLoop = 60000
export const token = process.env.DISCORD_TOKEN
export const sha = process.env.COMMIT_SHA || 'master'
export const port = process.env.PORT || 1337
