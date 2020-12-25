import * as express from 'express'

export type IRequest = express.Request & { session: Express.Session }

export interface IContext {
  req: IRequest
}
