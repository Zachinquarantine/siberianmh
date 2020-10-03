import { IResolvers } from '../../generated/graphql'
import { UserStore } from '../../store'

const store = new UserStore()

export const resolvers: IResolvers = {
  Query: {
    viewer: () => {
      return store.getViewer()
    },
  },
}
