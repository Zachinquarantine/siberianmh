import * as express from 'express'
import { PullRequestStore } from '../lib/store'

const store = new PullRequestStore()

export const getAllPullRequests = async (
  req: express.Request,
  res: express.Response,
) => {
  const resp = await store.getAllPullRequests()
  return res.json(resp)
}
