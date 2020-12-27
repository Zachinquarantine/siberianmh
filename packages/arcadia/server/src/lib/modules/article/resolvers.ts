import { IResolvers } from '../../generated/graphql'
import { ArticleStore, UserStore } from '../../store'
import { ServerError } from '../../graphql-error'

const store = new ArticleStore()
const userStore = new UserStore()

export const resolvers: IResolvers = {
  Article: {
    author: async ({ author }, _, { req }) => {
      const userId = author ? author.id : req.session!.userId
      const dbAuthor = await userStore.getUser(userId)

      if (!dbAuthor) {
        throw new ServerError('User not found')
      }

      return dbAuthor
    },
  },
  Query: {
    allArticles: async () => {
      const resp = await store.allArticles()
      return resp
    },
    getArticle: async (_, { articleId, articleName }) => {
      const resp = await store.getArticle(articleId, articleName)

      if (!resp) {
        throw new ServerError('Article not found')
      }

      return resp
    },
  },
  Mutation: {
    createArticle: async (_, args, { req }) => {
      const resp = await store.createArticle(args, req)

      if (!resp) {
        throw new ServerError('Unable to create article')
      }

      return resp
    },
  },
}
