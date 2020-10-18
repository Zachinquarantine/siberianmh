import * as express from 'express'
import { ACLStore } from '../lib/store'

const store = new ACLStore()

export const bootstrapRoads = async (
  req: express.Request,
  res: express.Response,
) => {
  const token = await store.generateRootToken()

  if (token) {
    return res.status(200).json({
      status: 200,
      message: token,
    })
  }

  return res.status(401).json({
    status: 401,
    message: 'Root token is already registered',
  })
}
