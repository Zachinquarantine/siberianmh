import * as express from 'express'
import { RepositoryStore } from '../lib/store'

const store = new RepositoryStore()

export const handleWebhook = async (
  req: express.Request,
  res: express.Response,
) => {
  res.status(204).json({
    message: 'Accepted',
    status: 204,
  })

  await store.handleWebhook(req)
}
