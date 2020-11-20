export const __dev__ = process.env.NODE_ENV === 'development'

const devGround = {
  channels: {
    test: '763506034143657984',
  },
}

// Electron, the production
const electron = {
  roles: {
    maintainer: '745039155498582067',
  },
  channels: {
    theBoard: '779407693974732811',
  },
}

export const trustedRoleId = __dev__ ? '' : electron.roles.maintainer
export const theBoardChannel = __dev__
  ? devGround.channels.test
  : electron.channels.theBoard

export const token = process.env.DISCORD_TOKEN
