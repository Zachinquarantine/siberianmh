import * as express from 'express'
import { RepositoryStore } from '../lib/store'

const store = new RepositoryStore()

export const handleGitHubWebhook = async (
  req: express.Request,
  res: express.Response,
) => {
  res.status(201).json({
    message: 'Accepted',
    status: 201,
  })

  await store.handleGitHubWebhook(req)
}

export const handleGitLabWebhook = async (
  req: express.Request,
  res: express.Response,
) => {
  res.status(201).json({
    message: 'Accepted',
    status: 201,
  })

  await store.handleGitLabWebhook(req)
}
