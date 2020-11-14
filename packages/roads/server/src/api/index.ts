import * as express from 'express'

import { handleGitHubWebhook, handleGitLabWebhook } from './repository'
import { bootstrapRoads } from './base'
import { generateACL, deleteACL } from './acl'
import { getAllPullRequests } from './pull-request'
import { requiresAuth } from '../lib/requires-auth'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    message: ':wave:',
    status: 200,
  })
})

//#region Usage
// Base
router.get('/bootstrap', bootstrapRoads)

// Tokens
router.post('/acl', requiresAuth, generateACL)
router.delete('/acl/:token', requiresAuth, deleteACL)

// Pull Requests
router.get('/pull-request', requiresAuth, getAllPullRequests)

// Handle Webhooks
router.post('/gh/handle-event', handleGitHubWebhook)
router.post('/gl/handle-event', handleGitLabWebhook)

//#endregion

export const apiRoutes = router
