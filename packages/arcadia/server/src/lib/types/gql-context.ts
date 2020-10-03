import * as express from 'express'

export interface IContext {
  req: express.Request & { session: Express.Session }
}
