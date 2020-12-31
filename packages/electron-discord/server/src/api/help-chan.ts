import * as express from 'express'
import { HelpChannelStore } from '../lib/stores'

const store = new HelpChannelStore()

export const getHelpChannel = async (
  req: express.Request,
  res: express.Response,
) => {
  const resp = await store.getHelpChannel(req)
  return res.json(resp)
}

export const createHelpChannel = async (
  req: express.Request,
  res: express.Response,
) => {
  const resp = await store.createHelpChannel(req)

  return res.json(resp)
}
