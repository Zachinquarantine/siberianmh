import * as express from 'express'
import { Repository } from '../entities/repo'
import { IUser } from '@ozark/types'
import { CIStore } from '../lib/stores'
import { generateSecret } from '../lib/generate-secret'

const ciStore = new CIStore()

export const getAll = async (req: express.Request, res: express.Response) => {
  const resp = await ciStore.getAllRepositories(req)

  return res.json(resp)
}

export const getRepository = async (
  req: express.Request,
  res: express.Response,
) => {
  const resp = await ciStore.getRepository(req)

  if (resp === false) {
    return res.status(403).json({
      status: 403,
      message: 'Not authorized.',
    })
  }

  return res.json(resp)
}

export const updateRepository = async (
  req: express.Request,
  res: express.Response,
) => {
  const user = req.user as IUser
  const { repo } = req.params
  const { webhook_url, github_token, fails_in_row } = req.body

  await Repository.update(
    { user: user.user.id, name: repo },
    {
      webhook_url: webhook_url,
      github_access_token: github_token,
      fails_in_row,
    },
  )

  return res.status(200).json({
    status: 200,
    // Should be repository
    message: 'Updated',
  })
}

export const createRepository = async (
  req: express.Request,
  res: express.Response,
) => {
  const { owner, name } = req.body
  const { user } = req.user as IUser

  const repo = Repository.create({
    owner: owner,
    name: name,
    user: user,
    secret: generateSecret(),
  })

  await repo.save()

  return res.json(repo)
}

export const getAllJobsPerRepo = async (
  req: express.Request,
  res: express.Response,
) => {
  const jobs = await ciStore.getAllJobsPerRepo(req)

  return res.status(200).json(jobs)
}

export const getAllStatusesForRepo = async (
  req: express.Request,
  res: express.Response,
) => {
  const statuses = await ciStore.getAllStatusesForRepo(req)

  return res.status(200).json(statuses)
}
