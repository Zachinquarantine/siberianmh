import * as express from 'express'
import { CIStore } from '../lib/stores'

const mainStore = new CIStore()

export const handleStatus = async (
  req: express.Request,
  res: express.Response,
) => {
  return await mainStore.handleStatus(req, res)
}
