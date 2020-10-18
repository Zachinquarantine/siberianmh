import * as express from 'express'
import { ACLStore } from '../lib/store'

const store = new ACLStore()

export const generateACL = async (
  req: express.Request,
  res: express.Response,
) => {
  const resp = await store.generateACL()
  return res.json({
    status: 200,
    message: resp,
  })
}

export const deleteACL = async (
  req: express.Request,
  res: express.Response,
) => {
  const resp = await store.deleteACL(req)
  return res.status(resp.status).json(resp)
}
