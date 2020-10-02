import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import * as path from 'path'
import * as fs from 'fs'
import * as glob from 'glob'

export const genSchema = () => {
  const pathToModules = path.join(__dirname, './modules')
  const graphqlTypes = glob
    .sync(`${pathToModules}/**/*.graphql`)
    .map((schema) => fs.readFileSync(schema, { encoding: 'utf-8' }))

  const resolvers = glob
    .sync(`${pathToModules}/**/resolvers.?s`)
    .map((resolver) => require(resolver).resolvers)

  return makeExecutableSchema({
    typeDefs: mergeTypeDefs(graphqlTypes),
    resolvers: mergeResolvers(resolvers),
  })
}
