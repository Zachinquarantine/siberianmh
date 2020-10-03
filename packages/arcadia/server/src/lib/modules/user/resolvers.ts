import { IResolvers } from '../../generated/graphql'

export const resolvers: IResolvers = {
  Query: {
    user: (_login: string) => {
      return {
        id: 1,
        username: '1',
        email: '1@a.com',
        avatar_url: '1',
        site_admin: true,
      }
    },
  },
}
