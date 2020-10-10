import * as express from 'express'
import { Octokit, RestEndpointMethodTypes } from '@octokit/rest'
import { IUser } from '@ozark/types'

export const getMe = (req: express.Request, res: express.Response) => {
  if (req.user) {
    return res.json({
      message: 'Not authenticated',
      status: 403,
    })
  }

  const user = (req.user as unknown) as IUser

  return res.json(user.user)
}

export const getRepositoriesForUser = async (
  req: express.Request,
  res: express.Response,
) => {
  const user = req.user as IUser
  const github = new Octokit({ auth: user.accessToken })

  const data: RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'] = await github.paginate(
    'GET /user/repos',
    {
      per_page: 1000,
    },
  )

  const withPushRights = data.filter((r: any) => r.permissions.push)

  return res.json(withPushRights)
}
