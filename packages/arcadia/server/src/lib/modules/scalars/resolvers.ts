import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { IResolvers } from '../../generated/graphql'

export const resolvers: IResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value)
    },
    serialize(value) {
      return value.getTime()
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10)
      }
      return null
    },
  }),
}
