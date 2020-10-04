import { ASTNode, GraphQLError, Source, SourceLocation } from 'graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import { $TSFixMe } from './types'

export class ServerError extends Error implements GraphQLError {
  extensions: { [key: string]: any } | undefined
  locations: readonly SourceLocation[] | undefined
  path: readonly (string | number)[] | undefined
  nodes: readonly ASTNode[] | undefined
  source: Source | undefined
  positions: readonly number[] | undefined
  originalError: Maybe<Error>

  constructor(
    message: string,
    code?: string,
    extensions?: Record<string, $TSFixMe>,
  ) {
    super(message)

    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'ArcadiaError' })
    }

    this.extensions = { ...extensions, code }
  }
}
