import { IResolvers } from '../../generated/graphql'
import { UserStore } from '../../store'

const store = new UserStore()

export const resolvers: IResolvers = {
  Query: {
    viewer: (_, __, { req }) => {
      return store.getViewer(req)
    },
  },
  Mutation: {
    register: async (_, args, { req }) => {
      return store.register(args, req)
    },
    login: async (_, args, { req }) => {
      return store.login(args, req)
    },
  },
}
