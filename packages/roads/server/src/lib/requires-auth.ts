import * as express from 'express'
import { ACLStore } from './store'

const store = new ACLStore()

export async function requiresAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!req.headers['authorization']) {
    return res.status(401).send({
      message: 'Bad credentials',
      status: 401,
    })
  }

  if (req.headers.authorization.includes('Basic')) {
    return res.status(401).json({
      message:
        'Authorization via username:password is not supported due to security reasons. Use the Access Tokens.',
      status: 401,
    })
  }

  const [prefix, token] = req.headers['authorization'].split(' ')
  // Ensure prefix is Bearer
  if (prefix !== 'Bearer') {
    return res.status(401).json({
      message: 'Bad credentials',
      status: 401,
    })
  }

  const valid = await store.validateACL(token)

  if (!valid) {
    return res.status(401).json({
      status: 401,
      message: 'Bad credentials',
    })
  }

  next()
}
