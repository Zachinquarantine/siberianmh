export const ELECTRON_BLUE = '#358397'

const dev = process.env.NODE_ENV === 'development'

// DevGround is just test playground
const devGround = {
  categories: {
    ask: '762718419254116352',
    ongoing: '762718460265889792',
    dormant: '762718080634978325',
  },
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
}

export const categories = dev ? devGround.categories : electron.categories
export const askHelpChannelId = dev
  ? devGround.askHelpChannelId
  : electron.askHelpChannelId

export const dormantChannelTimeout = 28_800
export const dormantChannelLoop = 10000
export const token = process.env.DISCORD_TOKEN
export const sha = process.env.COMMIT_SHA || 'development'
export const port = process.env.PORT || 1337
